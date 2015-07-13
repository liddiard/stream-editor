from flask_admin import Admin
from flask_admin.contrib.pymongo import ModelView

from stream_editor import app, db
from stream_editor import models


admin = Admin(app)

admin.add_view(ModelView(models.Command))
admin.add_view(ModelView(models.Resource))
