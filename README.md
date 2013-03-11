colorCurve.JS
==========

A javascript [color curve] (http://en.wikipedia.org/wiki/Curve_(tonality)) editor component 

The idea is to recreate the Color curves editor from Photoshop/Gimp but in Javascript.
The javascript code is based in GIMP curves code, so is have some improvement over the Adobe Photoshop's one.

# How do I use colorcurve.js? #
Just include ColorCurve.min.js on your page and create a canvas for the curve.
The canvas for the curve *should be square (same width and height)*

```html
<script src="../src/ColorCurve.min.js" />
...
<canvas id="Curve" height="256" width="256"></canvas>   
...
```

Then, when page is loaded you should init the curve passing the name of canvas as a parameter
and the callback function to call when the curve is modified.

```javascript
var Curve
Curve = new ColorCurve('Curve', function(){  console.log('Curve modified');  });
```

Into the callback function you can access the values directly from the curve.
The values are in 0-255 format

```javascript
var Curve
Curve = new ColorCurve('Curve', function() { 
	console.log(curve.rgb[0]);
});
```

# Running the included example #
The project includes an example of three curves modifying the RGB channels of an image.
To run the example in Chrome you need to put the html and scripts into a webserver.
If you execute the example directly without a server, Chrome raises a security exception loading the image.

# TODO #
- Put the script in an properly namespace
- Raise exceptions when errors occur
- draw an historygram in the canvas
- Try to turn it into a JQuery plug-in 
