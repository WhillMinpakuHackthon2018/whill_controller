
const EVENTS = require('./EVENTS');
class Parser{
  constructor (command) {
    this.command = command
  }

  parseData(data){
    let dataview;

    if(ArrayBuffer.isView(data) === false){
      let buffer = new ArrayBuffer(data.length);
      dataview = new DataView(buffer);
      let writer = new Uint8Array(buffer);
      writer.set(data);
    }
    else{
      dataview = new DataView(data.buffer);

    }
    let datatype = dataview.getUint8(0);
    let view =  new DataView(dataview.buffer, 1);

    switch(datatype){  // Read Command ID

        case 0x00:   // Data set 0

          this.parseDataset0(view);
          break;

        case 0x01:   // Data set 1
          this.parseDataset1(view);
          break;

        case 0x52:   // Response of power WHILL on.

          client.fire_callback(EVENTS.CALLBACK_POWER_ON);



        default:
          return -1;  // Unknown Command
    }

    return 0;

  }


  parseDataset0(view){
    let result = {}
    result.speed_mode = view.getUint8(0)
    result.forward_speed = view.getUint8(1)
    result.forward_acceleration = view.getUint8(2)
    result.forward_deceleration = view.getUint8(3)
    result.reverse_speed = view.getUint8(4)
    result.reverse_acceleration = view.getUint8(5)
    result.reverse_deceleration = view.getUint8(6)
    result.turn_speed = view.getUint8(7)
    result.turn_acceleration = view.getUint8(8)
    result.turn_deceleration = view.getUint8(9)

    this.command.fireCallback(EVENTS.CALLBACK_DATA0, result);
  }

  parseDataset1(view){
    let results = {};

    results.acceleration = {};
    results.acceleration.x = view.getInt8(0, 1) * 0.122
    results.acceleration.y = view.getInt8(2, 3) * 0.122
    results.acceleration.z = view.getInt8(4, 5) * 0.122

    results.gyro = {}
    results.gyro.x = view.getInt8(6, 7) * 4.375
    results.gyro.y = view.getInt8(8, 9) * 4.375
    results.gyro.z = view.getInt8(10, 11) * 4.375

    results.joy = {}
    results.joy.front = view.getUint8(12)
    results.joy.side = view.getUint8(13)

    results.battery = {}
    results.battery.level = view.getInt8(14)
    results.battery.current = view.getInt8(15, 16) * 2.0

    results.right_motor = {};
    results.left_motor = {}
    results.right_motor.angle = view.getInt8(17, 18) * 0.001
    results.left_motor.angle = view.getInt8(19, 20) * 0.001
    results.right_motor.speed = view.getInt8(21, 22) * 0.004
    results.left_motor.speed = view.getInt8(23, 24) * 0.004

    results.power_status = view.getUint8(25)
    results.speed_mode_indicator =view.getUint8(26)
    results.error_code = view.getUint8(27)

    this.command.fireCallback(EVENTS.CALLBACK_DATA1, results);
  }


}
module.exports.Parser = Parser;
