from subprocess import TimeoutExpired
from flask import request, jsonify, current_app

from . import app
from .settings import (
    SUPPORTED_COMMANDS,
    COMMAND_TIMEOUT
)
from .command import parse_execute_request, execute_command


supported_command_names = [command['name'] for command in SUPPORTED_COMMANDS]


@app.route('/v1/commands/')
def list_commands():
    """Return the list of supported Unix commands"""
    return jsonify(commands=SUPPORTED_COMMANDS)


@app.route('/v1/execute/', methods=['POST'])
def execute():
    """Execute a list of stream commands and return the resulting output."""
    try:
        _input, operations = parse_execute_request(request)
    except (KeyError, ValueError) as error:
        return jsonify(error={'index': -1, 'message': f"Error: {error}"}), 400

    # execute commands
    outputs = [] # output after each command
    for index, operation in enumerate(operations):
        if type(operation) is not dict:
            error_msg = f"Malformed operation in `operations` array."
            return jsonify(error={'index': index, 'message': error_msg}), 400

        # input for this command will be the output from the previous command,
        # if any, otherwise the supplied input from the request
        if outputs: stdin = outputs[-1]
        else:       stdin = _input
        command = operation.get('command')
        arguments = operation.get('args')

        # check if the command is supported/allowed
        # IMPORTANT: prevents arbitrary command execution
        if command not in supported_command_names:
            error_msg = f"Command \"{command}\" is not supported."
            return jsonify(error={'index': index, 'message': error_msg}), 400

        try:
            stdout, stderr = execute_command(command, arguments, stdin=stdin)
        # stop processing if attempting to execute the command threw an error
        except Exception as error:
            error_msg = f"Error: {error}"
            if isinstance(error, TimeoutExpired):
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
                'message': stderr
            }), 400

        outputs.append(stdout)

    return jsonify(input=_input, outputs=outputs)
