import os

SECRET_KEY = os.environ.get('SECRET_KEY', 'your_secret_key')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your_jwt_secret_key')
WTF_CSRF_SECRET_KEY = os.environ.get('WTF_CSRF_SECRET_KEY', 'your_wtf_csrf_secret_key')
DB_USER = os.environ.get('DB_USER', 'your_db_user')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'your_db_password')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = os.environ.get('DB_PORT', '3306')
DB_NAME = os.environ.get('DB_NAME', 'your_db_name')
