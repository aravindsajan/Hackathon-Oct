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

    sensational_words = [
    "breaking",
    "breaking news",
    "shocking",
    "shocking news",
    "shocking revelation",
    "shocking discovery",
    "stunning",
    "stunning revelation",
    "unbelievable",
    "unbelievable news",
    "you won't believe",
    "you will not believe",
    "can't believe",
    "cannot believe",
    "mind blowing",
    "mind-blowing",
    "jaw dropping",
    "jaw-dropping",
    "incredible",
    "insane",
    "outrageous",
    "astonishing",
    "astonishing news",
    "bombshell",
    "bombshell revelation",
    "explosive",
    "explosive revelation",
    "major revelation",
    "huge revelation",
    "massive revelation",
    "terrifying",
    "terrifying discovery",
    "horrifying",
    "horrifying discovery",
    "frightening",
    "scary",
    "dangerous",
    "deadly",
    "catastrophic",
    "disastrous",
    "devastating",
    "alarming",
    "alarming news",
    "urgent",
    "urgent news",
    "alert",
    "breaking alert",
    "emergency",
    "crisis",
    "chaos",
    "mayhem",
    "panic",
    "everyone is talking",
    "the truth is out",
    "truth revealed",
    "truth exposed",
    "secret revealed",
    "secret exposed",
    "hidden truth",
    "hidden secret",
    "what they don't want you to know",
    "what nobody is telling you",
    "what the media won't tell you",
    "they don't want you to know",
    "you need to know",
    "must see",
    "must watch",
    "watch now",
    "read this now",
    "read before it's deleted",
    "share before deleted",
    "share before it is deleted",
    "share this before it's too late",
    "share immediately",
    "share now",
    "share urgently",
    "don't ignore",
    "do not ignore",
    "don't miss",
    "do not miss",
    "act now",
    "take action now",
    "this changes everything",
    "everything has changed",
    "this is huge",
    "this is unbelievable",
    "this is shocking",
    "this changes the game",
    "game changer",
    "game-changer",
    "historic",
    "unprecedented",
    "never before seen",
    "first time ever",
    "once in a lifetime",
    "rare event",
    "miracle",
    "miraculous",
    "miracle cure",
    "instant cure",
    "cure-all",
    "guaranteed",
    "100% guaranteed",
    "secret formula",
    "secret method",
    "secret trick",
    "exclusive",
    "exclusive news",
    "exclusive report",
    "leaked",
    "leaked information",
    "leaked documents",
    "leaked video",
    "viral",
    "going viral",
    "internet explodes",
    "internet is exploding",
    "social media explodes",
    "people are furious",
    "people are shocked",
    "nation in shock",
    "world in shock",
    "country in shock",
    "public outrage",
    "huge backlash",
    "massive backlash",
    "furious",
    "outrage",
    "scandal",
    "controversy",
    "bombshell report",
    "shocking report",
    "exclusive revelation",
    "uncovered",
    "exposed",
    "revealed",
    "caught red-handed",
    "caught on camera",
    "you won't believe what happened",
    "what happened next",
    "what happened after",
    "this is why",
    "here's what they don't tell you",
    "read this",
    "watch this",
    "warning",
    "serious warning",
    "public warning",
    "final warning"
    ]
    flags=0
    sensational = False
    shouting = False
    source = False
    risk = False
    for i in sensational_words:
        if  i in data["title"].lower():
            sensational = True
            flags+=1
            break
            
    cap_count = sum(1 for char in data["title"] if char.isupper())
    if cap_count/len(data["title"]) >= 0.5:
        shouting = True
        flags+=1

    if data["link"] == "NULL":
        source = True
        flags+=1

    if flags>=2:
        risk = True
    return jsonify({
        "category": category,
        "confidence_cat": confidence_c,
        "verification": verify,
        "confidence_ver": confidence_v,
        "sensational":sensational,
        "shouting":shouting,
        "source":source,
        "risk":risk
    })

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
