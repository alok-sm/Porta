#!/usr/bin/env python3

import sys
from Recorder import recorder
from Viewer import viewer
import os

def main():
    if len(sys.argv) < 2:
        print('record / view / clean?')
        return
    elif sys.argv[1] == 'record':
        recorder.start(sys.argv[1:])
    elif sys.argv[1] == 'clean':
        recorder.clean()
    elif sys.argv[1] == 'view':
        viewer.view(sys.argv[1:])
    else:
        print('record / view / clean?')

if __name__ == '__main__':
    main()

