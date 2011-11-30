#!/bin/sh

# Calculate a short checksum of the real hostname to determine a unique color
if [[ $TERM =~ "256color" ]]; then
    host_color="38;5;$((16 + $(hostname | cksum | cut -c1-3) % 256))";
else
    host_color="1;$((31 + $(hostname | cksum | cut -c1-3) % 6))";
fi

case "$TERM" in
	xterm*|rxvt*|screen*)
    if [ `id -u` = 0 ]; then
        PS1='${debian_chroot:+($debian_chroot)}\[\033[0;31m\]\u\[\033[00m\]@\[\033[0;32m\]\h\[\033[00m\] \[\033[00m\]\w\[\033[00m\] \$ '
    else
        PS1='${debian_chroot:+($debian_chroot)}\[\033[0;32m\]\u@\[\033[0;'$host_color'm\]\h\[\033[00m\] \[\033[00m\]\w\[\033[00m\] \$ '
    fi
	#PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME}: ${PWD/$HOME/~}\007"'
    TITLEBAR='\[\033]0;\u@\h:\w\007\]'
	;;
	*)
	;;
esac
HISTCONTROL=ignoreboth
shopt -s checkwinsize
shopt -s histappend

# Disable Ctrl-S
stty stop '' 2>/dev/null || true

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(lesspipe)"

# make history more friendly
bind '"\e[A":history-search-backward' 2>/dev/null  || true
bind '"\e[B":history-search-forward' 2>/dev/null   || true


