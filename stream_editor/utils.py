import re
from subprocess import Popen, PIPE, STDOUT


def format_output(text):
    """Format terminal output for return to client."""

    # Terminal commands' output always contains a trailing carriage return
    # so the terminal prompt moves to the next line. We don't want this in
    # output sent back to the client.
    return text[:-1]


def execute_command(command, arguments, stdin=None):
    """Execute the given command with arguments and an optional stdin"""

    # start building a the list of arguments `subprocess` expects
    # (https://docs.python.org/2/library/subprocess.html#using-the-subprocess-module),
    # starting with the command to run.
    operation = [command]

    # some commands (like sort) don't expect arguments and will try to
    # open a file with the name [empty string] if called with an empty
    # string argument, so we only append arguments if they are NOT an empty
    # string.
    if arguments:
        # split arguments into array elements where a space is not preceded
        # by a backslash (\). This allows arguments with a space, like
        # `grep happy\ bunny`
        operation += re.compile(r'(?<!\\) ').split(arguments)

    # cf. http://stackoverflow.com/a/8475367
    p = Popen(operation, stdout=PIPE, stdin=PIPE, stderr=PIPE)
    return p.communicate(input=stdin) # returns a tuple of (stdout, stderr)
