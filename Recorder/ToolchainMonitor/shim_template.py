#!/usr/bin/python

import os
import sys
import json
from threading import Thread
from subprocess import Popen, PIPE
import time
import urllib2  

stdin_lines = []
stdout_lines = []
stderr_lines = []

original_bin = '%%original_binary%%'
cli_args = sys.argv[:]
cli_args[0] = original_bin


def copy_file_contents(src, dst, buffer):
    for line in src:
        line_str = line
        buffer.append(line_str)
        dst.write(line_str)

def start_dtrace(pid):
    cmd = 'sudo dtrace -s {script} -p {pid}'.format(
        script=os.path.join(
            os.path.dirname(os.path.realpath(__file__)), 
            'open.dtrace'
        ),
        pid=str(pid)
    )
    return Popen(cmd, shell=True, stdout=PIPE)

process = Popen('sleep 1; ' + ' '.join(cli_args), shell=True stdin=PIPE, stdout=PIPE, stderr=PIPE)

threads = [
    Thread(target=copy_file_contents, args=(sys.stdin     , process.stdin, stdin_lines  )),
    Thread(target=copy_file_contents, args=(process.stdout, sys.stdout   , stdout_lines )),
    Thread(target=copy_file_contents, args=(process.stderr, sys.stderr   , stderr_lines ))
]

dtrace_proc = start_dtrace(process.pid)

for thread in threads:
    thread.start()

process.wait()
return_code = process.poll()
sys.stdin.close()

unix_timestamp = time.time()

log_line = json.dumps({
    '_eventType': 'toolchainEvent', 
    'command': cli_args,
    'stdin': [line.strip() for line in stdin_lines],
    'stdout': [line.strip() for line in stdout_lines],
    'stderr': [line.strip() for line in stderr_lines],
    'returnCode': return_code,
    'timestamp': unix_timestamp
})

req = urllib2.Request('http://localhost:8000/log')
req.add_header('Content-Type', 'application/json')

urllib2.urlopen(req, log_line)

os._exit(0)