from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import joblib
import time
from PIL import Image
import os

app = Flask(__name__)

# Load the disease prediction model and other required files once
disease_model = load_model('disease_prediction_model.h5')
encoder = joblib.load('encoder.pkl')
symptom_index = joblib.load('symptom_index.pkl')

# Load or create the brain tumor detection model
brain_tumor_model_path = 'brain_tumor_detection_model.h5'
if os.path.exists(brain_tumor_model_path):
    brain_tumor_model = load_model(brain_tumor_model_path)
    print("Brain tumor model loaded from disk.")
else:
    print("Brain tumor model not found. Please run the training script first.")

@app.route('/predict', methods=['POST'])
def predict():
    start_time = time.time()
    
    data = request.get_json()
    symptoms = data.get('symptoms', [])
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    # Process symptoms
    input_data = [0] * len(symptom_index)
    for symptom in symptoms:
        symptom = symptom.strip().replace(" ", "_").lower()
        if symptom in symptom_index:
            index = symptom_index[symptom]
            input_data[index] = 1
        else:
            return jsonify({"error": f"Symptom '{symptom}' not found"}), 400

    input_data = np.array(input_data).reshape(1, -1)
    input_data = np.expand_dims(input_data, axis=2)

    # Generate prediction
    prediction = disease_model.predict(input_data)

    top_3_indices = np.argsort(prediction[0])[-3:][::-1]
    top_3_labels = encoder.inverse_transform(top_3_indices)
    top_3_probabilities = prediction[0][top_3_indices]

    results = [{"disease": label, "probability": f"{prob * 100:.2f}%"} for label, prob in zip(top_3_labels, top_3_probabilities) if prob > 0]

    end_time = time.time()
    print(f"Prediction time: {end_time - start_time} seconds")

    return jsonify(results)

@app.route('/predict_brain_tumor', methods=['POST'])
def predict_brain_tumor():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        img = Image.open(file.stream).convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = brain_tumor_model.predict(img_array)
        predicted_class = np.argmax(prediction, axis=1)[0]

        class_names = ['glioma', 'meningioma', 'pituitary', 'notumor']
        result = class_names[predicted_class]
        probability = prediction[0][predicted_class]

        return jsonify({"result": result, "probability": f"{probability * 100:.2f}%"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
