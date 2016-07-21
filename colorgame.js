var closeColorRange = 60,
    colorRange = "Full",
    colors,
    MAX_RGB = 255,
    messageDisplay = document.querySelector("#message"),
    modeButtons = document.querySelectorAll(".modeButton"),
    modeElement = document.querySelector(".mode"),
    numOfGuesses = 6,
    possibleGuesses = document.querySelectorAll(".colorGuess"),
    rangeButtons = document.querySelectorAll(".rangeButton"),
    resetButton = document.getElementById("reset"),
    winningColor;

function getBackgroundColor() {
    var backgroundColor,
        element,
        style;

    element = document.querySelector("body");
    style = window.getComputedStyle(element, null);
    backgroundColor = style.getPropertyValue("background-color");

    return backgroundColor;
}

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
        this.style.background = getBackgroundColor();
    }
}

function setModeOptions(totalGuesses, difficulty, width) {
    numOfGuesses = totalGuesses;
    modeElement.innerHTML = difficulty + " <div class=\"arrow-down\"></div>";
    document.querySelector("#container").style.maxWidth = width;
}

function selectModeOptions(str) {
    if (str === "Easy") {
        numOfGuesses = 3;
        setModeOptions(numOfGuesses, "Easy", "600px");
    } else if (str === "Hard") {
        numOfGuesses = 6;
        setModeOptions(numOfGuesses, "Hard", "600px");
    } else {
        numOfGuesses = 16;
        setModeOptions(numOfGuesses, "Hardest", "800px");
    }
}

function randomColor() {
    var b, g, r;
    r = Math.floor(Math.random() * MAX_RGB);
    g = Math.floor(Math.random() * MAX_RGB);
    b = Math.floor(Math.random() * MAX_RGB);
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

        if (rgb[i] + variance > MAX_RGB || rgb[i] + variance < 0) {
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
    modeElement.innerHTML = this.textContent + " <span class=\"caret\">";
    selectModeOptions(this.textContent);
    resetText();
}

function changeRange() {
    var rangeText;

    if (this.textContent === "Full") {
        rangeText = "Full Colors  <div class=\"arrow-down\"></div>";
    } else {
        rangeText = "Close Colors  <div class=\"arrow-down\"></div>";
    }
    document.querySelector(".range").innerHTML = rangeText;
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
