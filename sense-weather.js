const schedule = require('node-schedule');
const cmd = require('node-cmd');
const got = require('got');
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
   },
   {
     measurement: 'bom_syd_airport',
     fields: {
       apparent_t: Influx.FieldType.FLOAT,
       cloud: Influx.FieldType.STRING,
       cloud_type: Influx.FieldType.STRING,
       gust_kmh: Influx.FieldType.INTEGER,
       air_temp: Influx.FieldType.FLOAT,
       dewpt: Influx.FieldType.INTEGER,
       press: Influx.FieldType.FLOAT,
       rel_hum: Influx.FieldType.INTEGER,
       wind_dir: Influx.FieldType.STRING,
       wind_spd_kmh: Influx.FieldType.INTEGER
     },
     tags: [
       'host',
       'app'
     ]
   }
 ]
});

// Schedule to run every 30 minutes
//var scheduledJob = schedule.scheduleJob('*/30 * * * *', () => {


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

//});
