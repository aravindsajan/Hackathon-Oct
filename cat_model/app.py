from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import pickle
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model("news_category_model.keras")

with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

@app.route("/")
def home():
    return "News Category API is running!"

@app.route("/predict-category", methods=["POST"])
def predict_category():
    data = request.get_json()

    news = data["news"]

    sequence = tokenizer.texts_to_sequences([news])

    padded = pad_sequences(
        sequence,
        maxlen=500,
        padding="post",
        truncating="post"
    )

    prediction = model.predict(padded, verbose=0)

    predicted_class = np.argmax(prediction[0])

    category = encoder.inverse_transform([predicted_class])[0]

    confidence = float(np.max(prediction[0]))

    return jsonify({
        "category": category,
        "confidence": confidence
    })

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
