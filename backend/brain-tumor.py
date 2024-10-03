import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelBinarizer
from PIL import Image

# Function to load and preprocess images
def load_and_preprocess_images(base_folder, img_size):
    images = []
    labels = []

    for dataset_type in ['Training', 'Testing']:
        dataset_folder = os.path.join(base_folder, dataset_type)
        for label in ['glioma', 'meningioma', 'pituitary', 'notumor']:
            label_folder = os.path.join(dataset_folder, label)
            if not os.path.isdir(label_folder):
                continue
            for img_name in os.listdir(label_folder):
                img_path = os.path.join(label_folder, img_name)
                if os.path.isfile(img_path):
                    try:
                        img = Image.open(img_path).convert('RGB')
                        img = img.resize(img_size)
                        images.append(np.array(img))
                        labels.append(label)
                    except Exception as e:
                        print(f"Error loading image {img_path}: {e}")

    if len(labels) == 0:
        raise ValueError("No images found in the specified directory.")

    labels = np.array(labels)
    lb = LabelBinarizer()
    labels = lb.fit_transform(labels)
    labels = np.argmax(labels, axis=1)  # Convert to class indices

    return np.array(images), labels, lb.classes_

# Main code
base_folder = "C:/Users/Sivaram/PycharmProjects/BTD/archive"  # Update this path as needed
img_size = (224, 224)
model_path = 'brain_tumor_detection_model.h5'

# Load and preprocess images
images, labels, classes = load_and_preprocess_images(base_folder, img_size)
num_classes = len(classes)
print(f"Classes found: {classes}")

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(images, labels, test_size=0.2, random_state=42, stratify=labels)

# Check if model exists
if os.path.exists(model_path):
    model = tf.keras.models.load_model(model_path)
    print("Model loaded from disk.")
else:
    # Define data augmentation and preprocessing
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=10,
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        zoom_range=0.1,
        brightness_range=[0.8, 1.2]
    )

    test_datagen = ImageDataGenerator(rescale=1./255)

    train_generator = train_datagen.flow(X_train, y_train, batch_size=32)
    test_generator = test_datagen.flow(X_test, y_test, batch_size=32)

    # Define a simple CNN model
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(optimizer=optimizers.Adam(learning_rate=0.001), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    # Train the model
    early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    lr_scheduler = tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.1, patience=2)

    history = model.fit(
        train_generator,
        epochs=50,
        validation_data=test_generator,
        callbacks=[early_stopping, lr_scheduler]
    )

    # Evaluate the model
    loss, accuracy = model.evaluate(test_generator)
    print(f'Test Accuracy: {accuracy * 100:.2f}%')

    # Save the model
    model.save(model_path)
    print("Model trained and saved to disk.")
