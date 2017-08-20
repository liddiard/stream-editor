# stream-editor

An interactive web UI for building and debugging Linux text stream editing commands like sed, grep, and awk.

Idea: Linux text manipulations are really powerful for pattern extraction and data formatting, but the shell can be a diffcult interface for tinkering with them and inspecting the output as you pipe it from one command to another.

Stream Editor tries to solve this with a pretty web UI that lets you inspect your input and output at each step of the way with an optional GitHub-style visual diff of changes after each command.

Read more [on my website](https://harrisonliddiard.com/project/stream-editor/).

## Screenshots

![Stream Editor screenshot](https://harrisonliddiard.com/media/stream-editor/2.png)

Using sed to remove the citation notes from a Wikipedia article. Removals shown in red.

![Stream Editor screenshot](https://harrisonliddiard.com/media/stream-editor/3.png)

Full Unicode support. 很好。

![Stream Editor screenshot](https://harrisonliddiard.com/media/stream-editor/5.png)

Examine the effect of chaining multiple operations together at every step.

## Requirements

- MacOS or Linux (sorry, these commands are not all available on Windows)
- Python 3

## Installation

1. clone the repo
2. (optional but recommended) [set up a virtual environment](http://docs.python-guide.org/en/latest/dev/virtualenvs/) for the project, and activate it
3. `pip3 install -r requirements.txt`
4. `python3 runserver.py`
5. `cd stream_editor/static`
6. `npm install && npm start`
7. navigate to [http://localhost:5000](http://localhost:5000)
