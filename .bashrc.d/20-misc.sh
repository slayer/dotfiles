#!/bin/bash

if [[ "$(type -t __fzf_history__)" != 'function' ]]; then
  [[ -f ~/.fzf.bash ]] && source ~/.fzf.bash
  [[ -f /usr/share/doc/fzf/examples/key-bindings.bash ]] && source /usr/share/doc/fzf/examples/key-bindings.bash
fi

