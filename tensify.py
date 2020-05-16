#!/usr/bin/python3

import sys
from pattern.en import lexeme, conjugate, PAST

text = sys.stdin.read().strip()
print(conjugate(verb = text, tense = PAST))


