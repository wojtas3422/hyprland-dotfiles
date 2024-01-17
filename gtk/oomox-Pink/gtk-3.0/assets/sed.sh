#!/bin/sh
sed -i \
         -e 's/#1f1f1f/rgb(0%,0%,0%)/g' \
         -e 's/#ffffff/rgb(100%,100%,100%)/g' \
    -e 's/#1f1f1f/rgb(50%,0%,0%)/g' \
     -e 's/#fcb0d6/rgb(0%,50%,0%)/g' \
     -e 's/#2e2e2e/rgb(50%,0%,50%)/g' \
     -e 's/#ffffff/rgb(0%,0%,50%)/g' \
	"$@"
