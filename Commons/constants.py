from os.path import expanduser

tempDir = expanduser('~/.portaTemp')
stubsDir = expanduser('~/.portaTemp/stubs')
stubsPath = expanduser('~/.portaTemp/stubPath')

logsDir = expanduser('~/.portaLogs')

bashrc_path = expanduser("~/.bash_profile")

logserver_host = '0.0.0.0'
logserver_port = 8000

viewserver_host = '0.0.0.0'
viewserver_port = 8000

bashrc_stub_str = '''

### START PORTA STUFF ###
### DONT MODIFY ANYTHING IN THIS BLOCK!!!! ###
### THIS SHOULD BE AT THE END OF THIS FILE ###
if [ -f {portaStubPath} ]; then
    export PATH=$(cat {portaStubPath})
fi
### END PORTA STUFF ###
'''.format(portaStubPath=stubsPath)