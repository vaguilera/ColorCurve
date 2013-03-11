var Filters = Filters || {};

Filters.pixels = [];
var CC1,CC2,CC3;

Filters.Init = function(img) 
{
  var c = document.getElementById('CvOriginal');
  c.style.display = 'none';  
  var ctx = c.getContext('2d');
  ctx.drawImage(img,0,0);
  
  var imageData = ctx.getImageData(0,0, c.width,c.height);
  Filters.numPixels = imageData.width * imageData.height;
  Filters.pixels = imageData.data; 

  var c = document.getElementById('CvModified');
  var ctx = c.getContext('2d');
  ctx.drawImage(img,0,0);

  this.canvas = document.getElementById('CvModified');
  this.ctx = Filters.canvas.getContext('2d');
  
  
}


Filters.getPixels = function(filter) {

  var imageData = this.ctx.getImageData(0,0, this.canvas.height,this.canvas.width);
  var pix = imageData.data; 

  filter(Filters.pixels,pix);
  Filters.ctx.putImageData(imageData, 0, 0);

}

Filters.ApplyFilter = function(idatasource, idataout) {
  

  if (CC1 == undefined || CC2 == undefined || CC3 == undefined) return;  
  for (var i = 0; i < Filters.numPixels; i++) { 
      idataout[i*4] = CC1.rgb[idatasource[i*4]];  
      idataout[i*4+1] = CC2.rgb[idatasource[i*4+1]];  
      idataout[i*4+2] = CC3.rgb[idatasource[i*4+2]];
    }
}


function start() {
  var imageObj = new Image();
  imageObj.src = 'image.jpg';
  imageObj.onload = function() {    
    Filters.Init(imageObj);
    CC1 = new ColorCurve('selectorR', function(){ Filters.getPixels(Filters.ApplyFilter);     });
    CC2 = new ColorCurve('selectorG', function(){ Filters.getPixels(Filters.ApplyFilter);     });
    CC3 = new ColorCurve('selectorB', function(){ Filters.getPixels(Filters.ApplyFilter);     });
  };


 
}




