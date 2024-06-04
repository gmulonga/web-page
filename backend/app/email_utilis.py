import logging
import smtplib
import ssl
from email.message import EmailMessage

from flask import jsonify, Blueprint, request
from flask_jwt_extended import jwt_required
from .models import (
    SubscribedEmails, EmailConfgurations, db
)


admin_bp = Blueprint('main', __name__)

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler()])

logger = logging.getLogger(__name__)


@admin_bp.route('/email/configurations/<int:id>/', methods=['GET'])
@jwt_required()
def get_email_configurations(id):
    """fetches the email config"""
    email_config = EmailConfgurations.query.get(id)

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


@admin_bp.route('/email/configuration/new/', methods=['POST'])
@jwt_required()
def add_email():
    """adding email configurations"""
    try:
        data = request.json
        new_email = EmailConfgurations(email=data['email'], password=data['password'])

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


@admin_bp.route('/email/configuration/update<int:id>/', methods=['PUT'])
@jwt_required()
def update_email(id):
    """updating email config"""
    try:
        data = request.json
        email_to_update = EmailConfgurations.query.get(id)

        if email_to_update:
            email_to_update.email = data['email']
            email_to_update.password = data['password']

            db.session.commit()
            return jsonify(
                {
                    "message": "Email configuration updated"
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


def send_email(email_receiver, email_subject, email_body):
    """sending email functionality

    Args:
        email_receiver (str): the email recepient
        email_subject (str): the email sender
        email_body (str): message of the email
    """
    email_configuration = EmailConfgurations.query.first()
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
    else:
        logger.error("No email configuration found.")


@admin_bp.route('/email/', methods=['POST'])
def send_email_to_customer():
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
