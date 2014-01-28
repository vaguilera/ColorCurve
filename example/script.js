var Filter = Filter || {}; // To encapsulate the image and the filter applied when you modify the curves
var CC1,CC2,CC3; //  To store the 3 colorcurve components

// Load images in both canvas
// We need 2 canvas. one to store the original image and the second one, to show the modified image
Filter.Init = function(img) 
{
  
  var c = document.getElementById('CvOriginal');
  c.style.display = 'none';  
  var ctx = c.getContext('2d');
  ctx.drawImage(img,0,0);
  
  var imageData = ctx.getImageData(0,0, c.width,c.height);
  
  this.numPixels = imageData.width * imageData.height;
  this.originalPixels = imageData.data; 

  var c = document.getElementById('CvModified');
  var ctx = c.getContext('2d');
  ctx.drawImage(img,0,0);

  this.canvas = document.getElementById('CvModified');
  this.ctx = this.canvas.getContext('2d');
  
  
}


Filter.applyFilter = function() {

  if (CC1 == undefined || CC2 == undefined || CC3 == undefined ) return;

  var imageData = this.ctx.getImageData(0,0, this.canvas.width,this.canvas.height);
  var pix = imageData.data; 

  // We get the corresponding value for every pixel in the image using the rgb array from every colorcurve
  for (var i = 0; i < Filter.numPixels; i++) { 
     
      /*R*/ pix[i*4]   = CC1.rgb[Filter.originalPixels[i*4]];  
      /*G*/ pix[i*4+1] = CC2.rgb[Filter.originalPixels[i*4+1]];  
      /*B*/ pix[i*4+2] = CC3.rgb[Filter.originalPixels[i*4+2]];
    
    }

  Filter.ctx.putImageData(imageData, 0, 0);

}


function start() {
  
  var imageObj = new Image();
  imageObj.src = 'image.jpg';
  imageObj.onload = function() {    
    
    try {
      
      Filter.Init(imageObj);

    } catch (err) {
      
      console.log(err.message);
      document.getElementById('error').style.display = 'block';
      return;
    
    }
    
    CC1 = new ColorCurve('selectorR', function(){ Filter.applyFilter();     });
    CC2 = new ColorCurve('selectorG', function(){ Filter.applyFilter();     });
    CC3 = new ColorCurve('selectorB', function(){ Filter.applyFilter();     });
  };


 
}




