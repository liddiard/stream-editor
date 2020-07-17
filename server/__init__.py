import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from .settings import ALLOWED_ORIGINS, RATELIMIT_RULES


app = Flask(__name__)

# https://flask-cors.readthedocs.io/
CORS(app, origins=ALLOWED_ORIGINS)

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
