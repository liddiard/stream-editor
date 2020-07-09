import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


app = Flask(__name__)

# https://flask-cors.readthedocs.io/en/latest/
CORS(app, origins=[
  'http://localhost:3000'
])

# https://flask-limiter.readthedocs.io/en/stable/
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["600 per day", "200 per hour"]
)

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error={
      'message': f"Ratelimit request rule exceeded: {e.description}",
      'index': 0
    }), 429

import server.views
