import os
from os import listdir

from Recorder.Commons.constants import stubsDir, stubsPath
from Recorder.Commons.utils import mkdir_p, setup_bashrc, clean_bashrc

binaries_to_monitor = [
    '/usr/bin/gcc',
    '/usr/bin/javac'
]

template_filepath = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'shim_template.py')
with open(template_filepath) as template_file:
    shim_template = template_file.read()


def get_fakepath(original_path):
    return os.path.join(stubsDir, os.path.abspath(original_path).lstrip('/'))


def symlink_path(orig_path):
    stub_path = get_fakepath(orig_path)
    mkdir_p(stub_path)

    for filename in listdir(orig_path):
        exec_file = os.path.join(orig_path, filename)
        stub_file = os.path.join(stub_path, filename)
        if os.path.isfile(exec_file) and os.access(exec_file, os.X_OK):
            os.system('ln -s {file_path} {stub_path}' .format(
                file_path=exec_file,
                stub_path=stub_file
            ))

    return stub_path


def generate_shim(binary):
    fakepath = get_fakepath(binary)
    os.system('rm {} > /dev/null 2> /dev/null'.format(fakepath))
    with open(fakepath, 'w') as shim_file:
        shim_file.write(shim_template.replace('%%original_binary%%', binary))
    os.system('chmod 755 {}'.format(fakepath))



def generate_all_shims():
    paths = os.environ.get('PATH', '').split(os.pathsep)

    # set up symlinks
    new_paths = [symlink_path(path) for path in paths]
    with open(stubsPath, 'w') as stubs_path:
        stubs_path.write(os.pathsep.join(new_paths))

    # set up scripts
    for binary in binaries_to_monitor:
        generate_shim(binary)


def main():
    clean_bashrc()
    setup_bashrc()
    generate_all_shims()


if __name__ == '__main__':
    main()