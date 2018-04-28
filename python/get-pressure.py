from sense_hat import SenseHat

sense = SenseHat()
pressure = sense.get_pressure()
# Pressure in Millibars
print(sense.pressure)
