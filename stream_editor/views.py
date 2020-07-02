from flask import request, jsonify, render_template

from . import app
from .settings import MAX_INPUT_LENGTH, SUPPORTED_COMMANDS
from .utils import format_output, execute_command


@app.route('/')
def front_page():
    """Render the front page of the application."""

    return render_template('front.html')


@app.route('/api/v1/commands/')
def list_commands():
    return jsonify(commands=SUPPORTED_COMMANDS)


@app.route('/api/v1/execute/', methods=['POST'])
def execute():
    """Execute a list of stream commands and return the resulting output."""

    supported_command_names = [command['name'] for command in SUPPORTED_COMMANDS]
    request_dict = request.get_json()
    text = request_dict['input']
    operations = request_dict['operations']
    outputs = [] # contains output after each command

    if len(text) > MAX_INPUT_LENGTH:
        error_msg = f"Sorry, input may not be longer than {MAX_INPUT_LENGTH} "\
            "characters."
        return jsonify(error=True, error_pos=-1, error_msg=error_msg)

    for index, operation in enumerate(operations):
        command = operation.get('command')
        arguments = operation.get('args')

        # check if the command is supported/allowed
        # IMPORTANT: prevents arbitrary command execution
        if command not in supported_command_names:
            error_msg = f"Command \"{command}\" is not supported."
            return jsonify(error={'index': index, 'message': error_msg}), 400

        stdout, stderr = execute_command(command, arguments, stdin=text)

        # stop processing if we ran into an error
        if stderr:
            return jsonify(error={
                'index': index,
                'message': format_output(stderr)
            }), 400

        text = format_output(stdout)
        outputs.append(text)

    return jsonify(input=request_dict['input'], outputs=outputs)
