<strong><em>Found a bug? [See info below on how to report it.](#reporting-bugs)</em></strong>

# <img src="https://github.com/liddiard/stream-editor/blob/master/client/public/img/logo-light.svg?raw=true" height="36" alt="Stream Editor logo" /> Stream Editor | [streameditor.io](https://streameditor.io/)

**Stream Editor** is a web tool for interactively using and chaining command-line text manipulation utilities, such as `sed`, `grep`, and `awk`.

Text transformation tools provided by Unix operating systems are incredibly powerful for pattern extraction, formatting, and data manipulation, but a command line isn't always the best interface for using them when it comes to experimentation and debugging, especially if you want to chain several commands together with pipes and understand what each is doing.

Stream Editor provides a user-friendly web interface for tinkering with these text editing commands that dynamically updates output as you type. It enables you to chain multiple commands together and observe the output after each step, optionally seeing a diff of added/deleted text with green/red highlights. 

Once you've finalized the operations you want to use, Stream Editor lets you export them as a series of command-line pipes with a single click, or share them with a unique URL.

[**Read more on my website.**](https://harrisonliddiard.com/project/stream-editor/)

## Screenshots

### Stream Editor default view (dark theme)

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

## Installation (local development)

### System requirements / prerequisites

- MacOS or Linux*
- Python 3.12 w/ pip 3
- Node.js 20 w/ npm 10

\* The Unix text editing commands that Stream Editor supports are not all available on Windows, though you *may* be able to get everything to work in a [Cygwin](https://www.cygwin.com/) kind of environment. It just hasn't been tested.

### Instructions

1. Clone the repo.
2. (optional but recommended) [Set up a Python 3 virtual environment](https://docs.python.org/3/tutorial/venv.html) for the project, and activate it.
3. Install the server dependencies: `pip3 install -r requirements.txt`
4. Start the Flask development server: `FLASK_ENV=development python3 dev_server.py`
5. Change to the client directory: `cd client`
6. Install the client dependencies: `npm install`
7. Start the client-side development server: `npm start`

## Notes for server deployment

**Note:** This isn't a comprehensive guide; this section is intended mainly for my personal reference.

Server is running with [gunicorn](https://gunicorn.org/):

```shell
JAIL_PATH=/root/jail gunicorn --name stream-editor server:app
```

To auto-restart (recommended), it can be installed as a systemd service at `/etc/systemd/system/stream-editor.service`:

```ini
[Unit]
Description=Stream Editor
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/home/liddiard/stream-editor/repo
Environment="JAIL_PATH=/root/jail"
Environment="PATH=/home/liddiard/stream-editor/bin"
ExecStart=/home/liddiard/stream-editor/bin/gunicorn --name stream-editor server:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable the service by running the following:

```bash
sudo systemctl daemon-reload
sudo systemctl start stream-editor.service
sudo systemctl enable stream-editor.service
sudo systemctl status stream-editor.service
```

It is also running behind a simple Nginx reverse proxy. Config:

```Nginx
server {

    server_name api.streameditor.io;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

}
```

- chroot jail is configured with [Jailkit](https://olivier.sessink.nl/jailkit/); [this post](http://www.mattheakis.com/blog/view.php?name=setting_up_a_jail_to_safely_execute_code) was a useful reference
- after Jailkit is installed (you have to build it from source), the script in `scripts/create_jail.sh` is supposed to do all the setup for the jail
- the man pages generated in `client/public/manpages/` are specific to the versions running on whatever machine you're using
- generate new man pages with the script in `scripts/generate_man_html.sh`. I did a lot of massaging of its output with regex find-and-replacing.
