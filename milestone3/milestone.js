window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
	canvasApp();
}

var size = 30;
var xIncrement = size * Math.sqrt(3) * 2;
var startX = 300;
var startY = 50;
var context;
var tilesRemaining = 24;
var isHolding = 0;
var color1 = 0;//color 1 of top triHex
var color2 = 0;//color 2 of top triHex
var lastColor1 = 0; //color1 of holding hex
var lastColor2 = 0; //color2 of holding hex
var flipped = 0; // whether the tile is flipped or not
var mouseX;
var mouseY;
var theCanvas;

var tiles = [   
			[1,6,4,2,2],
			[5,1,2,2,1],
			[4,2,1,2,1],
			[2,2,1,1,1],
			[1,1,1,1,1]
			];

var JUNGLECOLOR  = 'rgba(0, 100, 0, 255)'; 
var GRASSCOLOR   = 'rgba(0, 225, 0, 255)'; 
var DESERTCOLOR  = 'rgba(255, 201, 102, 255)';
var QUARRYCOLOR  = 'rgba(123, 123, 139, 255)';
var LAGOONCOLOR  = 'rgba(0, 191, 255, 255)';
var VOLCANOCOLOR = 'rgba(255, 48, 48, 255)'; 

var colors = [
    			JUNGLECOLOR,
    			GRASSCOLOR,
    			DESERTCOLOR,
    			QUARRYCOLOR,
    			LAGOONCOLOR,
    			VOLCANOCOLOR
    		  ];

var SubtileTypeEnum = {
  	JUNGLE: 0,
  	GRASS:  1,
  	DESERT: 2,
  	QUARRY: 3,
  	LAGOON: 4,
  	VOLCANO: 5,
};

function canvasApp(){

	theCanvas = document.getElementById('canvas');
	context = theCanvas.getContext('2d');
	if (!theCanvas || !theCanvas.getContext) {
    	return;
	}
	if (!context) {
   	 	return;
  	}
  	theCanvas.addEventListener("mousemove", mouse_monitor, false);
  	theCanvas.addEventListener("mousedown", click,false);
  	drawScreen();


  	function mouse_monitor(e){
  		drawScreen();
		console.log("mouseX " + event.clientX);
		console.log("mouseY " + event.clientY);
		context.fillRect(event.clientX - 50,event.clientY - 50,10,10);
		if(isHolding)
		{
			if(event.clientX >=250)
			{
				position = findValidPosition();
				drawTriHex(position.x,position.y + size,size,lastColor1,lastColor2);
			}
			else
			{
				drawTriHex(event.clientX - 50,event.clientY -50 + size,size,lastColor1,color2);
			}
		}
  	}
  	function click()
	{
		if(isHolding == 1)
		{
			isHolding = 0;
		}
		if(tilesRemaining > 0 && event.clientX < 200 && event.clientY < 325 && event.clientY > 275 && isHolding == 0)
		{
			tilesRemaining = tilesRemaining - 1;
			isHolding = 1;
			lastColor1 = color1;
			lastColor2 = color2;
			drawTriHex(event.clientX,event.clientY-25,size,lastColor1,lastColor2);
			genNewTile();
		}
		drawScreen();
	}
}

function genNewTile()
{
	if(tilesRemaining > 0)
	{
		context.shadowOffsetX=4;
		context.shadowOffsetY=4;
		context.shadowColor='black';
		context.shadowBlur=4;
		do
		{
			color1 = Math.floor(Math.random() * (5));
			color2 = Math.floor(Math.random() * (5));
			console.log("color1 " + colors[color1]);
			console.log("color2 " + colors[color2]);
		}while(tiles[color1][color2] == 0);
	}
}

