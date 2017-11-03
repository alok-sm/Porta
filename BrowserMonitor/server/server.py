import os
import json

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/browser_log', methods=['POST'])
def browser_log():
    data = request.get_json()
    print data
    return jsonify({
        'status': 'success'
    })
   

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, threaded=True, debug=True)