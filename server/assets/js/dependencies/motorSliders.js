
var socket = io.connect('http://192.168.1.155:3000');

socket.on('connected', function(data){
	console.log(data.numMotors);
	setupSliders(data.numMotors);
});

function setupSliders(numMotors){
	for(var i = 0; i < numMotors; i++){
		var sliderDiv = "<div class='motorSlider'></div>";
		$("#sliders").append(sliderDiv);
	}
	$(".motorSlider").each(function(){
		$(this).empty().slider({
	    	value: 0,
	    	range: "min",
	    	animate: true,
	    	orientation: "vertical",
	    	slide: function( event, ui ) {
	    		console.log(ui.value);
	    		var sliderPct = ui.value / 100.0;
	  			console.log(sliderPct);
	  			socket.emit('moveMotor', {'motor': $(this).index(), 'position':sliderPct});
	  		}
	  	});
	});
}


