import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential, save_model
from tensorflow.keras.layers import Dense, Conv1D, MaxPooling1D, Flatten, Dropout
from tensorflow.keras.utils import to_categorical
import seaborn as sns
import matplotlib.pyplot as plt
from collections import Counter
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib
import os

# Ensure the directory exists
os.makedirs('C:/Users/Sivaram/my-ai-app/backend', exist_ok=True)

# Reading the train.csv by removing the last column since it's an empty column
data = pd.read_csv(r"C:\Users\Sivaram\my-ai-app\backend\dataset\Training.csv").dropna(axis=1)

# Checking whether the dataset is balanced or not
disease_counts = data["prognosis"].value_counts()
temp_df = pd.DataFrame({
    "Disease": disease_counts.index,
    "Counts": disease_counts.values
})
plt.figure(figsize=(18, 8))
sns.barplot(x="Disease", y="Counts", data=temp_df)
plt.xticks(rotation=90)
plt.show()

# Encoding the target value into numerical value using LabelEncoder
encoder = LabelEncoder()
data["prognosis"] = encoder.fit_transform(data["prognosis"])

# Splitting data into features and labels
X = data.iloc[:, :-1]
y = data.iloc[:, -1]
# One-hot encode the labels
y_categorical = to_categorical(y)

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y_categorical, test_size=0.2, random_state=24)

# Reshape input for CNN
X_train = np.expand_dims(X_train.values, axis=2)
X_test = np.expand_dims(X_test.values, axis=2)

print(f"Train: {X_train.shape}, {y_train.shape}")
print(f"Test: {X_test.shape}, {y_test.shape}")

# Define the CNN model
model = Sequential()
model.add(Conv1D(32, kernel_size=3, activation='relu', input_shape=(X_train.shape[1], 1)))
model.add(MaxPooling1D(pool_size=2))
model.add(Dropout(0.25))
model.add(Conv1D(64, kernel_size=3, activation='relu'))
model.add(MaxPooling1D(pool_size=2))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(y_categorical.shape[1], activation='softmax'))

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

model.summary()
# Train the model
history = model.fit(X_train, y_train, validation_split=0.2, epochs=50, batch_size=32)

# Save the trained model to an HDF5 file
model.save('C:/Users/Sivaram/my-ai-app/backend/disease_prediction_model.h5')

# Save the encoder
joblib.dump(encoder, 'C:/Users/Sivaram/my-ai-app/backend/encoder.pkl')

# Save the symptom_index dictionary
symptom_index = {symptom: index for index, symptom in enumerate(X.columns)}
joblib.dump(symptom_index, 'C:/Users/Sivaram/my-ai-app/backend/symptom_index.pkl')

# Plotting the accuracy and loss curves
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Accuracy Curves')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Loss Curves')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()

plt.show()

# Load the new test dataset
new_data = pd.read_csv(r"C:\Users\Sivaram\my-ai-app\backend\dataset\Testing.csv").dropna(axis=1)

# Preprocess the new dataset
X_new = new_data.iloc[:, :-1]
y_new = encoder.transform(new_data.iloc[:, -1])
y_new_categorical = to_categorical(y_new)

# Reshape input for CNN
X_new = np.expand_dims(X_new.values, axis=2)

# Evaluate the model on the new dataset
new_loss, new_accuracy = model.evaluate(X_new, y_new_categorical)
print(f'New dataset accuracy: {new_accuracy * 100:.2f}%')

# Make predictions on the new dataset
predictions = model.predict(X_new)

# Convert predictions to class labels
predicted_classes = np.argmax(predictions, axis=1)
predicted_labels = encoder.inverse_transform(predicted_classes)

# Print or save the predictions
print(predicted_labels)

# Confusion matrix
cf_matrix = confusion_matrix(y_new, predicted_classes)
plt.figure(figsize=(12, 8))
sns.heatmap(cf_matrix, annot=True)
plt.title("Confusion Matrix for CNN on New Dataset")
plt.show()

# Function to predict disease based on symptoms
def predictDisease(symptoms):
    symptoms = symptoms.split(",")

    # Create input data for the model
    input_data = [0] * len(symptom_index)
    for symptom in symptoms:
        symptom = symptom.strip()
        if symptom in symptom_index:
            index = symptom_index[symptom]
            input_data[index] = 1
        else:
            print(f"Warning: Symptom '{symptom}' not found in dataset")

    # Reshape input data
    input_data = np.array(input_data).reshape(1, -1)
    input_data = np.expand_dims(input_data, axis=2)

    # Generate prediction
    prediction = model.predict(input_data)
    top_3_indices = np.argsort(prediction[0])[-3:][::-1]
    top_3_labels = encoder.inverse_transform(top_3_indices)
    top_3_probabilities = prediction[0][top_3_indices]

    # Filter out zero probability predictions
    results = [(label, round(probability * 100, 2)) for label, probability in zip(top_3_labels, top_3_probabilities) if probability > 0]

    return results

# Test the function
print(predictDisease("itching,skin_rash,nodal_skin_eruptions"))
