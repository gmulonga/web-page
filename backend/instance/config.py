import os

SECRET_KEY = os.urandom(24)
JWT_SECRET_KEY = os.urandom(24)
SQLALCHEMY_DATABASE_URI = 'sqlite:///webpage.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False