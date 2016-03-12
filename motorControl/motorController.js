var gpio = require('pigpio').Gpio;

var NUM_MOTORS = 4;

//multiplexer select pins
var pinS0 = 18;
var pinS1 = 15;
var pinS2 = 14;

//pwm pin
var PWM = 17;

//setup pins
/*gpio.setup(S0, gpio.DIR_OUT, function(err){
	if(err) throw err;
});
gpio.setup(S1, gpio.DIR_OUT, function(err){
	if(err) throw err;
});
gpio.setup(S2, gpio.DIR_OUT, function(err){
	if(err) throw err;
});*/


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('connected');
});

io.on('connection', function(socket){
	socket.emit('connected', {'numMotors': NUM_MOTORS});

	var motor = new gpio(PWM, {mode: gpio.OUTPUT});
	var S0 = new gpio(pinS0, {mode: gpio.OUTPUT});
	var S1 = new gpio(pinS1, {mode: gpio.OUTPUT});
	var S2 = new gpio(pinS2, {mode: gpio.OUTPUT});
	var SERVO_MIN = 1000;
	var SERVO_MAX = 2000;

  	socket.on('moveMotor', function(data){
  		var motorIdx = data.motor;
  		S0.digitalWrite((motorIdx & 1) ? 1 : 0);
  		motorIdx >>= 1;
  		S1.digitalWrite((motorIdx & 1) ? 1 : 0);
  		motorIdx >>= 1;
  		S2.digitalWrite((motorIdx & 1) ? 1 : 0);

    	console.log('move motor: ' + data.motor + ' to position: ' + data.position);
    	var pulseWidth = SERVO_MAX - (((SERVO_MAX - SERVO_MIN)) * data.position);
    	setMotorToPosition(motor, pulseWidth);
  	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function setMotorToPosition(motor,pos){
	//selectMotor(motor);
	//piBlaster.setPwm(PWM, pos);
	
    //console.log(pulseWidth);
    motor.servoWrite(pos);
}

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
}
