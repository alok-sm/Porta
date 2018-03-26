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
    return
    os.system('pkill -9 "Chromium"')


def generate_extension_str(extensions):
    return' '.join(['--load-extension={}'.format(path) for path in extensions])


def generate_chrome_cmd(url=None, extension_paths=None, args=None):
    if extension_paths is None: extension_paths = []
    args_str = '' if args is None else ' '.join(args)
    url_str = '' if url is None else url
    extension_str = generate_extension_str(extension_paths)

    chrome_cmd = '/Applications/Chromium.app/Contents/MacOS/Chromium ' \
           '{} {} {} > /dev/null 2>/dev/null &'.format(url_str, extension_str, args_str)
    print(chrome_cmd)

    return chrome_cmd


def restart_chrome():
    return
    stop_chrome()
    os.system(generate_chrome_cmd())


def restart_chrome_with_recorder_extension(tutorial_website):
    return
    stop_chrome()
    extension_path = os.path.abspath(os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        '../Recorder/BrowserMonitor'))
    os.system(generate_chrome_cmd(url=tutorial_website, extension_paths=[extension_path]))


def restart_chrome_with_viewer_extension(tutorial_website):
    return
    stop_chrome()
    extension_path = os.path.abspath(os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        '../Viewer/ChromeExtension'))
    os.system(generate_chrome_cmd(
        url=tutorial_website,
        extension_paths=[extension_path],
        args=['--disable-web-security', '--user-data-dir', '--allow-running-insecure-content']
    ))
