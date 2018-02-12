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

function sameLevel()
{
	var level1 = colorGrid[coordinates[0]][coordinates[1]].level;
	var level2 = colorGrid[coordinates[2]][coordinates[3]].level;
	var level3 = colorGrid[coordinates[4]][coordinates[5]].level;
	if(level1 == level2 && level1== level3)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function getAdjacent(hexRow,hexCol)
{
	var neighbors = Array(12);
	var offset;
	if(hexRow % 2 == 0)
	{
		offset = 0;
	}
	else
	{
		offset = -1;
	}
	for(var i = 0; i < 3;i++)
	{
		neighbors[i*4] = hexRow + i - 1;
		neighbors[i*4 + 2] = hexRow + i - 1;
	}
	for(var i = 0; i < 2;i++)
	{
		neighbors[i*8 + 1] = hexCol + offset;
		neighbors[i*8 + 3] = hexCol + offset + 1;
	}
	neighbors[5] = hexCol - 1;
	neighbors[7] = hexCol + 1;

	console.log("neighbors of" + hexRow + "," + hexCol);
	for(var i = 0; i < 6;i++)
	{
		console.log(neighbors[i*2] + "," + neighbors[i*2 + 1]);
	}

	return neighbors;
}

function volcanoPlacement()
{
	//first level placement doesn't matter
	if(colorGrid[coordinates[volcano*2]][coordinates[volcano*2+1]].level == 0)
		return true;
	//a volcano tile is under the volcano tile that will be placed
	if(colorGrid[coordinates[volcano*2]][coordinates[volcano*2+1]].color == VOLCANOCOLOR)
	{
		var lavaflow = getLavaFlow();
		if(!(colorGrid[coordinates[volcano*2]][coordinates[volcano*2+1]].lavaRow == lavaflow.lavaRow &&
		   colorGrid[coordinates[volcano*2]][coordinates[volcano*2+1]].lavaCol == lavaflow.lavaCol))
			return true;

	}
	return false;
}

function isAdjacent()
{
	findPlacements();
	var neighbors;
	if(tilesRemaining == tilesCapacity -1)
		return true;
	for(var i = 0; i < 3;i++)
	{
		neighbors = getAdjacent(coordinates[i*2],coordinates[i*2 + 1]);
		for(var j = 0; j < 6; j++)
		{
			if(colorGrid[neighbors[j*2]][neighbors[j*2+1]].level > 0)
				return true;
		}
	}
	return false;
}

function validity()
{
	if(isAdjacent() == false)
		return false;
	if(sameLevel() == false)
		return false;
	if(volcanoPlacement() == false)
		return false;
	return true;
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
		checkY = i * 1.5 * size + offY;
		for(var j = 0; j < columns; j++)
		{
			if(v == 1)
			{
				break;
			}
			if(i % 2 == 0)
			{
				checkX = j * xIncrement/2 - size  + offX;
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
				checkX = j * xIncrement/2 -size - xIncrement/4 + offX;
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