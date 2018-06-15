# !/bin/sh

# This script finds any .info files in the node_modules directory and renames them so 
# they don't conflict with drush. package.json runs this on completion of npm install.
# 
# See this issue for more info: https://www.drupal.org/node/2329453

find -L ./node_modules -type f -name "*.info" -print0 | while IFS= read -r -d "" FNAME; do
    mv -- "$FNAME" "${FNAME%.info}.inf0"
done