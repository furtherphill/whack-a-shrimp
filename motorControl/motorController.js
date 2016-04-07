var gpio = require('pigpio').Gpio;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var NUM_MOTORS = 4;

//multiplexer select pins
var pinS0 = 18;
var pinS1 = 15;
var pinS2 = 14;

//pwm pin
var PWM = 17;

app.get('/', function(req, res){
  res.send('connected');
});

io.on('connection', function(socket){
	//send the number of connected motors on this device
	socket.emit('connected', {'numMotors': NUM_MOTORS});

	var motor = new gpio(PWM, {mode: gpio.OUTPUT});
	var S0 = new gpio(pinS0, {mode: gpio.OUTPUT});
	var S1 = new gpio(pinS1, {mode: gpio.OUTPUT});
	var S2 = new gpio(pinS2, {mode: gpio.OUTPUT});
	var SERVO_MIN = 1000;
	var SERVO_MAX = 2000;

  	socket.on('moveMotor', function(data){
  		var motorIdx = data.motor;
  		selectMotor(motorIdx);

    	console.log('move motor: ' + data.motor + ' to position: ' + data.position);
    	var pulseWidth = SERVO_MAX - (((SERVO_MAX - SERVO_MIN)) * data.position);
    	motor.servoWrite(pulseWidth);
  	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//select the correct motor to route the pwm signal to via the multiplexer
function selectMotor(i){
  	S0.digitalWrite((i & 1) ? 1 : 0);
  	i >>= 1;
  	S1.digitalWrite((i & 1) ? 1 : 0);
  	i >>= 1;
  	S2.digitalWrite((i & 1) ? 1 : 0);
}
