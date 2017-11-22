#!/usr/bin/env python3

import sys
from Recorder import recorder


def main():
    if len(sys.argv) < 2:
        print('recorder / viewer / clean?')
        return
    if sys.argv[1] == 'record':
        recorder.start(sys.argv[1:])
    if sys.argv[1] == 'clean':
        recorder.clean()


if __name__ == '__main__':
    main()