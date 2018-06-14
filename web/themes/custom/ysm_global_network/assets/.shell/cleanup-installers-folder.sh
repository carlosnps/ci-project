# !/bin/sh

DIR="./config/.installers"

# Make sure the directory is empty.
if [ ! "$(ls -A $DIR)" ]; then
	# Remove it.
	rm -rf $DIR

	# Remove the script from the package.json file.
	sed -i "" "/sh:cleanup-installers-folder/ d" "./package.json"
fi