import os
from logging.config import dictConfig
import logging

from flask import Flask, jsonify
from flask_cors import CORS
from flask_compress import Compress
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from .settings import LOGGING_CONFIG, IS_DEV, ALLOWED_ORIGIN, RATELIMIT_RULES, COMPRESS_ALGORITHM


dictConfig(LOGGING_CONFIG)

app = Flask(__name__)

if IS_DEV:
    app.logger.warn("You're running in UNSAFE development mode which exposes "
        "write access to the server. Don't do this on a publicly accessible "
        "web server.")

# https://flask-cors.readthedocs.io/
CORS(app, origins=ALLOWED_ORIGIN)

logging.getLogger('flask_cors').level = logging.DEBUG

# compress responses
# https://github.com/colour-science/flask-compress
app.config['COMPRESS_ALGORITHM'] = COMPRESS_ALGORITHM
Compress(app)

# https://flask-limiter.readthedocs.io/
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=RATELIMIT_RULES,
    storage_uri="memory://"
)

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error={
      'message': f"Ratelimit request rule exceeded: {e.description}",
      'index': 0
    }), 429

import server.views
