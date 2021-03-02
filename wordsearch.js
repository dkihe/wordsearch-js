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
let fontSize = 24

// Global bool to check if user has clicked the canvas
let isDown

// Globals needed for handling mouse events
// Offset positions
let prevX, prevY

// Grid starting position and end position when using mouse
let gridStart
let gridEnd

// Saved grid image
let imageData

// Initialize the program (run ONLOAD)
let init = () => {
	// Check if canvas is nullss
	if (ctx) {
		document.getElementById("grid").addEventListener("mousedown", (e) => handleMouseDown(e))
		document.getElementById("grid").addEventListener("mousemove", (e) => handleMouseMove(e))
		document.getElementById("grid").addEventListener("mouseup", (e) => handleMouseUp(e))
		// Create default grid
		appendToWordBank()
		drawGrid(ctx, 10)
		initGridArray()
		sortWords(wordbankarray)
		console.log(wordbankarray)

		// TESTING
		// gridTest()


		console.log(gridSize)
		checkWordPlacement()
		insertRandomChar(ctx)
		imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	}
	else {
		console.log("ERROR")
	}
}

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
let insertRandomChar = () => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			if (gridarray[x][y] == null) {
				ctx.font = fontSize + "px Montserrat";
				ctx.textBaseline = 'middle'
				ctx.textAlign = "center";
				gridarray[x][y] = characters.charAt(Math.floor(Math.random() * 26));
				ctx.fillStyle = 'black'
				ctx.fillText(gridarray[x][y], x * cellSize + (cellSize/2), y * cellSize + (cellSize/2));
			}
		}
	}
}

// Create a new grid
// ONCLICK EVENT
let createGrid = () => {
	wordbankarray = []
	if (checkWordBankInput()) {
		appendToWordBank()
		drawGrid(ctx, gridSize)
		initGridArray()
		sortWords(wordbankarray)
		console.log(wordbankarray)
		checkWordPlacement()
		insertRandomChar()
		let inputcollection = document.getElementsByClassName('wordbank')
		for (element of inputcollection) {
			element.style.textDecoration = "none"
		}
		imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
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
			ctx.font = "16px Montserrat";
			ctx.textBaseline = 'middle'
			ctx.textAlign = "center";
			ctx.fillText(gridarray[x][y], x * cellSize, y * cellSize);
		}
	}
}

// Redraws the grid
let redrawGrid = () => {
	drawGrid(ctx, gridSize)
	initGridArray()
}

// Check if each word in each input box is valid
let checkWordBankInput = () => {
	let wordbank = document.getElementsByClassName('wordbank')
	for (let i = 0; i < wordbank.length; i++) {
		let word = wordbank[i].value.replace(/\s/g, '');
		if (word.length < 3 || word.length > gridSize) {
			if (word.length == 0) {
				continue
			}
			return false
		}
	}
	return true
}

// Append new words to the wordbank array
let appendToWordBank = () => {
	let wordbank = document.getElementsByClassName('wordbank')
	for (let i = 0; i < wordbank.length; i++) {
		let word = wordbank[i].value.replace(/\s/g, '').toUpperCase();
		wordbank[i].id = word
		if (word.length > 0) {
			wordbankarray.push(word)
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
	
	// console.log("RANDOM POINT: " + randPointX + ", " + randPointY)

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
					// console.log("WORDS CANT FIT")
					drawGrid(ctx, gridSize)
					initGridArray()
					alert("Error fitting words.  Try inputting shoter words.")
					break
				}
				// console.log("RETURNED FALSE")
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
							continue
						}
						else {
							return false
						}
					}
					else {
						return false
					}
				}
				return true

			case 1:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointX - wordLength >= 0)) {
						if ((gridarray[pointX - i][pointY] == null) || (gridarray[pointX - i][pointY] == word[i])) {
							continue
						}
						else {
							return false
						}
					}
					else {
						return false
					}
				}
				return true

			case 2:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointY + wordLength <= gridSize - 1)) {
						if ((gridarray[pointX][pointY + i] == null) || (gridarray[pointX][pointY + i] == word[i])) {
							continue
						}
						else {
							return false
						}
					}
					else {
						return false
					}
				}
				return true

			case 3:
				for (let i = 0; i <= wordLength; i++) {
					if ((pointY - wordLength >= 0)) {
						if ((gridarray[pointX][pointY - i] == null) || (gridarray[pointX][pointY - i] == word[i])) {
							continue
						}
						else {
							return false
						}
					}
					else {
						return false
					}
				}
				return true
	}
}

