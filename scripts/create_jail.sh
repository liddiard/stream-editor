#!/bin/bash

# script to create chroot jail
# assumes you already have jailkit installed by following the instructions at:
# http://www.mattheakis.com/blog/view.php?name=setting_up_a_jail_to_safely_execute_code

SUPPORTED_COMMANDS=( awk cat cut expand fold grep head sed sort tail tr tsort unexpand uniq wc )
JAILED_USER_USERNAME=untrusted_internet_user
JAIL_PATH=~/jail

echo 'Creating jail directory...'
mkdir -p JAIL_PATH

echo 'Initializing the jail...'
jk_init -j $JAIL_PATH jk_lsh

echo 'Creating jailed user...'
useradd -m $JAILED_USER_USERNAME
jk_jailuser -j $JAIL_PATH $JAILED_USER_USERNAME

echo 'Copying supported commands to the jail...'
for command in "${SUPPORTED_COMMANDS[@]}"
do
    command_path=$(which $command)
    jk_cp -j $JAIL_PATH $command_path
done

echo 'Done!'
