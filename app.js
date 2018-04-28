const schedule = require('node-schedule');
const cmd = require('node-cmd');
const Influx = require('influx');
const influx = new Influx.InfluxDB({
 host: 'localhost',
 database: 'pimetrics',
 schema: [
   {
     measurement: 'sense_hat_environmental',
     fields: {
       temp: Influx.FieldType.FLOAT,
       humidity: Influx.FieldType.FLOAT,
       pressure: Influx.FieldType.FLOAT
     },
     tags: [
       'host',
       'app'
     ]
   }
 ]
});

// Schedule to run every minute
var scheduledJob = schedule.scheduleJob('* * * * *', () => {

  // Log Sense HAT weather data to InfluxDB
  cmd.get('/usr/bin/python python/get-weather.py', (err, data, stderr) => {
    if(err) {
      console.log(err);
    } else {
      var weather = data.split('\n');
      influx.writePoints([
        {
            measurement: 'sense_hat_environmental',
            fields: {
              temp: weather[0],
              humidity: weather[1],
              pressure: weather[2]
            },
            tags: { host: 'localhost', app: 'pi-weather' }
        }
      ])
      .catch(err => {
        console.error(`Error writing points: ${err}`);
      });
    }
  });

});
