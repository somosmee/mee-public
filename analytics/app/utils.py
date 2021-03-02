import requests
import json


def send_message(message):
    r = requests.post('https://hooks.slack.com/services/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', data=json.dumps({'text': message}))
    return r.text
