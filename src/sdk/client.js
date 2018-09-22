

const PROTOCOL_SIGN = 0xAF;
const UARTDATA = {'baud':38400, 'bits':8, 'stop':2}

const getCalculatedCS = (payload, len) =>{
  let cs = 0x00;

  cs ^= PROTOCOL_SIGN;
  cs ^= len;

  for(let value of payload){
    cs ^= value;
  }

  return cs;

}

class Client {
  constructor (){

    this.uartdata = UARTDATA

  }
  startRecieve(onrecieve, oninvaliddata){

    this.onrecieve = onrecieve;
    this.oninvaliddata = oninvaliddata;

    this._startRecieve((data)=>{

      let sign_index = data.indexOf(PROTOCOL_SIGN);
      if(sign_index === -1){
        this.oninvaliddata(data);

      }

      let dat = data.slice(sign_index);

      if(this._validateData(dat) === false){

        this.oninvaliddata(data);
      }
      else{

        this.onrecieve(dat.slice(2, data.length - 1))

      }
    })
  }
  _startRecieve(callback){

  }
  send(payload, datatype=Uint8Array){
    let len = this._getRawLength(payload);
    let cs = this._getCalculatedCS(payload, len);

    payload.unshift(PROTOCOL_SIGN);
    payload.unshift(len);
    payload.push(cs);
    let pld = new datatype(payload);

    this._send(pld);
  }
  _validateData(data){

    if(data[0] != PROTOCOL_SIGN){

      return false;
    }


    let cs = this._getCalculatedCS(data.slice(2, data.length - 1), data[1]);

    return cs === data[data.length - 1]
  }
  _send(payload){


  }
  _getRawLength(payload){
    return payload.length +1;


  }
  _getCalculatedCS(payload, len){
    return getCalculatedCS(payload, len);
  }

}

module.exports.Client = Client
module.exports.PROTOCOL_SIGN = PROTOCOL_SIGN;
module.exports.getCalculatedCS = getCalculatedCS
