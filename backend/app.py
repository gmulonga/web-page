from flask import Flask, jsonify
from app.cars_routes import cars_bp
from app.requests_routes import request_bp
from app.admin_routes import main
from flask_wtf.csrf import CSRFProtect, generate_csrf


def create_app():
    app = Flask(__name__)

    app.config.from_object('app.config')
    app.config.from_pyfile('config.py', silent=True)

    csrf = CSRFProtect()
    csrf.init_app(app)

    app.register_blueprint(main, url_prefix='/main')
    app.register_blueprint(cars_bp, url_prefix='/cars')
    app.register_blueprint(request_bp, url_prefix='/request')

    @app.route('/csrf-token', methods=['GET'])
    def get_csrf_token():
        """gets the csrf token"""
        token = generate_csrf()
        return jsonify({'csrf_token': token})

    return app


if __name__ == '__main__':
    application = create_app()
    application.run(debug=True)
