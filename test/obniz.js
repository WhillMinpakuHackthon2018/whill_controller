let mock = require('mock-require');
let OBNIZ_ID;
let TX;
let RD;
let UARTDATA;
let ONCONNECT;
let ONRECIEVE;

class Mock {
  constructor(obniz_id, tx, rd){
    OBNIZ_ID = obniz_id;
    TX = tx;
    RD = rd;
  }
  getFreeUart(){
    return new MockUart();
  }
  set onconnect (onconnect) {

    ONCONNECT = onconnect;

  }

}
class MockUart{
  start(uartdata){
    UARTDATA = uartdata;


  }
  send(){

  }
  set onreceive(callback){
    ONRECIEVE = callback;
  }

}

mock('obniz', Mock);


const whill = require('../index');
var assert = require('assert');
describe('obniz test', ()=> {
  describe('constructor', () =>{
    it('should set obniz_id, tx, rd', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();

    });
    it('should command startSendingSpeedProfiles is valid', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();
        obniz.startSendingSpeedProfiles(100);

    });
    it('should command startSendingSensorsData is valid', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();
        obniz.startSendingSensorsData(100);

    });
    it('should command stopSendingData is valid', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();
        obniz.startSendingSensorsData(100);

    });
    it('should command setPower is valid', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();
        obniz.setPower(false);

    });
    it('should command setJoystick is valid', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();
        obniz.setJoystick(-1, 1);

    });
    it('should command releaseJoystick is valid', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();
        obniz.releaseJoystick();

    });
    it('should accept SpeedProfiles', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();
        obniz.startSendingSpeedProfiles(100);
        obniz.registerCallback(whill.EVENTS.CALLBACK_DATA0, (data) => {
          console.log(data);
        });

        let response = [0x00,0,1,2,3,4,5,6,7,8,9,10];
        let len = 11;
        let cs = whill.getCalculatedCS(response, len);

        response.unshift(len);
        response.unshift(whill.PROTOCOL_SIGN);

        response.push(cs);
        ONRECIEVE(response);



    });
    it('should accept SensorsData', ()=> {
        let obniz = new whill.Obniz('1234');
        ONCONNECT();
        obniz.startSendingSpeedProfiles(100);
        obniz.registerCallback(whill.EVENTS.CALLBACK_DATA1, (data) => {
          console.log(data);
        });

        let response = [0x01]
        for (var i = 0; i < 28; i++) {
          response.push(i)
        }
        let len = 29;
        let cs = whill.getCalculatedCS(response, len);

        response.unshift(len);
        response.unshift(whill.PROTOCOL_SIGN);

        response.push(cs);
        ONRECIEVE(response);



    });
  });
});
