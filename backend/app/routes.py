from flask import jsonify, Blueprint, request, session, redirect, url_for
from flask_jwt_extended import jwt_required, create_access_token
import bcrypt
from .models import (
    Cars, Testimonies, LoginCredentials, CustomerRequests, SubscribedEmails, AboutUs,
    EmailConfgurations, Patners, SpareParts, Social, SpareRequests, CarImages, db
)
import json
from werkzeug.security import generate_password_hash
import smtplib
import ssl
from email.message import EmailMessage
from flask_sqlalchaemy import SQLAlchemyError
import logging


main = Blueprint('main', __name__)

errorMessage = "An error occurred"

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler()])

logger = logging.getLogger(__name__)

USERS = {'carconnect': '1234'}


@main.route('/check-auth', methods=['GET'])
@jwt_required()
def check_auth():
    return jsonify({'isAuthenticated': True})


@main.route('/admin')
def admin():
    if 'username' in session:
        return "Admin Page"
    return redirect(url_for('main.login'))


@main.route('/login', methods=['POST'])
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


@main.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('main.home'))


@main.route('/', methods=['GET'])
def home():
    cars = Cars.query.all()
    testimonials = Testimonies.query.all()

    car_list = []
    for car in cars:
        car_dict = {
            'id': car.id,
            'name': car.name,
            'price': car.price,
            'type': car.type,
            'year': car.year,
            'description': car.description,
        }
        car_list.append(car_dict)

    testimony_list = []
    for testimony in testimonials:
        testimony_dict = {
            'id': testimony.id,
            'name': testimony.name,
            'testimony': testimony.testimony,
        }
        testimony_list.append(testimony_dict)

    data = {
        'cars': car_list,
        'testimonials': testimony_list,
    }

    return jsonify(data)


@main.route('/cars', methods=['GET'])
def get_cars():
    """Retrieve a list of all cars.

    Returns:
        jsonify: A JSON response containing information about all cars
    """
    cars = Cars.query.all()
    cars_list = []
    for car in cars:
        car_dict = {
            'id': car.id,
            'name': car.name,
            'price': car.price,
            'year': car.year,
            'type': car.type,
            'description': car.description,
            'dimensions': car.dimensions,
            'technology': car.technology,
            'engine': car.engine,
            'is_exclusive': car.is_exclusive,
            'images': []
        }
        for image in car.images:
            car_dict['images'].append({
                'id': image.id,
                'image_base64': image.image_base64
            })
        cars_list.append(car_dict)
    return jsonify(cars_list)


@main.route('/add-car', methods=['POST'])
@jwt_required()
def add_car():
    """Adds a new car to the DB"""
    if request.method == 'POST':
        try:
            data = request.json

            car_data = {
                'name': data.get('name'),
                'price': data.get('price'),
                'year': data.get('year'),
                'type': data.get('type'),
                'description': data.get('description'),
                'dimensions': json.dumps(data.get('dimensions')),
                'technology': json.dumps(data.get('technology')),
                'engine': json.dumps(data.get('engine')),
                'is_exclusive': data.get('is_exclusive')
            }

            new_car = Cars(**car_data)
            db.session.add(new_car)
            db.session.commit()

            return jsonify(
                {
                    "status": "success",
                    "message": "Car added successfully"
                }
            )

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid request'}), 400


@main.route('/cars/<int:id>', methods=['GET'])
def get_car(id):
    """Gets a car by ID

    Args:
        id (int): this is the ID of the car

    Returns:
        jsonify: JSON response containing a car of a specific ID
    """
    car = Cars.query.get(id)
    if car:
        car_data = {
            'id': car.id,
            'name': car.name,
            'price': car.price,
            'year': car.year,
            'type': car.type,
            'description': car.description,
            'dimensions': car.dimensions,
            'technology': car.technology,
            'engine': car.engine,
            'is_exclusive': car.is_exclusive,
        }

        images = CarImages.query.filter_by(car_id=id).all()
        images_base64 = [image.image_base64 for image in images]
        car_data['images'] = images_base64

        return jsonify(car_data), 200
    return jsonify({"message": "Car not found"}), 404


