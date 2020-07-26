from subprocess import TimeoutExpired
from flask import request, jsonify, current_app

from . import app
from .settings import SUPPORTED_COMMANDS, COMMAND_TIMEOUT
from .command import (
    get_man_page,
    CommandDisallowedError,
    parse_execute_request,
    execute_command
)


logger = app.logger


def request_error(message, index=0):
    """Helper to create a 400 Bad Request error"""
    return jsonify(error={'message': message, 'index': index}), 400


@app.route('/v1/commands/')
def list_commands():
    """Return the list of supported Unix commands"""
    return jsonify(commands=SUPPORTED_COMMANDS)


@app.route('/v1/man/<command>')
def man_page(command):
    """Return the list of supported Unix commands"""
    try:
        return jsonify(text=get_man_page(command))
    except CommandDisallowedError as error:
        return request_error(f"Error: {error}")


@app.route('/v1/execute/', methods=['POST'])
def execute():
    """Execute a list of stream commands and return the resulting output."""
    try:
        _input, operations = parse_execute_request(request)
    except (KeyError, TypeError, ValueError) as error:
        logger.warn(f"Malformed request: {error}")
        return request_error(f"Error: {error}")

    logger.info(f"Executing with operations: {operations}")
    # execute commands
    outputs = [] # output after running each command
    for index, operation in enumerate(operations):
        if type(operation) is not dict:
            logger.warn(f"Malformed operation: {operation}")
            return request_error(f"Malformed operation in `operations` array.",
                index)

        # input for this command will be the output from the previous command,
        # if any, otherwise the supplied input from the request
        if outputs: stdin = outputs[-1]
        else:       stdin = _input
        command = operation.get('command')
        arguments = operation.get('args')

        try:
            stdout, stderr = execute_command(command, arguments, stdin=stdin)
        # stop processing if attempting to execute the command threw an error
        except TimeoutExpired:
            logger.warn(f"Operation timed out: {operation}")
            return request_error(f"Command \"{command}\" timed out after "\
                f"{COMMAND_TIMEOUT} seconds.", index)
        except Exception as error:
            logger.warn(f"Execution error. Operation: {operation}, Error: "
                f"{error}")
            return request_error(f"Error: {error}", index)

        # stop processing if the command output something to stderr
        if stderr:
            logger.info(f"Returning stderr: {stderr}")
            return request_error(stderr, index)

        outputs.append(stdout)

    return jsonify(input=_input, outputs=outputs)
