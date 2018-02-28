#!/usr/bin/env python3

import sys
from Recorder import recorder
from Viewer import viewer


def main():
    if len(sys.argv) < 2:
        print('record / view / clean?')
        return
    if sys.argv[1] == 'record':
        recorder.start(sys.argv[1:])
    if sys.argv[1] == 'clean':
        recorder.clean()
    if sys.argv[1] == 'view':
        viewer.view(sys.argv[1:])
    else:
        print('record / view / clean?')

if __name__ == '__main__':
    main()

