# maximum size of input we will process
# 2**20; should match client-side constant of the same name
MAX_INPUT_LENGTH = 1048576

# maximum number of operations (commands) that are allowed
MAX_OPERATIONS = 16

# maximum time in seconds that an individual operation may run before we throw
# a timeout error
COMMAND_TIMEOUT = 2

# commands which users are allowed to execute. for security reasons, it is
# important that this list does not contain any potentially
# destructive/exploitable commands
SUPPORTED_COMMANDS = sorted([
    {
        'name': 'sed',
        'description': 'multipurpose stream editor',
        'docs': 'http://man.cx/sed',
        'examples': 'https://www.digitalocean.com/community/tutorials/the-basics-of-using-the-sed-stream-editor-to-manipulate-text-in-linux'
    },
    {
        'name': 'grep',
        'description': 'search text for a pattern',
        'docs': 'http://man.cx/grep',
        'examples': 'http://www.panix.com/~elflord/unix/grep.html'
    },
    {
        'name': 'awk',
        'description': 'pattern scanning and processing',
        'docs': 'http://man.cx/awk',
        'examples': 'http://www.hcs.harvard.edu/~dholland/computers/awk.html'
    },
    {
        'name': 'tr',
        'description': 'replace characters',
        'docs': 'http://man.cx/tr',
        'examples': 'http://www.thegeekstuff.com/2012/12/linux-tr-command/'
    },
    {
        'name': 'cut',
        'description': 'remove fields on each line',
        'docs': 'http://man.cx/cut',
        'examples': 'http://www.computerhope.com/unix/ucut.htm'
    },
    {
        'name': 'sort',
        'description': 'sort, merge, and sequence-check',
        'docs': 'http://man.cx/sort',
        'examples': 'http://www.thegeekstuff.com/2013/04/sort-files/'
    },
    {
        'name': 'tsort',
        'description': 'topological sort',
        'docs': 'http://man.cx/tsort',
        'examples': 'https://en.wikipedia.org/wiki/Tsort'
    },
    {
        'name': 'uniq',
        'description': 'report and filter repeated lines',
        'docs': 'http://man.cx/uniq',
        'examples': 'http://www.thegeekstuff.com/2013/05/uniq-command-examples/'
    },
    {
        'name': 'expand',
        'description': 'convert tabs to spaces',
        'docs': 'http://man.cx/expand',
        'examples': 'http://www.computerhope.com/unix/uexpand.htm'
    },
    {
        'name': 'unexpand',
        'description': 'convert spaces to tabs',
        'docs': 'http://man.cx/unexpand',
        'examples': 'http://www.computerhope.com/unix/uexpand.htm'
    },
    {
        'name': 'fold',
        'description': 'wrap lines at words or characters',
        'docs': 'http://man.cx/fold',
        'examples': 'http://www.cyberciti.biz/tips/linux-unix-word-wrap-command.html'
    },
    {
        'name': 'head',
        'description': 'retain the first part',
        'docs': 'http://man.cx/head',
        'examples': 'http://www.linfo.org/head.html'
    },
    {
        'name': 'tail',
        'description': 'retain the last part',
        'docs': 'http://man.he.net/?topic=tail&section=all',
            # for some reason, man.cx links the wrong page for this entry
        'examples': 'http://www.thegeekstuff.com/2009/08/10-awesome-examples-for-viewing-huge-log-files-in-unix/'
    },
    {
        'name': 'cat',
        'description': 'concatenate, format, and print',
        'docs': 'http://man.cx/cat',
        'examples': 'http://www.cyberciti.biz/faq/linux-unix-appleosx-bsd-cat-command-examples/'
    },
    {
        'name': 'wc',
        'description': 'count characters, words, and lines',
        'docs': 'http://man.cx/wc',
        'examples': 'https://www.geeksforgeeks.org/wc-command-linux-examples/'
    },
    {
        'name': 'bc',
        'description': 'basic calculator',
        'docs': 'http://man.cx/bc',
        'examples': 'https://www.geeksforgeeks.org/bc-command-linux-examples/'
    },
], key=lambda x: x['name']) # sort alphabetically by command name