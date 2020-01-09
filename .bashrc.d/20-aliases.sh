#!/bin/sh

alias ls='ls $LS_OPTIONS'
alias ll='ls $LS_OPTIONS -lh'
alias l='ls  $LS_OPTIONS -lAh'
alias la='ls $LS_OPTIONS -lah'
alias df='df -h'
alias free='free -hw'
alias pg="${PAGER:-less}"
alias e="${EDITOR:-vi}"
alias ff="find . -print -name"

alias tms="tmux split -h"  # horisontal
alias tmsv="tmux split -v" # vertical
alias j="jobs -l"
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias cls='reset; stty sane; tput rs1; clear; echo -ne "\033c"'
alias dums='du -msc -- * | sort -n'
alias duks='du -ksc -- * | sort -n'
alias h=history
alias q=exit
alias mtr="mtr --curses"
alias grep="grep --color=auto --exclude '*.git*' --exclude '*.svn*' --exclude '*.sw?'"
alias s="sudo"
alias be="bundle exec"
alias sshsocks="ssh -fCND 1080 "
alias clear_colors='sed -r "s/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]//g"'
alias pathbin='export PATH="$PWD/bin:$PATH"' # Useful for bundler binstubs
alias apt='sudo apt'
alias aptuu='apt update && apt upgrade'
alias G='gnome-open'

# processes
alias pps='ps -u "$USER" -o user,pid,ppid,pcpu,pmem,args'
alias psf='ps auxfw | less -S'
alias show-oom-score="while read -r pid comm; do printf '%d\\t%d\\t%s\\n' \"\$pid\" \"\$(cat /proc/\$pid/oom_score)\" \"\$comm\"; done < <(ps -e -o pid= -o comm=)"


# network
alias show-tcp-listen='sudo netstat -pant|grep LISTEN'
alias ipaddr="ip addr | awk '/^[0-9]+/ { curriface=\$2 } \$1 == \"inet\" { split( \$2, foo, \"/\" ); print curriface ,foo[1] }'" # pretty ip addr
alias p='ping'

# docker
alias d='sudo docker'
alias dl='sudo docker ps -l -q' # docker latest container
alias dockviz="docker run --rm -v /var/run/docker.sock:/var/run/docker.sock nate/dockviz"
alias dc='docker-compose ${DOCKER_COMPOSE_OPTIONS}'
alias dce='docker-compose ${DOCKER_COMPOSE_OPTIONS} exec '
alias dclf='docker-compose ${DOCKER_COMPOSE_OPTIONS} logs -f --tail=100'
alias dcrm='docker-compose ${DOCKER_COMPOSE_OPTIONS} rm -sf'
function dcrestart() { dcrm $1 && dc up -d $1; dclf $1; }
alias dockps='docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}"'
alias dockports='docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}"'
alias dockexecl='docker exec -i -t $(docker ps -l -q) /bin/bash'

# alias sen='docker run -v /run/docker.sock:/run/docker.sock -ti -e TERM tomastomecek/sen'
alias docker-rm-unused-images='docker images --filter "dangling=true" -q --no-trunc | xargs --no-run-if-empty docker rmi'
alias docker-rm-unused-volumes='docker volume rm $(docker volume ls -qf dangling=true)'
alias docker-rm-stopped-containers='docker ps --filter "status=exited" -q --no-trunc | xargs --no-run-if-empty docker rm'



# systemd
alias sc='sudo systemctl'
alias sctl='sudo systemctl'
alias start='sudo systemctl start'
alias stop='sudo systemctl stop'
alias restart='sudo systemctl restart'
alias status='sudo systemctl status'

# clipboard copy
alias pbcopy="xclip -sel clip"


# gcloud
alias gssh='gcloud beta compute ssh --tunnel-through-iap '
alias gsshi='gcloud compute ssh --internal-ip '
alias gscp='gcloud compute scp'
alias gcp-instances-list='gcloud compute instances list'
alias gcp-instances-start='gcloud compute instances start '
alias gcp-instances-stop='gcloud compute instances stop '
alias gcp-instances-reset='gcloud compute instances reset '
alias gcp-instances-describe='gcloud compute instances describe '
alias gcp-ssh='gcloud compute ssh --internal-ip'

inspath(){
  if [ -d "$1" ]; then
    export PATH="$1:$PATH"
  fi
}
addpath(){
  if [ -d "$1" ]; then
    export PATH="$PATH:$1"
  fi
}


function dirdiff() {
    # Shell-escape each path:
    DIR1=$(printf '%q' "$1"); shift
    DIR2=$(printf '%q' "$1"); shift
    vim $@ -c "DirDiff $DIR1 $DIR2"
}

function  sshr()           { ssh root@$1; }

