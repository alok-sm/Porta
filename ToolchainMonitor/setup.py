from clean import clean_bashrc
from common.constants import ngTortaDir, logsDir, stubsDir, stubLogsDir, bashrc_stub_str, bashrc_path
from common.utils import mkdir_p
from StubGenerator.generate import generate_stubs


def setup():
    mkdir_p(ngTortaDir)
    mkdir_p(logsDir)


def setup_stub_generator():
    mkdir_p(stubsDir)
    mkdir_p(stubLogsDir)
    clean_bashrc()
    with open(bashrc_path, "a") as bashrc:
        bashrc.write(bashrc_stub_str)


def main():
    setup()
    setup_stub_generator()
    generate_stubs()


if __name__ == '__main__':
    main()
