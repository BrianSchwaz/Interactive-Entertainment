var colorGrid = makeDoubleArray(rows,columns);

function makeDoubleArray(d1, d2) {
    var arr = new Array(d1), i, l;
    for(i = 0, l = d2; i < l; i++) {
        arr[i] = new Array(d1);
    }
    return arr;
}

function calcVolcano()
{
	var volcanoIndex = volcano;
	var c1Index = (volcano + 1) % 3;
	var c2Index = (volcano + 2) % 3;

	c[volcano] = VOLCANOCOLOR;
	c[c1Index] = colors[lastColor1];
	c[c2Index] = colors[lastColor2];
}

function makeEmptyColor()
{
	for(var i = 0;i<rows;i++)
	{
		for(var j= 0;j<columns;j++)
		{
			colorGrid[i][j] = new Hex(EMPTYCOLOR);
		}
	}
}

function findPlacements()
{   
	var pos1row = row;
	var pos1col = col;
	var pos2row;
	var pos2col;
	var pos3row;
	var pos3col;
	if(flipped == 1)
	{
		pos2row = row -1;
		pos2col = col + ((row+1) % 2); 
		pos3row = row -1;
		pos3col = pos2col - 1;
	}
	else
	{
		pos2row = row + 1;
		pos2col = col - (row % 2); 
		pos3row = row + 1;
		pos3col = pos2col + 1;
	}
	coordinates = [pos1row,pos1col,pos2row,pos2col,pos3row,pos3col];
}

function getLavaFlow()
{
	var towards = (volcano + 2) % 3;
	var lavaR = coordinates[towards * 2];
	var lavaC = coordinates[towards * 2 + 1];
	return {
		lavaRow :lavaR,
		lavaCol : lavaC,
	}
}

function toPixels(row,col)
{
	var pixelY = row * 1.5 * size -10;
	var pixelX;
	if(row % 2 == 0)
	{
		pixelX = col * xIncrement/2 - size -10;
	}
	else
	{
		pixelX = col * xIncrement/2 - size - xIncrement/4 -10;
	}
	return {
		x: pixelX,
		y: pixelY,
	}
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
	var r = 0;
	var c = 0;
	var closeX = mouseX - 10;
	var closeY = mouseY - 10 + size;
	if(flipped == 1)
	{
		closeY = mouseY - size;
	}
	//console.log("closeX " + closeX);
	//console.log("closeY " + closeY);
	var checkX;
	var checkY;
	for(var i = 0; i < rows;i++)
	{
		checkY = i * 1.5 * size -10;
		for(var j = 0; j < columns; j++)
		{
			if(v == 1)
			{
				break;
			}
			if(i % 2 == 0)
			{
				checkX = j * xIncrement/2 - size -10;
				if(distance(closeX,closeY,checkX,checkY) < size)
				{
					//console.log(i + ","  + j);
					context.fillRect(checkX,checkY,10,20);
					closeX = checkX;
					closeY = checkY;
					r = i;
					c = j;
					v = 1;
					break;
				}
			}
			else
			{
				checkX = j * xIncrement/2 - size - xIncrement/4 -10;
				if(distance(closeX,closeY,checkX,checkY) < size)
				{
					//console.log(i + ","  + j);
					//console.log(distance(closeX,closeY,checkX,checkY));
					closeX = checkX;
					closeY = checkY;
					r = i;
					c = j;
					v = 1;
					break;
				}
			}
			context.font =  "16px Arial";
			context.fillStyle = "black";
			context.fillText(i + ","  + j,checkX-size/2,checkY);
		}
	}
	return {
		x:  closeX,
		y:  closeY,
		valid: v,
		row: r,
		col: c,
	}
}


function drawHex(x,y,size,color,pointX,pointY,triHex){
	//context.beginPath(event.clieniX,event.clientY,25);
	if(validPos == 1 || x < 250 || triHex == 0)
	{
		context.strokeStyle = "white"; 
	}
	else
	{
		context.strokeStyle = "red"; 
	}
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
	if(color == VOLCANOCOLOR)
	{
		context.beginPath();
		context.moveTo(x,y);
		context.strokeStyle = "orange";
		/*console.log("x:" + x);
		console.log("y:" + y);
		console.log("pointX " + pointX);
		console.log("pointY " + pointY);
		console.log("midx:" + (x+pointX)/2);
		console.log("midy:" + (y+pointY)/2);*/
		context.lineTo((x+pointX)/2,(y+pointY)/2);
		context.stroke();
	}
}

//x and y indicate center position color1 botom left color2 bottom right volcano indicates rotation(0,1,2)
function drawTriHex(x,y,size,color1,color2,volcano,flip,holding,coordinates){
	var len = size;
	//console.log(flip);
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
	var c1Index = (volcano + 1) % 3;
	var c2Index = (volcano + 2) % 3;

	c[volcano] = VOLCANOCOLOR;
	c[c1Index] = colors[color1];
	c[c2Index] = colors[color2];

	var positionX;
	var positionY;

	if(volcanoIndex == 0)
	{
		positionX = place3X;
		positionY = place3Y;
	}
	else if(volcanoIndex == 1)
	{
		positionX = place1X;
		positionY = place1Y;
	}
	else
	{
		positionX = place2X;
		positionY = place2Y;
	}
	if(holding == 1)
	{
		posX = positionX;
		posY = positionY;
	}


	if(flip == 0)
	{
		drawHex(place1X,place1Y,size,c[0],positionX,positionY,1);
		context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("1",place1X,place1Y);
		drawHex(place2X,place2Y,size,c[1],positionX,positionY,1);
		context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("2",place2X,place2Y);
		drawHex(place3X,place3Y,size,c[2],positionX,positionY,1);
		context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("3",place3X,place3Y,positionX,positionY);
	}
	else
	{
		drawHex(place3X,place3Y,size,c[2],positionX,positionY,1);
		context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("3",place3X,place3Y);
		drawHex(place2X,place2Y,size,c[1],positionX,positionY,1);	
		context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("2",place2X,place2Y);
		drawHex(place1X,place1Y,size,c[0],positionX,positionY,1);
		context.font =  "16px Arial";
		context.fillStyle = "black";
		context.fillText("1",place1X,place1Y);
	}
}	

