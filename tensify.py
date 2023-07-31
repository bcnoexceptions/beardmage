#!/usr/bin/python3

import sys
from pattern.en import lexeme, conjugate, PAST

def main():
	first_time_fails()
	text = sys.stdin.read().strip()
	print(conjugate(verb = text, tense = PAST))

# workaround for poor maintenance of the pattern package
# https://github.com/RaRe-Technologies/gensim/issues/2438
def first_time_fails():
	try:
		print(conjugate(verb = "maintain", tense = PAST))
	except:
		pass

main()


