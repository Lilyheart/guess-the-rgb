var colors;
var winningColor;
var numOfSquares = 6;
var colorRange = "Full"; // 0 = full, 1 = david
var background = window.getComputedStyle(document.querySelector("body"), null).getPropertyValue("background-color");
var squares = document.querySelectorAll(".square");
var messageDisplay = document.querySelector("#message");
var resetButton = document.getElementById("reset");
var modeButtons = document.querySelectorAll(".modeButton");
var rangeButtons = document.querySelectorAll(".rangeButton");

init();

function init() {
    for (var i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function() {
            if (this.style.background === winningColor) {
                messageDisplay.textContent = "Correct!";
                resetButton.textContent = "Play again";
                changeAllSquareColors(winningColor);
                document.querySelector("h1").style.background = winningColor;
            } else {
                messageDisplay.textContent = "Try Again";
                this.style.background = background;
            }
        });
    }

    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].addEventListener("click", changeMode);
    }

    for (var i = 0; i < rangeButtons.length; i++) {
        rangeButtons[i].addEventListener("click", changeRange);
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
    winningColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById("colorToGuess").textContent = winningColor;
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.background = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
}

function changeAllSquareColors(color) {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = color;
    }
}

function generateRandomColors(num) {
    var arr = [];
    arr.push(randomColor());
    console.log("Color 0: " + arr[0]);
    for (var i = 1; i < num; i++) {
        if(colorRange === "Full"){
            arr.push(randomColor());
            console.log("Color "+i+": " + arr[i]);
        } else {
            arr.push(closeRandomColor(arr[i-1]));
            console.log("Color "+i+": " + arr[i]);
        }
    }
    arr = shuffleColors(arr);
    return arr;
}

function randomColor() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function closeRandomColor(str) {
    var rgb = str.match(/\d+/g);
    for (var i = 0; i < rgb.length; i++) {
        rgb[i] = Number(rgb[i]);
        var variance = Math.floor(Math.random() * 60) * (Math.random() < 0.5 ? -1 : 1);
        console.log(rgb[i] + "+" + variance);

        if(rgb[i] + variance > 255 || rgb[i] + variance < 0) {
            rgb[i] = rgb[i] - variance;
        } else {
            rgb[i] = rgb[i] + variance;
        }
    }
    return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}

//Using Durstenfeld shuffle algorithm.
function shuffleColors(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function changeMode() {
    document.querySelector(".mode").innerHTML = this.textContent + " <span class=\"caret\">";
    setModeOptions(this.textContent);
    resetText();
}

function setModeOptions(str) {
    if (str === "Easy") {
        numOfSquares = 3;
        document.querySelector("#container").style.maxWidth = "600px";
    } else if (str === "Hard") {
        numOfSquares = 6;
        document.querySelector("#container").style.maxWidth = "600px";
    } else {
        numOfSquares = 16;
        document.querySelector(".mode").innerHTML = "Hardest <span class=\"caret\">";
        document.querySelector("#container").style.maxWidth = "800px";
    }
}

function changeRange() {
    if(this.textContent === "Full") {
        document.querySelector(".range").innerHTML = "Full Colors <span class=\"caret\">";
    } else {
        document.querySelector(".range").innerHTML = "Close Colors <span class=\"caret\">";
    }
    colorRange = this.textContent;
    resetText();
}

function resetText() {
    resetButton.textContent = "New Colors";
    messageDisplay.textContent = "";
    document.querySelector("h1").style.background = "steelblue";
    setColors(numOfSquares);
}
