from flask import Flask, jsonify, session
from app.cars_routes import cars_bp
from app.requests_routes import request_bp
from app.admin_routes import admin_bp
from flask_wtf.csrf import CSRFProtect, generate_csrf, CSRFError
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    app.config.from_object('app.config')
    app.config.from_pyfile('config.py', silent=True)

    csrf = CSRFProtect()
    csrf.init_app(app)
    CORS(app, origins="http://localhost:3000", supports_credentials=True)  # Allow credentials

    app.register_blueprint(admin_bp, url_prefix='/main')
    app.register_blueprint(cars_bp, url_prefix='/cars')
    app.register_blueprint(request_bp, url_prefix='/request')

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

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        return jsonify({"status": "error", "message": e.description}), 400

    return app


if __name__ == '__main__':
    application = create_app()
    application.run(debug=True)