function drawScreen() {
	context.clearRect(0,0,theCanvas.width,theCanvas.height);
	console.log("mouseX " + event.clientX);
	console.log("mouseY " + event.clientY);
	console.log("isHolding " + isHolding);
	console.log("tiles:" + tilesRemaining);
	context.fillStyle="#FFC300";
	context.fillRect(0,0,200,600);
	context.fillStyle="#42c8f4";
	context.fillRect(200,0,600,600);
	context.font =  "18px Arial";
	context.fillStyle = "black";
	context.fillText("remaining: " + tilesRemaining,50,50);
	//draw top hex
	drawTriHex(100,300,size,color1,color2);
	for(var i = 0; i < 10;i++)
	{
		checkY = startY + i * 1.5 * size;
		for(var j = 0; j < 10; j++)
		{
			if(i % 2 == 0)
			{
				checkX = startX + j * xIncrement/2 - size;
			}
			else
			{
				checkX = startX - (xIncrement/4) + j * xIncrement/2 - size;
			}
			drawHex(checkX,checkY,size,color1);
		}
	}
} 
	
function hex_cornerX(x,y,size, i){
    var angle_deg = 60 * i   + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return x + size * Math.cos(angle_rad);
}
		
function hex_cornerY(x,y,size, i){
    var angle_deg = 60 * i   + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return y + size * Math.sin(angle_rad);
}

function distance(x1,y1,x2,y2)
{
	return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
}

function findValidPosition()
{
	var closeX = event.clientX - 50;
	var closeY = event.clientY - 50 + size;
	var checkX;
	var checkY;
	for(var i = 0; i < 10;i++)
	{
		checkY = startY + i * 1.5 * size;
		for(var j = 0; j < 10; j++)
		{
			if(i % 2 == 0 && j != 9)
			{
				checkX = startX + j * xIncrement/2 - size;
				if(distance(closeX,closeY,checkX,checkY) < size)
				{
					closeX = checkX;
					closeY = checkY;
					break;
				}
			}
			else if(i % 2 == 1 && j != 0)
			{
				checkX = startX - (xIncrement/4) + j * xIncrement/2 - size;
				if(distance(closeX,closeY,checkX,checkY) < size)
				{
					closeX = checkX;
					closeY = checkY;
					break;
				}
			}
		}
	}
	return {
		x:  closeX,
		y:  closeY,
	}
}

function drawHex(x,y,size,color){
	context.beginPath(event.clienX,event.clientY,25);
	context.strokeStyle = "white"; 
	context.lineWidth=3;
	context.lineCap = 'square';
	context.beginPath();
	context.moveTo(hex_cornerX(x,y,size,0),hex_cornerY(x,y,size,0));
	for (var i = 1; i <= 5; i++) {
		context.lineTo(hex_cornerX(x,y,size,i),hex_cornerY(x,y,size,i));
	}	
	context.shadowBlur = 30;
	context.fillStyle = color;	
	context.shadowOffsetY = 15;
	context.shadowOffsetX = 25;
	context.fill();
	context.shadowBlur = 0;
	context.shadowOffsetY = 0;
	context.shadowOffsetX = 0;
	context.closePath();
	context.stroke();
}

function drawTriHex(x,y,size,color1,color){
	var yIncrement = (size/2);
	var xIncrement = ((size/2) * (3**(1/2)));
	drawHex(x,y - size,size,VOLCANOCOLOR);
	drawHex(x - xIncrement,y + (size/2),size,colors[color1]);
	drawHex(x + xIncrement,y + (size/2),size,colors[color2]);
	tiles[color1][color2] = tiles[color1][color2] - 1;
	context.beginPath();
	context.strokeStyle = "black"; 
	context.lineWidth=4;
	context.lineCap = 'square';
	context.beginPath();
	context.moveTo(x,y - size);
	context.lineTo(x + xIncrement/2,y - size + size/2);
	context.closePath();
	context.fillStyle = 'black';
	context.moveTo(x + xIncrement/2,y - size + size/2);
	context.lineTo(x + xIncrement/4, y - size + size/2);
	context.lineTo(x + xIncrement/2,y - size + size/2);
	context.lineTo(x + xIncrement/2, y - size + size/4);
	context.fill();
	context.closePath();
	context.stroke();
	//console.log(tiles[color1][color2]);
}	

