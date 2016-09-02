rtlogs
======

To install the project dependencies run:

    npm install


To run the built-in server:

    npm start


## gwsocket

First, we need to download, extract and compile gwsocket on the server:

````
$ wget http://tar.gwsocket.io/gwsocket-0.1.tar.gz
$ tar -xzvf gwsocket-0.1.tar.gz
$ cd gwsocket-0.1/
$ ./configure
$ make
$ make install
````

Then, create the WebSocket server:

    gwsocket --access-log=<path_to_log_file> --bind=0.0.0.0 --echo-mode


this creates a named pipe in `/tmp/wspipein.fifo`


Then just send data to your the WebSocket server:

    tail -f <path_to_log_file> > /tmp/wspipein.fifo