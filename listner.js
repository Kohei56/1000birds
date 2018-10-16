//import {Address, ConfirmedTransactionListener, NEMLibrary, NetworkTypes} from "nem-library";
const nemlibrary = require('nem-library');
const Address = nemlibrary.Address;
const ConfirmedTransactionListener = nemlibrary.ConfirmedTransactionListener;
const NEMLibrary = nemlibrary.NEMLibrary;
const NetworkTypes  = nemlibrary.NetworkTypes;

//import { nemdb } from './model';
const model = require('./model');
const nemdb = model.nemdb;

console.log('Start Transaction Listening');

NEMLibrary.bootstrap(NetworkTypes.TEST_NET); // TestNetへの接続
const address = new Address("TDSPP6QU3TMGI7AMSPPCBJQ7TU37ABGMLTH73CEH");
const confirmedTransactionListener = new ConfirmedTransactionListener([
  {
    domain: '104.128.226.60'
  },
]).given(address);
confirmedTransactionListener.subscribe(res => {
    const nemDocument = new nemdb({
      xem: res._xem.quantity,
      message: res.message.payload
    });

    // MongoDBにドキュメントを保存する
    nemDocument.save((err) => {
      if (err) throw err;
    });

    console.log(res);
    console.log(res.message.payload); //メッセージ
    console.log(res._xem.quantity); //入金額
}, err => {
    console.log(err);
});