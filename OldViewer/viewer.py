import os
import sys
import json
from Commons import utils
from Viewer.Server.server import ViewServer


def view(args):
    path = os.path.expanduser('~/.portaLogs/{}.json'.format(sys.argv[2]))
    raw_log = json.load(open(path))
    utils.restart_chrome_with_viewer_extension("http://localhost:3000/static/main/index.html")
    view_server = ViewServer(raw_log)
    view_server.start()