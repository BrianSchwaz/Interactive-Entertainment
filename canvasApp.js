function canvasApp(){

	theCanvas = document.getElementById('canvas');
	context = theCanvas.getContext('2d');
	if (!theCanvas || !theCanvas.getContext) {
    	return;
	}
	if (!context) {
   	 	return;
  	}

	//var myVar1 = setInterval(,50);
  	theCanvas.addEventListener("mousemove", mouse_monitor, false);
  	theCanvas.addEventListener("mousedown", click,false);
  	window.addEventListener("keydown",checkKeyPress,false);
  	start();

  	function checkKeyPress(key)
  	{
  		//shift flips 16
  		if(key.keyCode == "83")
  		{
  			flipped = !flipped;
  			//console.log("flipped "+flipped);
  		}
  		//a rotates 65
  		if(key.keyCode == "65")
  		{
  			volcano = (volcano + 1) % 3;
  			//console.log(volcano);
  		}
  		drawComponents();
		//context.fillStyle = "white";
		//context.fillRect(mouseX - startX ,mouseY-startY,10,10);
  	}

  	function start()
  	{
  		makeEmptyColor();
  		drawBackground();
		genNewTile();
  		drawScreen();
  	}

  	function mouse_monitor(e){
		mouseX = event.clientX;
		mouseY = event.clientY;
		if(isHolding == 1)
		{
			drawBackground();
			drawScreen();
			drawHoldingTriHex();
		}
		//console.log("mouseX " + mouseX);
		//console.log("mouseY " + mouseY);
		//context.fillStyle = "white";
		//context.fillRect(mouseX - startX ,mouseY-startY,10,10);
		//console.log("row " + row);
		//console.log("col " + col);
  	}

  	function click()
	{

		if(isHolding == 1)
		{
			if(validPos ==1)
			{
				shadowOff();
				isHolding = 0;
				findPlacements();
				calcVolcano();
				var lavaflow = getLavaFlow();
				console.log(lavaflow.lavaRow + "," + lavaflow.lavaCol);
				//spot1
				colorGrid[coordinates[0]][coordinates[1]] = new Hex(
					c[0],
					posX,
					posY,
					lavaflow.lavaRow,
					lavaflow.lavaCol,
					colorGrid[coordinates[0]][coordinates[1]].level + 1);
				colorGrid[coordinates[2]][coordinates[3]] = new Hex(c[1],
					posX,
					posY,
					lavaflow.lavaRow,
					lavaflow.lavaCol,
					colorGrid[coordinates[2]][coordinates[3]].level + 1
					);
				colorGrid[coordinates[4]][coordinates[5]] = new Hex(c[2],
					posX,
					posY,
					lavaflow.lavaRow,
					lavaflow.lavaCol,
					colorGrid[coordinates[4]][coordinates[5]].level + 1
					);
				//alert("LOGGED X:" + colorGrid[coordinates[0]][coordinates[1]].pointX)			
				drawBackground();
				drawScreen();
			}
		}
		else if(tilesRemaining > 0 && distance(mouseX -10,mouseY -10,100,300) <= size * 2  && isHolding == 0)
		{
			flipped = 0;
			valid = 0;
			volcano = 0;
			tilesRemaining = tilesRemaining - 1;
			isHolding = 1;
			lastColor1 = color1;
			lastColor2 = color2;
			genNewTile();
			tiles[color1][color2] = tiles[color1][color2] - 1;
			drawScreen();
			shadowOn();
			if(flipped == 0)
			{
				drawTriHex(mouseX,mouseY-size,size,lastColor1,lastColor2,volcano,flipped,1);
			}
			else
			{
				drawTriHex(mouseX,mouseY+size,size,lastColor1,lastColor2,volcano,flipped,1);
			}
			shadowOff();
		}
	}
}