@main.route('/get-cars/<string:name>', methods=['GET'])
def get_cars_by_name(name):
    """Returns a car by name

    Args:
        name (str): the name of the car

    Returns:
        jsonify: returns a JSON of the response of a specific car by name
    """

    cars = Cars.query.filter_by(name=name).all()
    cars_list = []
    for car in cars:
        car_dict = {
            'id': car.id,
            'name': car.name,
            'price': car.price,
            'year': car.year,
            'type': car.type,
            'description': car.description,
            'dimensions': car.dimensions,
            'technology': car.technology,
            'engine': car.engine,
            'is_exclusive': car.is_exclusive,
            'images': []
        }
        for image in car.images:
            car_dict['images'].append({
                'id': image.id,
                'image_base64': image.image_base64
            })
        cars_list.append(car_dict)
    return jsonify(cars_list)


@main.route('/car/<int:car_id>/images', methods=['GET'])
def get_car_images(car_id):
    """Returns all the images of a specific car

    Args:
        car_id (int): the ID of the car

    Returns:
        jsonify: returns a JSON response for images belonging to a specific car
    """

    car_images = CarImages.query.filter_by(car_id=car_id).all()

    image_data = [{'image_base64': image.image_base64} for image in car_images]

    return jsonify(image_data)


@main.route('/evs/<string:name>', methods=['GET'])
def get_evs_by_name(name):
    """Returns all the evs by name

    Args:
        name (str): name of the car

    Returns:
        jsonify: returns all the evs of a specific name
    """

    evs_cars = Cars.query.filter_by(type='EVs', name=name).all()

    if not evs_cars:
        return jsonify(
            {
                "message": "No EVs found with the specified name"
            }
        ), 404

    evs_list = []
    for car in evs_cars:
        car_dict = {
            'id': car.id,
            'name': car.name,
            'price': car.price,
            'year': car.year,
            'description': car.description,
            'is_exclusive': car.is_exclusive,
            'images': []
        }
        for image in car.images:
            car_dict['images'].append({
                'id': image.id,
                'image_base64': image.image_base64
            })
        evs_list.append(car_dict)

    return jsonify(evs_list)


@main.route('/evs', methods=['GET'])
def get_evs():
    """returns all the evs

    Returns:
        jsonify: returns a JSON response to all the evs
    """

    evs_cars = Cars.query.filter_by(type='EVs').all()
    evs_list = []
    for car in evs_cars:
        car_dict = {
            'id': car.id,
            'name': car.name,
            'price': car.price,
            'year': car.year,
            'description': car.description,
            'is_exclusive': car.is_exclusive,
            'images': []
        }
        for image in car.images:
            car_dict['images'].append({
                'id': image.id,
                'image_base64': image.image_base64
            })
        evs_list.append(car_dict)
    return jsonify(evs_list)


@main.route('/exclusive-cars', methods=['GET'])
def get_exclusive_cars():
    """Returns all the exclusive cars

    Returns:
        jsonify: returns all the exclusive cars
    """

    exclusive_cars = Cars.query.filter_by(is_exclusive='True').all()
    exclusive_list = []
    for car in exclusive_cars:
        car_dict = {
            'id': car.id,
            'name': car.name,
            'price': car.price,
            'year': car.year,
            'type': car.type,
            'description': car.description,
            'images': []
        }
        for image in car.images:
            car_dict['images'].append({
                'id': image.id,
                'image_base64': image.image_base64
            })
        exclusive_list.append(car_dict)
    return jsonify(exclusive_list)


