console.log("If module not found, install express globally `npm i express -g`!");
// ##
// require
const Gun = require('gun');
const express = require('express');
const Schedule = require('node-schedule');

// ##
// Gun Server Port
const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8080;

// ##
// Config: express
const app = express();
app.use(Gun.serve);
app.use(express.static(__dirname));
app.use('node_modules', express.static('node_modules'));

// ##
// Config: Gun
const server = app.listen(port);
const gun = Gun({file: 'data.json', web: server});

// ##
Schedule.scheduleJob('*/1 * * * * *', () => {
  gun.get('heartbeat').put({
    heartbeat: new Date().getTime(),
  });
});

console.log('Server started on port ' + port + ' with /gun');
