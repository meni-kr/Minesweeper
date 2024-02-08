'use strict'

const MINE = '💣'
const FLAG = '🚩'
const LIFE = '💓'

var gTimerInterval
var gIsVictory
var gBoard
const gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}

function onInit(currI, currJ) {
    gIsVictory = false
    gBoard = []
    gGame.lives = 2
    showLives()
    gBoard = buildBoard(gLevel, currI, currJ)
    renderBoard(gBoard)
}

function setGameLevel(btn) {
    if (btn.innerText === 'easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        gGame.isOn = false
        onInit()
    } else if (btn.innerText === 'medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        gGame.isOn = false
        onInit()
    } else {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        gGame.isOn = false
        onInit()
    }
}

function buildBoard(sizeAndMines, currI, currJ) {
    const board = []
    for (var i = 0; i < sizeAndMines.SIZE; i++) {
        board.push([])
        for (var j = 0; j < sizeAndMines.SIZE; j++) {
            board[i][j] = {
                minesAround: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    if (gGame.isOn) {
        setRandMains(board, sizeAndMines, currI, currJ)
    }
    return board
}

function renderBoard(board) {
    setMinesNegsCount(gBoard)
    const elTable = document.querySelector('tbody')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const className = `cell hidden`
            var cell = board[i][j].isMine ? MINE : board[i][j].minesAround
            strHTML += `<td class="${className}" data-i=${i} data-j=${j} onmousedown="onCellClicked(event,this,${i},${j})">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    elTable.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAround = minesAroundCount(board[i][j], { i, j })
        }
    }
}

function minesAroundCount(cell, loc) {
    if (cell.isMine) return
    var countMine = 0
    for (var i = loc.i - 1; i <= loc.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = loc.j - 1; j <= loc.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === loc.i && j === loc.j) continue
            if (gBoard[i][j].isMine) countMine++
        }
    }
    return countMine
}

function onCellClicked(eve, elCell, currI, currJ) {
    const leftClick = eve.buttons === 1
    const rightClick = eve.buttons === 2
    if (!gGame.isOn) {
        if (rightClick) return
        gGame.isOn = true
        onInit(currI, currJ)
        revelCell(currI, currJ)
        return
    }
    if (leftClick && !gBoard[currI][currJ].isShown && !gBoard[currI][currJ].isMarked) {
        onMouseLeft(elCell, currI, currJ)
        checkGameOver(currI, currJ)
        return
    }
    if (rightClick) {
        if (gBoard[currI][currJ].isShown) return
        onMouseRight(elCell, currI, currJ)
    }
}

function onMouseLeft(elCell, i, j) {
    revelCell(i, j)
    if (elCell.innerText === '0') {
        expandShown(i, j)
    }
    checkWinGame()
}

function onMouseRight(elCell, i, j) {
    onCellMarked(elCell, i, j)
    checkWinGame()
    checkGameOver(i, j)
    showAndHide(elCell)
}

function onCellMarked(elCell, i, j) {

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        elCell.innerText = FLAG
        gGame.markedCount++
        return
    } else if (gBoard[i][j].isMine) {
        gBoard[i][j].isMarked = false
        elCell.innerText = MINE
        gGame.markedCount--
        return
    } else {
        gBoard[i][j].isMarked = false
        elCell.innerText = gBoard[i][j].minesAround
        gGame.markedCount--
        return
    }
}

function checkGameOver(i, j) {
    if (gIsVictory) {
        gGame.isOn = false
        alert('won the game')
    } else {
        checkLoseGame(i, j)
    }
}

function checkWinGame() {
    const countCell = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES
    if (gGame.shownCount === countCell && gGame.markedCount === gLevel.MINES) {
        gIsVictory = true
    }
}

function checkLoseGame(currI, currJ) {
    if (gBoard[currI][currJ].isMine) {
        if (gGame.lives !== 0) {
            gGame.lives--
            showLives()
        } else {
            alert('game over')
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[i].length; j++) {
                    if (gBoard[i][j].isMine) {
                        revelCell(i, j)
                    }
                }
            }
            gGame.isOn = false
        }
    }
}

function showLives() {
    const elSpan = document.querySelector('.lives span')
    var innerText = ''
    for (var i = 0; i < gGame.lives+1; i++) {
        innerText += LIFE + ' '
    }
    elSpan.innerText = innerText
}

function expandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length || gBoard[i].isShown || gBoard[i].isMarked) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length || gBoard[i][j].isShown || gBoard[i][j].isMarked || gBoard[i][j].minesAround) continue
            if (!gBoard[i][j].minesAround) {
                revelCell(i, j)
                expandShown(i, j)
            }
        }
    }
}
function onEmojiClicked(){
    gGame.isOn = false
    onInit()
}

function revelCell(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.classList.remove('hidden')
    gBoard[cellI][cellJ].isShown = true
    gGame.shownCount++
}

function showAndHide(elCell) {
    elCell.classList.toggle('flag')
    elCell.classList.toggle('hidden')
}