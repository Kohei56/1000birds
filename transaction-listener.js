//import {Address, ConfirmedTransactionListener, NEMLibrary, NetworkTypes} from "nem-library";
require('date-utils');
const nemlibrary = require('nem-library');
const Address = nemlibrary.Address;
const ConfirmedTransactionListener = nemlibrary.ConfirmedTransactionListener;
const NEMLibrary = nemlibrary.NEMLibrary;
const NetworkTypes  = nemlibrary.NetworkTypes;

//import { nemdb } from './model';
const model = require('./model');
const nemdb = model.nemdb;

NEMLibrary.bootstrap(NetworkTypes.TEST_NET); // TestNetへの接続
const address = new Address('TDSPP6QU3TMGI7AMSPPCBJQ7TU37ABGMLTH73CEH');
const confirmedTransactionListener = new ConfirmedTransactionListener([
  {
    domain: '104.128.226.60'
  },
]).given(address);
confirmedTransactionListener.subscribe(res => {
  // xem
  const xem = res._xem.quantity / 1000000;

  //　lat, lng, message
  const payload = new Buffer(res.message.payload, 'hex').toString('utf8');
  const latlng = payload.match(/#(\d{2,3}\.\d{6}),(\d{2,3}\.\d{6})/);
  if(latlng == null){
    var lat = 0;
    var lng = 0;
    var message = payload;
  } else {
    var lat = latlng[1];
    var lng = latlng[2];
    var message = payload.replace(latlng[0], '').trim();
  }

  // date
  const date = new Date().toFormat('YYYY/MM/DD HH24:MI');

  const nemDocument = new nemdb({
    date: date,
    xem: xem,
    lat: lat,
    lng: lng, 
    message: message
  });

  // MongoDBにドキュメントを保存する
  nemDocument.save((err) => {
    if (err) throw err;
  });

  console.log(`date: ${date}`);
  console.log(`xem: ${xem}`);
  console.log(`lat: ${lat}`);
  console.log(`lng: ${lng}`);
  console.log(`message: ${message}`);
//  console.log(res);
//  console.log(res.message.payload); //メッセージ
//  console.log(res._xem.quantity); //入金額
}, err => {
  console.log(err);
});

console.log('Transaction Listener is started');