@main.route('/delete-car/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_car(id):
    """Deletes a car

    Args:
        id (int): this is the car ID

    Returns:
        jsonify: Returns a json reponse 204 or 404
    """

    try:
        car = Cars.query.get(id)
        if car:
            # Delete associated images
            for image in car.images:
                db.session.delete(image)
            db.session.delete(car)
            db.session.commit()
            return jsonify(
                {
                    "status": "success",
                    "message": "Car and images deleted successfully"
                }
            )
        return jsonify(
            {
                "status": "error", "message": "Car not found"
            }
        ), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@main.route('/customer-requests', methods=['GET'])
def get_customer_requests():
    """gets all the customer requests

    Returns:
        jsonify: returns all the requests of customers
    """

    try:
        customer_requests = CustomerRequests.query.all()
        requests_data = [
            {
                'id': request.id,
                'name': request.name,
                'email': request.email,
                'phone': request.phone,
                'car_id': request.car_id
            }
            for request in customer_requests
        ]
        return jsonify(requests_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main.route('/customer-requests/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_customer_request(id):
    """deletes customer request

    Args:
        id (int): ID for the customer request

    Returns:
        jsonify: returns a response 204 or 404
    """

    try:
        customer_request = CustomerRequests.query.get(id)
        if customer_request:
            db.session.delete(customer_request)
            db.session.commit()
            return jsonify(
                {
                    "status": "success",
                    "message": "Customer request deleted successfully"
                }
            )
        return jsonify(
            {
                "status": "error",
                "message": "Customer request not found"
            }
        ), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@main.route('/add-testimony', methods=['POST'])
@jwt_required()
def add_testimonial():
    """add a new testimony

    Returns:
        jsonify: returns a response 201
    """

    data = request.json
    testimonial = Testimonies(
        name=data['name'],
        testimony=data['testimony']
    )
    db.session.add(testimonial)
    db.session.commit()
    return 'Testimony created', 201


@main.route('/testimonies', methods=['GET'])
def get_testimonials():
    """fetches all testimonies

    Returns:
        jsonofy: JSON reponse to all testimonies
    """

    testimonials = Testimonies.query.all()
    testimonials_data = [
        {
            'id': testimonial.id,
            'name': testimonial.name,
            'testimony': testimonial.testimony
        }
        for testimonial in testimonials
    ]
    return jsonify(testimonials_data)


@main.route('/testimonies/<int:id>', methods=['PUT'])
@jwt_required()
def edit_testimony(id):
    """edits a testimony

    Args:
        id (int): testimony ID

    Returns:
        jsonify: returns a JSON response
    """

    try:
        testimony = Testimonies.query.get_or_404(id)

        data = request.json
        new_name = data.get('name')
        new_testimony = data.get('testimony')

        if new_name is not None:
            testimony.name = new_name
        if new_testimony is not None:
            testimony.testimony = new_testimony

        db.session.commit()
        return '', 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@main.route('/testimonies/<int:testimony_id>', methods=['DELETE'])
@jwt_required()
def delete_testimony(testimony_id):
    """deletes a testimony

    Args:
        testimony_id (int): testimony ID

    Returns:
        jsonify: response 204
    """
    try:
        testimony = Testimonies.query.get_or_404(testimony_id)
        db.session.delete(testimony)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@main.route('/add_request', methods=['POST'])
@jwt_required()
def add_request():
    """adds a new request for a car

    Returns:
        jsonify: response 201
    """
    try:
        data = request.get_json()

        new_request = CustomerRequests(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            car_id=data['car_id']
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify(
            {
                'message': 'Request added successfully'
            }
        ), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main.route('/get_requests', methods=['GET'])
def get_requests():
    """returns all the requests by a customer

    Returns:
        jsonify: returns a json response for all the requests
    """
    try:
        requests = CustomerRequests.query.all()

        requests_list = []
        for req in requests:
            request_data = {
                'id': req.id,
                'name': req.name,
                'email': req.email,
                'phone': req.phone,
                'car_id': req.car_id
            }
            requests_list.append(request_data)

        return jsonify({'requests': requests_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main.route('/subscribe', methods=['POST'])
@jwt_required()
def subscribe():
    """allows a user to subscribe to emails"""
    data = request.json
    email = data['email']

    if email:
        if not SubscribedEmails.query.filter_by(email=email).first():
            subscribed_email = SubscribedEmails(email=email)
            db.session.add(subscribed_email)
            db.session.commit()

            return 'You have been successfully subscribed.', 201
        return 'You are already subscribed.', 200
    return 'Invalid email address.', 400


@main.route('/add_about_us', methods=['POST'])
@jwt_required()
def add_about_us():
    """adds the about us"""
    if request.method == 'POST':
        about_data = request.get_json()

        if 'about' not in about_data:
            return jsonify(
                {
                    'message': 'Missing "about" field'
                }
            ), 400

        new_about = AboutUs(about=about_data['about'])

        try:
            db.session.add(new_about)
            db.session.commit()
            return jsonify(
                {
                    'message': 'About Us added successfully'
                }
            ), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'message': 'Invalid request'}), 400


@main.route('/get_about_us', methods=['GET'])
def get_about_us():
    """fetches the about us from the DB"""
    try:
        about_us_data = AboutUs.query.all()
        about_us_list = [{'id': item.id, 'about': item.about}
                         for item in about_us_data]

        return jsonify(about_us_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main.route('/edit_about_us/<int:id>', methods=['PUT'])
@jwt_required()
def edit_about_us(id):
    """edits the about us

    Args:
        id (int): the id of the about us

    """
    try:
        about_us = AboutUs.query.get(id)
        if not about_us:
            return jsonify(
                {
                    'message': 'About Us not found'
                }
            ), 404

        about_content = request.json.get('about')
        about_us.about = about_content
        db.session.commit()

        return jsonify(
            {
                'message': 'About Us updated successfully'
            }
        ), 204

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@main.route('/delete_about_us/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_about_us(id):
    """deletes the about us

    Args:
        id (int): the ID of the about us

    """
    try:
        about_us = AboutUs.query.get(id)
        if not about_us:
            return jsonify({'message': 'About Us not found'}), 404

        db.session.delete(about_us)
        db.session.commit()

        return jsonify({'message': 'About Us deleted successfully'}), 204

    except SQLAlchemyError as e:
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


@main.route('/send-emails', methods=['POST'])
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


@main.route('/add_partner', methods=['POST'])
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

            new_partner = Patners(**partner_data)
            db.session.add(new_partner)
            db.session.commit()

            return jsonify(
                {
                    "status": "success",
                    "message": "Partner added successfully"
                }
            )

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid request'}), 400


@main.route('/get_partners', methods=['GET'])
def get_partners():
    """fetches all the parteners in the DB"""
    try:
        partners = Patners.query.all()
        partners_data = [{"id": partner.id, "name": partner.name,
                          "image": partner.image} for partner in partners]
        return jsonify(partners_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@main.route('/delete_partner/<int:partner_id>', methods=['DELETE'])
@jwt_required()
def delete_partner(partner_id):
    """deletes a partner from the DB

    Args:
        partner_id (int): the ID of the partner

    """
    if request.method == 'DELETE':
        try:
            partner = Patners.query.get(partner_id)
            if partner:
                db.session.delete(partner)
                db.session.commit()
                return jsonify(
                    {
                        "message": "Partner deleted successfully!"
                    }
                ), 200
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


@main.route('/add_spare_part', methods=['POST'])
@jwt_required()
def add_spare_part():
    """adding a spare part"""
    data = request.get_json()
    new_spare_part = SpareParts(
        make=data['make'],
        year=data['year'],
        chassis_no=data['chassis_no'],
        part_no=data['part_no']
    )
    db.session.add(new_spare_part)
    db.session.commit()
    return jsonify(
        {
            "message": "Spare part added successfully!"
        }
    ), 201


@main.route('/get_spare_parts', methods=['GET'])
def get_spare_parts():
    """fetches all the spare parts from the DB

    Returns:
        jsonify: returns a json response to all the spare parts
    """
    spare_parts = SpareParts.query.all()
    spare_parts_list = []
    for part in spare_parts:
        spare_parts_list.append({
            'id': part.id,
            'make': part.make,
            'year': part.year,
            'chassis_no': part.chassis_no,
            'part_no': part.part_no
        })
    return jsonify(
        {
            "spare_parts": spare_parts_list
        }
    )


@main.route('/get_spare_part/<int:spare_id>', methods=['GET'])
def get_spare_part(spare_id):
    """fetches a spare part by ID

    Args:
        spare_id (int): the ID of the spare part

    Returns:
        jsonify: a json response to a particular spare part
    """
    try:
        spare_part = SpareParts.query.get(spare_id)

        if spare_part:
            spare_part_data = {
                'id': spare_part.id,
                'make': spare_part.make,
                'year': spare_part.year,
                'chassis_no': spare_part.chassis_no,
                'part_no': spare_part.part_no
            }
            return jsonify(spare_part_data)
        return jsonify(
            {
                'message': 'Spare part not found'
            }
        ), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main.route('/get_spare_parts/<string:make>/<string:year>', methods=['GET'])
def get_spare_parts_by_make_and_year(make, year):
    """returns a spare part for a particular year and make

    Args:
        make (str): make id the spare part
        year (str): the year of the spare part

    Returns:
        jsonify: returns a json response for spare parts of a particular year and make
    """
    spare_parts = SpareParts.query.filter_by(make=make, year=year).all()
    if not spare_parts:
        return jsonify(
            {
                "message": "No spare parts found"
            }
        ), 404

    spare_parts_list = []
    for part in spare_parts:
        spare_parts_list.append({
            'id': part.id,
            'make': part.make,
            'year': part.year,
            'chassis_no': part.chassis_no,
            'part_no': part.part_no
        })

    return jsonify({"spare_parts": spare_parts_list})


@main.route('/delete_spare_part/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_spare_part(id):
    """deletes a spare part

    Args:
        id (int): the id of the spare part

    """
    spare_part = SpareParts.query.get(id)
    if spare_part:
        db.session.delete(spare_part)
        db.session.commit()
        return jsonify(
            {
                "message": "Spare part deleted successfully!"
            }
        ), 200
    return jsonify({"message": "Spare part not found"}), 404


@main.route('/add_social', methods=['POST'])
@jwt_required()
def add_social():
    """adding social media account"""
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


@main.route('/delete_social', methods=['DELETE'])
@jwt_required()
def delete_social():
    """deletes social media account"""
    social_records = Social.query.all()

    if social_records:
        for social in social_records:
            db.session.delete(social)
        db.session.commit()
        return jsonify(
            {
                "message": "All social records deleted successfully!"
            }
        ), 200
    return jsonify({"message": "No social records found"}), 404


@main.route('/get_social', methods=['GET'])
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


@main.route('/add_spare_request', methods=['POST'])
@jwt_required()
def add_spare_request():
    """ads a spare part request"""
    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({
                "status": "error",
                "message": "Invalid input"
            }), 400

        new_request = SpareRequests(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            spare_id=data['spare_id']
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({
            'message': 'Spare request added successfully'
        }), 201


@main.route('/get_spares_requests', methods=['GET'])
def get_all_requests():
    """fetches all the spare part requests"""
    try:
        all_requests = SpareRequests.query.all()

        requests_list = []
        for req in all_requests:
            request_data = {
                'id': req.id,
                'name': req.name,
                'email': req.email,
                'phone': req.phone,
                'spare_id': req.spare_id
            }
            requests_list.append(request_data)

        return jsonify({'requests': requests_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main.route('/delete_spare_request/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_spare_request(request_id):
    """deletes a spare part request

    Args:
        request_id (int): the ID of the spare part

    """
    try:
        spare_request = SpareRequests.query.get(request_id)

        if spare_request:
            db.session.delete(spare_request)
            db.session.commit()
            return jsonify(
                {
                    'message': 'Spare request deleted successfully'
                }
            ), 200
        return jsonify(
            {
                'message': 'Spare request not found'
            }
        ), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close()


@main.route('/add-email', methods=['POST'])
@jwt_required()
def add_email():
    """adding email configurations"""
    data = request.json
    new_email = EmailConfgurations(email=data['email'], password=data['password'])

    try:
        db.session.add(new_email)
        db.session.commit()
        return jsonify(
            {
                "message": "Email configuration added successfully"
            }
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@main.route('/update-email/<int:id>', methods=['PUT'])
@jwt_required()
def update_email(id):
    """updating email config"""
    data = request.json
    email_to_update = EmailConfgurations.query.get(id)

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


@main.route('/get-email-configurations/<int:id>', methods=['GET'])
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


@main.route('/add-credentials', methods=['POST'])
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
        return jsonify({"message": "Login credentials added successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@main.route('/update-credentials/<int:id>', methods=['PUT'])
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


@main.route('/get-credentials/<int:id>', methods=['GET'])
def get_credentials(id):
    """fetches the password"""
    credentials = LoginCredentials.query.get(id)

    if credentials:
        return jsonify(
            {
                'username': credentials.username,
                'password_hash': credentials.password
            }
        )
    return jsonify({'message': 'Credentials not found'}), 404
