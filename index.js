const express = require('express');
const  app = express();
const  port = process.env.PORT || 3000;
const router = express.Router();
const routes = require('./routes/routes');
const  bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);
console.log ("Program execution has ended successfully!");
app.listen(port, function(){ console.log('Node server listening on port ' + port);});
