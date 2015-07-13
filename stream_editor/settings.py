# commands which users are allowed to execute. for security reasons, it is
# important that this list does not contain any potentially
# destructive/exploitable commands
SUPPORTED_COMMANDS = ['sed', 'awk', 'grep']

# maximum size of input we will process
MAX_INPUT_LENGTH = 1048576 # 2**20