// Placesa the current word on the grid
let placeWord = (word, startX, startY, dir) => {
	for (let i = 0; i < word.length; i++) {
		switch (dir) {
			case 0:
				gridarray[startX + i][startY] = word[i]

				// Fill Grid 
				ctx.font = fontSize + "px Montserrat";
				ctx.textBaseline = 'middle'
				ctx.textAlign = "center";
				// ctx.fillStyle = 'red'
				ctx.fillText(gridarray[startX + i][startY], (startX + i) * cellSize + (cellSize/2), startY * cellSize + (cellSize/2));
				break;
			case 1:
				gridarray[startX - i][startY] = word[i]

				// Fill Grid 
				ctx.font = fontSize + "px Montserrat";
				ctx.textBaseline = 'middle'
				ctx.textAlign = "center";
				// ctx.fillStyle = 'red'
				ctx.fillText(gridarray[startX - i][startY], (startX - i) * cellSize + (cellSize/2), startY * cellSize + (cellSize/2));
				break;
			case 2:
				gridarray[startX][(startY + i)] = word[i]

				// Fill Grid 
				ctx.font = fontSize + "px Montserrat";
				ctx.textBaseline = 'middle'
				ctx.textAlign = "center";
				// ctx.fillStyle = 'red'
				ctx.fillText(gridarray[startX][(startY + i)], startX * cellSize + (cellSize/2), (startY + i) * cellSize + (cellSize/2));
				break;
			case 3:
				gridarray[startX][(startY - i)] = word[i]

				// Fill Grid 
				ctx.font = fontSize + "px Montserrat";
				ctx.textBaseline = 'middle'
				ctx.textAlign = "center";
				// ctx.fillStyle = 'red'
				ctx.fillText(gridarray[startX][(startY - i)], startX * cellSize + (cellSize/2), (startY - i) * cellSize + (cellSize/2));
				break;
		}
	}
}

let handleMouseDown = (e) => {

	e.preventDefault();
	
	prevX = e.offsetX
	prevY = e.offsetY
	
	let gridposX = Math.floor(prevX/cellSize)
	let gridposY = Math.floor(prevY/cellSize)

	gridStart = [gridposX, gridposY]

	isDown = true;

	// console.log("OFFSET: " + prevX, prevY)
	// console.log("GRID POS: " + gridposX, gridposY)
}

let handleMouseMove = (e) => {
	if(!isDown) {
		return;
	}

	e.preventDefault();   

	let prevnearestCellX = (cellSize * Math.floor(prevX/cellSize)) + (cellSize/2)
	let prevnearestCellY = (cellSize * Math.floor(prevY/cellSize)) + (cellSize/2)
	let offsetnearestCellX = (cellSize * Math.floor(e.offsetX/cellSize)) + (cellSize/2)
	let offsetnearestCellY = (cellSize * Math.floor(e.offsetY/cellSize)) + (cellSize/2)
	// Change in X/Y
	let dx = offsetnearestCellX - prevnearestCellX
	let dy = offsetnearestCellY - prevnearestCellY


	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.putImageData(imageData,0,0)
	ctx.strokeStyle = "rgba(255, 238, 0, 0.5)"
	ctx.beginPath();
	ctx.lineWidth = (cellSize/2)
	ctx.moveTo(prevnearestCellX, prevnearestCellY);

	if (Math.abs(dx) > Math.abs(dy)) {
		
		ctx.lineTo(offsetnearestCellX, prevnearestCellY);
	}
	else {
		
		ctx.lineTo(prevnearestCellX, offsetnearestCellY);
	}
	ctx.stroke()
	ctx.closePath()
}

let handleMouseUp = (e) => {
	e.preventDefault();

	let gridposX = Math.floor(e.offsetX/cellSize)
	let gridposY = Math.floor(e.offsetY/cellSize)

	gridEnd = [gridposX, gridposY]

	if (getHighlightedWord (gridStart, gridEnd)) {
		imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
		// console.log(wordbankarray)
		if (wordbankarray.length <= 0) {
			alert("All words have been found!")
		}
	}
	else {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.putImageData(imageData,0,0)
	}

	isDown=false;
}

// ADD CLAMP FUNCTION FOR LINE DRAWING

let getHighlightedWord = (gridS, gridE) => {
	let gsX = gridS[0]
	let gsY = gridS[1]
	let geX = gridE[0]
	let geY = gridE[1]

	// console.log("START: " + gsX, gsY)
	// console.log("END: " + geX, geY)
	// console.log("START LETTER: " + gridarray[gsX][gsY])
	// console.log("END LETTER: " + gridarray[geX ][geY])
	
	console.log(geX - gsX , geY - gsY)

	let answer = []
	let dir

	if ( geX - gsX  != 0 ) {
		dir = Math.sign(geX - gsX) 
		for (let i = 0; i <= Math.abs(gsX - geX); i++) {
			answer.push(gridarray[gsX + (i * dir)][gsY])
		}
	}
	else {
		dir = Math.sign(geY - gsY)
		for (let i = 0; i <= Math.abs(gsY - geY); i++) {
			answer.push(gridarray[gsX][gsY + (i * dir)])
		}
	}
	let ans = checkWord(answer)

	if (ans) {
		return true
	}
	else {
		return false
	}
}

checkWord = (word) => {
	// console.log(word)
	if (wordbankarray.length > 0) {
		if (wordbankarray.indexOf(word.join('')) >= 0) {
			console.log(word.join(''))
			document.getElementById(word.join('')).style.textDecoration = "line-through"
			wordbankarray = wordbankarray.filter(element => { 
				console.log(element, word.join(''))
				return element != word.join('') 
			})
			console.log(wordbankarray)
			return true
		}
		else if (wordbankarray.indexOf(word.reverse().join('')) >= 0){
			console.log(word.reverse().join(''))
			document.getElementById(word.reverse().join('')).style.textDecoration = "line-through"
			wordbankarray = wordbankarray.filter(element => { 
				console.log(element, word.reverse().join(''))
				return element != word.reverse().join('') 
			})
			console.log(wordbankarray)
			return true
		}
	}
	else {
		console.log("none")
		return false
	}
}