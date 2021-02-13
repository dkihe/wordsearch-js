// Canvas 
let canvas = document.getElementById('grid')
let ctx = canvas.getContext('2d')

// Grid properties
let cellSize = 32
let gridSize = canvas.width/cellSize
// Grid array
let gridarray
// Wordbank array
let wordbankarray = []

// Draw the grid
let drawGrid = (ctx, gridLength) => {
	// Change canvas width and height according to the number of rows/cols
	canvas.style.width = cellSize * gridLength
	canvas.style.height = cellSize * gridLength
	canvas.width = cellSize * gridLength
	canvas.height = cellSize * gridLength
	gridSize = canvas.width/cellSize
	// Draw lines horizontallysss
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
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	gridarray = create2DArray(gridSize)
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			if (gridarray[x][y] == null) {
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				gridarray[x][y] = characters.charAt(Math.floor(Math.random() * 26));
				ctx.fillText(gridarray[x][y], x * cellSize, y * cellSize);
			}
		}
	}
}

// Create a new grid
let createGrid = () => {
	let gridSizeValue = parseInt(document.getElementById('gridsize').value)

	if (Number.isInteger(gridSizeValue)) {
		drawGrid(ctx, gridSizeValue)
		insertRandomChar(ctx)
		console.log(gridSize)
		sortWords(wordbankarray)
		console.log(wordbankarray)
	}
	else {
		console.log("not a number")
	}
}


// Creates a new input element
// ONCLICK EVENT
let createNewInputElem = () => {
	let wordinput = document.getElementById('wordinput')
	if (checkWordBankInput()) {
		appendToWordBank()
		let input = document.createElement('input')
		input.type = 'text'
		input.className = 'wordbank'
		wordinput.appendChild(input)
	}
	else {
		alert("Words must be bettween 3 and " + gridSize + " characters in length")
	}
}

// Check if each word in each input box is valid
let checkWordBankInput = () => {
	let wordbank = document.getElementsByClassName('wordbank')
	for (let i = 0; i < wordbank.length; i++) {
		if (wordbank[i].value.length < 3 || wordbank[i].value.length > gridSize) {
			return false
		}
	}
	return true
}

// Append new words to the wordbank array
let appendToWordBank = () => {
	wordbankarray = []
	let wordbank = document.getElementsByClassName('wordbank')
	for (let i = 0; i < wordbank.length; i++) {
		if (wordbank[i].value.length > 0) {
			wordbankarray.push(wordbank[i].value)
		}
	}
	console.log(wordbankarray)
}




// ALGORITHM
// 1. Sort words in word bank from decending order according to length
// 2. Pick random spot on grid
// 3. Place HEAD of array onto random spot

let sortWords = (arr) => {
	arr.sort((a, b) =>{
		return (a.length - b.length)
	})
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
