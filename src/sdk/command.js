
const PARSER_CLASS = require('./parser').Parser
const EVENTS = require('./events')

class Commands {
  constructor(parser_class=PARSER_CLASS) {

    this.callbacks = {};
    this.parser = new parser_class(this);



  }
  setClient(client){
    this.client = client;
  }
  _startRecieve(){

    this.client.startRecieve((data) => {

        this.parser.parseData(data)
      },
      (data) => {

        this.fireCallback(EVENTS.INVALIT_DATA, data)
      }
    )

  }
  _stopRecieve(){
    this.client.stopRecieve()
  }

  startSendingSpeedProfiles( interval_ms, speed_mode=5){
    let payload = [0x00,  //Start Sending Data
                    0x00,  //Data0 (Speed profiles)
                    interval_ms<<8 & 0xFF,
                    interval_ms<<0 & 0xFF,
                    speed_mode];
    this.client.send(payload);
    this._startRecieve();

  }

  startSendingSensorsData(interval_ms){
    let payload = [0x00,   //Start Sending Data
                    0x01,   //Data1  (Sensors)
                    interval_ms<<8 & 0xFF,
                    interval_ms<<0 & 0xFF,
                    0x00];
    this.client.send(payload);
    this._startRecieve();

  }

  stopSendingData(){
    let payload = [0x01];  // Stop Sending Data
    this.client.send(payload)
    this._stopRecieve();
  }

  setPower(power){
    let payload = [0x02,
                   power ? 0x01 : 0x00];
    this.client.send(payload)
  }

  setJoystick(x, y){


    let payload = [0x03,
                   0x00,   // Enable Host control
                   y,
                   x];
    this.client.send(payload, Int8Array);
  }
  releaseJoystick(){


    let payload = [0x03,
                   0x01,   // Enable Joystick control
                   0x00,
                   0x00];
    this.client.send(payload, Int8Array);
  }

  setSpeedProfile( profile,speed_mode){
     let payload = [0x04,
                    profile.forward_spped || 0,
                    profile.forward_acceleration || 0,
                    profile.forward_deceleration || 0,
                    profile.reverse_speed || 0,
                    profile.reverse_acceleration || 0,
                    profile.reverse_deceleration || 0,
                    profile.turn_speed || 0,
                    profile.turn_acceleration || 0,
                    profile.turn_deceleration || 0];
    this.client.send(payload)
  }


  setBatteryVoltaegeOut(enable){
    let payload = [0x05,
                  enable ? 0x01 : 0x00];
    this.client.send(payload);
  }
  registerCallback(name, callback){
    let callbacks = this.callbacks[name] || [];
    callbacks.push(callback);
    this.callbacks[name] = callbacks;

  }
  fireCallback(name, params){
    const callbacks = this.callbacks[name] || [];
  
    for (let callback of callbacks) {
      callback(params);
    }

  }


}
module.exports.Commands = Commands;
