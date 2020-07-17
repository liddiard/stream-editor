# script to create chroot jail
# assumes you already have jailkit installed by following the instructions at:
# http://www.mattheakis.com/blog/view.php?name=setting_up_a_jail_to_safely_execute_code

SUPPORTED_COMMANDS = ( awk cat cut expand fold grep head sed sort tail tr tsort unexpand uniq wc )
JAILED_USER_USERNAME = 'untrusted_internet_user'

# create the jail directory
mkdir -p ~/jail
j=~/jail

# initialize the jail
jk_init -j $j jk_lsh

# create a jailed user
useradd -m $JAILED_USER_USERNAME
jk_jailuser -j $j $JAILED_USER_USERNAME

# copy necessary commands to the jail
for command in SUPPORTED_COMMANDS
do
    command_path=$(which $command)
    jk_cp -j $j $command_path
done
