# commands which users are allowed to execute. for security reasons, it is
# important that this list does not contain any potentially
# destructive/exploitable commands
SUPPORTED_COMMANDS = [
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
        'description': 'translate characters',
        'docs': 'http://man.cx/tr',
        'examples': 'http://www.thegeekstuff.com/2012/12/linux-tr-command/'
    },
    {
        'name': 'cut',
        'description': 'cut out fields of each line',
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
        'description': 'report or filter repeated lines',
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
        'description': 'filter for folding lines',
        'docs': 'http://man.cx/fold',
        'examples': 'http://www.cyberciti.biz/tips/linux-unix-word-wrap-command.html'
    },
    {
        'name': 'head',
        'description': 'copy the first part',
        'docs': 'http://man.cx/head',
        'examples': 'http://www.linfo.org/head.html'
    },
    {
        'name': 'tail',
        'description': 'copy the last part',
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
]

# maximum size of input we will process
MAX_INPUT_LENGTH = 1048576 # 2**20
