const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const model = require('./model');
const nemdb = model.nemdb;

// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// bodyParserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// ポート指定
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api', (req, res) => {
  nemdb.find({}, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(port);
console.log(`Server is started on port ${port}`);
