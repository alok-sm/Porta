import json
import sys

event_types = ['toolchainEvent', 'toolchainError', 'commandExec', 'selectionChange', 'newTab', 'devtoolsOpen', 'browserError']

with open(sys.argv[1]) as log_file:

    log = json.load(log_file)

    for i in range(len(log['events'])):
        log['events'][i]['index'] = i
        if log['events'][i]['_eventType'] == 'toolchainEvent':
            if not log['events'][i]['returnCode'] == 0:
                log['events'][i]['_eventType'] = 'toolchainError'

    for event_type in event_types:
        print len([ event for event in log['events'] if event['_eventType'] == event_type ]),