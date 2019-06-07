# .bashrc

function  sshr()           { ssh root@$1; }
function  rmd              { rm -fr $@; }

function  z                { suspend $@; }
function  j                { jobs -l $@; }
function  p                { ${PAGER}  $@; }
function  e                { ${EDITOR} $@; }

function  h                { history $@ | grep "$1"; }
function  hc               { history -c; }

function  ff               { find . -name $@ -print; }

function  psa              { ps aux $@; }
function  psu              { ps  ux $@; }

function  dub              { du -sclb $@; }
function  duk              { du -sclk $@; }
function  dum              { du -sclm $@; }

function  dfk              { df -PTak $@; }
function  df_m             { df -PTam $@; }
function  dfh              { df -PTah $@; }
function  dfi              { df -PTai $@; }

shopt -s cdspell checkwinsize cmdhist dotglob

for f in ~/.bashrc.d/*.sh; do . $f; done
