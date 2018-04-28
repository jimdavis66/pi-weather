from sense_hat import SenseHat

sense = SenseHat()
humidity = sense.get_humidity()
# Humidity in percentage
print(sense.humidity)
