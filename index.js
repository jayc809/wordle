const url = "https://raw.githubusercontent.com/jayc809/public-files/main/5_letter_words.txt"
let wordsArray = []
let correctWord = ""
let correctWordArray = []
const grid = document.getElementById("grid")
const alphabet = document.getElementById("alphabet")
const abcs = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
                      "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
const customWords = ["serai", "hoyah"]
let currAttempt = 0
let currLetter = 0
let allLetters = {}

function fetchText(url) {
    fetch(url).then(function(response) {
        response.text().then(function(text) {
            wordsArray = text.split("\n")
            for (let i = 0; i < customWords.length; i += 1) {
                wordsArray.push(customWords[i])
            }
            correctWord = wordsArray[Math.floor(Math.random() * wordsArray.length)]
            correctWordArray = stringToArray(correctWord)
            console.log(correctWord)
        })
    })
}

function stringToArray(word) {
    array = []
    for (let i = 0; i < word.length; i += 1) {
        array.push(word.substring(i, i+1))
    }
    return array
}

function generateGrid() {
    for (let i = 0; i < 7; i += 1) {
        const attempt = document.createElement("div")
        attempt.classList.add("attempt")
        attempt.id = "attempt" + i
        attempt.style.top = (i * 100 + 10) + "px"
        attempt.style.left = 10 + "px"
        for (let j = 0; j < 5; j += 1) {
            const letter = document.createElement("h2")
            letter.classList.add("letter")
            letter.id = `letter (${i}, ${j})`
            letter.style.left = (j * 80) + "px"
            attempt.append(letter)
        }
        grid.append(attempt)
    }
    const displayText = document.createElement("h1")
    displayText.id = "display-text"
    displayText.style.top = 700 + "px"
    grid.append(displayText)
}

function kbInputAlphabet(e) {
    const keyPressed = e.key.toUpperCase()
    if (((e.keyCode >= 97 && e.keyCode <= 122) || (e.keyCode >= 65 && e.keyCode <= 90)) && currLetter != 5) {
        const letter = document.getElementById(`letter (${currAttempt}, ${currLetter})`)
        if (letter.textContent == ""){
            letter.textContent = keyPressed
        }
        if (currLetter < 5) {
            currLetter += 1
        }
    }
}

function kbInputNonAlphabet(e) {
    const displayText = document.getElementById("display-text")
    displayText.textContent = ""
    const keyPressed = e.key.toUpperCase()
    if (keyPressed == "BACKSPACE") {
        if (currLetter > 0) {
            currLetter -= 1
            const letter = document.getElementById(`letter (${currAttempt}, ${currLetter})`)
            letter.textContent = ""
        }
    } else if (keyPressed == "ENTER") {
        checkWin()
    }
}

function getEnteredWord() {
    let word = ""
    for (j = 0; j < 5; j += 1) {
        const letter = document.getElementById(`letter (${currAttempt}, ${j})`)
        word += letter.innerText.toLowerCase()
    }
    return word
}

function noMatch() {
    for (j = 0; j < 5; j += 1) {
        const letter = document.getElementById(`letter (${currAttempt}, ${j})`)
        const red = "rgb(150, 0, 0)"
        letter.style.backgroundColor = red
    }
    setTimeout(() => {
        for (j = 0; j < 5; j += 1) {
            const letter = document.getElementById(`letter (${currAttempt - 1}, ${j})`)
            letter.style.backgroundColor = "transparent"
        }
    }, 300)
}

function checkWin() {
    const displayText = document.getElementById("display-text")
    if (currLetter == 5) {
        const word = getEnteredWord()
        if (wordsArray.includes(word)) {
            let correctLetters = 0
            for (j = 0; j < 5; j += 1) {
                const letter = document.getElementById(`letter (${currAttempt}, ${j})`)
                const letterText = letter.innerText.toLowerCase()
                if (correctWordArray.includes(letterText)) {
                    const green = "rgb(0, 150, 0)"
                    const yellow = "rgb(150, 150, 0)"
                    if (letterText == correctWordArray[j]) {
                        letter.style.backgroundColor = green
                        correctLetters += 1
                        allLetters[letterText].color = green
                    } else {
                        letter.style.backgroundColor = yellow
                        correctLetters += 0.5
                        if (allLetters[letterText].color != green) {
                            allLetters[letterText].color = yellow
                        }
                    }
                } else {
                    allLetters[letterText].isNull = true
                }
            }
            if (correctLetters == 5) {
                displayText.textContent = "YOU WIN!"
                setTimeout(() => {
                    endGame("win")
                }, 500)
            } else if (currAttempt == 6) {
                displayText.textContent = "YOU LOSE"
                setTimeout(() => {
                    endGame("loss")
                }, 500)
            } else {
                if (correctLetters == 0) {
                    noMatch()
                }
                currAttempt += 1
                currLetter = 0
            }
        } else {
            displayText.textContent = "NOT A WORD"
        }
        renderAlphabet()
    } else {
        displayText.textContent = "TOO SHORT"
    }
}

function generateAlphabet() {
    for (let i = 0; i < abcs.length; i += 1) {
        allLetters[abcs[i]] = (new Alphabet(abcs[i]))
    }
    renderAlphabet()
}

function renderAlphabet() {
    alphabet.innerHTML = ""
    for (let y = 0; y < 6; y += 1) {
        for (let x = 0; x < 5; x += 1) {
            if (y * 5 + x < 26) {
                const letter = document.createElement("h2")
                const alphabetInstance = allLetters[abcs[y * 5 + x]]
                letter.classList.add("alphabet")
                letter.style.left = x * 50 + "px"
                letter.style.top = y * 50 + "px"
                letter.style.color = alphabetInstance.color
                letter.textContent = alphabetInstance.name.toUpperCase()
                if (!alphabetInstance.isNull) {
                    alphabet.append(letter)
                }
            }
        }
    }
}

function endGame(result) {
    const displayResult = document.createElement("div")
    displayResult.classList.add("display-result")
    grid.append(displayResult)
    const displayResultContent = document.createElement("h2")
    displayResultContent.classList.add("display-result-content")
    if (result == "win") {
        const numAttempts = currAttempt + 1
        if (numAttempts == 1) {
            displayResultContent.textContent = `VICTORY!\r\n\r\nYou Took 1 Attempt`
        } else {
            displayResultContent.textContent = `VICTORY!\r\n\r\nYou Took ${numAttempts} Attempts`
        }
    } else {
        displayResultContent.textContent = 'Correct Word:\r\n\r\n' + correctWord.toUpperCase()
    }
    const displayResultBtn = document.createElement("button")
    displayResultBtn.classList.add("display-result-btn")
    displayResultBtn.textContent = "RESTART"
    displayResultBtn.addEventListener("click", restart)
    displayResult.append(displayResultBtn)
    displayResult.append(displayResultContent)
    const displayResultBg = document.createElement("div")
    displayResultBg.classList.add("display-result-bg")
    displayResult.append(displayResultBg)
}

function restart() {
    location.reload()
}

class Alphabet {
    constructor(name) {
        this.name = name
        this.color = "white"
        this.isNull = false
    }
}

function initialize() {
    fetchText(url)
    generateGrid()
    generateAlphabet()
    document.addEventListener("keypress", kbInputAlphabet)
    document.addEventListener("keydown", kbInputNonAlphabet)
}
initialize()