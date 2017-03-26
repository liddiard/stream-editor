import os

from stream_editor import app


if __name__ == '__main__':
    # set debug mode OFF if a `PROD` environment variable is not set 
    app.config['DEBUG'] = not os.environ.get('PROD') 
    app.run()
