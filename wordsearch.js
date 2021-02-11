// Canvas 
let canvas = document.getElementById('grid')
let ctx = canvas.getContext('2d')

// Grid properties
let cellSize = 32
let gridSize
// Grid array
let grid

// Draw the grid
let drawGrid = (ctx, gridLength) => {
	// Change canvas width and height according to the number of rows/cols
	canvas.style.width = cellSize * gridLength
	canvas.style.height = cellSize * gridLength
	canvas.width = cellSize * gridLength
	canvas.height = cellSize * gridLength

	// Draw lines horizontally
	for (let x = 0; x < gridLength; x++) {
		ctx.beginPath()
		ctx.moveTo(cellSize * x, 0)
		ctx.lineTo(cellSize * x, canvas.width )
		ctx.strokeStyle = "black";
    	ctx.stroke();
	}
	// Draw lines vertically
	for (let y = 0; y < gridLength; y++) {
		ctx.beginPath()
		ctx.moveTo(0, cellSize * y)
		ctx.lineTo(canvas.height , cellSize * y)
		ctx.strokeStyle = "black";
		ctx.stroke();
	}
}

// Createan empty 2D array
create2DArray = (size) => {
	let array = [];
	for (let x = 0; x < size; x++) {
		array.push([]);
		for (let y = 0; y < size; y++) {
			array[x].push(null);
		}
	}
	return array;
};

insertRandomChar = (ctx) => {
	// Get the grid length of the grid
	const gridSize = canvas.width/cellSize
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	grid = create2DArray(gridSize)
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			if (grid[x][y] == null) {
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				grid[x][y] = characters.charAt(Math.floor(Math.random() * 26));
				ctx.fillText(grid[x][y], x * cellSize, y * cellSize);
			}
		}
	}
}

let createGrid = () => {
	let gridSize = parseInt(document.getElementById('gridsize').value)

	if (Number.isInteger(gridSize)) {
		drawGrid(ctx, gridSize)
		insertRandomChar(ctx)
	}
	else {
		console.log("not a number")
	}
}



let init = () => {

	// Check if canvas is null
	if (ctx) {
		// Create default grid
		drawGrid(ctx, 16)
		insertRandomChar(ctx)
	}
	else {
		console.log("ERROR")
	}
}
