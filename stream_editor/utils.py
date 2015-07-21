import re
import shlex
from subprocess import Popen, PIPE, STDOUT


def format_output(text):
    """Format terminal output for return to client."""

    # Terminal commands' output usually contains a trailing carriage return
    # so the terminal prompt moves to the next line. We don't want this in
    # output sent back to the client.
    if text and text[-1] == '\n':
        return text[:-1]
    else:
        return text


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
        # split arguments into array elements which subprocess expects, taking
        # into account quotes and backslashes
        arguments_list = combine_args(shlex.split(arguments))
        operation += arguments_list

    # cf. http://stackoverflow.com/a/8475367
    p = Popen(operation, stdout=PIPE, stdin=PIPE, stderr=PIPE)
    return p.communicate(input=stdin.encode('utf-8')) # returns a tuple of (stdout, stderr)


def combine_args(arguments):
    """Combines a list of arguments into a single argument if the list does
    not contain any flags.

    This has the effect of "auto-quoting" input so input which does not
    contain any flag options need not be surrounded by quotes.
    """

    for argument in arguments:
        # if an argument starts with a hyphen, we assume it is a flag
        if argument[0] == "-":
            return arguments

    return [' '.join(arguments)]
