#!/usr/bin/env python

# Light each LED in each channel, and repeat.
# The first LED in each channel is kept white, to allow us to see
# if it's in the most convenient place for wiring the garment. 

import opc, time

numLEDs = 64
numChannels = 16
client = opc.Client('localhost:7890')

while True:
	for i in range(numLEDs):
		pixels = [ (0,0,0) ] * numLEDs * numChannels
		for j in range(numChannels):
			pixels[j*64] = (255, 255, 255)
			pixels[i+j*64] = (255, 0, 0)
		client.put_pixels(pixels)
		time.sleep(0.05)





