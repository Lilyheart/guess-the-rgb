var colorRange = 'Full',
    colorStyle = 'RGB',
    MAX_RGB = 255,
    messageDisplay = document.querySelector('#message'),
    modeElement = document.querySelector('.mode'),
    numOfGuesses = 6,
    possibleGuesses = document.querySelectorAll('.colorGuess'),
    resetButton = document.getElementById('reset'),
    winningRGBColor;

function getBackgroundColor() {
    var backgroundColor,
        element,
        style;

    element = document.querySelector('body');
    style = window.getComputedStyle(element, null);
    backgroundColor = style.getPropertyValue('background-color');

    return backgroundColor;
}

function changeAllColors(color) {
    var i;

    for (i = 0; i < possibleGuesses.length; i += 1) {
        possibleGuesses[i].style.background = color;
    }
}

function setGuess() {
    if (this.style.background === winningRGBColor) {
        messageDisplay.textContent = 'Correct!';
        resetButton.textContent = 'Play again';
        changeAllColors(winningRGBColor);
        document.querySelector('h1').style.background = winningRGBColor;
    } else {
        messageDisplay.textContent = 'Try Again';
        this.style.background = getBackgroundColor();
    }
}

function setModeOptions(totalGuesses, difficulty, width) {
    numOfGuesses = totalGuesses;
    modeElement.innerHTML = difficulty + ' <div class="arrow-down"></div>';
    document.querySelector('#container').style.maxWidth = width;
}

function selectModeOptions(str) {
    if (str === 'Easy') {
        numOfGuesses = 3;
        setModeOptions(numOfGuesses, 'Easy', '600px');
    } else if (str === 'Hard') {
        numOfGuesses = 6;
        setModeOptions(numOfGuesses, 'Hard', '600px');
    } else {
        numOfGuesses = 16;
        setModeOptions(numOfGuesses, 'Hardest', '800px');
    }
}

function randomColor() {
    var blue = Math.floor(Math.random() * MAX_RGB),
        green = Math.floor(Math.random() * MAX_RGB),
        red = Math.floor(Math.random() * MAX_RGB);

    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}

function closeRandomColor(str) {
    var i,
        rgb = str.match(/\d+/g),
        variance,
        closeColorRange = 60;

    for (i = 0; i < rgb.length; i += 1) {
        rgb[i] = Number(rgb[i]);
        if (Math.round(Math.random()) === 0) {
            variance = Math.floor(Math.random() * closeColorRange);
        } else {
            variance = -Math.floor(Math.random() * closeColorRange);
        }

        if (rgb[i] + variance > MAX_RGB || rgb[i] + variance < 0) {
            rgb[i] -= variance;
        } else {
            rgb[i] += variance;
        }
    }

    return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
}

// Using Durstenfeld shuffle algorithm.
function shuffleColors(arr) {
    var i, swap, temp;

    for (i = arr.length - 1; i > 0; i -= 1) {
        swap = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[swap];
        arr[swap] = temp;
    }

    return arr;
}

function generateRandomColors(num) {
    var arr = [],
        i;

    arr.push(randomColor());
    for (i = 1; i < num; i += 1) {
        if (colorRange === 'Full') {
            arr.push(randomColor());
        } else {
            arr.push(closeRandomColor(arr[i - 1]));
        }
    }
    arr = shuffleColors(arr);

    return arr;
}

// http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
function rgbTOhsl(rgb) {
    var redRange = rgb[0] / MAX_RGB,
        greenRange = rgb[1] / MAX_RGB,
        blueRange = rgb[2] / MAX_RGB,
        LUM_CALC = 2,
        GREEN_HUE_CALC = 2,
        BLUE_HUE_CALC = 4,
        DEGREES_CALC = 60,
        FULL_CIRCLE = 360,
        HALF = 0.5,
        SAT_CALC = 2,
        PERCENT = 100,
        max = Math.max(redRange, greenRange, blueRange),
        min = Math.min(redRange, greenRange, blueRange),
        hue,
        sat,
        lum = (max + min) / LUM_CALC;

    if (max === min) {
        hue = sat = 0;
    } else {
        switch (max) {
            case redRange: hue = ((greenRange - blueRange) / (max - min)) * DEGREES_CALC; break;
            case greenRange: hue = (GREEN_HUE_CALC + (blueRange - redRange) / (max - min)) * DEGREES_CALC; break;
            default: hue = (BLUE_HUE_CALC + (redRange - greenRange) / (max - min)) * DEGREES_CALC;
        }
        if (hue < 0) {
            hue += FULL_CIRCLE;
        }

        if (lum < HALF) {
            sat = (max - min) / (max + min);
        } else {
            sat = (max - min) / (SAT_CALC - max - min);
        }
    }

    return 'hsl(' + Math.round(hue) + ', ' + Math.round(sat * PERCENT) + '%, ' + Math.round(lum * PERCENT) + '%)';
}

