from . import db 

class Cars(db.Model):
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
    id = db.Column(db.Integer, primary_key=True)
    image_base64 = db.Column(db.String(), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)

class Testimonies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    testimony = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)

class Patners(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(), nullable=False)
    name = db.Column(db.String(255), nullable=False)

class CustomerRequests(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    car_id = db.Column(db.String(255), nullable=False)

class SpareRequests(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    spare_id = db.Column(db.String(255), nullable=False)

class Social(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    twitter = db.Column(db.String(255), nullable=False)
    instagram = db.Column(db.String(255), nullable=False)

class SpareParts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(255), nullable=False)
    year = db.Column(db.String(10), nullable=False)
    chassis_no = db.Column(db.String(255), nullable=False)
    part_no = db.Column(db.String(255), nullable=False)

class SubscribedEmails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)

class AboutUs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    about = db.Column(db.String(120), nullable=False)

class EmailConfgurations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)

class LoginCredentials(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
