from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()


def create_app() -> Flask:
    """Creates a Flask app"""
    app = Flask(__name__)
    app.config.from_object('app.config')

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    CORS(app, origins="*")

    # Register blueprints
    from . import cars_routes, requests_routes, admin_routes
    app.register_blueprint(admin_routes.admin_bp)
    app.register_blueprint(cars_routes.cars_bp)
    app.register_blueprint(requests_routes.request_bp)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app
