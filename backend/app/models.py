from . import db


class Cars(db.Model):
    """
    Cars class representing the cars table in the database.

    Attributes:
        id (int): The unique identifier of the car.
        name (str): The name of the car.
        price (str): The price of the car.
        year (str): The year of manufacture of the car.
        type (str): The type of the car.
        description (str): The description of the car.
        dimensions (str): The dimensions of the car.
        technology (str): The technology features of the car.
        engine (str): The engine specifications of the car.
        is_exclusive (str): Whether the car is exclusive or not.
        images (list): A list of CarImages objects associated with the car.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.String(255), nullable=False)
    year = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String, nullable=False)
    dimensions = db.Column(db.String, nullable=False)
    technology = db.Column(db.String, nullable=False)
    engine = db.Column(db.String, nullable=False)
    is_exclusive = db.Column(db.String, nullable=False)
    images = db.relationship('CarImages', backref='car', lazy=True)


class CarImages(db.Model):
    """
    CarImages class representing the car_images table in the database.

    Attributes:
        id (int): The unique identifier of the car image.
        image_base64 (str): The base64 encoded image data.
        car_id (int): The unique identifier of the car associated with the image.
    """
    id = db.Column(db.Integer, primary_key=True)
    image_base64 = db.Column(db.String(), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)


class Testimonies(db.Model):
    """
    Testimonies class representing the testimonies table in the database.

    Attributes:
        id (int): The unique identifier of the testimony.
        testimony (str): The content of the testimony.
        name (str): The name of the person giving the testimony.
    """
    id = db.Column(db.Integer, primary_key=True)
    testimony = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)


class Patners(db.Model):
    """
    Patners class representing the patners table in the database.

    Attributes:
        id (int): The unique identifier of the partner.
        image (str): The image data of the partner.
        name (str): The name of the partner.
    """
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(), nullable=False)
    name = db.Column(db.String(255), nullable=False)


class CustomerRequests(db.Model):
    """
    CustomerRequests class representing the customer_requests table in the database.

    Attributes:
        id (int): The unique identifier of the customer request.
        name (str): The name of the customer.
        email (str): The email of the customer.
        phone (str): The phone number of the customer.
        car_id (str): The unique identifier of the car requested by the customer.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    car_id = db.Column(db.String(255), nullable=False)


class SpareRequests(db.Model):
    """
    SpareRequests class representing the spare_requests table in the database.

    Attributes:
        id (int): The unique identifier of the spare request.
        name (str): The name of the customer.
        email (str): The email of the customer.
        phone (str): The phone number of the customer.
        spare_id (str): The unique identifier of the spare part requested by the customer.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    spare_id = db.Column(db.String(255), nullable=False)


class Social(db.Model):
    """
    Social class representing the social table in the database.

    Attributes:
        id (int): The unique identifier of the social media account.
        phone (str): The phone number of the social media account.
        email (str): The email of the social media account.
        twitter (str): The twitter handle of the social media account.
        instagram (str): The instagram handle of the social media account.
    """
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    twitter = db.Column(db.String(255), nullable=False)
    instagram = db.Column(db.String(255), nullable=False)


class SpareParts(db.Model):
    """
    SpareParts class representing the spare_parts table in the database.

    Attributes:
        id (int): The unique identifier of the spare part.
        make (str): The make of the vehicle the spare part belongs to.
        year (str): The year of manufacture of the vehicle the spare part belongs to.
        chassis_no (str): The chassis number of the vehicle the spare part belongs to.
        part_no (str): The part number of the spare part.
    """
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(255), nullable=False)
    year = db.Column(db.String(10), nullable=False)
    chassis_no = db.Column(db.String(255), nullable=False)
    part_no = db.Column(db.String(255), nullable=False)


class SubscribedEmails(db.Model):
    """
    SubscribedEmails class representing the subscribed_emails table in the database.

    Attributes:
        id (int): The unique identifier of the subscribed email.
        email (str): The email address that is subscribed.
    """
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)


class AboutUs(db.Model):
    """
    AboutUs class representing the about_us table in the database.

    Attributes:
        id (int): The unique identifier of the about us content.
        about (str): The content of the about us section.
    """
    id = db.Column(db.Integer, primary_key=True)
    about = db.Column(db.String(120), nullable=False)


class EmailConfgurations(db.Model):
    """Represents email configurations in the database.

    Attributes:
        id (int): Configuration ID.
        email (str): Email address.
        password (str): Email password.
    """
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)


class LoginCredentials(db.Model):
    """
    LoginCredentials class representing the login_credentials table in the database.

    Attributes:
        id (int): The unique identifier of the login credentials.
        username (str): The username associated with the login credentials.
        password (str): The password associated with the login credentials.
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)