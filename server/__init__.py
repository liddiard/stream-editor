import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from .settings import IS_DEV, ALLOWED_ORIGIN, RATELIMIT_RULES


app = Flask(__name__)

if IS_DEV:
    app.logger.warn("You're running in UNSAFE development mode which exposes "
        "write access to the server. Don't do this on a publicly accessible "
        "web server.")

# https://flask-cors.readthedocs.io/
CORS(app, origins=ALLOWED_ORIGIN)

# https://flask-limiter.readthedocs.io/
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=RATELIMIT_RULES
)

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error={
      'message': f"Ratelimit request rule exceeded: {e.description}",
      'index': 0
    }), 429

import server.views
