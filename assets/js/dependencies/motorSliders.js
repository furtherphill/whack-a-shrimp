var piBlaster = require('pi-blaster.js');
var gpio = require('rpi-gpio');

$(function() {
	var NUM_MOTORS = 1;

	//multiplexer select pins
	var S0 = 12;
	var S1 = 10;
	var S2 = 8;

	//pwm pin
	var PWM = 11;

	//setup pins
	gpio.setup(S0, gpio.DIR_OUT, function(err){
		if(err) throw err;
	});
	gpio.setup(S1, gpio.DIR_OUT, function(err){
		if(err) throw err;
	});
	gpio.setup(S2, gpio.DIR_OUT, function(err){
		if(err) throw err;
	});

	selectMotor(0);

    for(var i = 0; i < NUM_MOTORS; i++){
    	var newSlider = $("#sliders").slider({
        	value: 0,
        	range: "min",
        	animate: true,
        	orientation: "vertical",
        	slide: function( event, ui ) {
        		console.log(ui.value);
        		var sliderPct = ui.value / 100.0;
      			piBlaster.setPwm(PWM, sliderPct);
      		}
      	});
    }
});

function selectMotor(i){
	gpio.write(S0, false, function(err){
		if(err) throw err;
		console.log("set S0 LOW");
	})
	gpio.write(S1, false, function(err){
		if(err) throw err;
		console.log("set S1 LOW");
	})
	gpio.write(S2, false, function(err){
		if(err) throw err;
		console.log("set S2 LOW");
	})


	  /*digitalWrite(addr0, (i & 1) ? HIGH : LOW);
  i >>= 1;
  digitalWrite(addr1, (i & 1) ? HIGH : LOW);
  i >>= 1;
  digitalWrite(addr2, (i & 1) ? HIGH : LOW);*/
}


/*s2 = GPIO15 (8)
s1 = GPIO15 (10)
s0 = GPIO18 (12)

pwm = GPIO17 (11)

var piblaster = require('pi-blaster.js');

piblaster.setPwm(17, 1 ); # 100% brightness
piblaster.setPwm(22, 0.2 ); # 20% brightness
piblaster.setPwm(23, 0 ); # off*/