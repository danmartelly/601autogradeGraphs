(function ($) {
	
	var MOVE_DISTANCE_FOR_NEW_POINT = 20;
	var MAX_NEARBY_DISTANCE = 10;
	
	var options = {};
	
	
	
    function init(plot) {
    	var opt = null, evtHolder = null, plotOffset = null, 
    	placeholder = null, container = null, moveItem = null; // always modify this data set
    	
    	plot.hooks.bindEvents.push(bindEvents);
    	function bindEvents(plot, eventHolder) {
    		opt = plot.getOptions();
    		evtHolder = eventHolder;
    		plotOffset = plot.getPlotOffset();
    		placeHolder = plot.getPlaceholder();
    		container = placeHolder.parent();
    		
    		evtHolder.mousedown(onMouseDown);
    		evtHolder.mouseup(onMouseUp);
    		evtHolder.mousemove(onMouseMove);
    		evtHolder.click(onMouseClick);
        }
    	
    	function onMouseClick(e) {
    		var positem = getMousePosition(e);
    		placeHolder.trigger("plotclick", positem);
    	}
    	
    	function onMouseDown(e) {
    		var positem = getMousePosition(e);
    		
    		if (container.find(".flotPencilRadio").prop("checked")) {
    			addGraphPoint(positem);
    		} else if (container.find(".flotEraserRadio").prop("checked")) {
    			removeGraphPoint(positem);
    		} else if (container.find(".flotMovePointRadio").prop("checked")) {
    			moveItem = positem[1];
    		}
        	
    		placeHolder.trigger("plotdown", positem);
    	}
    	
        function onMouseUp(e) {
        	var positem = getMousePosition(e);
        	functionifyStudentGraph();
    		placeHolder.trigger("plotup", positem);
        }
        
        function onMouseMove(e) {
        	var positem = getMousePosition(e);
        	if (e.buttons) {
        		if (container.find(".flotPencilRadio").prop("checked")) {
	        		offset = evtHolder.offset();
	            	var canvasX = e.pageX - offset.left - plotOffset.left,
	            	canvasY = e.pageY - offset.top - plotOffset.top;
	            	var closest = findNearbyItem(canvasX, canvasY, 1000).datapoint;
	            	var pointPos = plot.p2c({'x': closest[0], 'y': closest[1]});
	            	var pCanvasX = pointPos.left,
	            	pCanvasY = pointPos.top;
	            	if (distance(canvasX, canvasY, pCanvasX, pCanvasY) > MOVE_DISTANCE_FOR_NEW_POINT) {
	            		addGraphPoint(positem);
	            	} 
            	} else if (container.find(".flotEraserRadio").prop("checked")) {
            		removeGraphPoint(positem);
            	} else if (container.find(".flotMovePointRadio").prop("checked")) {
            		if (moveItem) {
            			var s = getStudentData(),
            			x = positem[0].x,
                    	y = positem[0].y;
            			s.data[moveItem.dataIndex] = [x, y];
            			setStudentData(s);
            		}
            	}
        		
            	var x = positem[0].x,
            	y = positem[0].y;
            	
        	}
    		placeHolder.trigger("plothover", positem);
        }
        
        // returns the equivalent plot position (pos) and the closest
        // point (item) from the student graph
        function getMousePosition(e) {
        	var pos, item = null, offset = evtHolder.offset();
        	var canvasX = e.pageX - offset.left - plotOffset.left,
        	canvasY = e.pageY - offset.top - plotOffset.top;
        	pos = plot.c2p({left: canvasX, top:canvasY});
        	pos.pageX = e.pageX;
        	pos.pageY = e.pageY;
        	item = findNearbyItem(canvasX, canvasY);
        	return [pos, item];
        }
        
        // basically copied from jquery.flot.js "findNearbyItem" function
        // maxDistance defaults to MAX_NEARBY_DISTANCE
        function findNearbyItem(mouseX, mouseY, maxDistance) {
        	if (maxDistance == undefined) {maxDistance = MAX_NEARBY_DISTANCE;}
        	var item = null;
        	
        	var s = getStudentData();
        	var axisx = s.xaxis,
        		axisy = s.yaxis,
        		points = s.datapoints.points,
        		mx = axisx.c2p(mouseX),
        		my = axisy.c2p(mouseY),
        		maxx = maxDistance / axisx.scale,
        		maxy = maxDistance / axisy.scale,
        		points = s.datapoints.points,
        		ps = s.datapoints.pointsize,
        		smallestDistance = maxDistance * maxDistance + 1;
        	
        	for (var i = 0; i < points.length; i += ps) {
        		var x = points[i], y = points[i + 1];
        		if (x == null) {continue;}
        		
        		if (x - mx > maxx || x - mx < -maxx ||
        			y - my > maxy || y - my < -maxy) {
        			continue;
        		}
        		
        		// distance in pixels
        		var dx = Math.abs(axisx.p2c(x) - mouseX),
        			dy = Math.abs(axisy.p2c(y) - mouseY),
        			dist = dx * dx + dy * dy; //save distance squared actually
        		
        		if (dist < smallestDistance) {
        			smallestDistance = dist;
        			item = [i/ps];
        		}
        	}
        	
        	if (item) {
        		var i = item[0];
        		return { datapoint: s.data[i],
        			dataIndex: i,
        			series: s,
        		};
        	}
        	
        	return null;
        }
        
        function addGraphPoint(positem) {
        	var x = positem[0].x,
        	y = positem[0].y;
    		var s = getStudentData();
    		var a = [x,y];
    		s.data.push(a);
    		if (s.timeData == null) {s.timeData = [];}
    		s.timeData[s.data.length - 1] = new Date().getTime(); //in milliseconds
    		setStudentData(s);
    		functionifyStudentGraph();
        }
        
        function functionifyStudentGraph() {
        	var s = getStudentData();
        	s.data = s.data.sort(function(a,b) {
        		return a[0] - b[0];
        	});
        	setStudentData(s);
        }
        
        function removeGraphPoint(positem) {
        	var item = positem[1];
        	if (item) {
        		var s = getStudentData();
            	s.data.splice(item.dataIndex, 1);
            	setStudentData(s);
        	}
        }
        
        function getStudentData() {
        	var s = plot.getData();
        	for (var i = 0; i < s.length; i++) {
        		if (s[i].label == "studentData") {
        			return s[i];
        		}
        	}
        }
        
        function setStudentData(series) {
        	var s = plot.getData();
        	for (var i = 0; i < s.length; i++) {
        		if (s[i].label == "studentData") {
        			s[i] = series;
        		}
        	}
        	plot.setData(s);
        	plot.draw();
        }
        
        function distance(x1, y1, x2, y2) {
        	return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
        }
        
        function shutdown(plot, eventHolder) {
        	eventHolder.unbind("mousedown", onMouseDown);
        	eventHolder.unbind("mouseup", onMouseUp);
        	eventHolder.unbind("mousemove", onMouseMove);
        	eventHolder.unbind("mouseclick", onMouseClick);
        }
        
        plot.hooks.shutdown.push(shutdown);
    }
    
    

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "plotup",
        version: "0.1"
    });
})(jQuery);