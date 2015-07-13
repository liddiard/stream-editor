def format_output(text):
    """Format terminal output for return to client."""

    # Terminal commands' output always contains a trailing carriage return
    # so the terminal prompt moves to the next line. We don't want this in
    # output sent back to the client.
    return text[:-1]
