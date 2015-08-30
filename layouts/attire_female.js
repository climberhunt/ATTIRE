/*
 * ATTIRE Female Garment Model creation script
 *
 * www.ATTIRE.ie
 *
 * 2015 David Hunt
 * 
 * Derived from an example script by Micah Elizabeth Scott
 */

var model = []
var scale = -1 / 8.0;
var centerX = 31 / 2.0;
var centerY = 15 / 2.0;

function toRad (degrees) {
	return (degrees * 2 * Math.PI / 180);
}


function grid16x12(index, x, y) {
	for (var v = 0; v < 12; v++) {
		for (var u = 0; u < 16; u++) {
			var px = (v & 1) ? (x+15-u) : (x+u);
			var py = y + v;
			model[index++] = {
				point: [  (px - centerX) * scale, 0, (py - centerY) * scale ]
			};
		}
	}
	return index;
}

var HIP=20;

function hip(index, x, y, flip, angle) {
	var v;
	var u;
	var px, py, rx, ry;
	var add;
	var radians;

	radians = angle * Math.PI / 180;

	for (v = 0; v < 8; v++) {
		add = 0;
		if ((v==3)||(v==6)){
			index &= ~0x3f; // once we've a few rows done,
			index += 64;	// skip to the next channel
		}
		for (u = 0; u < HIP; u++) {
			if ((v<2)&&(u==0)) { u = 3; add = 3; }
			if ((v<4)&&(u==0)) { u = 2; add = 2; }
			if ((v<6)&&(u==0)) { u = 1; add = 1; }
			// Direction of data line for each strip can't 
			// simply be zig-zag, needs to be hardcoded for 
			// each channel, so the first LED is at the top.
			// There are three channels in this segment.
			// channels 0,2,3,5,6 go down, the rest go up.
			switch (v) {
				case 0:
				case 2:
				case 3:
				case 5:
				case 6:
					if (flip)
						rx = HIP-((HIP-1)-u+add);
					else
						rx = ((HIP-1)-u+add);
					break;
				default:
					if (flip)
						rx = HIP-(u);
					else
						rx = (u);
					break;
			}
			ry = v;
			px = rx * Math.cos(radians) -  ry * Math.sin(radians);
			py = rx * Math.sin(radians) +  ry * Math.cos(radians);
			px += x;
			py += y;
			model[index++] = {
				point: [  (px - centerX) * scale, 0, (py - centerY) * scale ]
		   };
		}
	}
	return index;
}

function triangle(index, x, y, flip, angle) {
	var v;
	var u;
	var px, py, rx, ry;
	var add;
	var radians;
	var len;

	radians = angle * Math.PI / 180;

	for (v = 0; v < 7; v++) {
		add = 0;
		switch(v) {
			case 0:
			   len = 2;
			   break;
			case 1:
			   len = 3;
			   break;
			case 2:
			   len = 5;
			   break;
			case 3:
			   len = 6;
			   break;
			case 4:
			   len = 8;
			   break;
			case 5:
			   len = 9;
			   break;
			case 6:
			   len = 11;
			   break;
			case 7:
			   len = 12;
			   break;
		}
		for (u = 0; u < len; u++) {
			rx = (v & 1) ? len-((len-1)-u+add) : len-(u);
			rx -= Math.round((v+1)/2);
			ry = v;
			if (flip) {
				rx = 16 - rx;
			}
		px = rx * Math.cos(radians) -  ry * Math.sin(radians);
		py = rx * Math.sin(radians) +  ry * Math.cos(radians);
			px += x;
			py += y;
			model[index++] = {
				point: [  (px - centerX) * scale, 0, (py - centerY) * scale ]
		   };
		}
	}
	return index;
}

function shoulder(index, x, y, flip, angle) {
	var v;
	var u;
	var px, py;
	var rx, ry;
	var radians;

	radians = angle * Math.PI / 180;


	for (v = 0; v < 4; v++) {
//		if ((v==2)){
//			index &= ~0x3f; // once we've a few rows done,
//			index += 64;	// skip to the next channel
//		}
		for (u = 0; u < 13; u++) {
			switch (v) {
				case 0:
				case 2:
					ry = u;
					break;
				default:
					ry = 12-u;
					break;
			}
			rx = v;
			if (flip) {
				rx = (13-rx);
			}
		px = rx * Math.cos(radians) -  ry * Math.sin(radians);
		py = rx * Math.sin(radians) +  ry * Math.cos(radians);
			px += x;
			py += y;
			model[index++] = {
				point: [  (px - centerX) * scale, 0, (py - centerY) * scale ]
			};
		}
	}
	return index;
}


function strip(index, length, x, y, angle) {
	var v;
	var u;
	var px, py;
	var radians;

	radians = angle * Math.PI / 180;

	for (v = 0; v < length; v++) {
	px = 0 * Math.cos(radians) -  v * Math.sin(radians);
	py = 0 * Math.sin(radians) +  v * Math.cos(radians);
		px += x;
		py += y;
		model[index++] = {
			point: [  (px - centerX) * scale, 0, (py - centerY) * scale ]
		};
	}
	return index;
}


var index = 0;
next = 0;
index = 0;

// Two bottom grids
hip(next,  0, 8, 1, 45);
next += 128+64;
hip(next, 18, 22.3, 0, -45);
next += 128+64;

// Triangles under the arms
triangle(next, -9.0, -1, 1, 0);
next += 64;
triangle(next, 24, -1, 0, 0);
next += 64;

// Shoulders
shoulder(next, -4, -13.5, 1, -10);
next += 64;
shoulder(next, 22, -16, 0, 10);
next += 64;

// Left side of diamond
index = strip(next, 10, 14.5  , -1.9, 20.0);
index = strip(index, 12, 11.5, 8, 340.0);
next += 64;

// Strip down the middle. 
//index = strip(next, 16, 16, 14,  180.0);
//next += 64;

// Right side of diamond
index = strip(next, 10, 16.5  , -2, 340.0);
index = strip(index, 12, 19.5, 8,  20.0);
next += 64;

// Looks like these horizontal strips around the waist got dropped. 
//strip(next, 16, 10, 6,  90);
//next += 64;
//strip(next, 16, 22, 6,  270);
//next += 64;

console.log(JSON.stringify(model));
