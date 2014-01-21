import scipy

def intervalIterator(loLimit, hiLimit, interval):
	current = loLimit
	while current <= hiLimit:
		yield current
		current += interval

def linearInterpolate(x, x0, y0, x1, y1):
	return y0 + (y1-y0)*(x-x0)/float(x1-x0)

class Function:
	def __init__(self, array):
		self.array = sorted(array, key=(lambda x: x[0]))

	def __getitem__(self, arg):
		return self.array[arg]

	def __len__(self):
		return len(self.array)

	def yforx(self, x):
		before = None
		after = None
		for i in range(len(self.array)):
			if self.array[i][0] > x:
				after = self.array[i]
				try:
					before = self.array[i-1]
				finally:
					break
		if before == None: return after[1]
		x0 = before[0]
		y0 = before[1]
		x1 = after[0]
		y1 = after[1]
		return y0 + (y1-y0)*(x-x0)/float(x1-x0)


def multiplierCompare(refArray, otherArray, loLimit, hiLimit, interval = 1, multiplier = .1):
	rf = Function(refArray)
	of = Function(otherArray)
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

def bufferCompare(refArray, otherArray, loLimit, hiLimit, interval = 1, bufferSize = 1):
	rf = Function(refArray)
	of = Function(otherArray)
	for x in intervalIterator(loLimit, hiLimit, interval):
		ry = rf.yforx(x)
		oy = of.yforx(x)
		if ry - bufferSize <= oy <= ry + bufferSize:
			return False
	return True

test = Function([[4,8], [8,5], [7,7], [9,13], [0,3]])
print test.yforx(2)
print len(test)