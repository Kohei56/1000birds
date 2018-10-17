const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const model = require('./model');
const nemdb = model.nemdb;

// ミドルウェア
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// ポート指定
const port = process.env.PORT || 3000;

// ルーティング
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

router.get('/api', (req, res) => {
  nemdb.find({}, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.use('/', router);
app.listen(port);
console.log(`Server is started on port ${port}`);
