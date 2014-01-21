(function ($) {
	
	var MOVE_DISTANCE_FOR_NEW_POINT = 10;
	
	var options = {};
	
    function init(plot) {
    	var opt = null, evtHolder = null, plotOffset = null, 
    	placeholder = null;
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
            	var s = plot.getData();
            	var prev = s[0].data[s[0].data.length-1];
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
        
        function getMousePosition(e) {
        	var pos, item = null, offset = evtHolder.offset();
        	var canvasX = e.pageX - offset.left - plotOffset.left,
        	canvasY = e.pageY - offset.top - plotOffset.top;
        	pos = plot.c2p({left: canvasX, top:canvasY});
        	pos.pageX = e.pageX;
        	pos.pageY = e.pageY;
        	return [pos, item];
        }
        
        function addGraphPoint(positem) {
        	var x = positem[0].x,
        	y = positem[0].y;
    		var s = plot.getData();
    		console.log(s);
    		var a = [x,y];
    		a.time = 50;
    		s[0].data.push(a);
    		plot.setData(s);
    		plot.draw();
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