from flask import send_from_directory
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/static/<path:path>')
def file(path):
    return send_from_directory('file', path)



app.run(host='0.0.0.0', port='3000')