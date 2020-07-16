import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


# Enter into chroot if not in development env
# ⚠️ WARNING: Running in development mode is UNSAFE for any amount of time
# on a publicly accessible server as it gives anyone on the internet
# unrestricted filesystem access to whatever server it's running on, which
# may compromise the server, along with any other servers/services that
# use credentials stored on it. DON'T DO IT!
if not os.environ.get('FLASK_ENV') == 'development':
    # IMPORTANT: the below lines should raise an Error and terminate
    # execution of the function if it is not successful as written
    try:
        os.chroot(os.environ['JAIL_PATH'])
    except KeyError:
        raise RuntimeError("Your FLASK_ENV environment variable is not "
            "to 'development' (and it should not be for security reasons "
            "unless you are truly running on a local machine that is "
            "inaccessible from the public internet; see code comment "
            " above this message), and you don't have a JAIL_PATH "
            "environment variable set, which should point to a secure "
            "chroot in which you're ok with anyone from the public "
            "internet running commands from the command line.")

app = Flask(__name__)

# https://flask-cors.readthedocs.io/
CORS(app, origins=[
  'http://localhost:3000'
])

# https://flask-limiter.readthedocs.io/
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
