#!/bin/bash

# browser extension
npm run build

# https://github.com/react-community/create-react-native-app/issues/343#issuecomment-337270308
sysctl -w fs.inotify.max_user_watches=10000
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_queued_events
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_instances
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
watchman watch-del-all && watchman shutdown-server

# mobile application (please connect your device to the USB)
npm run build-android
