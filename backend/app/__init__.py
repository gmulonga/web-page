from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_wtf.csrf  import CSRFProtect, generate_csrf


db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()
csrf = CSRFProtect()


def create_app():
    """creates a flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('app.config')
    app.config.from_pyfile('config.py')

    csrf.init_app(app)
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    CORS(app, origins="http://localhost:3000")

    with app.app_context():
        from . import cars_routes, requests_routes, admin_routes
        app.register_blueprint(admin_routes.main)
        app.register_blueprint(cars_routes.cars_bp)
        app.register_blueprint(requests_routes.request_bp)

        db.create_all()

    @app.route('/csrf-token', methods=['GET'])
    def get_csrf_token():
        token = generate_csrf()
        return jsonify({'csrf_token': token})

    return app
