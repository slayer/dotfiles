#!/bin/sh

# set PATH so it includes user's private bin if it exists
if [ -d ~/bin ] ; then
  export PATH=~/bin:"${PATH}"
fi

# for dir in /opt/*; do
#   if [ "${dir}/bin" ]; then
#     export PATH=$PATH:${dir}/bin
#   fi
# done


