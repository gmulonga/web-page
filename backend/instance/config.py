import os
import secrets


# Generate secure secret keys
SECRET_KEY = secrets.token_hex(24)
JWT_SECRET_KEY = secrets.token_hex(24)

# Get the database URI from environment variables
SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
if not SQLALCHEMY_DATABASE_URI:
    raise ValueError("SQLALCHEMY_DATABASE_URI environment variable is not set")

SQLALCHEMY_TRACK_MODIFICATIONS = False
