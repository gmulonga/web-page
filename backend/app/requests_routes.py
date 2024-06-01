from flask import jsonify, Blueprint, request, session, redirect, url_for
from flask_jwt_extended import jwt_required
from .models import (
    Testimonies, CustomerRequests, SpareParts, SpareRequests, db
)
from werkzeug.security import generate_password_hash
import logging
import os


request_bp = Blueprint('request', __name__)

errorMessage = "An error occurred"

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler()])

logger = logging.getLogger(__name__)

USERS = os.environ.get("USERS")


@request_bp.route('/check-auth', methods=['GET'])
@jwt_required()
def check_auth():
    return jsonify({'isAuthenticated': True})


@request_bp.route('/admin')
def admin():
    if 'username' in session:
        return "Admin Page"
    return redirect(url_for('main.login'))


@request_bp.route('/request', methods=['GET'])
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


@request_bp.route('/requests/new', methods=['POST'])
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


@request_bp.route('/request/delete/<int:id>', methods=['DELETE'])
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
            return 'deleted', 204
        return jsonify(
            {
                "status": "error",
                "message": "Customer request not found"
            }
        ), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@request_bp.route('/testimony', methods=['GET'])
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


@request_bp.route('/testimony/new', methods=['POST'])
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


@request_bp.route('/testimony/update/<int:id>', methods=['PUT'])
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
        return 'updated', 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@request_bp.route('/testimony/delete/<int:testimony_id>', methods=['DELETE'])
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


@request_bp.route('/spare_parts', methods=['GET'])
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


@request_bp.route('/spare_part/new', methods=['POST'])
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


@request_bp.route('/spare_part/<int:spare_id>', methods=['GET'])
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


@request_bp.route('/spare_parts/<string:make>/<string:year>', methods=['GET'])
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


@request_bp.route('/spare_part/delete/<int:id>', methods=['DELETE'])
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


@request_bp.route('/spare_request/new', methods=['POST'])
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


@request_bp.route('/spares_requests', methods=['GET'])
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


@request_bp.route('/spare_request/delete/<int:request_id>', methods=['DELETE'])
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
