from os.path import expanduser

ngTortaDir = expanduser('~/.ngTorta')
logsDir = expanduser('~/.ngTorta/logs')

stubsDir = expanduser('~/.ngTorta/stubs')
stubLogsDir = expanduser('~/.ngTorta/logs/stubs')

stubsPath= expanduser('~/.ngTorta/stubPath')
bashrc_path = expanduser("~/.bash_profile")

bashrc_stub_str = '''

### START NGTORTA STUFF ###
### DONT MODIFY ANYTHING IN THIS BLOCK!!!! ###
### THIS SHOULD BE AT THE END OF THIS FILE ###
if [ -f {ngTortaStubPath} ]; then
    export PATH=$(cat {ngTortaStubPath})
fi
### END NGTORTA STUFF ###
'''.format(ngTortaStubPath=stubsPath)