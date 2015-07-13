from subprocess import Popen, PIPE, STDOUT

from flask import request, jsonify, render_template

from stream_editor import app
from stream_editor.settings import MAX_INPUT_LENGTH, SUPPORTED_COMMANDS
from stream_editor.utils import format_output
from stream_editor.models import Command, Resource


@app.route('/')
def front_page():
    """Render the front page of the application."""

    return render_template('front.html')


@app.route('/api/commands/')
def list_commands():
    return jsonify(commands=SUPPORTED_COMMANDS)


@app.route('/api/execute/', methods=['POST'])
def execute():
    """Execute a list of stream commands and return the resulting output."""

    request_dict = request.get_json()
    text = request_dict['input']
    operations = request_dict['operations']
    output = [] # contains output after each command

    if len(text) > MAX_INPUT_LENGTH:
        error_msg = "Sorry, input may not be longer than %d characters."\
                                                            % MAX_INPUT_LENGTH
        return jsonify(error=True, error_pos=-1, error_msg=error_msg)

    for index, operation in enumerate(operations):
        command = operation['command']
        arguments = operation['arguments']

        # check if the command is supported/allowed
        # IMPORTANT: prevents arbitrary command execution
        if command not in SUPPORTED_COMMANDS:
            error_msg = "Command \"%s\" is not supported." % command
            return (jsonify(error=True, error_pos=index, error_msg=error_msg),
                    413) # "Request Entity Too Large" client error

        # cf. http://stackoverflow.com/a/8475367
        p = Popen([command, arguments], stdout=PIPE, stdin=PIPE, stderr=PIPE)
        stdout, stderr = p.communicate(input=text)

        # stop processing if we ran into an error
        if stderr:
            return jsonify(error=True, error_pos=index,
                           error_msg=format_output(stderr))

        text = format_output(stdout)
        output.append(text)

    return jsonify(error=False, output=output)
