from flask import Flask
from app.cars_routes import cars_bp
from app.requests_routes import request_bp
from app.admin_routes import admin_bp


def create_app():
    """Function to create and configure the Flask application."""
    app = Flask(__name__)

    app.register_blueprint(admin_bp, url_prefix='/admin_bp')
    app.register_blueprint(cars_bp, url_prefix='/cars')
    app.register_blueprint(request_bp, url_prefix='/request')

    return app


if __name__ == '__main__':
    application = create_app()
    application.run(debug=True)
