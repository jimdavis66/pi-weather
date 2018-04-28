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

  // Log BOM weather data to InfluxDB
  got('http://reg.bom.gov.au/fwo/IDN60901/IDN60901.94767.json', { json: true }).then(response => {
    influx.writePoints([
      {
        measurement: 'bom_syd_airport',
        fields: {
          apparent_t: response.body.observations.data[0].apparent_t,
          cloud: response.body.observations.data[0].cloud,
          cloud_type: response.body.observations.data[0].cloud_type,
          gust_kmh: response.body.observations.data[0].gust_kmh,
          air_temp: response.body.observations.data[0].air_temp,
          dewpt: response.body.observations.data[0].dewpt,
          press: response.body.observations.data[0].press,
          rel_hum: response.body.observations.data[0].rel_hum,
          wind_dir: response.body.observations.data[0].wind_dir,
          wind_spd_kmh: response.body.observations.data[0].wind_spd_kmh
        },
        tags: { host: 'localhost', app: 'pi-weather' }
      }
    ])
    .catch(err => {
      console.error(`Error writing points: ${err}`);
    })
  })
  .catch(error => {
    console.log(error.response.body);
  });


//});
