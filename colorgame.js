var background = window.getComputedStyle(document.querySelector("body"), null).getPropertyValue("background-color"),
    closeColorRange = 60,
    colorRange = "Full",
    colors,
    messageDisplay = document.querySelector("#message"),
    modeButtons = document.querySelectorAll(".modeButton"),
    numOfGuesses = 6,
    possibleGuesses = document.querySelectorAll(".colorGuess"),
    rangeButtons = document.querySelectorAll(".rangeButton"),
    resetButton = document.getElementById("reset"),
    TOTAL_NUMBER_OF_COLORS = 255,
    winningColor;

function changeAllColors(color) {
    for (var i = 0; i < possibleGuesses.length; i+=1) {
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

function randomColor() {
    var b, g, r;
    r = Math.floor(Math.random() * TOTAL_NUMBER_OF_COLORS);
    g = Math.floor(Math.random() * TOTAL_NUMBER_OF_COLORS);
    b = Math.floor(Math.random() * TOTAL_NUMBER_OF_COLORS);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function closeRandomColor(str) {
    var i,
        rgb = str.match(/\d+/g),
        variance;

    for (i = 0; i < rgb.length; i+=1) {
        rgb[i] = Number(rgb[i]);
        if (Math.round(Math.random()) === 0) {
            variance = Math.floor(Math.random() * closeColorRange);
        } else {
            variance = -Math.floor(Math.random() * closeColorRange);
        }
        
        if (rgb[i] + variance > TOTAL_NUMBER_OF_COLORS || rgb[i] + variance < 0) {
            rgb[i] = rgb[i] - variance;
        } else {
            rgb[i] = rgb[i] + variance;
        }
    }
    return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}

//Using Durstenfeld shuffle algorithm.
function shuffleColors(arr) {
    var i, j, temp;
    for (i = arr.length - 1; i > 0; i-=1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function generateRandomColors(num) {
    var arr = [], i;
    arr.push(randomColor());
    for (i = 1; i < num; i+=1) {
        if (colorRange === "Full") {
            arr.push(randomColor());
        } else {
            arr.push(closeRandomColor(arr[i - 1]));
        }
    }
    arr = shuffleColors(arr);
    return arr;
}

function setColors(num) {
    colors = generateRandomColors(num);
    winningColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById("colorToGuess").textContent = winningColor;
    for (var i = 0; i < possibleGuesses.length; i+=1) {
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

function init() {
    var i;

    for (i = 0; i < possibleGuesses.length; i+=1) {
        possibleGuesses[i].addEventListener("click", setGuess);
    }

    for (i = 0; i < modeButtons.length; i+=1) {
        modeButtons[i].addEventListener("click", changeMode);
    }

    for (i = 0; i < rangeButtons.length; i+=1) {
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
