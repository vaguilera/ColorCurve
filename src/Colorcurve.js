
function ColorCurve(canvas)
{
	this.points 		= [];
	this.currentpoint 	= -1;
	this.c 				= document.getElementById(canvas);
	this.ctx 			= this.c.getContext('2d');
	this.height 		= this.c.height;
	this.width 			= this.c.width;
	this.redraw			= 0;
	this.values			= [];
	this.rgb			= [];

	if (this.height != this.width) {
		console.log("ERROR: Canvas must have same width and height.");
		return;
	}

	this.points.push({x: 0, y: 0});
	this.points.push({x: 0.250, y: 0.250});
	this.points.push({x: 0.750, y: 0.750});
	this.points.push({x: 1.0, y: 1.0});

 	var me = this; // Copying IQ's trick from Graphtoy -- http://www.iquilezles.org
	this.c.onmousedown = function(ev) { me.MouseDown(ev); }
	this.c.onmouseup = function(ev) { me.MouseUp(ev);  me.Draw(); }
	this.c.onmouseout = function(ev) { me.MouseUp(ev);  me.Draw();}
	this.c.onmousemove = function(ev) { 
		me.MouseMove(ev);
		if (me.redraw == 1) {
			me.Draw();
			me.redraw = 0;
		}
	 }

	this.Draw();
	this.UpdateValues();
}

// Update the RGB array to fit the new curve values. Transform curve points to 0..255 values
ColorCurve.prototype.UpdateValues = function()
{
	this.rgb.splice(0, this.rgb.length);	
	for(var i=0;i<256;i++) this.rgb.push(Math.round(this.GetY(i/255.0)*255));

}

// Compare 2 points
ColorCurve.prototype.IsEqual = function(p1,p2)
{
	if (p1.x == p2.x && p1.y == p2.y) return true;
	else return false;
}

// Draw the curve
ColorCurve.prototype.Draw = function() 
{
	this.values.splice(0, this.values.length);
	this.ctx.clearRect(0, 0, this.width, this.height);
	this.DrawGrid();
	
	for(i=0;i<this.points.length-1;i++)
	{
		if (i<1) { 
			p1 = this.points[0];
		} else { 
			p1 = this.points[i-1];
		}	 
		if (i+2 > this.points.length-1) {
			p4 = this.points[i+1];
		} else { 
			p4 = this.points[i+2];
		} 
		this.Quadratic(p1,this.points[i],this.points[i+1],p4);
	}
	this.DrawPoints();
	
}

// The background grid
ColorCurve.prototype.DrawGrid = function() 
{
	var space = this.width/4.0;	

	this.ctx.beginPath();
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = '#aaaaaa';
	
	for(i=0;i<this.height-space;i+=space)
	{
		this.ctx.moveTo(0, i+space); this.ctx.lineTo(this.height, i+space);
	}
	for(i=0;i<this.height-space;i+=space)
	{
		this.ctx.moveTo(i+space, 0); this.ctx.lineTo(i+space, this.height);
	}
	this.ctx.stroke();
}

