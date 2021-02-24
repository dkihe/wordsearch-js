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

// Create a new grid
// ONCLICK EVENT
let createGrid = () => {
	if (checkWordBankInput()) {
		appendToWordBank()
		drawGrid(ctx, gridSize)
		initGridArray()
		sortWords(wordbankarray)
		console.log(wordbankarray)
		checkWordPlacement()
	}
	else {
		alert("Words must be bettween 3 and " + gridSize + " characters in length")
	}
}

let setGridSize = () => {
	if (document.getElementById('small').checked) {
		gridSize = document.getElementById('small').value
		setNumInput(5)
	}
	else if (document.getElementById('medium').checked) {
		gridSize = document.getElementById('medium').value
		setNumInput(8)
	}
	else if (document.getElementById('large').checked) {
		gridSize = document.getElementById('large').value
		setNumInput(10)
	}
}

let setNumInput = (size) => {
	document.getElementById('wordinput').innerHTML = ""
	for (let i = 0; i < size; i++) {
		let input = document.createElement('input')
		input.type = 'text'
		input.className = 'wordbank'
		wordinput.appendChild(input)
	}
}

// Simple test function to see layout of grid
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

// Redraws the grid
let redrawGrid = () => {
	drawGrid(ctx, gridSize)
	initGridArray()
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
			if (wordbank[i].value.length == 0) {
				continue
			}
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
}


// Sort an array (arr) in descending order according to word length
let sortWords = (arr) => {
	arr.sort((a, b) =>{
		return (b.length - a.length)
	})
}
	
// Checks if a word can fit at a random location on the grid.  Dir refers to the direction on the word
let checkWordPlacement = () => {
	let isPlaced = false
	let randPointX, randPointY, dir
	let loops = 0
	let looplimit = 100

	// Get random point
	randPointX = Math.floor(Math.random() * (gridSize - 1))
	randPointY = Math.floor(Math.random() * (gridSize - 1))
	
	console.log("RANDOM POINT: " + randPointX + ", " + randPointY)

	dir = Math.floor(Math.random() * 4)
	for (let word = 0; word < wordbankarray.length; word++) {
		while ((!isPlaced || loops <= looplimit)) {
			if (checkFit(wordbankarray[word], randPointX, randPointY, dir)) {
				placeWord(wordbankarray[word], randPointX, randPointY, dir)
				isPlaced = true
				break
			}
			else {
				if (loops >= looplimit) {
					isPlaced = true
					console.log("WORDS CANT FIT")
					eraseGrid ()
					break
				}
				console.log("RETURNED FALSE")
				loops += 1
				dir = Math.floor(Math.random() * 4)
				randPointX = Math.floor(Math.random() * (gridSize - 1))
				randPointY = Math.floor(Math.random() * (gridSize - 1))
			}
		}
	}
}

// Checks to see if the current word will fit at a specific point on the grid
let checkFit = (word, pointX, pointY, dir) => {
	let wordLength = word.length - 1
		switch (dir) {
			case 0:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointX + wordLength <= gridSize - 1)) {
						if ((gridarray[pointX + i][pointY] == null) || (gridarray[pointX + i][pointY] == word[i])) {
							console.log(word[i])
							console.log("PLACE: " + word[i] + " AT: " + (pointX + i) + ", " + pointY)
						}
						else {
							console.log("DOES NOT FIT")
							return false
						}
					}
					else {
						console.log("DOES NOT FIT")
						return false
					}
				}
				return true
				break
			case 1:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointX - wordLength >= 0)) {
						if ((gridarray[pointX - i][pointY] == null) || (gridarray[pointX - i][pointY] == word[i])) {
							console.log("PLACE: " + word[i] + " AT: " + (pointX - i) + ", " + pointY)
						}
						else {
							console.log("DOES NOT FIT")
							return false
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
						if ((gridarray[pointX][pointY + i] == null) || (gridarray[pointX][pointY + i] == word[i])) {
							console.log("PLACE: " + word[i] + " AT: " + pointX + ", " + (pointY + i))
						}
						else {
							console.log("DOES NOT FIT")
							return false
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
						if ((gridarray[pointX][pointY - i] == null) || (gridarray[pointX][pointY - i] == word[i])) {
							console.log("PLACE: " + word[i] + " AT: " + pointX + ", " + (pointY - i))
						}
						else {
							console.log("DOES NOT FIT")
							return false
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

// Placesa the current word on the grid
let placeWord = (word, startX, startY, dir) => {
	for (let i = 0; i < word.length; i++) {
		switch (dir) {
			case 0:
				gridarray[startX + i][startY] = word[i].toUpperCase()

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX + i][startY], (startX + i) * cellSize, startY * cellSize);
				break;
			case 1:
				gridarray[startX - i][startY] = word[i].toUpperCase()

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX - i][startY], (startX - i) * cellSize, startY * cellSize);
				break;
			case 2:
				gridarray[startX][(startY + i)] = word[i].toUpperCase()

				// Fill Grid 
				ctx.font = "32px Arial";
				ctx.textBaseline = 'top'
				ctx.fillText(gridarray[startX][(startY + i)], startX * cellSize, (startY + i) * cellSize);
				break;
			case 3:
				gridarray[startX][(startY - i)] = word[i].toUpperCase()

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
		drawGrid(ctx, 10)
		initGridArray()
		console.log(gridSize)
		setNumInput(5)
		// insertRandomChar(ctx)
	}
	else {
		console.log("ERROR")
	}
}
