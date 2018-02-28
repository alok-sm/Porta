import os
import sys
import json
from Commons import utils
from Viewer.Server.server import ViewServer


def view(args):
    path = os.path.expanduser('~/.portaLogs/{}.json'.format(sys.argv[1]))
    raw_log = json.load(open(path))
    utils.restart_chrome_with_viewer_extension(raw_log["tutorial_website"])
    view_server = ViewServer(raw_log)
    view_server.start()