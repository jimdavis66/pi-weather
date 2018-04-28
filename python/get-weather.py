from sense_hat import SenseHat

sense = SenseHat()
temp = sense.get_temperature()
humidity = sense.get_humidity()
pressure = sense.get_pressure()
# Temperature in Degrees Celcius
print(sense.temp)
# Humidity in percentage
print(sense.humidity)
# Pressure in Millibars
print(sense.pressure)
