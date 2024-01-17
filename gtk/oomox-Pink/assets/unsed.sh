#!/bin/sh
sed -i \
         -e 's/rgb(0%,0%,0%)/#1f1f1f/g' \
         -e 's/rgb(100%,100%,100%)/#ffffff/g' \
    -e 's/rgb(50%,0%,0%)/#1f1f1f/g' \
     -e 's/rgb(0%,50%,0%)/#fcb0d6/g' \
 -e 's/rgb(0%,50.196078%,0%)/#fcb0d6/g' \
     -e 's/rgb(50%,0%,50%)/#2e2e2e/g' \
 -e 's/rgb(50.196078%,0%,50.196078%)/#2e2e2e/g' \
     -e 's/rgb(0%,0%,50%)/#ffffff/g' \
	"$@"
