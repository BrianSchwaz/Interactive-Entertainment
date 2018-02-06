window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
	canvasApp();
}

var size = 30;
var xIncrement = size * Math.sqrt(3) * 2;
var offX = -50;
var offY = -50;
var startX = 10;
var startY = 10;
var context;
var tilesRemaining = 24;
var isHolding = 0;
var color1 = 0;//color 1 of top triHex
var color2 = 0;//color 2 of top triHex
var lastColor1 = 0; //color1 of holding hex
var lastColor2 = 0; //color2 of holding hex
var flipped = 1; // whether the tile is flipped or not
var theCanvas;
var rows = 15;
var columns = 18;
var hexGrid = makeArray(rows,columns);
var volcano = 0; //volcano indicates rotation of current tri-hex
var stagger;
var validPos = 0;

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

function makeArray(d1, d2) {
    var arr = new Array(d1), i, l;
    for(i = 0, l = d2; i < l; i++) {
        arr[i] = new Array(d1);
    }
    return arr;
}

function drawBackground()
{
	context.clearRect(0,0,theCanvas.width,theCanvas.height);
	context.fillStyle="#42c8f4";
	context.fillRect(200,0,600,600);
	//draw top hex
	//-50s are to start mapping of hexes off the screen;
	for(var i = 0; i < rows;i++)
	{
		checkY = offY + i * 1.5 * size;
		for(var j = 0; j < columns; j++)
		{
			if(i % 2 == 0)
			{
				checkX = offX + j * xIncrement/2 - size;
			}
			else
			{
				checkX = offX - (xIncrement/4) + j * xIncrement/2 - size;
			}
			drawHex(checkX,checkY,size,color1);
		}
	}
}

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
  	drawBackground();
	genNewTile();
  	drawScreen();

  	function mouse_monitor(e){
		drawBackground();
		drawScreen();
		console.log("mouseX " + event.clientX);
		console.log("mouseY " + event.clientY);
		context.fillStyle = "white";
		context.fillRect(event.clientX - startX ,event.clientY-startY,10,10);
		if(isHolding)
		{
			shadowOn();
			if(event.clientX >=250)
			{
				position = findValidPosition();
				drawTriHex(position.x,position.y + stagger,size,lastColor1,lastColor2,volcano,flipped);
				drawScreen();
			}
			else
			{
				stagger = size;
				if(flipped == 1)
				{
					stagger *= -1;
				}
				drawTriHex(event.clientX - startX,event.clientY - startY + stagger,size,lastColor1,color2,volcano,flipped);
			}
		}
		shadowOff();
  	}

  	function click()
	{

		if(isHolding == 1)
		{
			isHolding = 0;
		}
		if(tilesRemaining > 0 && distance(event.clientX -10,event.clientY -10,100,300) <= size * 1.5  && isHolding == 0)
		{
			tilesRemaining = tilesRemaining - 1;
			isHolding = 1;
			lastColor1 = color1;
			lastColor2 = color2;
			genNewTile();
			drawScreen();
			shadowOn();
			if(flipped == 0)
			{
				drawTriHex(event.clientX,event.clientY-size,size,lastColor1,lastColor2,volcano,flipped);
			}
			else
			{
				drawTriHex(event.clientX,event.clientY+size,size,lastColor1,lastColor2,volcano,flipped);
			}
			shadowOff();
		}
	}
}

function shadowOn()
{
  	context.shadowOffsetX=20;
	context.shadowOffsetY=20;
	context.shadowColor='black';
	context.shadowBlur=30;
}

function shadowOff()
{
  	context.shadowOffsetX=0;
	context.shadowOffsetY=0;
	context.shadowBlur=0;
}

function genNewTile()
{
	if(tilesRemaining > 0)
	{
		do
		{
			color1 = Math.floor(Math.random() * (5));
			color2 = Math.floor(Math.random() * (5));
		}while(tiles[color1][color2] == 0);
	}
}

function drawScreen() {
	context.fillStyle="#FFC300";
	context.fillRect(0,0,200,600);
	context.font =  "18px Arial";
	context.fillStyle = "black";
	context.fillText("remaining: " + tilesRemaining,50,50);
	context.shadowBlur = 0;
	context.shadowOffsetY = 0;
	context.shadowOffsetX = 0;
	drawTriHex(100,300,size,color1,color2,0,0);
} 
	
function hex_cornerX(x,y,size, i){
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return x + size * Math.cos(angle_rad);
}
		
function hex_cornerY(x,y,size, i){
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return y + size * Math.sin(angle_rad);
}

function distance(x1,y1,x2,y2)
{
	return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
}

function findValidPosition()
{
	var v = 0;
	var closeX = event.clientX - 10;
	var closeY = event.clientY - 10 + size;
	if(flipped == 1)
	{
		closeY = event.clientY - 10 - size;
	}
	var checkX;
	var checkY;
	for(var i = 0; i < rows;i++)
	{
		checkY = offY + i * 1.5 * size;
		for(var j = 0; j < columns; j++)
		{
			if(i % 2 == 0)
			{
				checkX = offX + j * xIncrement/2 - size;
				if(distance(closeX,closeY,checkX,checkY) < size)
				{
					closeX = checkX;
					closeY = checkY;
					v = 1;
					break;
				}
			}
			else
			{
				checkX = offX + j * xIncrement/2 - size - xIncrement/4;
				if(distance(closeX,closeY,checkX,checkY) < size)
				{
					closeX = checkX;
					closeY = checkY;
					v = 1;
					break;
				}
			}
		}
	}
	return {
		x:  closeX,
		y:  closeY,
		valid: v
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
	context.fillStyle = color;
	context.closePath();
	context.stroke();
	context.fill();
	shadowOff();
	context.stroke();
}

function drawTriHexFlipped()
{

}

//x and y indicate center position color1 botom left color2 bottom right volcano indicates rotation(0,1,2)
function drawTriHex(x,y,size,color1,color2,volcano,flip){
	var len = size;
	if(flip == 1)
	{
		len *= -1;
	}
	var yIncrement = (len/2);
	var xIncrement = ((len/2) * (3**(1/2)));
	var place1X = x;
	var place1Y = y - len;
	var place2X = x - xIncrement;
	var place2Y = y + (len/2);
	var place3X = x + xIncrement;
	var place3Y = y + (len/2);

	var volcanoIndex = volcano;
	var c1Index = volcano + 1 % 3;
	var c2Index = volcano + 2 % 3;
	var c = new Array(3);

	c[volcano] = VOLCANOCOLOR;
	c[c1Index] = colors[color1];
	c[c2Index] = colors[color2];

	if(flip == 0)
	{
		drawHex(place1X,place1Y,size,c[0]);
		drawHex(place2X,place2Y,size,c[1]);
		drawHex(place3X,place3Y,size,c[2]);
	}
	else
	{
		drawHex(place3X,place3Y,size,c[2]);
		drawHex(place2X,place2Y,size,c[1]);	
		drawHex(place1X,place1Y,size,c[0]);
	}
	tiles[color1][color2] = tiles[color1][color2] - 1;
}	

