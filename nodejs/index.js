const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/webhook', (req, res) => {

  request.get('/int-rates.json', options, function (err, result, body) {
    if (result.statusCode === 200) {
      var data =body;
      var parameters = req.body.result.parameters;

      var bankname = parameters['bank-name'];
      var amount = parameters['amount'];
      var senior = parameters['senior'];
      var duration = parameters['duration'];
      var durationInDays = 0;

      //converting into days as our data is in days
      if (duration['unit'] == 'mo') {
        durationInDays = duration['amount'] * 30;
      }
      else if (duration['unit'] == 'yr') {
        durationInDays = duration['amount'] * 365;
      }
      else if (duration['unit'] == 'day') {
        durationInDays = duration['amount'];
      }

      var bankdata = data[bankname];
      var intRates = '';
      bankdata.foreach(function (item, index) {
        if (durationInDays <= item['DatesEnd']) {
          if (senior.toLowerCase() == 'true')
            intRates = item['senior'];
          else
            intRates = item['normal'];
          break;
        }
      });

      var speechText = 'The interest rate for ' + bankname + ' for a period of ' + duration['amount'] + ' ' + duration['unit'] + ' is ' + intRates;

      res.status(200).json({
        speech: speechText,
        displayText: speechText,
        source: 'Bank Website'
      });
    }
  });
});

const server = app.listen(process.env.PORT || 8081, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});