from flask import Flask, request, jsonify
from pororo import Pororo

app = Flask(__name__)
pos_tagger = Pororo(task="pos", lang="ko")

@app.route('/pos-tag', methods=['POST'])
def pos_tag():
    content = request.json
    text = content['text']
    tags = pos_tagger(text)
    return jsonify({'tags': tags})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
