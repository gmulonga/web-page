import os
import secrets

class Config:
    SECRET_KEY = secrets.token_bytes(24)
    JWT_SECRET_KEY = secrets.token_bytes(24)
    WTF_CSRF_SECRET_KEY = secrets.token_hex(16)
    DB_USER = 'default_user'
    DB_PASSWORD = 'default_password'
    DB_HOST = 'localhost'
    DB_PORT = '3306'
    DB_NAME = 'default_db'
    SQLALCHEMY_DATABASE_URI = f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    TESTING = True