// Main function. Calculate curve coeficients and draw the curve
// Based on the GIMP source code. http://git.gnome.org/browse/gimp/
ColorCurve.prototype.Quadratic = function(p1,p2,p3,p4)
{
	this.ctx.strokeStyle = '#ffffff'; 
  	this.ctx.lineWidth = 1.5;
  	var slope = 0;

	x0 = p2.x;
	x3 = p3.x;

	y0 = p2.y;
	y3 = p3.y;

	dx = x3 - x0;
	dy = y3 - y0;

	x1 = ((2.0*x0)/3.0) + (x3/3.0)    
	x2 = (x0/3.0) + ((2.0*x3)/3.0);


	if (this.IsEqual(p1,p2) && this.IsEqual(p3,p4))
	{
      y1 = y0 + (dy / 3.0);
      y2 = y0 + ((dy * 2.0) / 3.0);
 	} 
	if (this.IsEqual(p1,p2) && !this.IsEqual(p3,p4) )
	{

		slope = ((p4.y) - y0) / (p4.x - x0);
		y2 = y3 - ((slope * dx) / 3.0);
		y1 = y0 + ((y2 - y0) / 2.0);
 
	}
	if (!this.IsEqual(p1,p2) && this.IsEqual(p3,p4) ) 
	{
      slope = (y3 - (p1.y)) / (x3 - p1.x);

      y1 = y0 + ((slope * dx) / 3.0);
      y2 = y3 + ((y1 - y3) / 2.0);
 	}

	if ( !this.IsEqual(p1,p2) && !this.IsEqual(p3,p4) ) {
		slope = (y3 - (p1.y)) / (x3 - p1.x);
		y1 = y0 + ((slope * dx) / 3.0);
		slope = ((p4.y) - y0) / (p4.x - x0);
		y2 = y3 - ((slope * dx) / 3.0);
 	}

	this.ctx.beginPath(); 	
	this.ctx.moveTo(x0*this.width, this.height-(y0*this.height)); 

	step =(x3-x0)/20.0;	
	tx = x0;
	for(var i=0.0;i<=1.05;i+=0.05)
		{	
		ty =     (y0 * Math.pow((1-i),3)) +
	  		(3 * y1 * Math.pow((1-i),2) * i)     +
	  		(3 * y2 * (1-i) * i     * i)     +
	      	(y3 * i     * i     * i);

		this.ctx.lineTo(tx*this.width,this.height-(ty*this.height));
		this.values.push({x: tx, y: ty});
		tx = tx + step;

	}

	this.ctx.moveTo(0, this.height-(this.points[0].y*this.height));
	this.ctx.lineTo(this.points[0].x*this.width,this.height-(this.points[0].y*this.height));

	this.ctx.moveTo(this.points[3].x*this.width, this.height-(this.points[3].y*this.height));
	this.ctx.lineTo(this.width,this.height-(this.points[3].y*this.height));
	
	this.ctx.stroke();


	// Uncomment this for view the control points
	/*
	this.ctx.fillStyle = '#00ff00'; 
	this.ctx.beginPath();	

	this.ctx.moveTo(x1,y1);
	this.ctx.arc(x1,y1, 3, 0 , 2 * Math.PI, false);
	this.ctx.moveTo(x2,y2);
	this.ctx.arc(x2,y2, 3, 0 , 2 * Math.PI, false);
	
	this.ctx.fill();
	*/
	return true;

}

// Draw the control points
ColorCurve.prototype.DrawPoints = function() 
{
	
	this.ctx.fillStyle = '#ff0000'; 
	this.ctx.beginPath();	

 	for(i=0;i<this.points.length;i++)
 	{ 
		this.ctx.moveTo(this.points[i].x*this.width,this.height-(this.points[i].y*this.height));
		this.ctx.arc(this.points[i].x*this.width,this.height-(this.points[i].y*this.height), 3, 0 , 2 * Math.PI, false);
		
 	}
	this.ctx.fill();
 	
}


ColorCurve.prototype.MouseDown = function(event) 
{
	if(!event) var event = window.event;
    var x = (event.pageX-this.c.offsetLeft)/this.width,
        y = (event.pageY-this.c.offsetTop)/this.height;
	
	dis = 10000;
	punto = -1;

	for (i=0;i<this.points.length;i++)
	{
		x1 = x-this.points[i].x;
		y1 = y-(1.0-this.points[i].y);

		tdis = x1*x1+y1*y1;
		tdis = Math.sqrt(tdis);
		
		if (tdis < dis) { 
			dis = tdis;
			punto = i;
		}
		
	}	
	this.currentpoint = (dis < 8.0) ? punto : this.currentpoint;	

}


ColorCurve.prototype.MouseUp = function(event) {
   
	if (this.currentpoint != -1) { 
		this.UpdateValues();
	}
	this.currentpoint = -1;

}

ColorCurve.prototype.MouseMove = function(event) {
   
	if (this.currentpoint == -1) return;

	if (this.currentpoint > 0) prevx = this.points[this.currentpoint-1].x; else prevx = 0;
	if (this.currentpoint==this.points.length-1) nextx = 1.0; else nextx = this.points[this.currentpoint+1].x; 
	
	x = (event.pageX-this.c.offsetLeft)/this.width;
    y = 1.0-((event.pageY-this.c.offsetTop)/this.height);

     if(x > prevx && x < nextx) {
		this.points[this.currentpoint].x = x;
		this.points[this.currentpoint].y = y;
	
		this.redraw = 1;		
	}



}

// Return the normalized Y value for the specified X value. X should be passed normnalized too
ColorCurve.prototype.GetY = function(xpos)
{
	
	if (xpos < this.values[0].x) xpos = this.values[0].x;
	if (xpos > this.values[this.values.length-1].x) xpos = this.values[this.values.length-1].x;

	for(var i=0;i<this.values.length-2;i++)
	{
		if(xpos >= this.values[i].x && xpos < this.values[i+1].x) break;
	}
	var valuea = (xpos - this.values[i].x)/ (this.values[i+1].x-this.values[i].x);
	var valueb = valuea *  (this.values[i+1].y-this.values[i].y);

	var ret = this.values[i].y+valueb;

	if (ret < 0.0) return 0.0;
	if (ret > 1.0) return 1.0;

	return ret;
}





