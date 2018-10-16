//import mongoose from 'mongoose';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// スキーマ
const nemdbSchema = new Schema({
  xem: Number,
  message: String
}, {
  collection: 'nemcol'
});

// MongoDBへの接続
const databaseName = 'nemdb';
const databasePath = `mongodb://localhost/${databaseName}`;
mongoose.connect(databasePath, {useNewUrlParser: true});

// モデルのエクスポート
//export const nemdb = mongoose.model(databaseName, nemdbSchema);
exports.nemdb = mongoose.model(databaseName, nemdbSchema);
