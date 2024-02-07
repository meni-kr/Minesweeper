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
    
    renderBoard(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

console.table(buildBoard(gLevel));
// renderBoard(buildBoard(gLevel))

function buildBoard(sizeAndMines) {
    const board = []
    for (var i = 0; i < sizeAndMines.SIZE; i++) {
        board.push([])
        for (var j = 0; j < sizeAndMines.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: true
            }
            
        }
    }
    board[1][1].isMine = true
    board[2][2].isMine = true
    return board
}

function renderBoard(board) {
    const elTable = document.querySelector('tbody')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const className = `cell cell-${i}-${j}`
            const cell = board[i][j].isMine ? MINE : board[i][j].minesAroundCount

            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})">${cell}</td>`

        }
        strHTML += '</tr>'
    }
    elTable.innerHTML = strHTML
}


function setMinesNegsCount(board){
    for(var i = 0; i<board.length;i++){
        for(var j = 0; j<board[i].length;j++){
            board[i][j].minesAroundCount= minesAroundCount(board[i][j], {i,j})
        }
    }
}

function minesAroundCount(cell, loc) {
    // console.log('cell:',cell )
    // console.log('loc:', loc)
    if (cell.isMine) return
    var countMine = 0
    for (var i = loc.i - 1; i < loc.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = loc.j - 1; j < loc.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === loc.i && j === loc.j) continue
            console.log('i:', i)
            console.log('j:', j)
            if(gBoard[i][j].isMine)countMine++
            console.log(':',countMine )
        }
    }
    return countMine
}

function onCellClicked(elCell, i, j) {
    console.log(elCell);
}

// function onCellMarked(elCell){}
// function checkGameOver(){}
// function expandShown(board, elCell, i, j){}
