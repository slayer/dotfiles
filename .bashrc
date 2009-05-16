# .bashrc

# Source global definitions
#if [ -f /etc/profile ]; then
#	. /etc/profile
#fi

#if [[ -f /etc/bash_completion ]]; then
#    #. /etc/bash_completion
#fi
export EDITOR=vi
shopt -s histappend
PROMPT_COMMAND='history -a'
HISTCONTROL=ignoreboth
export LS_OPTIONS='--color=auto'
eval `dircolors`

. ~/.aliases

function	sshm()           { ssh root@midge-$1; }
function    sshr()			 { ssh root@$1; }
function    rmd              { rm -fr $@; }

function    x                { exit    $@; }
function    z                { suspend $@; }
function    j                { jobs -l $@; }
function    p                { ${PAGER}  $@; }
function    e                { ${EDITOR} $@; }

function    c                { clear; }
function    h                { history $@; }
function    hc               { history -c; }
function    hcc              { hc;c; }
function    cx               { hc;x; }

function    ..               { cd ..; }

function    ff               { find . -name $@ -print; }

function    psa              { ps aux $@; }
function    psu              { ps  ux $@; }

function    lpsa             { ps aux $@ | p; }
function    lpsu             { ps  ux $@ | p; }

function    dub              { du -sclb $@; }
function    duk              { du -sclk $@; }
function    dum              { du -sclm $@; }

function    dfk              { df -PTak $@; }
function    dfm              { df -PTam $@; }
function    dfh              { df -PTah $@; }
function    dfi              { df -PTai $@; }
function    logread          { local file=/var/log/syslog; local cmd=less; [ "x$1x" = "x-fx" ] && { cmd="tail -f "; shift; }; [ -n "$1" ] && file="`find /var/log/${1}*log`"; $cmd $file; }

shopt -s cdspell checkwinsize cmdhist dotglob

case "$TERM" in
	xterm*|rxvt*|screen*)
	PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME}: ${PWD/$HOME/~}\007"'
    TITLEBAR='\[\033]0;\u@\h:\w\007\]'
	;;
	*)
	;;
esac

export HOST=`hostname -s`
export PATH=$PATH:$HOME/bin:./

