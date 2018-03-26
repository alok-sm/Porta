import os
import sys
import json
from Commons import utils
from Viewer.Server.server import ViewServer


def view(args):
    # path = os.path.expanduser('~/.portaLogs/{}.json'.format(sys.argv[2]))
    # raw_log = json.load(open(path))
    os.system('/Applications/Chromium.app/Contents/MacOS/Chromium --no-startup-window --profile-directory="Profile 1"')
    os.system('source ~/.bashrc; tab /Applications/Chromium.app/Contents/MacOS/Chromium http://localhost:9000 --disable-web-security --user-data-dir --allow-running-insecure-content --profile-directory=\\\'Profile 1\\\'')
    os.system('source ~/.bashrc; tab ~/dev/HciResearch/Porta/Viewer/Frontend/ grunt serve')
    view_server = ViewServer()
    view_server.start()