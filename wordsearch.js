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
let create2DArray = (size) => {
	let array = [];
	for (let x = 0; x < size; x++) {
		array.push([]);
		for (let y = 0; y < size; y++) {
			array[x].push(null);
		}
	}
	return array;
};

// Initialize the grid array
let initGridArray = () => {
	gridarray = create2DArray(gridSize)
}

// Insert random characters on the grid array and the grid itself
let insertRandomChar = (ctx) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
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

let insertChar = () => {
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			if (gridarray[x][y] != null) {
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[x][y], x * cellSize, y * cellSize);
			}
		}
	}
}

// Create a new grid
// ONCLICK EVENT
let createGrid = () => {
	let gridSizeValue = parseInt(document.getElementById('gridsize').value)
	if (Number.isInteger(gridSizeValue)) {
		drawGrid(ctx, gridSizeValue)
		initGridArray()
		// insertRandomChar(ctx)
		// Testing
		sortWords(wordbankarray)
		// console.log("GRID SIZE: " + gridSize)

		// // gridTest()
		// // Testing
		for (let i = 0; i < wordbankarray.length; i++) {
			checkWordPlacement(wordbankarray[i])
		}



	}
	else {
		console.log("not a number")
	}
}

let gridTest = () => {
	console.log(gridSize)
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			gridarray[x][y] = x + ", " + y

			// Fill Grid 
			ctx.font = "16px Arial";
			ctx.textBaseline = 'top'
			ctx.fillText(gridarray[x][y], x * cellSize, y * cellSize);
		}
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
		// Testing
		// checkWordPlacement(wordbankarray[0],3)
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
// 1. Sort words in word bank from descending order according to length
// 2. Pick random spot on grid
// 3. Place HEAD of array onto random spot

// Sort an array (arr) in descending order according to word length
let sortWords = (arr) => {
	arr.sort((a, b) =>{
		return (b.length - a.length)
	})
}
	
	// Checks if a word can fit at a random location on the grid.  Dir refers to the direction on the word
let checkWordPlacement = (word) => {
	let isPlaced = false
	let wordLength = word.length - 1
	let randPointX, randPointY, dir

	
	
	// Get random point
	randPointX = Math.floor(Math.random() * (gridSize - 1))
	randPointY = Math.floor(Math.random() * (gridSize - 1))
	
	console.log("RANDOM POINT: " + randPointX + ", " + randPointY)

	dir = Math.floor(Math.random() * 4)
	while (!isPlaced) {
		if (checkFit(word, randPointX, randPointY, dir)) {
			placeWord(word, randPointX, randPointY, dir)
			isPlaced = true
		}
		else {
			console.log("RETURNED FALSE")
			dir = Math.floor(Math.random() * 4)
			randPointX = Math.floor(Math.random() * (gridSize - 1))
			randPointY = Math.floor(Math.random() * (gridSize - 1))
		}
	}
}

let checkFit = (word, pointX, pointY, dir) => {
	let wordLength = word.length - 1
		switch (dir) {
			case 0:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointX + wordLength <= gridSize - 1)) {
						if (gridarray[pointX + i][pointY] == null || gridarray[pointX + i][pointY] == word[i]) {
							console.log(word[i])
							console.log("PLACE: " + word[i] + " AT: " + (pointX + i) + ", " + pointY)
						}
						else {
							console.log("DOES NOT FIT")
							return false
						}
					}
					else {
						return false
					}
				}
				return true
				break
			case 1:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointX - wordLength >= 0)) {
						if (gridarray[pointX - i][pointY] == null || gridarray[pointX - i][pointY] == word[i]) {
							console.log("PLACE: " + word[i] + " AT: " + (pointX - i) + ", " + pointY)
						}
					}
					else {
						console.log("DOES NOT FIT")
						return false
					}
				}
				return true
				break
			case 2:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointY + wordLength <= gridSize - 1)) {
						if (gridarray[pointX][pointY + i] == null || gridarray[pointX][pointY + i] == word[i]) {
							console.log("PLACE: " + word[i] + " AT: " + pointX + ", " + (pointY + i))
						}
					}
					else {
						console.log("DOES NOT FIT")
						return false
					}
				}
				return true
				break
			case 3:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointY - wordLength >= 0)) {
						if (gridarray[pointX][pointY - i] == null || gridarray[pointX][pointY - i] == word[i]) {
							console.log("PLACE: " + word[i] + " AT: " + pointX + ", " + (pointY - i))
						}
					}
					else {
						console.log("DOES NOT FIT")
						return false
					}
				}
				return true
				break
	}
}

let placeWord = (word, startX, startY, dir) => {
	for (let i = 0; i < word.length; i++) {
		switch (dir) {
			case 0:
				gridarray[startX + i][startY] = word[i]

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX + i][startY], (startX + i) * cellSize, startY * cellSize);
				break;
			case 1:
				gridarray[startX - i][startY] = word[i]

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX - i][startY], (startX - i) * cellSize, startY * cellSize);
				break;
			case 2:
				gridarray[startX][(startY + i)] = word[i]

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX][(startY + i)], startX * cellSize, (startY + i) * cellSize);
				break;
			case 3:
				gridarray[startX][(startY - i)] = word[i]

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX][(startY - i)], startX * cellSize, (startY - i) * cellSize);
				break;
		}
	}
}

let init = () => {
	// Check if canvas is nullss
	if (ctx) {
		// Create default grid
		drawGrid(ctx, 6)
		initGridArray()
		console.log(gridSize)
		// insertRandomChar(ctx)
	}
	else {
		console.log("ERROR")
	}
}
