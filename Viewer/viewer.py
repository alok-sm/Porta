import os
import sys
import json
from Commons import utils
from Viewer.Server.server import ViewServer

def run_in_new_tab(command, location='.'):
    cmd = 'source ~/.bashrc; tab {} {}'.format(
        location, command
    )
    # print(cmd)
    os.system(cmd)

def view(args):
    # os.system('source ~/.bashrc; tab /Applications/Chromium.app/Contents/MacOS/Chromium http://localhost:9000 --disable-web-security --user-data-dir --allow-running-insecure-content --profile-directory=\\\'Profile 1\\\'')
    # os.system('source ~/.bashrc; tab ~/dev/HciResearch/Porta/Viewer/Frontend/ grunt serve')
    # os.system('source ~/.bashrc; tab ~/Desktop/ http-server')
    
    
    run_in_new_tab('/Applications/Chromium.app/Contents/MacOS/Chromium http://localhost:9000 --disable-web-security --user-data-dir --allow-running-insecure-content --profile-directory=\\\'Profile 1\\\'')
    
    # run_in_new_tab('/Applications/Google\\\\\\\\ Chrome.app/Contents/MacOS/Google\\\\\\\\ Chrome --disable-web-security --user-data-dir --allow-running-insecure-content')
    run_in_new_tab('grunt serve', '~/dev/HciResearch/Porta/Viewer/Frontend/')
    # run_in_new_tab('http-server', '~/Google\ Drive\ \(amysore\@eng.ucsd.edu\)/porta-userstudy/LogFiles/_screencasts/')
    run_in_new_tab('http-server', '/Users/alok/Movies')

    view_server = ViewServer()
    view_server.start()