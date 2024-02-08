'use strict'

var gCells = []

function setRandMains(board,sizeAndMines) {
    var maineCount = 0
    while(maineCount !== sizeAndMines.MINES){
        var i =getRandomInt(0, sizeAndMines.SIZE)
        var j =getRandomInt(0, sizeAndMines.SIZE)
        if(!board[i][j].isMine){
            board[i][j].isMine = true
            maineCount++
        }
    }
    
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
