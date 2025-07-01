import tensorflow as tf

def convert_to_tflite(h5_model_path, tflite_model_path, quantize=False):
    model = tf.keras.models.load_model(h5_model_path)
    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    if quantize:
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        converter.target_spec.supported_types = [tf.float16]

    tflite_model = converter.convert()

    with open(tflite_model_path, "wb") as f:
        f.write(tflite_model)
convert_to_tflite("model_tuned.h5", "model_tuned.tflite", quantize=True)
