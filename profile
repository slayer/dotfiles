#!/bin/sh

. ~/.bashrc
[ `id -u` = 600 ] && calendar -A 5

if [ -d ~/dotfiles -a -x `which git-pull` ]; then
	cd ~/dotfiles && git pull -q origin master 2>/dev/null &
fi

