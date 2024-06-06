from flask import jsonify, Blueprint, request
from flask_jwt_extended import jwt_required
from .models import (
    Cars, Testimonies, CarImages, db
)


cars_bp = Blueprint('cars', __name__)


@cars_bp.route('/', methods=['GET'])
def home():
    """Gets all the cars and testimonials

    Returns:
        json: returns a json data for the cars and testimonies
    """
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


@cars_bp.route('/car', methods=['GET'])
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


@cars_bp.route('/car/new', methods=['POST'])
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
                'dimensions': data.get('dimensions'),
                'technology': data.get('technology'),
                'engine': data.get('engine'),
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


@cars_bp.route('/car/<int:id>', methods=['GET'])
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


@cars_bp.route('/car/<string:name>', methods=['GET'])
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


@cars_bp.route('/car/<int:car_id>/images', methods=['GET'])
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


@cars_bp.route('/car/evs', methods=['GET'])
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


@cars_bp.route('/car/evs/<string:name>', methods=['GET'])
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


@cars_bp.route('/car/exclusive', methods=['GET'])
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


@cars_bp.route('/car/delete/<int:id>', methods=['DELETE'])
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
            return 'deleted', 204
        return jsonify(
            {
                "status": "error", "message": "Car not found"
            }
        ), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
