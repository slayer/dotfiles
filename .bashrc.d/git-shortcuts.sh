#!/bin/sh


##################
# git section
#
alias g="git ";                       [[ "$(type -t _git)" = "function" ]] && complete -o default -F _git g
alias gs='git status'
alias gst='git status'
alias gsub='git submodule'
alias gd='git diff';                  [[ "$(type -t _git_diff)" = "function" ]] && complete -o default -F _git_diff gd
alias gdc='git diff --cached'
alias gdh='git diff HEAD'
alias ga='git add'
alias gc='git commit -v'
alias gci='git commit -v -m'
alias gcia='git commit --amend'
alias gca='gc -a'
alias gb='git branch';                [[ "$(type -t _git_branch)" = "function" ]] && complete -o default -F _git_branch gb
alias gl='git log';                   [[ "$(type -t _git_log)" = "function" ]] && complete -o default -F _git_log gl
alias glp='git log -p';               [[ "$(type -t _git_log)" = "function" ]] && complete -o default -F _git_log gl
alias gpl='git pull origin master'
alias gp='git push -u'
alias gpp='git pull; git push -u'



[[ "$(type -t _git_log)" = "function" ]] && complete -o default -F _git_log glp

function gco {
	if [ -z "$1" ]; then
		git checkout master
	else
		git checkout $1
	fi
}

function st {
	if [ -d ".svn" ]; then
		svn status
	else
		git status
	fi
}

if [ -x `which colordiff` ]; then
	alias diff=colordiff
	function cvsdiff () { cvs diff $@ | colordiff; }
	function svndiff () { svn diff $@ | colordiff; }
fi
#
##################


