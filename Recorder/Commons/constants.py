from os.path import expanduser

tempDir = expanduser('~/.ngTortaTemp')
stubsDir = expanduser('~/.ngTortaTemp/stubs')
stubsPath = expanduser('~/.ngTortaTemp/stubPath')

logsDir = expanduser('~/.ngTortaLogs')

bashrc_path = expanduser("~/.bash_profile")

logserver_host = '0.0.0.0'
logserver_port = 8000

bashrc_stub_str = '''

### START NGTORTA STUFF ###
### DONT MODIFY ANYTHING IN THIS BLOCK!!!! ###
### THIS SHOULD BE AT THE END OF THIS FILE ###
if [ -f {ngTortaStubPath} ]; then
    export PATH=$(cat {ngTortaStubPath})
fi
### END NGTORTA STUFF ###
'''.format(ngTortaStubPath=stubsPath)