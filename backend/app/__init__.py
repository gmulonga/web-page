from flask import Flask, g
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import DevelopmentConfig
import mysql.connector
import sqlalchemy

db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()

def create_app(config_class=DevelopmentConfig):
    """Creates a Flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)
    app.config.from_pyfile('config.py')

    # Configure SQLAlchemy to use mysql-connector-python
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{app.config['DB_USER']}:{app.config['DB_PASSWORD']}@{app.config['DB_HOST']}:{app.config['DB_PORT']}/{app.config['DB_NAME']}"

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    CORS(app, origins="http://localhost:3000")

    with app.app_context():
        from . import cars_routes, requests_routes, admin_routes
        app.register_blueprint(admin_routes.admin_bp)
        app.register_blueprint(cars_routes.cars_bp)
        app.register_blueprint(requests_routes.request_bp)

        db.create_all()

    return app

def get_db():
    if 'db' not in g:
        try:
            g.db = mysql.connector.connect(
                host=app.config['DB_HOST'],
                user=app.config['DB_USER'],
                password=app.config['DB_PASSWORD'],
                database=app.config['DB_NAME'],
                port=app.config['DB_PORT']
            )
            if g.db.is_connected():
                print("Connection to MySQL database was successful")
        except mysql.connector.Error as err:
            print(f"Error: '{err}'")
            g.db = None
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None and db.is_connected():
        db.close()
