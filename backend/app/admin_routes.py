import logging
import os

from flask import jsonify, Blueprint, request, session, redirect, url_for
from flask_jwt_extended import jwt_required, create_access_token
from .models import (
    LoginCredentials, db
)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_wtf.csrf import validate_csrf, CSRFError


admin_bp = Blueprint('main', __name__)

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler()])

logger = logging.getLogger(__name__)

INIT_USERNAME = os.environ.get("INIT_USERNAME")
INIT_PASSWORD = os.environ.get("INIT_PASSWORD")


@admin_bp.route('/check-auth/', methods=['GET'])
@jwt_required()
def check_auth():
    return jsonify({'isAuthenticated': True})


@admin_bp.route('/admin/')
def admin():
    """checking if the user is admin"""
    if 'username' in session:
        return "Admin Page"
    return redirect(url_for('main.login'))


@admin_bp.route('/login', methods=['POST'])
def login():
    """logging in a user"""

    # try:
    #     csrf_token = request.headers.get('X-CSRFToken')
    #     validate_csrf(csrf_token)
    # except CSRFError:
    #     return jsonify({"message": "CSRF token missing"}), 400

    data = request.get_json()
    if not data:
        return jsonify({
            "status": "error",
            "message": "Invalid input"
        }), 400

    username = data.get('username')
    password = data.get('password')

    if LoginCredentials.query.filter_by(username=username).first() == None:
        if username == INIT_USERNAME and password == INIT_PASSWORD:
            access_token = create_access_token(identity=username)
            return jsonify({"status": "success", "access_token": access_token})
        return jsonify({
            "status": "error",
            "message": "Invalid credentials"
        }), 401

    user = LoginCredentials.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify({"status": "success", "access_token": access_token})
    return jsonify({
        "status": "error",
        "message": "Invalid credentials"
    }), 401


@admin_bp.route('/logout/')
def logout():
    """logging out a user"""
    session.pop('username', None)
    return redirect(url_for('home'))


@admin_bp.route('/credentials/<int:id>/', methods=['GET'])
def get_credentials(id):
    """fetches the password and username"""
    credentials = LoginCredentials.query.get(id)

    if credentials:
        return jsonify(
            {
                'username': credentials.username,
                'password_hash': credentials.password
            }
        )
    return jsonify({'message': 'Credentials not found'}), 404


@admin_bp.route('/credentials/new/', methods=['POST'])
@jwt_required()
def add_credentials():
    """adding a password"""
    try:
        data = request.json
        hashed_password = generate_password_hash(data['password'])

        new_credentials = LoginCredentials(
            username=data['username'],
            password=hashed_password.decode('utf-8')
        )

        db.session.add(new_credentials)
        db.session.commit()
        return jsonify(
            {
                "message": "Credentials added successfully"
            }
        ), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/credentials/update/<int:id>/', methods=['PUT'])
@jwt_required()
def update_credentials(id):
    """updating a password"""
    try:
        data = request.json
        credentials_to_update = LoginCredentials.query.get(id)

        if credentials_to_update:
            credentials_to_update.username = data['username']
            new_password = data['password']
            hashed_password = generate_password_hash(new_password)

            credentials_to_update.password = hashed_password

            db.session.commit()
            return jsonify(
                {
                    "message": "Credentials updated successfully"
                }
            )
        return jsonify(
            {
                "message": "Not found"
            }
        ), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
