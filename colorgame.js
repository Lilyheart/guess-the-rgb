var colors;
var winningColor;
var numOfGuesses = 6;
var colorRange = "Full"; // 0 = full, 1 = david
var background = window.getComputedStyle(document.querySelector("body"), null).getPropertyValue("background-color");
var possibleGuesses = document.querySelectorAll(".colorGuess");
var messageDisplay = document.querySelector("#message");
var resetButton = document.getElementById("reset");
var modeButtons = document.querySelectorAll(".modeButton");
var rangeButtons = document.querySelectorAll(".rangeButton");

function changeAllColors(color) {
    for (var i = 0; i < possibleGuesses.length; i++) {
        possibleGuesses[i].style.background = color;
    }
}

function setGuess() {
    if (this.style.background === winningColor) {
        messageDisplay.textContent = "Correct!";
        resetButton.textContent = "Play again";
        changeAllColors(winningColor);
        document.querySelector("h1").style.background = winningColor;
    } else {
        messageDisplay.textContent = "Try Again";
        this.style.background = background;
    }
}

function setModeOptions(str) {
    if (str === "Easy") {
        numOfGuesses = 3;
        document.querySelector(".mode").innerHTML = "Easy <div class=\"arrow-down\"></div>";
        document.querySelector("#container").style.maxWidth = "600px";
    } else if (str === "Hard") {
        numOfGuesses = 6;
        document.querySelector(".mode").innerHTML = "Hard <div class=\"arrow-down\"></div>";
        document.querySelector("#container").style.maxWidth = "600px";
    } else {
        numOfGuesses = 16;
        document.querySelector(".mode").innerHTML = "Hardest <div class=\"arrow-down\"></div>";
        document.querySelector("#container").style.maxWidth = "800px";
    }
}

function setColors(num) {
    colors = generateRandomColors(num);
    winningColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById("colorToGuess").textContent = winningColor;
    for (var i = 0; i < possibleGuesses.length; i++) {
        if (colors[i]) {
            possibleGuesses[i].style.display = "block";
            possibleGuesses[i].style.background = colors[i];
        } else {
            possibleGuesses[i].style.display = "none";
        }
    }
}

function resetText() {
    resetButton.textContent = "New Colors";
    messageDisplay.textContent = "";
    document.querySelector("h1").style.background = "steelblue";
    setColors(numOfGuesses);
}

function changeMode() {
    document.querySelector(".mode").innerHTML = this.textContent + " <span class=\"caret\">";
    setModeOptions(this.textContent);
    resetText();
}

function changeRange() {
    if (this.textContent === "Full") {
        document.querySelector(".range").innerHTML = "Full Colors  <div class=\"arrow-down\"></div>";
    } else {
        document.querySelector(".range").innerHTML = "Close Colors  <div class=\"arrow-down\"></div>";
    }
    colorRange = this.textContent;
    resetText();
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

        if (rgb[i] + variance > 255 || rgb[i] + variance < 0) {
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

function generateRandomColors(num) {
    var arr = [];
    arr.push(randomColor());
    for (var i = 1; i < num; i++) {
        if (colorRange === "Full") {
            arr.push(randomColor());
        } else {
            arr.push(closeRandomColor(arr[i - 1]));
        }
    }
    arr = shuffleColors(arr);
    return arr;
}

function init() {
    for (var i = 0; i < possibleGuesses.length; i++) {
        possibleGuesses[i].addEventListener("click", setGuess);
    }

    for (i = 0; i < modeButtons.length; i++) {
        modeButtons[i].addEventListener("click", changeMode);
    }

    for (i = 0; i < rangeButtons.length; i++) {
        rangeButtons[i].addEventListener("click", changeRange);
    }

    resetButton.addEventListener("click", function() {
        messageDisplay.textContent = "";
        this.textContent = "New Colors";
        document.querySelector("h1").style.background = "steelblue";
        setColors(numOfGuesses);
    });

    setColors(numOfGuesses);
}

init();
