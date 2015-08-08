# commands which users are allowed to execute. for security reasons, it is
# important that this list does not contain any potentially
# destructive/exploitable commands
SUPPORTED_COMMANDS = [
    {
        'name': 'sed',
        'description': 'multipurpose stream editor',
        'resources': [
            'http://man.cx/sed',
            'https://www.digitalocean.com/community/tutorials/the-basics-of-using-the-sed-stream-editor-to-manipulate-text-in-linux',
            'http://www.panix.com/~elflord/unix/sed.html',
            'http://www.grymoire.com/Unix/Sed.html'
        ]
    },
    {
        'name': 'grep',
        'description': 'search text for a pattern',
        'resources': [
            'http://man.cx/grep',
        ]
    },
    {
        'name': 'awk',
        'description': 'pattern scanning and processing language',
        'resources': [
            'http://man.cx/awk',
        ]
    },
    {
        'name': 'tr',
        'description': 'translate characters',
        'resources': [
            'http://man.cx/tr',
        ]
    },
    {
        'name': 'cut',
        'description': 'cut out selected fields of each line of a file',
        'resources': [
            'http://man.cx/cut',
        ]
    },
    {
        'name': 'sort',
        'description': 'sort, merge, and sequence-check text',
        'resources': [
            'http://man.cx/sort',
        ]
    },
    {
        'name': 'tsort',
        'description': 'topological sort',
        'resources': [
            'http://man.cx/tsort',
        ]
    },
    {
        'name': 'uniq',
        'description': 'report or filter out repeated lines',
        'resources': [
            'http://man.cx/uniq',
        ]
    },
    {
        'name': 'expand',
        'description': 'convert tabs to spaces',
        'resources': [
            'http://man.cx/expand',
        ]
    },
    {
        'name': 'unexpand',
        'description': 'convert spaces to tabs',
        'resources': [
            'http://man.cx/unexpand',
        ]
    },
    {
        'name': 'fold',
        'description': 'filter for folding lines',
        'resources': [
            'http://man.cx/fold',
        ]
    },
    {
        'name': 'head',
        'description': 'copy the first part of text',
        'resources': [
            'http://man.cx/head',
        ]
    },
    {
        'name': 'tail',
        'description': 'copy the last part of text',
        'resources': [
            'http://man.cx/tail',
        ]
    },
    {
        'name': 'cat',
        'description': 'concatenate, format, and print text',
        'resources': [
            'http://man.cx/cat',
        ]
    },
]

# maximum size of input we will process
MAX_INPUT_LENGTH = 1048576 # 2**20
