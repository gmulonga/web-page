from flask import jsonify, Blueprint, request, session
from flask_jwt_extended import jwt_required, create_access_token
import bcrypt
from .models import Cars, Testimonies, LoginCredentials, CustomerRequests, SubscribedEmails, AboutUs, EmailConfgurations, Patners, SpareParts, Social, SpareRequests, db
import json

main = Blueprint('main', __name__)

USERS = {'carconnect': '1234'}

@main.route('/check-auth', methods=['GET'])
@jwt_required() 
def check_auth():
    return jsonify({'isAuthenticated': True})

@main.route('/admin')
def admin():
    if 'username' in session:
        return "Admin Page"
    else:
        return redirect(url_for('main.login'))

@main.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Check if LoginCredentials table is empty
        if db.session.query(LoginCredentials).count() == 0:
            if USERS.get(username) == password:
                access_token = create_access_token(identity=username)
                return jsonify({"status": "success", "access_token": access_token})
            else:
                return jsonify({"status": "error", "message": "Invalid credentials"}), 401
        else:
            # Look up the username in the LoginCredentials table
            user = LoginCredentials.query.filter_by(username=username).first()
            if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                access_token = create_access_token(identity=username)
                return jsonify({"status": "success", "access_token": access_token})
            else:
                return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@main.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('main.home'))

@main.route('/', methods=['GET'])
def home():
    cars = Cars.query.all()
    testimonials = Testimonies.query.all()

    # getting all the cars
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

    # getting all the testimonies
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


# adding a car to the database

@main.route('/add-car', methods=['POST'])
@jwt_required()
def add_car():
    if request.method == 'POST':
        try:
            # Parse the request payload
            data = request.json

            # Extract car data
            car_data = {
                'name': data.get('name'),
                'price': data.get('price'),
                'year': data.get('year'),
                'type': data.get('type'),
                'description': data.get('description'),
                # Serialize dimensions to a string (for example, JSON)
                'dimensions': json.dumps(data.get('dimensions')),
                'technology': json.dumps(data.get('technology')),
                'technology': json.dumps(data.get('technology')),
                'engine': json.dumps(data.get('engine')),
                'is_exclusive': data.get('is_exclusive')
            }

            # Create a new car instance
            new_car = Cars(**car_data)
            db.session.add(new_car)
            db.session.commit()

            return jsonify({"status": "success", "message": "Car added successfully"})

        except Exception as e:
            print('An error occurred:', str(e))
            db.session.rollback()
            return jsonify({"status": "error", "message": "An error occurred"}), 500



# getting a car with a specific ID
@main.route('/cars/<int:id>', methods=['GET'])
def get_car(id):
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
    else:
        return jsonify({"message": "Car not found"}), 404


# getting all cars with a specific name
@main.route('/get-cars/<string:name>', methods=['GET'])
def get_cars_by_name(name):
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
    car_images = CarImages.query.filter_by(car_id=car_id).all()

    image_data = [{'image_base64': image.image_base64} for image in car_images]

    return jsonify(image_data)


# getting all EVs by name
@main.route('/evs/<string:name>', methods=['GET'])
def get_evs_by_name(name):
    evs_cars = Cars.query.filter_by(type='EVs', name=name).all()

    if not evs_cars:
        return jsonify({"message": "No EVs found with the specified name"}), 404

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


# getting all EVS

@main.route('/evs', methods=['GET'])
def get_evs():
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


# getting all exclusive offers
@main.route('/exclusive-cars', methods=['GET'])
def get_exclusive_cars():
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


