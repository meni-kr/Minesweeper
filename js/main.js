'use strict'

const MINE = '💣'
const FLAG = '🚩'



var gBoard
const gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard(gLevel)
    gGame.isOn = true
    renderBoard(gBoard)


}

function setGameLevel(btn) {
    if (btn.innerText === 'easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        onInit()
        // gBoard = buildBoard(gLevel)
        // renderBoard(gBoard)
    }else if(btn.innerText === 'medium'){
        gLevel.SIZE = 8
        gLevel.MINES = 14
        onInit()
        // gBoard = buildBoard(gLevel)
        // renderBoard(gBoard)
    }else{
        gLevel.SIZE = 12
        gLevel.MINES = 32
        onInit()
        // gBoard = buildBoard(gLevel)
        // renderBoard(gBoard)
    }

}

function buildBoard(sizeAndMines) {
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
    // console.log(board[4][3]);
    setRandMains(board,gLevel)
    
    
    // board[0][3].isMine = true
    // board[1][3].isMine = true
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

function onCellClicked(eve, elCell, i, j) {
    if (!gGame.isOn) return
    if (eve.buttons === 1 && !gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
        revelCell(i, j)

        if (gBoard[i][j].isMine) {
            checkGameOver(i, j)
            console.log('game over')
            // onInit()
        } else if (elCell.innerText === '0') {
            expandShown(i, j)

        }
        checkWinGame()
        return
    }
    if (eve.buttons === 2) {
        if (gBoard[i][j].isShown) return
        onCellMarked(elCell, i, j)

        showAndHide(elCell)
        checkWinGame()
    }
}
function onCellMarked(elCell, i, j) {

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        elCell.innerText = FLAG
        gGame.markedCount++
    } else if (gBoard[i][j].isMine) {
        gBoard[i][j].isMarked = false
        elCell.innerText = MINE
        gGame.markedCount--
    } else {
        gBoard[i][j].isMarked = false
        elCell.innerText = gBoard[i][j].minesAround
        gGame.markedCount--
    }
}

function checkGameOver(i, j) {
    if (gBoard[i][j].isMine) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMine) {
                    revelCell(i, j)

                }
            }
        }
        gGame.isOn = false
        console.log('lost');
    }
}

function checkWinGame() {
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES && gGame.markedCount === gLevel.MINES) {
        console.log('won')
    }
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

function revelCell(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.classList.remove('hidden')
    gBoard[cellI][cellJ].isShown = true
    gGame.shownCount++
}

function showAndHide(elCell) {
    elCell.classList.toggle('hidden')
}

