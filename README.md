<strong><em>Found a bug? [See info below on how to report it.](#reporting-bugs)</em></strong>

# <img src="https://github.com/liddiard/stream-editor/blob/master/client/public/img/logo-light.svg?raw=true" height="36" alt="Stream Editor logo" /> Stream Editor | [streameditor.io](https://streameditor.io/)

**Stream Editor** is a web tool for interactively writing and chaining command-line text manipulation utilities, such as `sed`, `grep`, and `awk`.

Text transformation tools provided by Unix operating systems are incredibly powerful for pattern extraction, formatting, and data manipulation, but a command line isn't always the best interface for using them when it comes to experimentation and debugging, especially if you want to chain several commands together with pipes.

Stream Editor provides an accessible web interface that dynamicalaly updates output as you make changes to input text and the commands applied to it. It allows you to chain multiple commands together and observe the output after each step, optionally with a visual diff of deleted/added text with red/green highlights. Once you've figured out the operations you want to use, you can export them as a series of command-line pipes with a single click, or share them with a unique URL.

[Read more on my website](https://harrisonliddiard.com/project/stream-editor/).

## Screenshots

### Stream Editor default view

![Stream Editor screenshot](screenshots/initial.png)

### Stream Editor light theme, showcasing its full Unicode support

![Stream Editor screenshot](screenshots/unicode.png)

### Stream Editor being used to analyze its own logs, showing the effects of multiple commands chained together

![Stream Editor screenshot](screenshots/chain.png)

## Reporting bugs

### Security bugs

Found a security bug related to this codebase or how Stream Editor is deployed at [streameditor.io](https://streameditor.io)? I highly encourage and kindly request that you report it by emailing:

```
security [at] streameditor [dot] io
```

Please privately email me instead of posting about it publicy on GitHub Issues or elsewhere, and please include your steps to reproduce.

The way Stream Editor is set up at [streameditor.io](https://streameditor.io) is intended to **prevent**:

- arbitrary command execution
- writing files to the server
- reading any *sensitive* data from the server
- otherwise gaining access to the server
- adversely affecting others' ability to use [streameditor.io](https://streameditor.io) in a significant way 

Valid security bugs are likely to include anything that allows you to do these things. Note that reading certain *non-sensitive* files from the server is possible and expected.

### Other bugs

If your bug **does not** involve any security concerns, please report it on [GitHub Issues](https://github.com/liddiard/stream-editor/issues).

## Installation (Development)

### Requirements

- MacOS or Linux (sorry, these commands are not all available on Windows)
- Python 3.7+

1. clone the repo
2. (optional but recommended) [set up a virtual environment](https://docs.python.org/3/tutorial/venv.html) for the project, and activate it
3. `pip3 install -r requirements.txt`
4. `FLASK_ENV=development python3 dev_server.py`
5. `cd client`
6. `npm install && npm start`
