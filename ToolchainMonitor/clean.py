import os

from common.constants import bashrc_stub_str, bashrc_path, ngTortaDir


def clean_bashrc():
    with open(bashrc_path, "r") as bashrc:
        content = bashrc.read()

    with open(bashrc_path, "w") as bashrc:
        bashrc.write(content.replace(bashrc_stub_str, ''))


def main():
    os.system('rm -rf {}'.format(ngTortaDir))
    clean_bashrc()


if __name__ == '__main__':
    main()
