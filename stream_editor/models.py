from stream_editor import db


class Resource(db.Document):
    name = db.StringField(max_length=255, required=True)
    url = db.URLField(required=True)

    def __unicode__(self):
        return self.name


class Command(db.Document):
    name = db.StringField(max_length=16, required=True)
    description = db.StringField(max_length=255, required=True)
    resources = db.ListField(db.EmbeddedDocumentField('Resource'))
    position = db.IntField(min_value=0)

    meta = {
        'ordering': ['position']
    }

    def __unicode__(self):
        return self.name
