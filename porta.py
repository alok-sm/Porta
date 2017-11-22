#!/usr/bin/env python3

import sys
from Recorder import recorder


def main():
    if len(sys.argv) < 2:
        print('recorder / viewer?')
        return
    if sys.argv[1] == 'recorder':
        recorder.main(sys.argv[1:])


if __name__ == '__main__':
    main()