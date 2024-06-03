import os
import secrets


SECRET_KEY = secrets.token_bytes(24)
JWT_SECRET_KEY = secrets.token_bytes(24)
WTF_CSRF_SECRET_KEY = secrets.token_hex(16)
SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
SQLALCHEMY_TRACK_MODIFICATIONS = False
