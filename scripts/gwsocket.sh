#!/bin/bash -ex

if [ "$#" -ne 1 ]; then
    echo "Argument missing"
    echo "Usage: gwsocket.sh <path_to_log_file>"
    exit 1
fi

LOG_FILE=$1

/usr/local/bin/gwsocket --bind=0.0.0.0 --echo-mode &
GW_SOCKET_PROC_ID=$!
echo "gwsocket process ID is $GW_SOCKET_PROC_ID"

sleep 1

tail -f $LOG_FILE -n0 > /tmp/wspipein.fifo &
TAIL_PROC_ID=$!
echo "tail process ID is $TAIL_PROC_ID"
echo ""

echo "Kill both processes by running:"
echo "kill -9 $GW_SOCKET_PROC_ID $TAIL_PROC_ID"