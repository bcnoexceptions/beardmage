#!/bin/bash

# USAGE: ./add-channel.sh <name> <role>
# don't include quotes in the name

sqlite3 channels.sqlite "insert into channels values('$1', '$2', '', '');"
