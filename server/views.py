from subprocess import TimeoutExpired
from flask import request, jsonify, current_app

from . import app
from .settings import (
    MAX_INPUT_LENGTH,
    MAX_OPERATIONS,
    SUPPORTED_COMMANDS,
    COMMAND_TIMEOUT
)
from .utils import format_output, execute_command


@app.route('/v1/commands/')
def list_commands():
    """Return the list of supported Unix commands"""
    return jsonify(commands=SUPPORTED_COMMANDS)


@app.route('/v1/execute/', methods=['POST'])
def execute():
    """Execute a list of stream commands and return the resulting output."""

    # validate input
    supported_command_names = [command['name'] for command in SUPPORTED_COMMANDS]
    try:
        request_dict = request.get_json()
        text = request_dict['input']
        operations = request_dict['operations']
    except KeyError:
        error_msg = "Required keys `input` and/or `operations` missing from "\
            "request body."
        return jsonify(error={'index': -1, 'message': error_msg}), 400
    outputs = [] # contains output after each command

    if len(text) > MAX_INPUT_LENGTH:
        error_msg = f"Maximum input length ({MAX_INPUT_LENGTH} characters) "\
            "exceeded."
        return jsonify(error={'index': -1, 'message': error_msg}), 400

    if len(operations) > MAX_OPERATIONS:
        error_msg = f"Maximum number of commands ({MAX_OPERATIONS}) exceeded."
        return jsonify(error={
            'index': len(operations) - 1,
            'message': error_msg
        }), 400

    # execute commands
    for index, operation in enumerate(operations):
        command = operation.get('command')
        arguments = operation.get('args')

        # check if the command is supported/allowed
        # IMPORTANT: prevents arbitrary command execution
        if command not in supported_command_names:
            error_msg = f"Command \"{command}\" is not supported."
            return jsonify(error={'index': index, 'message': error_msg}), 400

        try:
            stdout, stderr = execute_command(command, arguments, stdin=text)
        # stop processing if attempting to execute the command threw an error
        except Exception as e:
            error_msg = f"Error: {e}"
            if isinstance(e, TimeoutExpired):
                error_msg = f"Command \"{command}\" timed out after "\
                    f"{COMMAND_TIMEOUT} seconds."
            return jsonify(error={
                'index': index,
                'message': error_msg
            }), 400

        # stop processing if a command output something to stderr
        if stderr:
            return jsonify(error={
                'index': index,
                'message': format_output(stderr)
            }), 400

        text = format_output(stdout)
        outputs.append(text)

    return jsonify(input=request_dict['input'], outputs=outputs)