function rgbTOhex(rgb) {
    var winningText = '#',
        HEX = 16,
        i;

    for (i = 0; i < rgb.length; i += 1) {
        if (Number(rgb[i]).toString(HEX).length === 1) {
            winningText += '0';
        }
        winningText += Number(rgb[i]).toString(HEX);
    }

    return winningText;
}

function setwinningText(winningRGB) {
    var winningText,
        rgb = winningRGB.match(/\d+/g);

    switch (colorStyle) {
        case 'RGB':
            winningText = winningRGB;
            break;
        case 'HSL':
            winningText = rgbTOhsl(rgb);
            break;
        case 'HEX':
            winningText = rgbTOhex(rgb);
            break;
        default:
    }

    document.getElementById('colorToGuess').textContent = winningText;
}

function setColors(num) {
    var i,
    colors;

    colors = generateRandomColors(num);
    winningRGBColor = colors[Math.floor(Math.random() * colors.length)];
    setwinningText(winningRGBColor);
    for (i = 0; i < possibleGuesses.length; i += 1) {
        if (colors[i]) {
            possibleGuesses[i].style.display = 'block';
            possibleGuesses[i].style.background = colors[i];
        } else {
            possibleGuesses[i].style.display = 'none';
        }
    }
}

function resetText() {
    resetButton.textContent = 'New Colors';
    messageDisplay.textContent = '';
    document.querySelector('h1').style.background = 'steelblue';
    setColors(numOfGuesses);
}

function changeMode() {
    modeElement.innerHTML = this.textContent + ' <span class="caret">';
    selectModeOptions(this.textContent);
    resetText();
}

function changeRange() {
    var rangeText;

    if (this.textContent === 'Full') {
        rangeText = 'Full Colors  <div class="arrow-down"></div>';
    } else {
        rangeText = 'Close Colors  <div class="arrow-down"></div>';
    }
    document.querySelector('.range').innerHTML = rangeText;
    colorRange = this.textContent;
    resetText();
}

function changeModel() {
    var modelText,
        modelElement = document.querySelector('.model');

    if (this.textContent === 'Phy (HSL)') {
        modelText = 'HSL';
    } else {
        modelText = this.textContent;
    }

    modelElement.innerHTML = modelText + '  <div class="arrow-down"></div>';
    colorStyle = modelText;
    resetText();
}

function reset() {
    messageDisplay.textContent = '';
    this.textContent = 'New Colors';
    document.querySelector('h1').style.background = 'steelblue';
    setColors(numOfGuesses);
}

function settingListeners() {
    var i,
        modeButtons = document.querySelectorAll('.modeButton'),
        rangeButtons = document.querySelectorAll('.rangeButton'),
        modelButtons = document.querySelectorAll('.modelButton');

    for (i = 0; i < possibleGuesses.length; i += 1) {possibleGuesses[i].addEventListener('click', setGuess);}
    for (i = 0; i < modeButtons.length; i += 1) {modeButtons[i].addEventListener('click', changeMode);}
    for (i = 0; i < rangeButtons.length; i += 1) {rangeButtons[i].addEventListener('click', changeRange);}
    for (i = 0; i < modelButtons.length; i += 1) {modelButtons[i].addEventListener('click', changeModel);}
}

function init() {
    settingListeners();
    resetButton.addEventListener('click', reset);
    setColors(numOfGuesses);
}

init();
