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

// Global bool to check if user has clicked the canvas
let isDown

// Globals needed for handling mouse events
// Offset positions
let prevX, prevY
// Grid positions
let gridposX, gridposY

// Saved grid image
let imageData

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
				ctx.font = "24px Montserrat";
				ctx.textBaseline = 'top'
				ctx.textAlign = "start";
				gridarray[x][y] = characters.charAt(Math.floor(Math.random() * 26));
				ctx.fillStyle = 'black'
				ctx.fillText(gridarray[x][y], x * cellSize, y * cellSize);
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
			ctx.textBaseline = 'top'
			ctx.textAlign = "start";
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
					drawGrid(ctx, gridSize)
					initGridArray()
					alert("Error fitting words.  Try inputting shoter words.")
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
						console.log(word[i] + ", " + gridarray[pointX + i][pointY])
						if ((gridarray[pointX + i][pointY] == null) || (gridarray[pointX + i][pointY] == word[i])) {
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
						console.log(word[i] + ", " + gridarray[pointX - i][pointY])
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
						console.log(word[i] + ", " + gridarray[pointX][pointY + i])
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
						console.log(word[i] + ", " + gridarray[pointX][pointY - i])
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
				gridarray[startX + i][startY] = word[i]

				// Fill Grid 
				ctx.font = "24px Montserrat";
				ctx.textBaseline = 'top'
				ctx.textAlign = "start";
				ctx.fillStyle = 'red'
				ctx.fillText(gridarray[startX + i][startY], (startX + i) * cellSize, startY * cellSize);
				break;
			case 1:
				gridarray[startX - i][startY] = word[i]

				// Fill Grid 
				ctx.font = "24px Montserrat";
				ctx.textBaseline = 'top'
				ctx.textAlign = "start";
				ctx.fillStyle = 'red'
				ctx.fillText(gridarray[startX - i][startY], (startX - i) * cellSize, startY * cellSize);
				break;
			case 2:
				gridarray[startX][(startY + i)] = word[i]

				// Fill Grid 
				ctx.font = "24px Montserrat";
				ctx.textBaseline = 'top'
				ctx.textAlign = "start";
				ctx.fillStyle = 'red'
				ctx.fillText(gridarray[startX][(startY + i)], startX * cellSize, (startY + i) * cellSize);
				break;
			case 3:
				gridarray[startX][(startY - i)] = word[i]

				// Fill Grid 
				ctx.font = "24px Montserrat";
				ctx.textBaseline = 'top'
				ctx.textAlign = "start";
				ctx.fillStyle = 'red'
				ctx.fillText(gridarray[startX][(startY - i)], startX * cellSize, (startY - i) * cellSize);
				break;
		}
	}
}

let init = () => {
	// Check if canvas is nullss
	if (ctx) {
		document.getElementById("grid").addEventListener("mousedown", (e) => handleMouseDown(e))
		document.getElementById("grid").addEventListener("mousemove", (e) => handleMouseMove(e))
		document.getElementById("grid").addEventListener("mouseup", (e) => handleMouseUp(e))
		// Create default grid
		drawGrid(ctx, 10)
		initGridArray()

		// TESTING
		// gridTest()


		console.log(gridSize)
		setNumInput(5)
		imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
		// insertRandomChar(ctx)
	}
	else {
		console.log("ERROR")
	}
}

let handleMouseDown = (e) => {

	e.preventDefault();

	// let rect = canvas.getBoundingClientRect()
	// let mouseX = window.event.clientX - rect.left
	// let mouseY = window.event.clientY - rect.top
	
	prevX = e.offsetX
	prevY = e.offsetY
	
	gridposX = Math.floor(prevX/cellSize)
	gridposY = Math.floor(prevY/cellSize)

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
	ctx.strokeStyle = "rgba(255, 238, 0, 0.75)"
	ctx.beginPath();
	ctx.lineWidth = (cellSize/2)
	ctx.moveTo(prevnearestCellX, prevnearestCellY);
	console.log("DELTA: " + dx, dy)

	if (Math.abs(dx) > Math.abs(dy)) {
		
		ctx.lineTo(offsetnearestCellX, prevnearestCellY);
		console.log(offsetnearestCellX, prevnearestCellY)
	}
	else {
		
		ctx.lineTo(prevnearestCellX, offsetnearestCellY);
		console.log(prevnearestCellX, offsetnearestCellY)
	}
	ctx.stroke()
	ctx.closePath()
}

let handleMouseUp = (e) => {
	e.preventDefault();
	isDown=false;
}

// ADD CLAMP FUNCTION FOR LINE DRAWING


let mouseDown = () => {
	// let temppos
	// let rect = canvas.getBoundingClientRect()
	// let mouseX = window.event.clientX - rect.left
	// let mouseY = window.event.clientY - rect.top

	// let gridposX = Math.floor(mouseX/cellSize)
	// let gridposY = Math.floor(mouseY/cellSize)
	

	// if (!clicked) {
	// 	ctx.fillStyle = "rgba(255, 238, 0, 0.5)";;
	// 	ctx.fillRect(gridposX * cellSize, gridposY * cellSize, cellSize, cellSize)
	// 	temppos = [gridposX, gridposY]
	// 	clicked = true
	// }
	// else {
		
	// }
	// console.log(gridposX, gridposY)


}
