import numpy as np
import scipy
from scipy.optimize import curve_fit
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
			if oy <= ry*(1.-multiplier) or oy >= ry*(1.+multiplier):
				return False
		else:
			if oy <= ry*(1.+multiplier) or oy >= ry*(1.-multiplier):
				return False
	return True

def bufferCompare(refLabel, otherLabel, loLimit, hiLimit, interval = 1, bufferSize = 1):
	rf = getFunctionForLabel(refLabel)
	of = getFunctionForLabel(otherLabel)
	for x in intervalIterator(loLimit, hiLimit, interval):
		ry = rf.yforx(x)
		oy = of.yforx(x)
		if oy <= (ry - bufferSize) or oy >= (ry + bufferSize):
			return False
	return True


def genericSin(x, amp, freq, xShift, offset):
	return amp*np.sin(2*np.pi*freq*(x - xShift)) + offset

def genericExp(x, initial, factor, timeConst, xShift, offset):
	return initial*factor**((x-xShift)/timeConst) + offset

# Takes in the label of what is to be curve fitted, the highest degree polynomial desired
# and a list functions. Functions should be mathematical functions such as func(x, a, b, c)
# where the independent variable comes first and constants come afterwards. It should return a number.
# curveSelect returns the best function and a measure of how well it fits
def curveSelect(label, polydegree=0, funcList=[]):
	data = getDataForLabel(label)
	xdata = [p[0] for p in data]
	ydata = [p[1] for p in data]
	associatedError = []
	# do polynomial first
	fitResults = np.polyfit(xdata, ydata, polydegree, full=True)
	polyAnswer = fitResults[0]
	polyError = fitResults[1]
	# do functions now
	for f in funcList:
		if not callable(f):
			raise Exception("Only accepts ints and functions. unexpected input: " + str(f))
		popt, pcov = curve_fit(f, xdata, ydata)
		print pcov
	return pcov
			
print curveSelect('answerData', funcList=[genericExp, genericSin])
# print curveSelect('studentData', funcList=[lambda x, a: a*np.sin(x)])