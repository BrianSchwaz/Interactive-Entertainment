class Hex{
	
	constructor(color,lavaX,lavaY,lavaRow,lavaCol,level,huts)
	{
		this.color = color;
		this.lavaX = lavaX; //index col of lava flow
		this.lavaY = lavaY; //index row of lava flow
		this.lavaRow = lavaRow;
		this.lavaCol = lavaCol; 
		this.level = level;
		this.huts = huts;
		if(this.level == undefined)
		{
			this.level = 0;
		}
	}
}