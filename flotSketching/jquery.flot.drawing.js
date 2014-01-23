(function ($) {
	
	var MOVE_DISTANCE_FOR_NEW_POINT = 20;
	var MAX_NEARBY_DISTANCE = 10;
	
	var options = {};
	
	
	
    function init(plot) {
    	var opt = null, evtHolder = null, plotOffset = null, 
    	placeholder = null, data = [[],[]]; // always modify this data set
    	
    	plot.hooks.bindEvents.push(bindEvents);
    	function bindEvents(plot, eventHolder) {
    		opt = plot.getOptions();
    		evtHolder = eventHolder;
    		plotOffset = plot.getPlotOffset();
    		placeHolder = plot.getPlaceholder();
    		
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
    		if ($("#pencilRadio").prop("checked")) {
    			addGraphPoint(positem);
    		} else if ($("#eraserRadio").prop("checked")) {
    			
    		} else if ($("#movePointRadio").prop("checked")) {
    			
    		}
        	
    		placeHolder.trigger("plotdown", positem);
    	}
    	
        function onMouseUp(e) {
        	var positem = getMousePosition(e);
    		placeHolder.trigger("plotup", positem);
        }
        
        function onMouseMove(e) {
        	var positem = getMousePosition(e);
        	if (e.buttons) {
        		offset = evtHolder.offset();
            	var canvasX = e.pageX - offset.left - plotOffset.left,
            	canvasY = e.pageY - offset.top - plotOffset.top;
            	var s = getStudentData();
            	var prev = s.data[s.data.length-1];
            	var prevPos = plot.p2c({'x': prev[0], 'y': prev[1]});
            	var pCanvasX = prevPos.left,
            	pCanvasY = prevPos.top;
            	if ($("#pencilRadio").prop("checked") && 
            			distance(canvasX, canvasY, pCanvasX, pCanvasY) > MOVE_DISTANCE_FOR_NEW_POINT) {
            		addGraphPoint(positem);
            	} else if ($("#eraserRadio").prop("checked")) {
            		
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
        	return [pos, item];
        }
        
        function findNearbyItem(plotX,plotY) {
        	
        }
        
        function addGraphPoint(positem) {
        	var x = positem[0].x,
        	y = positem[0].y;
    		var s = getStudentData();
    		var a = [x,y];
    		s.data.push(a);
    		// functionify the student data by sorting the points based on x value
        	s.data = s.data.sort(function(a,b) {
        		return a[0] - b[0];
        	});
    		if (s.timeData == null) {s.timeData = [];}
    		s.timeData[s.data.length - 1] = new Date().getTime(); //in milliseconds
    		setStudentData(s);
    		plot.draw();
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
        }
        
        function distance(x1, y1, x2, y2) {
        	return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
        }
        
        function findNearbyItem(mouseX, mouseY) {
        	var item = null, v,i,j,ps;
        	for (i=0; i < plot.getData().length; i++) {
        		var s = plot.getData()[i];
        		if (s.nearBy.findItem !== null) {
        			item = s.nearBy.findItem(mouseX, mouseY, i, s);
        		}
        	}
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