# Deleting a car with a specific id
@main.route('/delete-car/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_car(id):
    try:
        car = Cars.query.get(id)
        if car:
            # Delete associated images
            for image in car.images:
                db.session.delete(image)
            db.session.delete(car)
            db.session.commit()
            return jsonify({"status": "success", "message": "Car and images deleted successfully"})
        else:
            return jsonify({"status": "error", "message": "Car not found"}), 404
    except Exception as e:
        print('An error occurred:', str(e))
        db.session.rollback()
        return jsonify({"status": "error", "message": "An error occurred"}), 500


# ---------- GETTING CUSTOMER REQUEST -----------

@main.route('/customer-requests', methods=['GET'])
def get_customer_requests():
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
    try:
        customer_request = CustomerRequests.query.get(id)
        if customer_request:
            db.session.delete(customer_request)
            db.session.commit()
            return jsonify({"status": "success", "message": "Customer request deleted successfully"})
        else:
            return jsonify({"status": "error", "message": "Customer request not found"}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": "An error occurred"}), 500


#  ------------ TESTIMONIES ROUTES -----------

# Adding a new testimonial
@main.route('/add-testimony', methods=['POST'])
@jwt_required()
def add_testimonial():
    data = request.json
    testimonial = Testimonies(name=data['name'], testimony=data['testimony'])
    db.session.add(testimonial)
    db.session.commit()
    return 'Testimony created', 201


@main.route('/testimonies', methods=['GET'])
def get_testimonials():
    testimonials = Testimonies.query.all()
    # Create a list of dictionaries representing each testimonial
    testimonials_data = [
        {
            'id': testimonial.id,
            'name': testimonial.name,
            'testimony': testimonial.testimony
        }
        for testimonial in testimonials
    ]
    return jsonify(testimonials_data)


# Edit route for a specific testimony
@main.route('/testimonies/<int:id>', methods=['PUT'])
@jwt_required()
def edit_testimony(id):
    try:
        testimony = Testimonies.query.get_or_404(id)

        # Get new data from the request JSON
        data = request.json
        new_name = data.get('name')
        new_testimony = data.get('testimony')

        # Update the testimony with new data
        if new_name is not None:
            testimony.name = new_name
        if new_testimony is not None:
            testimony.testimony = new_testimony

        db.session.commit()
        return '', 204  # No content, success
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Delete route for a specific testimony
@main.route('/testimonies/<int:testimony_id>', methods=['DELETE'])
@jwt_required()
def delete_testimony(testimony_id):
    try:
        testimony = Testimonies.query.get_or_404(testimony_id)
        db.session.delete(testimony)
        db.session.commit()
        return '', 204  # No content, success
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# adding customer requests in the database

@main.route('/add_request', methods=['POST'])
@jwt_required()
def add_request():
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

        return jsonify({'message': 'Request added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# get all the requests in the database

@main.route('/get_requests', methods=['GET'])
def get_requests():
    try:
        requests = CustomerRequests.query.all()

        requests_list = []
        for request in requests:
            request_data = {
                'id': request.id,
                'name': request.name,
                'email': request.email,
                'phone': request.phone,
                'car_id': request.car_id
            }
            requests_list.append(request_data)

        return jsonify({'requests': requests_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ------ checking if the email is already in the database

@main.route('/subscribe', methods=['POST'])
@jwt_required()
def subscribe():
    data = request.json
    email = data['email']

    if email:
        # Check if the email is not already subscribed
        if not SubscribedEmails.query.filter_by(email=email).first():
            subscribed_email = SubscribedEmails(email=email)
            db.session.add(subscribed_email)
            db.session.commit()

            return 'You have been successfully subscribed.', 201
        else:
            return 'You are already subscribed.', 200
    else:
        return 'Invalid email address.', 400


# -------------- ABOUT US -------------------

@main.route('/add_about_us', methods=['POST'])
@jwt_required()
def add_about_us():
    if request.method == 'POST':
        # Assuming you're sending JSON data in the request body
        about_data = request.get_json()

        if 'about' not in about_data:
            return jsonify({'message': 'Missing "about" field'}), 400

        new_about = AboutUs(about=about_data['about'])

        try:
            db.session.add(new_about)
            db.session.commit()
            return jsonify({'message': 'About Us added successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Error adding About Us', 'error': str(e)}), 500


# get all about us
@main.route('/get_about_us', methods=['GET'])
def get_about_us():
    try:
        about_us_data = AboutUs.query.all()

        # Convert the data to a list of dictionaries
        about_us_list = [{'id': item.id, 'about': item.about}
                         for item in about_us_data]

        return jsonify(about_us_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# edit about us

@main.route('/edit_about_us/<int:id>', methods=['PUT'])
@jwt_required()
def edit_about_us(id):
    try:
        about_us = AboutUs.query.get(id)
        if not about_us:
            return jsonify({'message': 'About Us not found'}), 404

        about_content = request.json.get('about')
        about_us.about = about_content
        db.session.commit()

        return jsonify({'message': 'About Us updated successfully'}), 204

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update About Us'}), 500


# delete about us

@main.route('/delete_about_us/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_about_us(id):
    print(f"Received request to delete About Us with ID: {id}")
    try:
        about_us = AboutUs.query.get(id)
        if not about_us:
            return jsonify({'message': 'About Us not found'}), 404

        db.session.delete(about_us)
        db.session.commit()

        return jsonify({'message': 'About Us deleted successfully'}), 204

    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error deleting About Us: {e}")
        return jsonify({'message': 'Failed to delete About Us'}), 500
    

# ------------ GETTING ALL THE EMAILS FROM THE DATABASE -----------


def send_email(email_receiver, email_subject, email_body):
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
        print("No email configuration found.")


# sending emails to the subscribed customers
@main.route('/send-emails', methods=['POST'])  # Change method to POST
def send_emails():  # Rename the function for clarity
    try:
        # Fetch all the subscribed emails from the database
        subscribed_emails = SubscribedEmails.query.all()

        # Extract the email addresses from the fetched data
        emails = [email.email for email in subscribed_emails]

        data = request.get_json()

        email_subject = data['subject']
        email_body = data['body']

        # Send email to each email address
        for email_receiver in emails:
            try:
                send_email(email_receiver, email_subject, email_body)
                print(f"Email sent to: {email_receiver}")
            except Exception as e:
                print(f"Failed to send email to: {email_receiver}. Error: {e}")

        # Return a success response
        return jsonify({"message": "Emails sent successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------- add and delete patner -----------------
@main.route('/add_partner', methods=['POST'])
@jwt_required()
def add_partner():
    if request.method == 'POST':
        try:
            # Parse the request payload
            data = request.json

            # Extract partner data
            partner_data = {
                'name': data.get('name'),
                'image': data.get('image_base64')
            }

            # Create a new partner instance
            new_partner = Patners(**partner_data)
            db.session.add(new_partner)
            db.session.commit()

            return jsonify({"status": "success", "message": "Partner added successfully"})

        except Exception as e:
            print('An error occurred:', str(e))
            db.session.rollback()
            return jsonify({"status": "error", "message": "An error occurred"}), 500


@main.route('/get_partners', methods=['GET'])
def get_partners():
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
    if request.method == 'DELETE':
        try:
            partner = Patners.query.get(partner_id)
            if partner:
                db.session.delete(partner)
                db.session.commit()
                return jsonify({"message": "Partner deleted successfully!"}), 200
            else:
                return jsonify({"message": "Partner not found!"}), 404
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400


# spare parts routes

@main.route('/add_spare_part', methods=['POST'])
@jwt_required()
def add_spare_part():
    data = request.get_json()
    new_spare_part = SpareParts(
        make=data['make'],
        year=data['year'],
        chassis_no=data['chassis_no'],
        part_no=data['part_no']
    )
    db.session.add(new_spare_part)
    db.session.commit()
    return jsonify({"message": "Spare part added successfully!"}), 201


@main.route('/get_spare_parts', methods=['GET'])
def get_spare_parts():
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
    return jsonify({"spare_parts": spare_parts_list})


# get spare part by id

@main.route('/get_spare_part/<int:spare_id>', methods=['GET'])
def get_spare_part(spare_id):
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
        else:
            return jsonify({'message': 'Spare part not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# get spare part by year and make 

@main.route('/get_spare_parts/<string:make>/<string:year>', methods=['GET'])
def get_spare_parts_by_make_and_year(make, year):
    spare_parts = SpareParts.query.filter_by(make=make, year=year).all()
    if not spare_parts:
        return jsonify({"message": "No spare parts found for the given make and year"}), 404

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


# delete spare part form the DB
@main.route('/delete_spare_part/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_spare_part(id):
    spare_part = SpareParts.query.get(id)
    if spare_part:
        db.session.delete(spare_part)
        db.session.commit()
        return jsonify({"message": "Spare part deleted successfully!"}), 200
    else:
        return jsonify({"message": "Spare part not found"}), 404


# add social media platforms
@main.route('/add_social', methods=['POST'])
@jwt_required()
def add_social():
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


# delete the social media platfrom
@main.route('/delete_social', methods=['DELETE'])
@jwt_required()
def delete_social():
    social_records = Social.query.all()

    if social_records:
        for social in social_records:
            db.session.delete(social)
        db.session.commit()
        return jsonify({"message": "All social records deleted successfully!"}), 200
    else:
        return jsonify({"message": "No social records found"}), 404


# get all the social media platform form the DB 
@main.route('/get_social', methods=['GET'])
def get_social():
    social = Social.query.all()
    social_list = []
    for social in social:
        social_list.append({
            'twitter': social.twitter,
            'email': social.email,
            'instagram': social.instagram,
            'phone': social.phone,

        })
    return jsonify({"social": social_list})


# add spares request
@main.route('/add_spare_request', methods=['POST'])
@jwt_required()
def add_spare_request():
    if request.method == 'POST':
        data = request.json

        new_request = SpareRequests(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            spare_id=data['spare_id']
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({'message': 'Spare request added successfully'}), 201


# get all spare part requests
@main.route('/get_spares_requests', methods=['GET'])
def get_all_requests():
    try:
        all_requests = SpareRequests.query.all()

        requests_list = []
        for request in all_requests:
            request_data = {
                'id': request.id,
                'name': request.name,
                'email': request.email,
                'phone': request.phone,
                'spare_id': request.spare_id
            }
            requests_list.append(request_data)

        return jsonify({'requests': requests_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# delete spare part request

@main.route('/delete_spare_request/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_spare_request(request_id):
    try:
        spare_request = SpareRequests.query.get(request_id)

        if spare_request:
            db.session.delete(spare_request)
            db.session.commit()
            return jsonify({'message': 'Spare request deleted successfully'}), 200
        else:
            return jsonify({'message': 'Spare request not found'}), 404
    except Exception as e:
        db.session.rollback()  # Rollback changes if an error occurs
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close()


# ---------EMAIL CONFIGURATION---------
# Add route
@main.route('/add-email', methods=['POST'])
@jwt_required()
def add_email():
    data = request.json
    new_email = EmailConfgurations(email=data['email'], password=data['password'])
    
    try:
        db.session.add(new_email)
        db.session.commit()
        return jsonify({"message": "Email configuration added successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to add email configuration"}), 500


# Update route
@main.route('/update-email/<int:id>', methods=['PUT'])
@jwt_required()
def update_email(id):
    data = request.json
    email_to_update = EmailConfgurations.query.get(id)
    
    if email_to_update:
        email_to_update.email = data['email']
        email_to_update.password = data['password']
        
        try:
            db.session.commit()
            return jsonify({"message": "Email configuration updated successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to update email configuration"}), 500
    else:
        return jsonify({"message": "Email configuration not found"}), 404


@main.route('/get-email-configurations/<int:id>', methods=['GET'])
def get_email_configurations(id):
    email_config = EmailConfgurations.query.get(id)

    if email_config:
        return jsonify({'email': email_config.email, 'password': email_config.password})
    else:
        return jsonify({'message': 'Email configuration not found'}), 404


# ---------- SETTING PASSWORD ------------
# Add route
@main.route('/add-credentials', methods=['POST'])
@jwt_required()
def add_credentials():
    data = request.json
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    new_credentials = LoginCredentials(username=data['username'], password=hashed_password.decode('utf-8'))

    try:
        db.session.add(new_credentials)
        db.session.commit()
        return jsonify({"message": "Login credentials added successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to add login credentials"}), 500


# Update route

@main.route('/update-credentials/<int:id>', methods=['PUT'])
@jwt_required()
def update_credentials(id):
    data = request.json
    credentials_to_update = LoginCredentials.query.get(id)
    
    if credentials_to_update:
        credentials_to_update.username = data['username']
        new_password = data['password']
        hashed_password = generate_password_hash(new_password)
        
        credentials_to_update.password = hashed_password
        
        try:
            db.session.commit()
            return jsonify({"message": "Login credentials updated successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to update login credentials"}), 500
    else:
        return jsonify({"message": "Login credentials not found"}), 404

    

@main.route('/get-credentials/<int:id>', methods=['GET'])
def get_credentials(id):
    credentials = LoginCredentials.query.get(id)

    if credentials:
        return jsonify({'username': credentials.username, 'password_hash': credentials.password})
    else:
        return jsonify({'message': 'Credentials not found'}), 404