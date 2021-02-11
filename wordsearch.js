// Canvas 
let canvas = document.getElementById('grid')

// Grid properties
const cellX = 32
const cellY = 32

// Grid array
let grid

// Draw the grid
let drawGrid = (ctx, cols, rows) => {
	// Change canvas width and height according to the number of rows/cols
	canvas.style.width = cellX * rows
	canvas.style.height = cellY * cols
	canvas.width = cellX * rows
	canvas.height = cellY * cols

	// Draw lines horizontally
	for (let x = 0; x < rows; x++) {
		ctx.beginPath()
		ctx.moveTo(cellX * x, 0)
		ctx.lineTo(cellX * x, canvas.width )
		ctx.strokeStyle = "black";
    	ctx.stroke();
	}
	// Draw lines vertically
	for (let y = 0; y < cols; y++) {
		ctx.beginPath()
		ctx.moveTo(0, cellY * y)
		ctx.lineTo(canvas.height , cellY * y)
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

createNewGrid = () => {
	// Get the grid length of the grid
	const gridSize = canvas.width/cellX
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	grid = create2DArray(gridSize)
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			grid[x][y] = characters.charAt(Math.floor(Math.random() * 26));
		}
	}
}

drawText = (ctx) => {
	const gridSize = canvas.width/cellX

	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			ctx.font = "32px Arial";
			ctx.textBaseline = 'top'
			ctx.fillText(grid[x][y], x * cellX, y * cellY);
			console.log(x * gridSize)
		}
	}
}

let init = () => {
	let ctx = canvas.getContext('2d')

	// Check if canvas is null
	if (ctx) {
		drawGrid(ctx ,16,16)
		createNewGrid()
		drawText(ctx)
		console.log(grid)
	}
	else {
		console.log("ERROR")
	}
}
