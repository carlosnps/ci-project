# !/bin/sh

# This script loops through all .scss files found inside the font-awesome folder and
# replaces ".#{" with "%#{".  The idea behind is to convert the .className into a 
# slient extend, which reduces CSS bloat as the fonts are only loaded into the CSS
# when their className is extended.
# 
# Example: .fa => %fa;

for file in ./node_modules/font-awesome/scss/*.scss; do
    [[ ! -e $file ]] && continue
    
    sed -i "" "s/\.#{/%#{/g" $file
done

# Removes all scripts that deal with suppressing font-awesome.
sed -i "" "s/.*suppress-font-awesome.*//g" "./package.json"

# Removes this file, it's no longer needed.
rm "./.shell/suppress-font-awesome-output.sh"