from flask import request, jsonify, render_template

from stream_editor import app
from stream_editor.settings import MAX_INPUT_LENGTH, SUPPORTED_COMMANDS
from stream_editor.utils import format_output, execute_command


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

    supported_command_names = [command['name'] for command in SUPPORTED_COMMANDS]
    request_dict = request.get_json()
    text = request_dict['input']
    operations = request_dict['operations']
    outputs = [] # contains output after each command

    if len(text) > MAX_INPUT_LENGTH:
        error_msg = "Sorry, input may not be longer than %d characters."\
                                                            % MAX_INPUT_LENGTH
        return jsonify(error=True, error_pos=-1, error_msg=error_msg)

    for index, operation in enumerate(operations):
        command = operation['cmd']
        arguments = operation['args']

        # check if the command is supported/allowed
        # IMPORTANT: prevents arbitrary command execution
        if command not in supported_command_names:
            error_msg = "Command \"%s\" is not supported." % command
            return jsonify(error=True, error_pos=index, error_msg=error_msg)

        stdout, stderr = execute_command(command, arguments, stdin=text)

        # stop processing if we ran into an error
        if stderr:
            return jsonify(error=True, error_pos=index,
                           error_msg=format_output(stderr))

        text = format_output(stdout)
        outputs.append(text)

    return jsonify(error=False, input=request_dict['input'], outputs=outputs)
