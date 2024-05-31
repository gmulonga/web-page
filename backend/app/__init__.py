from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('app.config')
    app.config.from_pyfile('config.py')

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    CORS(app, origins="http://localhost:3000")

    with app.app_context():
        from . import routes
        app.register_blueprint(routes.main)

        db.create_all()

    return app