from flask import Flask
from app.cars_routes import cars_bp
from app.requests_routes import request_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(cars_bp, url_prefix='/cars')
    app.register_blueprint(request_bp, url_prefix='/request')

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
