#!/bin/sh

cd `dirname "$0"`
java -jar closure-compiler/compiler.jar --js ../jquery.dim-background.js --js_output_file ../jquery.dim-background.min.js

