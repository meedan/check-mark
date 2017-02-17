#!/bin/bash
# Generate icons in different sizes
# Inkscape and ImageMagick are required

for suffix in 'local' 'edge' 'live'
do
  img="logo-$suffix.svg"
  
  for size in 16 48 128
  do
    inkscape --export-png="${size}x${size}-$suffix.png" -w $size -h $size $img
  done
  
  convert "128x128-$suffix.png" "scalable-$suffix.ico"
done
