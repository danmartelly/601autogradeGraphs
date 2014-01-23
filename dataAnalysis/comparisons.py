import scipy
from dataConverter import *

def intervalIterator(loLimit, hiLimit, interval):
	current = loLimit
	while current <= hiLimit:
		yield current
		current += interval


def multiplierCompare(refLabel, otherLabel, loLimit, hiLimit, interval = 1, multiplier = .1):
	rf = getFunctionForLabel(refLabel)
	of = getFunctionForLabel(otherLabel)
	for x in intervalIterator(loLimit, hiLimit, interval):
		ry = rf.yforx(x)
		oy = of.yforx(x)
		if ry > 0:
			if ry*(1.-multiplier) <= oy <= ry*(1.+multiplier):
				return False
		else:
			if ry*(1.+multiplier) <= oy <= ry*(1.-multiplier):
				return False
	return True

def bufferCompare(refLabel, otherLabel, loLimit, hiLimit, interval = 1, bufferSize = 1):
	rf = getFunctionForLabel(refLabel)
	of = getFunctionForLabel(otherLabel)
	print rf.array, of.array
	for x in intervalIterator(loLimit, hiLimit, interval):
		ry = rf.yforx(x)
		oy = of.yforx(x)
		if (ry - bufferSize) <= oy and oy <= (ry + bufferSize):
			return False
	return True

print 'oone'
print bufferCompare('answerData', 'studentData', 0, 4, .2, .02)
print 'twoo'
print bufferCompare('answerData', 'studentData', 0, 4, .2, 2)