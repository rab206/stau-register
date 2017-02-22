#!/bin/bash
# Bash Menu Script Example
# --- Needs to run as sudo

apacheFileToSwap="/etc/apache2/sites-available/001-cloud9.conf"
workspaceRoot="/home/ubuntu/workspace/"
dirToSwitchTo="$workspaceRoot$1"

sed -i "/DocumentRoot/c\DocumentRoot $dirToSwitchTo" $apacheFileToSwap
sed -i "/<Directory/c\    <Directory $dirToSwitchTo>" $apacheFileToSwap

service apache2 restart
echo Ok, up and running in : $dirToSwitchTo