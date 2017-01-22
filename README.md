# stream-editor

Use Linux text stream editing commands like sed, grep, and awk interactively online.

Idea: Linux text manipulations are really powerful for pattern extraction and data formatting, but the shell can be a diffcult interface for tinkering with them and inspecting the output as you pipe it from one command to another.

Stream Editor tries to solve this with a pretty web UI that lets you inspect your input and output at each step of the way with an optional GitHub-style visual diff of changes after each command.

Read more [on my website](https://harrisonliddiard.com/project/stream-editor/).

## Screenshots

![Stream Editor screenshot](https://harrisonliddiard.com/img/projects/stream-editor/2.png)

![Stream Editor screenshot](https://harrisonliddiard.com/img/projects/stream-editor/3.png)

![Stream Editor screenshot](https://harrisonliddiard.com/img/projects/stream-editor/5.png)

## Installation

1. clone the repo
2. (optional but recommended) [set up a virtual environment](http://docs.python-guide.org/en/latest/dev/virtualenvs/) for the project, and activate it
3. `pip install -r requirements.txt`
4. `python runserver.py`
5. navigate to [http://localhost:5000](http://localhost:5000)
