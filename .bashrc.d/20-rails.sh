#!/bin/sh

function r() {
	if [ -x bin/rails ]; then
		bin/rails $@
	else
		rails $@
	fi
}

