#!/bin/sh

case "$TERM" in
	xterm*|rxvt*|screen*)
    if [ `id -u` = 0 ]; then
        PS1='${debian_chroot:+($debian_chroot)}\[\033[0;31m\]\u\[\033[00m\]@\[\033[0;32m\]\h\[\033[00m\] \[\033[00m\]\w\[\033[00m\] \$ '
    else
        PS1='${debian_chroot:+($debian_chroot)}\[\033[0;32m\]\u@\h\[\033[00m\] \[\033[00m\]\w\[\033[00m\] \$ '
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
stty stop '' 2>/dev/null

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(lesspipe)"

# make history more friendly
bind '"\e[A":history-search-backward'
bind '"\e[B":history-search-forward'


