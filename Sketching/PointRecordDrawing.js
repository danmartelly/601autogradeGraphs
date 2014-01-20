PointRecordDrawing = function (canvasId) {
	var self = this;
	this.canvas = null;
	this.width = this.height = 0;
	this.actions = new Array();
	this.ctx = null;
	this.canvasData = null;
	this.mouseDown = false;
	this.functionMap = null;
	this.lastMouseX = this.lastMouseY = -1;
	this.bgColor = "#FFFFFF";
	var currentLineWidth = 5;
	var drawingColor = "#000000";
	var pauseInfo = null;
	
	onMouseDown = function(event) {
		self.mouseDown = true;
		
		var canvasX = $(self.canvas).offset().left;
		var canvasY = $(self.canvas).offset().top;
		
		var x = Math.floor(event.pageX - canvasX);
		var y = Math.floor(event.pageY - canvasY);
		
		var point = new Point(x, y);
		self.drawAction(point, true);
		if (self.functionMap != null) {
			self.functionMap.pushPoint(point);
		}
		event.preventDefault();
		return false;
	}
	
	onMouseMove = function(event) {
		var canvasX = $(self.canvas).offset().left;
		var x = Math.floor(event.pageX - canvasX);
		console.log(x);
		if (self.mouseDown) {
			var canvasX = $(self.canvas).offset().left;
			var canvasY = $(self.canvas).offset().top;
			
			var x = Math.floor(event.pageX - canvasX);
			var y = Math.floor(event.pageY - canvasY);
			
			var point = new Point(x,y);
			self.drawAction(point, true);
			if (self.functionMap != null) {
				self.functionMap.pushPoint(point);
			}
			
			event.preventDefault();
			self.lastMouseX = x;
			self.lastMouseY = y;
			return false;
		}
	}
	
	onMouseUp = function(event) {
		self.mouseDown = false;
		self.lastMouseX = -1;
		self.lastMouseY = -1;
	}
	
	this.clearCanvas = function() {
		self.ctx.clearRect(10,0,self.canvas.width, self.canvas.height);
	}
	
	this.drawPixel = function(x, y, r, g, b, a) {
		if (arguments.length <= 2) {
			r = 0;
			g = 0;
			b = 0;
			a = 255;
		}
	    var index = (x + y * self.width) * 4;

	    self.canvasData.data[index + 0] = r;
	    self.canvasData.data[index + 1] = g;
	    self.canvasData.data[index + 2] = b;
	    self.canvasData.data[index + 3] = a;
	}
	
	this.updateCanvas = function() {
		self.ctx.putImageData(self.canvasData, 0, 0);
	}
	
	this.clearColumn = function(x) {
		for (var y = 0; y < self.height; y++) {
			self.drawPixel(x, y, 255, 255, 255, 0);
		}
	}
	
	this.drawAction = function (actionArg, addToArray) {
		var x = actionArg.x;
		var y = actionArg.y;
		self.clearColumn(x);
		self.drawPixel(x,y-1);
		self.drawPixel(x,y);
		self.drawPixel(x,y+1);
		self.updateCanvas();
		
		if (addToArray) {
			self.actions.push(actionArg);
		}
	}
	
	__init = function() {
		self.canvas = $("#" + canvasId);
		if (self.canvas.length == 0) {
			alert("No canvas with id " + canvasId + " found");
			return;
		}
		self.canvas = self.canvas.get(0);
		self.width = $(self.canvas).width();
		self.height = $(self.canvas).height();
		self.ctx = self.canvas.getContext("2d");
		self.canvasData = self.ctx.getImageData(0, 0, self.width, self.height);
		self.functionMap = new FunctionMapping(this);

		$(self.canvas).bind("mousedown", onMouseDown);
		$(self.canvas).bind("mouseup", onMouseUp);
		$(self.canvas).bind("mousemove", onMouseMove);
		
		self.clearCanvas();
	}
	
	__init();
};

FunctionMapping = function(drawingArg) {
	// each x value has exactly one y value
	var self = this;
	this.drawing = drawingArg;
	
	this.f = new Array(); // array of Point objects
	
	this.pushPoint = function(point) {
		this.f[point.x] = point.y;
	};
	
	this.printArray = function() {
		var answer = "[";
		for (var i = 0; i < this.f.length - 1; i++) {
			console.log(i);
			answer += self.f[i] + ", ";
		}
		answer += self.f[self.f.length-1];
		answer += "]";
		console.log(answer);
	};
};

checkFunction = function(answer, lowerBound, upperBound) {
	for (var i = 0; i < answer.length; i++) {
		ay = answer[i];
		ly = lowerBound[i];
		uy = upperBound[i];
		//check lower bound
		if (!(ay == undefined || ly == undefined || ay < ly)) {
			console.log("failed lower :" + i + " " + ay + " " + ly);
			return false;
		}
		//check upper bound
		if (!(ay == undefined || uy == undefined || ay > uy)) {
			console.log("failed upper :" + i + " " + ay + " " + uy);
			return false;
		}
	}
	return true
};

Point = function(argX, argY) {
	this.x = argX;
	this.y = argY;
};










