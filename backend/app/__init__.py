from flask import Flask, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_wtf.csrf import CSRFProtect, generate_csrf

db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()
csrf = CSRFProtect()

def create_app():
    """Creates a Flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('app.config')
    app.config.from_pyfile('config.py')

    csrf.init_app(app)
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    CORS(app, origins="http://localhost:3000", supports_credentials=True)  # Allow credentials

    with app.app_context():
        from . import cars_routes, requests_routes, admin_routes
        app.register_blueprint(admin_routes.admin_bp)
        app.register_blueprint(cars_routes.cars_bp)
        app.register_blueprint(requests_routes.request_bp)

        db.create_all()

    @app.route('/csrf-token', methods=['GET'])
    def get_csrf_token():
        """Endpoint to obtain the CSRF token"""
        token = generate_csrf()
        session['csrf_token'] = token  # Store the token in the session
        return jsonify({'csrf_token': token})

    @app.after_request
    def set_csrf_cookie(response):
        csrf_token = session.get('csrf_token')
        if csrf_token:
            response.set_cookie(
                'csrf_token',
                csrf_token,
                secure=True, httponly=False,  # Allow JavaScript access to the cookie
                samesite='Strict'
            )
        return response

    return app
