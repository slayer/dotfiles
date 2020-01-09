# .bashrc

shopt -s cdspell checkwinsize cmdhist dotglob

for f in ~/.bashrc.d/*.sh; do . $f; done
