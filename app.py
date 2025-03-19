from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Dictionnaire pour traduire les lettres en code Morse
MORSE_CODE_DICT = {
    'A': '.-',      'B': '-...',
    'C': '-.-.',    'D': '-..',
    'E': '.',       'F': '..-.',
    'G': '--.',     'H': '....',
    'I': '..',      'J': '.---',
    'K': '-.-',     'L': '.-..',
    'M': '--',      'N': '-.',
    'O': '---',     'P': '.--.',
    'Q': '--.-',    'R': '.-.',
    'S': '...',     'T': '-',
    'U': '..-',     'V': '...-',
    'W': '.--',     'X': '-..-',
    'Y': '-.--',    'Z': '--..',
    '1': '.----',   '2': '..---',
    '3': '...--',   '4': '....-',
    '5': '.....',   '6': '-....',
    '7': '--...',   '8': '---..',
    '9': '----.',   '0': '-----',
    ', ': '--..--', '.': '.-.-.-',
    '?': '..--..',  '/': '-..-.',
    '-': '-....-',  '(': '-.--.',
    ')': '-.--.-'
}

# Dictionnaire inversé pour traduire le code Morse en lettres
REVERSE_MORSE_CODE_DICT = {v: k for k, v in MORSE_CODE_DICT.items()}

def text_to_morse(text):
    return MORSE_CODE_DICT[text.upper()]

def morse_to_text(morse):
    return REVERSE_MORSE_CODE_DICT[morse]

def generate_practice():
    if random.choice([True, False]):
        # Texte à Morse
        text = random.choice(list(MORSE_CODE_DICT.keys()))
        morse = text_to_morse(text)
        return {"type": "text_to_morse", "text": text, "morse": morse}
    else:
        # Morse à texte
        morse = random.choice(list(MORSE_CODE_DICT.values()))
        text = morse_to_text(morse)
        return {"type": "morse_to_text", "text": text, "morse": morse}

@app.route('/')
def index():
    practice = generate_practice()
    return render_template('index.html', practice=practice)

@app.route('/check', methods=['POST'])
def check():
    data = request.json
    practice_type = data['type']
    user_input = data['input']
    correct_answer = data['answer']

    if practice_type == "text_to_morse":
        if user_input == correct_answer:
            return jsonify({"result": "Correct!"})
        else:
            return jsonify({"result": "Faux. Essayez encore."})
    else:
        if user_input.upper() == correct_answer:
            return jsonify({"result": "Correct!"})
        else:
            return jsonify({"result": "Faux. Essayez encore."})

if __name__ == '__main__':
    app.run(debug=True)
