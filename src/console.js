const sdk = require('./sdk');
const Obniz = sdk.Obniz;
const EVENTS = sdk.EVENTS;
const obniz = new Obniz("1438-0083", 5, 6, 0);


obniz.client.onconnect = () => {
  obniz.startSendingSensorsData()
}
obniz.registerCallback(EVENTS.CALLBACK_DATA1, (data) =>{
  console.log(data);
  obniz.stopSendingData();
} )



/*obniz.startSendingSensorsData(50);
obniz.registerCallback(whill.EVENTS.CALLBACK_DATA1, (data) => {
  console.log(data);
});*/
