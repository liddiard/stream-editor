import shlex
from subprocess import Popen, PIPE, STDOUT

from .settings import MAX_INPUT_LENGTH, MAX_OPERATIONS, COMMAND_TIMEOUT


def parse_execute_request(request):
    """Parse an incoming HTTP request for command execution into its input and
    operations. Throws an error if request is malformed"""
    try:
        request_dict = request.get_json()
        _input = request_dict['input']
        operations = request_dict['operations']
    except KeyError:
        raise KeyError("Required keys `input` and/or `operations` missing from "
            "request body.")

    if type(_input) is not str:
        raise ValueError(f"`input` value is not a string.")
    
    if type(operations) is not list:
        raise ValueError(f"`operations` value is not an array.")

    if len(_input) > MAX_INPUT_LENGTH:
        raise ValueError(f"Maximum input length ({MAX_INPUT_LENGTH} "
            "characters) exceeded.")

    if len(operations) > MAX_OPERATIONS:
        raise ValueError(f"Maximum number of commands ({MAX_OPERATIONS}) "
          "exceeded.")

    return _input, operations


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
        # into account quotes and backslashes using shlex
        arguments_list = shlex.split(arguments)
        operation += arguments_list

    # cf. http://stackoverflow.com/a/8475367
    p = Popen(operation, stdout=PIPE, stdin=PIPE, stderr=PIPE)
    # `stdin` appears to be of type "bytes" and "str". For some reason, we
    # have to coerce it to string explicitly, then encode it as bytes in
    # UTF-8. Then we decode the output back into a string.
    stdout, stderr = p.communicate(input=str(stdin).encode('utf-8'),
        timeout=COMMAND_TIMEOUT)
    return (format_output(stdout.decode('utf-8')),
            format_output(stderr.decode('utf-8')))