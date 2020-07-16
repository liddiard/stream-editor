import os

from server import app


if __name__ == '__main__':
    # Only turn debug mode on if the enviornment variable is set.
    # ⚠️ WARNING: Running in debug mode is UNSAFE for any amount of time on a
    # publicly accessible server as it gives anyone on the internet
    # unrestricted filesystem access to whatever server it's running on, which
    # may compromise the server, along with any other servers/services that
    # use credentials stored on it. DON'T DO IT!
    app.run()
