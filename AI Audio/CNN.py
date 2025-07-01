import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models, callbacks, optimizers, metrics

image_size = (128, 128)
batch_size = 32
chemin_dossier = 'sounds'

datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    zoom_range=0.2,
    brightness_range=[0.8, 1.2],
    horizontal_flip=True
)

train_generator = datagen.flow_from_directory(
    chemin_dossier,
    target_size=image_size,
    batch_size=batch_size,
    class_mode='binary',
    classes=['NonQueen_Spectrograms', 'Queen_Spectrograms'],
    subset='training',
    shuffle=True
)

val_generator = datagen.flow_from_directory(
    chemin_dossier,
    target_size=image_size,
    batch_size=batch_size,
    class_mode='binary',
    classes=['NonQueen_Spectrograms', 'Queen_Spectrograms'],
    subset='validation',
    shuffle=False
)

model = models.Sequential([
    layers.Input(shape=(128, 128, 3)),

    layers.Conv2D(32, (3, 3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.Conv2D(32, (3, 3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(),

    layers.Conv2D(64, (3, 3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.Conv2D(64, (3, 3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(),

    layers.Conv2D(128, (3, 3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.Conv2D(128, (3, 3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(),

    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])


model.compile(
    optimizer=optimizers.Adam(learning_rate=1e-4),
    loss='binary_crossentropy',
    metrics=['accuracy', metrics.AUC(name='auc')]
)


early_stop = callbacks.EarlyStopping(patience=7, restore_best_weights=True)
reduce_lr = callbacks.ReduceLROnPlateau(patience=3, factor=0.5, verbose=1)
checkpoint = callbacks.ModelCheckpoint('model_CNN.h5', save_best_only=True, monitor='val_auc', mode='max')


history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=25,
    callbacks=[early_stop, reduce_lr, checkpoint],
    steps_per_epoch=len(train_generator),
    validation_steps=len(val_generator),
    verbose=1
)

model.save('model_CNN.h5')
print("✅ Modèle sauvegardé : model_CNN.h5")

converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

with open("model_CNN.tflite", "wb") as f:
    f.write(tflite_model)

print("✅ Modèle TFLite exporté : model_CNN.tflite")
