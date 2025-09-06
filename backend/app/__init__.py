from flask import Flask, jsonify

from .extensions import mongo
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    mongo.init_app(app)

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"message": "Flask Order & Product API is running"}), 200

    return app
