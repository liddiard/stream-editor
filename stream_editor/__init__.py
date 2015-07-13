import os

from flask import Flask
from flask_mongoengine import MongoEngine


app = Flask(__name__)


app.config['MONGODB_SETTINGS'] = {'DB': 'streameditor'}
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']

db = MongoEngine(app)


import stream_editor.views
import stream_editor.admin
