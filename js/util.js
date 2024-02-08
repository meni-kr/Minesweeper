'use strict'


function setRandMains() {
    for (var k = 0; k < gLevel.MINES; k++) {
        var i = getRandomInt(0, gLevel.SIZE - 1)
        var j = getRandomInt(0, gLevel.SIZE - 1)
        gBoard[i][j].isMine = true
        console.log(gBoard[i][j])
        console.log(i,j);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + 1) + min;
}