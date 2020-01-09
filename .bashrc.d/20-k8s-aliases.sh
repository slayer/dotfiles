
# kubectl completions:
if [[ -x "$(which kubectl)" ]]; then

  if [[ $(type -t compopt) = "builtin" ]]; then
    complete -o default -F __start_kubectl kubectl
  else
    complete -o default -o nospace -F __start_kubectl kubectl
  fi

  # helm completions
  [[ -x /usr/local/bin/helm ]] && source <(helm completion bash)
  source <(kubectl completion bash)

  [[ -d ${HOME}/.krew/bin ]] && export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

  # k8s aliases
  alias k='kubectl'
  alias kcompl="source <(kubectl completion bash)"
  alias ka='kubectl --all-namespaces'
  alias keti='kubectl exec -ti'
  alias kdp='kubectl describe pod'
  alias kgp='kubectl get pods'
  alias kgpa='kubectl get pods --all-namespaces'
  alias kgpw='kubectl get pods -o wide'
  alias kgpwa='kubectl get pods --all-namespaces -o wide | less -S'
  alias kgs='kubectl get services'
  alias kgsa='kubectl get services --all-namespaces'
  alias kgn='kubectl get nodes'
  alias kgnw='kubectl get nodes -o wide'
  alias kgd='kubectl get deployments'
  alias kgda='kubectl get deployments --all-namespaces'
  alias kgdw='kubectl get deployments -o wide'
  alias kgns='kubectl get namespaces'
  alias ktn='kubectl top nodes'
  alias ktp='kubectl top pods'
  alias ktpa='kubectl top pods --all-namespaces'
  alias kl='kubectl logs'
  alias klf='kubectl logs -f'
  alias kcsc='kubectl config set-context $(k config current-context)'
  alias kcv='kubectl config view'
  alias kns='kubens'
  alias kcx='kubectx'
  alias kube-node-resources='kubectl get nodes --no-headers | awk '\''{print $1}'\'' | xargs -I {} sh -c '\''echo {} ; kubectl describe node {} | grep Allocated -A 5 | grep -ve Event -ve Allocated -ve percent -ve -- ; echo '\'''
  [[ "$(type -t __start_kubectl)" = "function" ]] && complete -o default -F __start_kubectl k

  function kube-restart-node() {
    local node=$1

    kubectl drain $node --ignore-daemonsets
    sleep 10
    gcloud compute instances stop $node;
    sleep 5;
    gcloud compute instances start $node
    sleep 20
    kubectl uncordon $node
  }
fi

# see also https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins/kubectl

function ctop() {
  docker run --rm -ti \
    --name=ctop \
    --volume /var/run/docker.sock:/var/run/docker.sock:ro \
    quay.io/vektorlab/ctop:latest
}

