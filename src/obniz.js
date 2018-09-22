const Obniz = require("obniz");
const ClientBase  = require('./client').Client;
const CommandsBase = require('./command').Commands;

class Client extends ClientBase {
  constructor (obniz_id, tx=0, rx=1, gnd=5){
    super();
    let uartdata = {tx, rx, gnd};

    uartdata.baud = this.uartdata.baud;
    uartdata.stop = this.uartdata.stop;
    this._connectCallbacks = [];
    this.obniz = new Obniz(obniz_id);
    this.obniz.onconnect = async () => {
      this.uart =  this.obniz.getFreeUart();
      this.uart.start(uartdata);
      this.obniz.io1.output(true);
      this.onconnect(this.obniz);

    }




  }
  onconnect(obniz){

  }
  _send(payload){
    this.uart.send(payload)
  }
  _startRecieve(callback){

    this.uart.onreceive = callback
  }
  stopRecieve(){
    this.uart.onreceive = null;
  }
}

class Commands extends CommandsBase {
  constructor (obniz_id, tx=0, rd=1 ){
    super();
    let client = new Client(obniz_id, tx, rd);
    this.setClient(client);
  }

}

module.exports.Commands = Commands;
