# .bashrc

# Source global definitions
#if [ -f /etc/profile ]; then
#	. /etc/profile
#fi

#if [[ -f /etc/bash_completion ]]; then
#    #. /etc/bash_completion
#fi
#PROMPT_COMMAND='history -a'


function  sshm()           { ssh root@midge-$1; }
function  sshr()           { ssh root@$1; }
function  rmd              { rm -fr $@; }

function  x                { exit    $@; }
function  z                { suspend $@; }
function  j                { jobs -l $@; }
function  p                { ${PAGER}  $@; }
function  e                { ${EDITOR} $@; }

function  c                { clear; }
function  h                { history $@ | grep "$1"; }
function  hc               { history -c; }
function  hcc              { hc;c; }
function  cx               { hc;x; }

function  ff               { find . -name $@ -print; }

function  psa              { ps aux $@; }
function  psu              { ps  ux $@; }

function  lpsa             { ps aux $@ | p; }
function  lpsu             { ps  ux $@ | p; }

function  dub              { du -sclb $@; }
function  duk              { du -sclk $@; }
function  dum              { du -sclm $@; }

function  dfk              { df -PTak $@; }
function  df_m             { df -PTam $@; }
function  dfh              { df -PTah $@; }
function  dfi              { df -PTai $@; }
function  logread          { local file=/var/log/syslog; local cmd=less; [ "x$1x" = "x-fx" ] && { cmd="tail -f "; shift; }; [ -n "$1" ] && file="`find /var/log/${1}*log`"; $cmd $file; }

shopt -s cdspell checkwinsize cmdhist dotglob

for f in ~/.bashrc.d/*.sh; do
  . $f
done
