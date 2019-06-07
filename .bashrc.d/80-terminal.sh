#!/bin/sh

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


