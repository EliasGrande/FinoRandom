#!/bin/sh

selfname=`basename "$0"`

error()
{
	code=$?
	[ -n "$1" ] && echo "$selfname: $1" >&2
	[ $code -eq 0 ] && exit 1
	exit $code
}

selfdir=`readlink -m "$0/.."` || error

getmetablock()
{
	cat "$1" \
		| sed -ne '1,/\/\/\s*\=\=\/UserScript\=\=/p' \
		| sed -ne '/\/\/\s*\=\=UserScript\=\=/,$p'
}

getmetavar()
{
	re='[A-Za-z\-]'
	echo "$2" | grep -qe "^$re$re*\$" || error "not valid var name"
	var=`echo "$2" | sed -e 's#\-#\\-#g'`
	getmetablock "$1" \
		| grep -e '^//\s*\@'"$var"'\s' \
		| sed -e 's#^//\s*\@'"$var"'\s\s*\(\S\)#\1#' \
		-e 's#\(\S\)\s*$#\1#'
}

yuipath="$selfdir/yuicompressor.jar"
yuierror="yuicompressor download failed, please download it manually and save \
it as '$yuipath'"
downloaderror()
{
	code=$?
	echo "$selfname: $yuierror" >&2
	rm -f "$yuipath"
	[ $code -eq 0 ] && exit 1
	exit $code
}
downloadyui()
{
	rm -f "$yuipath"
	relurl="https://github.com/yui/yuicompressor/releases"
	latest=`curl -I "$relurl/latest"` || downloaderror
	latest=`echo "$latest" | \
		sed -ne 's/^\s*Location\:\s*\(\S.*\S\)\s*$/\1/p'`
	[ -n "$latest" ] || downloaderror
	echo "$latest"
	version=`echo "$latest" | grep -oe '[0-9]\(\.[0-9]\)*$'`
	[ -n "$version" ] || downloaderror
	download="$relurl/download/v$version/yuicompressor-$version.jar"
	wget "$download" -O "$yuipath" || downloaderror
}

compress()
{
	[ -f "$yuipath" ] || downloadyui
	getmetablock "$1" && java -jar "$yuipath" "$1" || error
}

clean()
{
	rm -f "$yuipath"
}

fireinstall()
{
	fullpath=`readlink -f "$1"` || error
	if [ -n "$(pidof firefox)" ]; then
		firefox "file://$fullpath" || error
		t1="firefox"
		t2="greasemonkey installation"
		sleep 0.5 || sleep 1
		xdotool windowactivate `xdotool search --class "$t1"` 2>&1|:
		xdotool windowactivate `xdotool search --name "$t2"` 2>&1|:
		wmctrl -a "$t1" 2>&1|:
		wmctrl -a "$t2" 2>&1|:
		exit 0
	fi
	firefox "file://$fullpath" &
}

case "$1" in
	getmetablock) getmetablock "$2" || error;;
	getmetavar) getmetavar "$2" "$3" || error;;
	compressorpath) echo "$yuipath";;
	downloadcompressor) downloadyui || error "$yuierror";;
	compress) compress "$2" || error;;
	fireinstall) fireinstall "$2" || error;;
	clean) clean || error;;
	*)
		[ -n "$1" ] && error "unknown action '$1'"
		error "no action specified" ;;
esac

