import logging

from flask import jsonify, Blueprint, request, session, redirect, url_for
from flask_jwt_extended import jwt_required, create_access_token
from .models import (
    LoginCredentials, Patners, Social, db
)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_wtf.csrf import validate_csrf, CSRFError


admin_bp = Blueprint('main', __name__)

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler()])

logger = logging.getLogger(__name__)

USERS = {'admin': '1234'}


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
    try:
        csrf_token = request.headers.get('X-CSRFToken')
        if not csrf_token or csrf_token != session.get('csrf_token'):
            raise CSRFError("CSRF token is missing or invalid")

        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Invalid input"}), 400

        username = data.get('username')
        password = data.get('password')

        if db.session.query(LoginCredentials).count() == 0:
            if USERS.get(username) == password:
                access_token = create_access_token(identity=username)
                return jsonify({"status": "success", "access_token": access_token})
            return jsonify({"status": "error", "message": "Invalid credentials"}), 401

        user = LoginCredentials.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity=username)
            return jsonify({"status": "success", "access_token": access_token})
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401
    except CSRFError as e:
        return jsonify({"status": "error", "message": str(e)}), 400


@admin_bp.route('/logout/')
def logout():
    """logging out a user"""
    session.pop('username', None)
    return redirect(url_for('home'))


@admin_bp.route('/partners', methods=['GET'])
def get_partners():
    """fetches all the parteners in the DB"""
    try:
        partners = Patners.query.all()
        partners_data = [{"id": partner.id, "name": partner.name,
                          "image": partner.image} for partner in partners]
        return jsonify(partners_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@admin_bp.route('/partner/new/', methods=['POST'])
@jwt_required()
def add_partner():
    """adding partners in the footer secion"""
    try:
        data = request.json

        partner_data = {
            'name': data.get('name'),
            'image': data.get('image_base64')
        }

        new_partner = Patners(**partner_data)
        db.session.add(new_partner)
        db.session.commit()

        return jsonify(
            {
                "status": "success",
                "message": "Partner added successfully"
            }
        ), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/partner/delete/<int:partner_id>/', methods=['DELETE'])
@jwt_required()
def delete_partner(partner_id):
    """deletes a partner from the DB

    Args:
        partner_id (int): the ID of the partner

    """
    try:
        partner = Patners.query.get(partner_id)
        if partner:
            db.session.delete(partner)
            db.session.commit()
            return '', 204
        return jsonify({"message": "Partner not found!"}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@admin_bp.route('/social/', methods=['GET'])
def get_social():
    """gets all the social media accounts"""
    social = Social.query.all()
    social_list = []
    for soc in social:
        social_list.append({
            'twitter': soc.twitter,
            'email': soc.email,
            'instagram': soc.instagram,
            'phone': soc.phone,

        })
    return jsonify({"social": social_list})


@admin_bp.route('/social/new/', methods=['POST'])
@jwt_required()
def add_social():
    """creates a new social media accounts

    Returns:
        json: returns json data for the social media accounts
    """
    try:
        data = request.get_json()
        new_social = Social(
            phone=data['phone'],
            twitter=data['twitter'],
            instagram=data['instagram'],
            email=data['email']
        )
        db.session.add(new_social)
        db.session.commit()
        return jsonify({"message": "social added successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/social/delete/', methods=['DELETE'])
@jwt_required()
def delete_social():
    """deletes all social media account"""
    try:
        social_records = Social.query.all()

        if social_records:
            for social in social_records:
                db.session.delete(social)
            db.session.commit()
            return '', 204
        return jsonify({"message": "No social records found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/credentials/<int:id>/', methods=['GET'])
def get_credentials(id):
    """fetches the passwor and username"""
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
