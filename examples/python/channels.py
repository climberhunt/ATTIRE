#!/usr/bin/env python

# Light each channel block in sequence, and repeat.
# 64 LEDS in each channel, by 16 channels

import opc, time

numLEDs = 64
numChannels = 16
client = opc.Client('localhost:7890')

while True:
	for j in range(numChannels):
		print "Channel " + str(j+1)
		pixels = [ (0,0,0) ] * numLEDs * numChannels
		for i in range(numLEDs):
			pixels[i+j*64] = (255, 255, 255)
		client.put_pixels(pixels)
		time.sleep(1)
		for i in range(numLEDs):
			pixels[i+j*64] = (0, 0, 0)
		client.put_pixels(pixels)





