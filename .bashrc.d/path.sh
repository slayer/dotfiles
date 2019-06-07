#!/bin/sh

# set PATH so it includes user's private bin if it exists
if [[ ":$PATH:" != *"${HOME}/bin:"* ]] && [[ -d ${HOME}/bin ]] ; then
  export PATH=${HOME}/bin:"${PATH}"
fi

# if [[ ":$PATH:" != *"${HOME}/.linuxbrew/bin:"* ]] && [[ -d ${HOME}/.linuxbrew/bin ]]; then
#   export PATH="${HOME}/.linuxbrew/bin:$PATH"
#   export MANPATH="${HOME}/.linuxbrew/share/man:$MANPATH"
#   export INFOPATH="${HOME}/.linuxbrew/share/info:$INFOPATH"
# fi

# echo "17: ${PATH}; $(ruby -e 'puts ENV["PATH"].split(":").size')" >&2

# for dir in /opt/*; do
#   if [ "${dir}/bin" ]; then
#     export PATH=$PATH:${dir}/bin
#   fi
# done


