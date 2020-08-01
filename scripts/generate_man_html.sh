#!/bin/bash

# generate HTML files of the supported commands' man pages
# assumes man2html is installed (install with `apt install man2html`)

# note: output requires some massaging after this, such as removing the "Return
# to Main Contents" link, and adding the stylesheet <link> and a script tag

# note: on the Ubuntu 18.04 machine that this is command is run on, `awk` is
# symlinked to `gawk`, which is the man page we need to access
SUPPORTED_COMMANDS=( gawk cat cut expand fold grep head sed sort tail tr tsort unexpand uniq wc )

for command in "${SUPPORTED_COMMANDS[@]}"
do
  command_path=$(man --path $command)
  # if the man page is gzipped, unzip it first
  if [ ${command_path: -3} == '.gz' ]
  then
    gunzip $command_path
    # update `command_path` to the newly unzipped file path
    command_path=$(man --path $command)
  fi
  # man2html writes a line of the encoding used at the beginning of the file
  # for some reason; remove it with `tail`
  man2html $command_path | tail -n +3 > "$command.html"
  echo "Generated HTML manpage for: $command_path"
done