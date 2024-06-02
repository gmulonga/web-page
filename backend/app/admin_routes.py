from flask import jsonify, Blueprint, request, session, redirect, url_for
from flask_jwt_extended import jwt_required, create_access_token
import bcrypt
from .models import (
    LoginCredentials, SubscribedEmails,
    EmailConfigurations, Partners, Social, db
)

from werkzeug.security import generate_password_hash
import smtplib
import ssl
from email.message import EmailMessage
import logging


admin_bp = Blueprint('main', __name__)

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler()])

logger = logging.getLogger(__name__)

USERS = {'admin': '1234'}


@admin_bp.route('/check-auth', methods=['GET'])
@jwt_required()
def check_auth():
    return jsonify({'isAuthenticated': True})


@admin_bp.route('/admin')
def admin():
    if 'username' in session:
        return "Admin Page"
    return redirect(url_for('main.login'))


@admin_bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({
                "status": "error",
                "message": "Invalid input"
            }), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({
                "status": "error",
                "message": "Missing username or password"
            }), 400

        if db.session.query(LoginCredentials).count() == 0:
            if USERS.get(username) == password:
                access_token = create_access_token(identity=username)
                return jsonify({"status": "success", "access_token": access_token})
            return jsonify({
                "status": "error",
                "message": "Invalid credentials"
            }), 401

        user = LoginCredentials.query.filter_by(username=username).first()
        if user and bcrypt.checkpw(
            password.encode('utf-8'),
            user.password.encode('utf-8')
        ):
            access_token = create_access_token(identity=username)
            return jsonify({"status": "success", "access_token": access_token})
        return jsonify({
            "status": "error",
            "message": "Invalid credentials"
        }), 401


def send_email(email_receiver, email_subject, email_body):
    """sending email functionality

    Args:
        email_receiver (str): the email recepient
        email_subject (str): the email sender
        email_body (str): message of the email
    """
    try:
        email_configuration = EmailConfigurations.query.first()
        if email_configuration:
            email_sender = email_configuration.email
            email_password = email_configuration.password

            em = EmailMessage()
            em["Subject"] = email_subject
            em["From"] = email_sender
            em["To"] = email_receiver
            em.set_content(email_body)

            context = ssl.create_default_context()

            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                server.login(email_sender, email_password)
                server.sendmail(email_sender, email_receiver, em.as_string())
            return jsonify({"Email sent"})
        else:
            logger.error("No email configuration found.")
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/send-emails', methods=['POST'])
def send_emails():
    """sends email to the subscribed customers"""
    try:
        subscribed_emails = SubscribedEmails.query.all()

        emails = [email.email for email in subscribed_emails]

        data = request.get_json()

        email_subject = data['subject']
        email_body = data['body']

        for email_receiver in emails:
            try:
                send_email(email_receiver, email_subject, email_body)
            except Exception as e:
                return jsonify({'error': str(e)}), 500

        return jsonify(
            {
                "message": "Emails sent successfully."
            }
        ), 200

    except Exception as e:
        return jsonify(
            {
                "error": str(e)
            }
        ), 500


@admin_bp.route('/partners', methods=['GET'])
def get_partners():
    """fetches all the parteners in the DB"""
    try:
        partners = Partners.query.all()
        partners_data = [{"id": partner.id, "name": partner.name,
                          "image": partner.image} for partner in partners]
        return jsonify(partners_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@admin_bp.route('/partner/new', methods=['POST'])
@jwt_required()
def add_partner():
    """adding partners in the footer secion"""
    if request.method == 'POST':
        try:
            data = request.json

            partner_data = {
                'name': data.get('name'),
                'image': data.get('image_base64')
            }

            new_partner = Partners(**partner_data)
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
    else:
        return jsonify({'error': 'Invalid request'}), 400


@admin_bp.route('/partner/delete/<int:partner_id>', methods=['DELETE'])
@jwt_required()
def delete_partner(partner_id):
    """deletes a partner from the DB

    Args:
        partner_id (int): the ID of the partner

    """
    if request.method == 'DELETE':
        try:
            partner = Partners.query.get(partner_id)
            if partner:
                db.session.delete(partner)
                db.session.commit()
                return '', 204
            return jsonify({"message": "Partner not found!"}), 404
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400
    else:
        return jsonify(
            {
                "error": "Invalid request method"
            }
        ), 405


@admin_bp.route('/social', methods=['GET'])
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


@admin_bp.route('/social/new', methods=['POST'])
@jwt_required()
def add_social():
    """creates a new social media accounts

    Returns:
        json: returns json data for the social media accounts
    """
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


@admin_bp.route('/social/delete', methods=['DELETE'])
@jwt_required()
def delete_social():
    """deletes all social media account"""
    social_records = Social.query.all()

    if social_records:
        for social in social_records:
            db.session.delete(social)
        db.session.commit()
        return '', 204
    return jsonify({"message": "No social records found"}), 404


@admin_bp.route('/email/configurations/<int:id>', methods=['GET'])
def get_email_configurations(id):
    """fetches the email config"""
    email_config = EmailConfigurations.query.get(id)

    if email_config:
        return jsonify(
            {
                'email': email_config.email,
                'password': email_config.password
            }
        )
    return jsonify(
        {
            'message': 'Email configuration not found'
        }
    ), 404


@admin_bp.route('/email/configuration/new', methods=['POST'])
@jwt_required()
def add_email():
    """adding email configurations"""
    data = request.json
    new_email = EmailConfigurations(email=data['email'], password=data['password'])

    try:
        db.session.add(new_email)
        db.session.commit()
        return jsonify(
            {
                "message": "Email configuration added successfully"
            }
        ), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/email/configuration/update<int:id>', methods=['PUT'])
@jwt_required()
def update_email(id):
    """updating email config"""
    data = request.json
    email_to_update = EmailConfigurations.query.get(id)

    if email_to_update:
        email_to_update.email = data['email']
        email_to_update.password = data['password']

        try:
            db.session.commit()
            return jsonify(
                {
                    "message": "Email configuration updated successfully"
                }
            )
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify(
            {
                "message": "Email configuration not found"
            }
        ), 404


@admin_bp.route('/credentials/<int:id>', methods=['GET'])
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


@admin_bp.route('/credentials/new', methods=['POST'])
@jwt_required()
def add_credentials():
    """adding a password"""
    data = request.json
    hashed_password = bcrypt.hashpw(
        data['password'].encode('utf-8'),
        bcrypt.gensalt()
    )

    new_credentials = LoginCredentials(
        username=data['username'],
        password=hashed_password.decode('utf-8')
    )

    try:
        db.session.add(new_credentials)
        db.session.commit()
        return jsonify(
            {
                "message": "Login credentials added successfully"
            }
        ), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/credentials/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_credentials(id):
    """updating a password"""
    data = request.json
    credentials_to_update = LoginCredentials.query.get(id)

    if credentials_to_update:
        credentials_to_update.username = data['username']
        new_password = data['password']
        hashed_password = generate_password_hash(new_password)

        credentials_to_update.password = hashed_password

        try:
            db.session.commit()
            return jsonify(
                {
                    "message": "Login credentials updated successfully"
                }
            )
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify(
            {
                "message": "Login credentials not found"
            }
        ), 404
