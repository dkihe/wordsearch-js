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
let createGrid = () => {
	let gridSizeValue = parseInt(document.getElementById('gridsize').value)
	if (Number.isInteger(gridSizeValue)) {
		drawGrid(ctx, gridSizeValue)
		initGridArray()
		// insertRandomChar(ctx)
		// Testing
		sortWords(wordbankarray)
		console.log(wordbankarray)
		console.log("GRID SIZE: " + gridSize)
		// checkWordPlacement(wordbankarray[0],3)
		for (let i = 0; i < wordbankarray.length; i++) {
			let rand = Math.floor(Math.random() * 4)
			checkWordPlacement(wordbankarray[i],rand)
		}
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
		return (a.length - b.length)
	})
}

// Checks if a word can fit at a random location on the grid.  Dir refers to the direction on the word
let checkWordPlacement = (word, dir) => {
	// dir
	// 0: forward
	// 1: backward
	// 2: down
	// 3: up
	// 4: diagonal (forward-up)
	// 5: diagonal (backward-down)
	// 6: diagonal (forward-up)
	// 7: diagonal (backward-down)
	let isPlaced = false
	let wordLength = word.length - 1
	let randPointX, randPointY

	while (!isPlaced) {
		randPointX = Math.floor(Math.random() * (gridSize - 1))
		randPointY = Math.floor(Math.random() * (gridSize - 1))
		switch (dir) {
			// Forward
			case 0:
				console.log("RANDOM POINT: " + randPointX + ", " + randPointY)
				console.log("FIT POINT: " + (randPointX + wordLength) + ", " + randPointY)
				if ((randPointX + wordLength < gridarray.length) && (gridarray[randPointX + wordLength][randPointY] == null)) {
					// console.log("RANDOM POINT: " + randPointX + ", " + randPointY)
					// console.log("FIT POINT: " + (randPointX + wordLength) + ", " + randPointY)
					for (let i = 0; i < word.length; i++) {
						if (gridarray[randPointX + i][randPointY] == word[i]) {
							console.log("SAME WORD")
							continue
						}
						else if (gridarray[randPointX + i][randPointY] == null) {
							console.log("NULL LOCATION")
							continue
						}
						else {
							console.log("NOTHING")
							break
						}
					}
					console.log("CAN FIT")
					// console.log(gridarray)
					isPlaced = true
				}
				else {
					console.log("CAN'T FIT")
					break
				}
				// placeWord(word, randPointX, randPointY, dir)
			// Backward
			case 1:
				console.log("RANDOM POINT: " + randPointX + ", " + randPointY)
				console.log("FIT POINT: " + (randPointX - wordLength) + ", " + randPointY)
				if ((randPointX - wordLength >= 0) && (gridarray[randPointX - wordLength][randPointY] == null)) {
					for (let i = 0; i < word.length; i++) {
						if (gridarray[randPointX - i][randPointY] == word[i]) {
							console.log("SAME WORD")
							continue
						}
						else if (gridarray[randPointX - i][randPointY] == null) {
							console.log("NULL LOCATION")
							continue
						}
						else {
							console.log("NOTHING")
							break
						}
					}
					console.log("FIT")
					// console.log(gridarray)
					isPlaced = true
					// placeWord(word, randPointX, randPointY, dir)
				}
				else {
					console.log("CAN'T FIT")
					break;
				}
			// Down
			case 2:
				console.log("RANDOM POINT: " + randPointX + ", " + randPointY)
				console.log("FIT POINT: " + randPointX + ", " + (randPointY + wordLength))
				if ((randPointY + wordLength < gridarray.length) && (gridarray[randPointX][randPointY + wordLength] == null)) {
					for (let i = 0; i < word.length; i++) {
						if (gridarray[randPointX][randPointY + i] == word[i]) {
							console.log("SAME WORD")
							continue
						}
						else if (gridarray[randPointX][randPointY + i] == null) {
							console.log("NULL LOCATION")
							continue
						}
						else {
							console.log("NOTHING")
							break
						}
					}
					console.log("FIT")
					// console.log(gridarray)
					isPlaced = true
					// placeWord(word, randPointX, randPointY, dir)
				}
				else {
					console.log("CAN'T FIT")
					break
				}
			// Up
			case 3:
				console.log("RANDOM POINT: " + randPointX + ", " + randPointY)
				console.log("FIT POINT: " + randPointX + ", " + (randPointY - wordLength))
				if ((randPointY - wordLength >= 0) && (gridarray[randPointX][randPointY - wordLength] == null)) {
					for (let i = 0; i < word.length; i++) {
						if (gridarray[randPointX][randPointY - i] == word[i]) {
							console.log("SAME WORD")
							continue
						}
						else if (gridarray[randPointX][randPointY - i] == null) {
							console.log("NULL LOCATION")
							continue
						}
						else {
							console.log("NOTHING")
							break
						}
					}
					console.log("FIT")
					// console.log(gridarray)
					isPlaced = true
					// placeWord(word, randPointX, randPointY, dir)
				}
				else {
					console.log("CAN'T FIT")
					break
				}
		}
	}
	placeWord(word, randPointX, randPointY, dir)
}

let placeWord = (word, startX, startY, dir) => {
	for (let i = 0; i < word.length; i++) {
		switch (dir) {
			case 0:
				console.log(word[i])
				console.log("PLACE AT: " + (startX + i) + ", " + startY)
				gridarray[startX + i][startY] = word[i]

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX + i][startY], (startX + i) * cellSize, startY * cellSize);
				console.log(gridarray)
				break;
			case 1:
				console.log(word[i])
				console.log("PLACE AT: " + (startX - i) + ", " + startY)
				gridarray[startX - i][startY] = word[i]

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX - i][startY], (startX - i) * cellSize, startY * cellSize);
				break;
			case 2:
				console.log(word[i])
				console.log("PLACE AT: " + startX + ", " + (startY + i))
				gridarray[startX][(startY + i)] = word[i]

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX][(startY + i)], startX * cellSize, (startY + i) * cellSize);
				break;
			case 3:
				console.log(word[i])
				console.log("PLACE AT: " + startX + ", " + (startY - i))
				gridarray[startX][(startY - i)] = word[i]

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX][(startY - i)], startX * cellSize, (startY - i) * cellSize);
				break;
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
