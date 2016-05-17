var colors;
var pickedColor;
var numOfSquares = 6;
var background = window.getComputedStyle(document.querySelector("body"), null).getPropertyValue("background-color");
var squares = document.querySelectorAll(".square");
var messageDisplay = document.querySelector("#message");
var resetButton = document.getElementById("reset");
var modeButtons = document.querySelectorAll(".mode");

init();

function init() {
    for (var i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function() {
            if (this.style.background === pickedColor) {
                messageDisplay.textContent = "Correct!";
                changeColors(pickedColor);
                document.querySelector("h1").style.background = pickedColor;
                resetButton.textContent = "Play again";
            } else {
                this.style.background = background;
                messageDisplay.textContent = "Try Again";
            }
        });
    }

    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].addEventListener("click", changeMode);
    }

    resetButton.addEventListener("click", function() {
        messageDisplay.textContent = "";
        this.textContent = "New Colors";
        document.querySelector("h1").style.background = "steelblue";
        setColors(numOfSquares);
    });

    setColors(numOfSquares);
}

function setColors(num) {
    colors = generateRandomColors(num);
    pickedColor = pickColor();
    document.getElementById("colorDisplay").textContent = pickedColor;
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.background = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
}

function pickColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function changeColors(color) {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = color;
    }
}

function generateRandomColors(num) {
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(randomcolor());
    }
    return arr;
}

function randomcolor() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function changeMode() {
    resetButton.textContent = "New Colors";
    messageDisplay.textContent = "";
    document.querySelector("h1").style.background = "steelblue";
    if (this.textContent === "Easy") {
        modeButtons[0].classList.add("selected");
        modeButtons[1].classList.remove("selected");
        numOfSquares = 3;
    } else {
        modeButtons[0].classList.remove("selected");
        modeButtons[1].classList.add("selected");
        numOfSquares = 6;
    }
    setColors(numOfSquares);
}
