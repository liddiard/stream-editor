# commands which users are allowed to execute. for security reasons, it is
# important that this list does not contain any potentially
# destructive/exploitable commands
SUPPORTED_COMMANDS = [
    {
        'name': 'sed',
        'description': 'multipurpose stream editor',
        'resources': []
    },
    {
        'name': 'grep',
        'description': 'search text for a pattern',
        'resources': []
    },
    {
        'name': 'awk',
        'description': 'pattern scanning and processing language',
        'resources': []
    },
    {
        'name': 'tr',
        'description': 'translate characters',
        'resources': []
    },
    {
        'name': 'cut',
        'description': 'cut out selected fields of each line of a file',
        'resources': []
    },
    {
        'name': 'sort',
        'description': 'sort, merge, and sequence-check text',
        'resources': []
    },
    {
        'name': 'tsort',
        'description': 'topological sort',
        'resources': []
    },
    {
        'name': 'uniq',
        'description': 'report or filter out repeated lines',
        'resources': []
    },
    {
        'name': 'expand',
        'description': 'convert tabs to spaces',
        'resources': []
    },
    {
        'name': 'unexpand',
        'description': 'convert spaces to tabs',
        'resources': []
    },
    {
        'name': 'fold',
        'description': 'filter for folding lines',
        'resources': []
    },
    {
        'name': 'head',
        'description': 'copy the first part of text',
        'resources': []
    },
    {
        'name': 'tail',
        'description': 'copy the last part of text',
        'resources': []
    },
    {
        'name': 'cat',
        'description': 'concatenate, format, and print text',
        'resources': []
    },
]

# maximum size of input we will process
MAX_INPUT_LENGTH = 1048576 # 2**20
