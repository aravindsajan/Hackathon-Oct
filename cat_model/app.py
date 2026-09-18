from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import pickle
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)
CORS(app)

cat_model = tf.keras.models.load_model("news_category_model.keras")
ver_model = tf.keras.models.load_model("news_verify_model.keras")
with open("tokenizer.pkl", "rb") as f:
    tokenizer_c = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    encoder_c = pickle.load(f)

with open("tokenizer_v.pkl", "rb") as f:
    tokenizer_v = pickle.load(f)

with open("label_encoder_v.pkl", "rb") as f:
    encoder_v = pickle.load(f)

@app.route("/")
def home():
    return "News Category API is running!"

@app.route("/predict-category", methods=["POST"])
def predict_category():
    data = request.get_json()

    news = data["news"]

    sequence_c = tokenizer_c.texts_to_sequences([news])
    sequence_v = tokenizer_v.texts_to_sequences([news])

    padded_c = pad_sequences(
        sequence_c,
        maxlen=500,
        padding="post",
        truncating="post"
    )
    padded_v = pad_sequences(
        sequence_v,
        maxlen=500,
        padding="post",
        truncating="post"
    )

    prediction_c = cat_model.predict(padded_c, verbose=0)

    predicted_class_c = np.argmax(prediction_c[0])

    category = encoder_c.inverse_transform([predicted_class_c])[0]

    confidence_c = float(np.max(prediction_c[0]))

    prediction_v = ver_model.predict(padded_v, verbose=0)

    predicted_class_v = np.argmax(prediction_v[0])

    verify = encoder_v.inverse_transform([predicted_class_v])[0]

    confidence_v = float(np.max(prediction_v[0]))

    return jsonify({
        "category": category,
        "confidence_cat": confidence_c,
        "verification": verify,
        "confidence_cat": confidence_v
    })

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
