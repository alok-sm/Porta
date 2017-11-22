import os

from Commons.constants import bashrc_path
from Commons.constants import bashrc_stub_str
from Commons.constants import logsDir
from Commons.constants import stubsDir
from Commons.constants import tempDir


def mkdir_p(path):
    os.system('mkdir -p {}'.format(path))


def clean_directories():
    os.system('rm -rf {}'.format(tempDir))


def setup_directories():
    mkdir_p(tempDir)
    mkdir_p(logsDir)
    mkdir_p(stubsDir)


def restart_bash():
    os.system('pkill bash')


def clean_bashrc():
    with open(bashrc_path, "r") as bashrc:
        content = bashrc.read()

    with open(bashrc_path, "w") as bashrc:
        bashrc.write(content.replace(bashrc_stub_str, ''))


def setup_bashrc():
    with open(bashrc_path, "a") as bashrc:
        bashrc.write(bashrc_stub_str)


def stop_chrome():
    os.system('pkill "Google Chrome"')


def generate_chrome_cmd(restore=False, extension_path=None):
    extension_str = '' if extension_path is None else '--load-extension={}'.format(extension_path)
    restore_str = '--restore-last-session' if restore else ''

    return '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome ' \
           '{} {} > /dev/null 2>/dev/null &'.format(extension_str, restore_str)


def restart_chrome(restore):
    stop_chrome()
    os.system(generate_chrome_cmd(restore=restore))


def restart_chrome_with_extension(restore):
    stop_chrome()
    extension_path = os.path.abspath(os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        '../BrowserMonitor'))
    os.system(generate_chrome_cmd(restore=restore, extension_path=extension_path))
