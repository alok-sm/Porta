#!/usr/bin/env python3

import sys
from Recorder import recorder
from Viewer import viewer
import os

def main():
    if len(sys.argv) < 2:
        print('record / view / clean / chromium?')
        return
    elif sys.argv[1] == 'record':
        recorder.start(sys.argv[1:])
    elif sys.argv[1] == 'clean':
        recorder.clean()
    elif sys.argv[1] == 'view':
        viewer.view(sys.argv[1:])
    elif sys.argv[1] == 'chromium':
        os.system('source ~/.bashrc; tab /Applications/Chromium.app/Contents/MacOS/Chromium --disable-web-security --user-data-dir --allow-running-insecure-content')
    else:
        print('record / view / clean?')

if __name__ == '__main__':
    main()

