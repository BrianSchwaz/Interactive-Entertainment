
function drawScreen() {
	context.fillStyle="#FFC300";
	context.fillRect(0,0,200,600);
	context.font =  "18px Arial";
	context.fillStyle = "black";
	context.fillText("remaining: " + tilesRemaining,50,50);
	context.shadowBlur = 0;
	context.shadowOffsetY = 0;
	context.shadowOffsetX = 0;
	stationary = 1;
	if(tilesRemaining > 0)
		drawTriHex(100,300,size,color1,color2,0,0);
	stationary = 0;
} 

function drawComponents()
{
	drawBackground();
	drawScreen();
	drawHoldingTriHex();
	//console.log("row " + row);
	//console.log("col " + col);
}

function drawHoldingTriHex()
{
	if(isHolding)
	{
		shadowOn();
		/*if(mouseX >=250)
		{*/
			//overMap = 1;
			stagger = size;
			position = findValidPosition();
			validPos = position.valid;
			row = position.row;
			col = position.col;
			findPlacements();
			
			if(flipped == 1)
			{
				drawTriHex(position.x,position.y - stagger,size,lastColor1,lastColor2,volcano,flipped,1);
			}
			else
			{
				drawTriHex(position.x,position.y + stagger,size,lastColor1,lastColor2,volcano,flipped,1);
			}
			//drawScreen();
		/*}
		else
		{
			overMap = 0;
			validPos = 0;
			stagger = size;
			if(flipped == 1)
			{
				stagger *= -1;
			}
			drawTriHex(mouseX - startX,mouseY - startY + stagger,size,lastColor1,lastColor2,volcano,flipped,1);
		}*/
	}
	shadowOff();
}

function drawBackground()
{	
	stationary = 1;
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
			drawHex(checkX,checkY,size,colorGrid[i][j].color,colorGrid[i][j].lavaX,colorGrid[i][j].lavaY,0);
			context.font =  "12px Arial";
			context.fillStyle = "black";
			if(colorGrid[i][j].level > 0)
			{
				context.fillText("lvl: " + colorGrid[i][j].level,checkX - size/3,checkY - size/3);
			}
		}
	}
	stationary = 0;
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
