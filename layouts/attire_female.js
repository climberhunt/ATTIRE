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


// Grid of 16x12. 12 strips containing 16 leds each. 
function grid16x12(index, x, y) {
    // Instance of a zig-zag 8x8 grid with upper-left corner at (x, y)
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

function grid12x8(index, x, y, flip, angle) {
    // Instance of a zig-zag 8x8 grid with upper-left corner at (x, y)
    var v;
    var u;
    var px, py, rx, ry;
    var add;
    var radians;

    radians = angle * Math.PI / 180;

    for (v = 0; v < 8; v++) {
        add = 0;
        for (u = 0; u < 16; u++) {
            if ((v<2)&&(u==0)) { u = 3; add = 3; }
            if ((v<4)&&(u==0)) { u = 2; add = 2; }
            if ((v<6)&&(u==0)) { u = 1; add = 1; }
            if (flip) {
                rx = (v & 1) ? 16-(15-u+add) : 16-(u);
            } else {
                rx = (v & 1) ? (15-u+add) : (u);
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

function triangle2(index, x, y, flip, angle) {
    // Instance of a zig-zag 8x8 grid with upper-left corner at (x, y)
    var v;
    var u;
    var px, py, rx, ry;
    var add;
    var radians;
    var len;

    radians = angle * Math.PI / 180;

    for (v = 0; v < 8; v++) {
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
    // Instance of a zig-zag 8x8 grid with upper-left corner at (x, y)
    var v;
    var u;
    var px, py;
    var rx, ry;
    var radians;

    radians = angle * Math.PI / 180;


    for (v = 0; v < 6; v++) {
        for (u = 0; u < 16; u++) {
            ry = (v & 1) ? (15-u) : (u);
            rx = v;
            if (flip) {
                rx = (16-rx);
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


function triangle(index,x,y, mirror) {
    var v;
    var u;
    var px, py;

    for (v = 8; v > 1; v--) {
        for (u = 0; u < v; u++) {
            if (mirror) {
                px = (v & 1) ? (x+(v-1)-u) : (x+u);
            } else {
                px = 8 - ((v & 1) ? (x+(v-1)-u) : (x+u));
            }
            //px = x + u;
            py = y + v;
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


// Eight zig-zag grids
var index = 0;
//for (var v = 1; v < 2; v++) {
//    for (var u = 1; u < 2; u++) {
//        grid16x12(index, u*18, v*14);
//        index += 192;
//    }
//}

next = 0;

// Two bottom grids
next = grid12x8(next,  3.6, 8, 1, 45);
next = 128;
next = grid12x8(next, 17.0, 19, 0, -45);
next = 256;

// Triangles under the arms
next = triangle2(next, 25.0, -3, 0, 0);
next = 256+128;
next = triangle2(next, -10.0, -3, 1, 0);
next = 512;


//next = triangle(next, -10, -5, 0);
//next = triangle(next, 28, -5, 1);

// Shoulders
next = 512+128;
next = shoulder(next, 5, -21, 0, 20);
next = 512+256;
next = shoulder(next, 11, -16, 1, 340);

// Left side of diamond
next = 1024;
next = strip(next, 8, 15  , 0, 20.0);
next = strip(next, 8, 12.5, 7.5, 340.0);
next = strip(next,12, 15  ,15, 20.0);

// Right side of diamond
next = 1024+64;
next = strip(next, 8, 17  , 0, 340.0);
next = strip(next, 8, 19.5, 7.5,  20.0);
next = strip(next,12, 17  ,15, 340.0);

// Strip down the middle. 
next = 1024+128;
next = strip(next, 16, 16, -1,  0.0);

next = 1024+128+64;
next = strip(next, 16, 10, 6,  90);
next = 1024+256;
next = strip(next, 16, 22, 6,  270);




console.log(JSON.stringify(model));
