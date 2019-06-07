#!/bin/sh

## local.sh example:
# # for ((x=0; x<=255; x++));do echo -e "${x}:\033[38;5;${x}mcolor\033[000m";done
# PS1='${debian_chroot:+($debian_chroot)}\[\033[0;38;5;140m\]\u@\h\[\033[00m\] \[\033[00m\]\w\[\033[00m\] \$ '
#                                                       ^ this code
# source ~/.bashrc.d/git.sh



case "$TERM" in
	xterm*|rxvt*|screen*)
    if [ `id -u` = 0 ]; then
        PS1='\[\033[0;31m\]\h\[\033[00m\] \[\033[00m\]\w\[\033[00m\] \$ '
    else
        PS1='\[\033[0;32m\]\u@\h\[\033[00m\] \[\033[00m\]\w\[\033[00m\] \$ '
    fi
    TITLEBAR='\[\033]0;\u@\h:\w\007\]'
	;;
	*)
	;;
esac

if [[ -x "/usr/bin/git" ]]; then
  export PS1="\[\033[0;33m\]\$(__git_ps1 '%s ')\[\033[00m\]$PS1"
fi

function set-random-prompt-color(){
  local color="$((${RANDOM}%200+9))"
  # local git_ps1="\[\033[0;33m\]\$(__git_ps1 '%s ')\[\033[00m\] " # TODO
  echo PS1="'"'\[\033[0;38;5;'${color}'m\]\u@\h\[\033[00m\] \[\033[00m\]\w\[\033[00m\] \$ '"'" >~/.bashrc.d/90-local-prompt.sh
  . ~/.bashrc.d/90-local-prompt.sh
}
