window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
	canvasApp();
}

var polySides = [];
var polyX = [];
var polyY = [];
var polySize = [];
var polyFill = [];
var velocityX = [];
var velocityY = [];
var curved = [];
var polygons = 0;
var score = 0;
var lives = 3;
var score = 0;
var radius = [];
var path = [];//1 straight //2 curve up //3 curve down //4 curve right //5 curve left //6 up left //7 down left //8 down right //9 up right

function canvasApp(){

	var canvas = document.getElementById('canvas');
  	
  	if (!canvas || !canvas.getContext) {
    	return;
  	}
  
  	var context = canvas.getContext('2d');
 	
	if (!context) {
   	 	return;
  	}
	
	var myVar1 = setInterval(main, 50);
	var myVar2 = setInterval(newPolygon, 1000);
	var myVar3 = setInterval(updateVelocities,300);

	function distance(x1,y1,x2,y2)
	{
		return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
	}

	function checkClicked()
	{
		for(var i = 0; i < polygons;i++)
		{
			e = window.event;
			console.log("mouseX " + e.clientX + " mouseY " + e.clientY);
			console.log("polyX " + polyX[i] + " polyY " + polyY[i]);
			console.log(distance(polyX[i],polyY[i],e.clientX-50,e.clientY-50));			
			if(distance(polyX[i],polyY[i],e.clientX-50,e.clientY-50) < polySize[i])
			{
				score++;
				console.log("removed");
				deletePolygon(i);
			}
		}
	}

	function main()
	{
		canvas.onclick = checkClicked;
		context.clearRect(0,0,canvas.width,canvas.height);
		if(lives > 0)
		{
			context.rect(0,0,canvas.width,canvas.height);
			context.font =  "18px Arial";
			context.fillStyle = "black";
			context.fillText("Score: " + score,50,50);
			context.stroke();
			drawPolygons();
		}
		else
		{
			context.font =  "18px Arial";
			context.fillStyle = "black";
			context.fillText("Game Over",canvas.width/2,canvas.height/2);
			context.font =  "18px Arial";
			context.fillStyle = "black";
			context.fillText("Score: " + score,50,50);
		}
	}

	function drawPolygons()
	{
		for(var i = 0; i < polygons; i++)
		{
			if(polyX[i] < - 50 || polyX[i] > (50 + canvas.width)|| polyY[i] < -50 || polyY[i] > (canvas.height))
			{
				deletePolygon(i);
				lives--;
			}
		}
		for(var i = 0; i < polygons; i++)
		{
			polyX[i] += velocityX[i];
			polyY[i] += velocityY[i];
			drawPolygon(polySides[i],polyX[i],polyY[i],polySize[i],polyFill[i]);
		}
		console.log(polySides.length);
	}

	/*$('body').click(function(){
  		console.log('clicked');
	});*/

	function updateVelocities()
	{
		for(var i = 0; i < polygons; i++)
		{
			if(path[i] == 2)
			{
				velocityY[i] += 1;
			}
			else if(path[i] == 3)
			{
				velocityY[i] -= 1;
			}
			else if(path[i] == 4)
			{
				velocityX[i] += 1;
			}
			else if(path[i] == 5)
			{
				velocityX[i] -= 1;
			}
			else if(path[i] == 6)
			{
				radius[i] += .2;
				velocityX[i] -= 2;
				velocityY[i] = Math.sqrt(Math.pow(radius[i],2)-Math.pow(velocityX[i],2));
				if(velocityX[i] < 0)
					path[i] = 7;
			}
			else if(path[i] == 7)
			{
				radius[i] += .2;
				velocityY[i] -= 2;
				velocityX[i] = -(Math.sqrt(Math.pow(radius[i],2)-Math.pow(velocityY[i],2)));
				if(velocityY[i] < 0)
					path[i] = 8;
			}
			else if(path[i] == 8)
			{
				radius[i] += .2;
				velocityX[i] += 2;
				velocityY[i] = -(Math.sqrt(Math.pow(radius[i],2)-Math.pow(velocityX[i],2)));
				if(velocityX[i] > 0)
					path[i] = 9;
			}
			else if(path[i] == 9)
			{
				radius[i] += .2;
				velocityY[i] += 2;
				velocityX[i] = (Math.sqrt(Math.pow(radius[i],2)-Math.pow(velocityY[i],2)));
				if(velocityY[i] > 0)
					path[i] = 6;
			}
		}
	}

	function deletePolygon(index)
	{
		polyFill.splice(index,1);
		polySides.splice(index,1);
		polyX.splice(index,1);
		polyY.splice(index,1);
		polySize.splice(index,1);
		velocityY.splice(index,1);
		velocityX.splice(index,1);
		path.splice(index,1);
		radius.splice(index,1);
		polygons--;
	}

	function newPolygon()
	{
		polyFill.push('#'+(Math.random()*0xFFFFFF<<0).toString(16));
		polySides.push(Math.floor(Math.random()* ((8 -3) + 1) + 3));
		result = Math.random();
		if(result < .35)
		{
			radius.push(0);
			var x = Math.floor(Math.random() * (canvas.width));
			polyX.push(x);
			velocityX.push(0);
			if(Math.random() < .5)
			{
				path.push(1);
			}
			else
			{
				if(x < canvas.width/2)
				{
					//curve right
					path.push(4);
				}
				else
				{
					//curve left
					path.push(5);
				}
			}
			if(Math.random() < .5)
			{
				polyY.push(0);
				velocityY.push(7);
			}
			else
			{
				polyY.push(canvas.height);
				velocityY.push(-7);
			}
		}
		else if(result < 0.7)
		{
			radius.push(0);
			var y = Math.floor(Math.random() * (canvas.height));
			polyY.push(y);
			velocityY.push(0);
			if(Math.random() < 0.5)
			{
				path.push(1);
			}
			else
			{
				if(y > canvas.height/2)
				{
					//curve down
					path.push(3);
				}
				else
				{
					//curve up
					path.push(2);
				}
			}
			if(Math.random() < .5)
			{
				polyX.push(0);
				velocityX.push(7);
			}
			else
			{
				polyX.push(canvas.width);
				velocityX.push(-7);
			}
		}
		else
		{
			radius.push(Math.sqrt(Math.pow(6,2)+Math.pow(6,2)));
			path.push(6);
			velocityX.push(6);
			velocityY.push(6);
			polyX.push(canvas.width/2);
			polyY.push(canvas.height/3);
		}
		polySize.push(Math.floor(Math.random() * (50 - 35 + 1) + 30));
		polygons++;
	}

	function drawPolygon(sides,x,y,size,fill){
			context.beginPath();
			context.strokeStyle = "white"; 
			context.lineWidth=2;
			context.lineCap = 'square';
			context.beginPath();
			context.moveTo(poly_cornerX(sides,x,y,size,0),poly_cornerY(sides,x,y,size,0));
			for (var i = 1; i <= sides - 1; i++) {
				context.lineTo(poly_cornerX(sides,x,y,size,i),poly_cornerY(sides,x,y,size,i));
			}
			context.closePath();
			context.stroke();
			context.fillStyle = fill;
			context.fill();	
	}

	function poly_cornerX(sides,x,y,size, i){
    	var angle_deg = 360/sides * i;
    	var angle_rad = Math.PI / 180 * angle_deg;
    	return x + size * Math.cos(angle_rad);
	}

	function poly_cornerY(sides,x,y,size, i){
    	var angle_deg = 360/sides * i;
    	var angle_rad = Math.PI / 180 * angle_deg;
    	return y + size * Math.sin(angle_rad);
	}

	/*function drawScreen()
	{
		//console.log(performance.now() / 1000);
		//console.log(performance.now() / 1000);
	}*/
}
