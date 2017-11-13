import os

from Commons.constants import bashrc_stub_str
from Commons.constants import stubsDir
from Commons.constants import logsDir
from Commons.constants import bashrc_path
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


