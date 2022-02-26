import json
word_bank = {
    'words': []
}

with open('words.txt', 'r') as words:
    for word in words.readlines():
        word_bank['words'].append(word[:5])

with open('wordBank.json', 'w') as outfile:
    json.dump(word_bank, outfile)