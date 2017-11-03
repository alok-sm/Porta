import os
from os import listdir

from common.constants import stubsDir, stubsPath
from common.utils import mkdir_p

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
        if os.path.isfile(exec_file) and os.access(exec_file, os.X_OK) and exec_file not in binaries_to_monitor:
            os.system('ln -s {file_path} {stub_path}'.format(
                file_path=exec_file,
                stub_path=stub_file
            ))

    return stub_path


def generate_shim(binary):
    fakepath = get_fakepath(binary)
    with open(fakepath, 'w') as shim_file:
        shim_file.write(shim_template.replace('%%original_binary%%', binary))

    os.system('chmod 755 {}'.format(fakepath))


def generate_stubs():
    paths = os.environ.get('PATH', '').split(os.pathsep)
    new_paths = [symlink_path(path) for path in paths]

    with open(stubsPath, 'w') as stubs_path:
        stubs_path.write(os.pathsep.join(new_paths))

    for binary in binaries_to_monitor:
        generate_shim(binary)


def main():
    generate_stubs()


if __name__ == '__main__':
    main()
