$('document').ready(function() {
    var chosenOne;
    var turn = 'white';
    var boardState = [
        new Array(8),
        new Array(8),
        new Array(8),
        new Array(8),
        new Array(8),
        new Array(8),
        new Array(8),
        new Array(8)
    ];
    setup();
    $('.red-cell').click(function(){
        var id = $(this).attr('id');
        var row = id[0];
        var col = id[1];
        var clickedCell = boardState[row][col];
        console.log(clickedCell);
        if(clickedCell && clickedCell.color === turn){
            chosenOne = clickedCell;
            // check if piece is kinged
            var targets = getAllMoves(chosenOne);
            highlightMoves(targets);
        }
        else if(chosenOne) {
            var jumped = didJump(chosenOne, row);
            if(jumped){
                // capture enemy
                captureEnemy(chosenOne, row, col);
            }
            var pieceMoved = movePiece(chosenOne, row, col);
            if (!pieceMoved) return;
            endGame(turn);
            kingPiece(chosenOne);
            //if can jump again, highlight. Else, end turn
            if (jumped) {
                var newTargets = getJumpMoves(chosenOne,[]);
                if(newTargets.length){
                    highlightMoves(newTargets);
                    $('button').addClass('show-button');
                }
                else{
                    endTurn();
                }
            }
            else{
                endTurn();
            }
        }
    });

    // board setup

    function buildBoard () {
        for(var i = 0; i < 8; i++){
            addRow(i);
            for(var j = 0; j < 8; j++) {
                addColumn(i, j);
            }
        }
    }
    function addRow(i) {
        var newDiv = $("<div>", {id: "row" + i, "class": "row"});
        $('#master-div').append(newDiv);
    }
    function addColumn(i, j) {
        var newCol = $("<div>", {id: '' + i + j, 'class': 'column ' + (squareIsRed(i, j) ? 'red-cell' : '')});
        $('#row' + i).append(newCol);
    }
    function squareIsRed(row, col) {
        return (row + col) % 2 === 0;
    }
    function placePieces() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (squareIsRed(i, j) && i < 3){
                    createPiece('white',false,i,j);
                }
                else if (squareIsRed(i, j) && i > 4) {
                    createPiece('black',false,i,j);
                }
            }
        }
    }
    function createPiece(color,isKing,row,col){
        createDOMPiece(color,false,row,col);
        createBSPiece(color, row, col);
    }
    function createDOMPiece(color,isKing,row,col) {
        var piece;
        if (color === 'white') {
            piece = $('<img>', {src: 'assets/white-checker.png', class: 'white-checker'});
        }
        else if (color === 'black'){
            piece = $('<img>', {src: 'assets/black-checker.png', class: 'black-checker'});
        }
        $('#' + row + col).html(piece);
    }
    function createBSPiece(color, row, col){
        boardState[row][col] = {
            color: color,
            kinged: false,
            row: row,
            col: col
        };
    }
    function setup() {
        buildBoard();
        placePieces();
        console.log(boardState);
    }

    // movement functions


    $('#end-turn').click(function() {
        endTurn();
    });
    function movePiece(piece, trgtRow, trgtCol) {
        if (isHighlighted(trgtRow, trgtCol)) {
            movePieceDOM(piece, trgtRow, trgtCol);
            movePieceBS(piece, trgtRow, trgtCol);
            return true;
        }
        else {
            alert("This doesn't work")
            return false;
        }
    }
    function movePieceBS(piece, trgtRow, trgtCol) {
        //remove piece from old location
        boardState[piece.row][piece.col] = null;
        //add piece to new location
        boardState[trgtRow][trgtCol] = piece;
        //update piece to reflect new location
        piece.row = trgtRow;
        piece.col = trgtCol;
    }
    function movePieceDOM (piece, trgtRow, trgtCol) {
        var img = $('#' + piece.row + piece.col).find("img")
        $('#' + trgtRow + trgtCol).append(img);
        removeHighlights();
    }
    function highlightMoves(targets) {
        removeHighlights();
        for (var i = 0; i < targets.length; i++){
            highlight(targets[i]);
        }
    }
    function highlight (target) {
        var targetId = '' + target.row + target.col;
        $('#' + targetId).addClass('highlight');
    }
    function getAllMoves(piece) {
        var potentialMoves = [];
        getSingleMoves(piece, potentialMoves);
        getJumpMoves(piece, potentialMoves);
        return potentialMoves;
    }
    function getSingleMoves(piece, moveArr) {
        return getMoves(piece,moveArr,'single');
    }
    function getJumpMoves(piece, moveArr) {
        return getMoves(piece,moveArr,'jump');
    }
    function getMoves(piece, moveArr, moveType) {
        var validateFn = moveType === 'single' ? canMoveTo : canJumpTo;
        var leftTarget = genTargetCoords (moveType, 'left', piece, piece.color);
        var rightTarget = genTargetCoords (moveType, 'right', piece, piece.color);
        if(validateFn(leftTarget, piece)){
            moveArr.push(leftTarget);
        }
        if(validateFn(rightTarget, piece)){
            moveArr.push(rightTarget);
        }
        if(piece.kinged){
            var enemyColor = piece.color === 'white' ? 'black' : 'white';
            var leftReverseTarget = genTargetCoords(moveType, 'left', piece, enemyColor);
            var rightReverseTarget = genTargetCoords(moveType, 'right', piece, enemyColor);
            if(validateFn(leftReverseTarget, piece)){
                moveArr.push(leftReverseTarget);
            }
            if(validateFn(rightReverseTarget, piece)){
                moveArr.push(rightReverseTarget);
            }
        }
        return moveArr;
    }
    function genTargetCoords(type, side, piece, color){
        var verticalDir = color === 'white' ? 1 : -1;
        // if kinged, regardless of color var verticalDirKinged === 1 && -1
        var horizontalDir = side === 'left' ? -1 : 1;
        var rowOffset = type === 'single' ? verticalDir : verticalDir * 2;
        var colOffset = type === 'single' ? horizontalDir : horizontalDir * 2;
        return {
            row: Number(piece.row) + rowOffset,
            col: Number(piece.col) + colOffset
        };
    }
    function canJumpTo(target, piece) {
        return canMoveTo(target) && wouldJumpEnemy(target, piece)
        // check if in between square is occupied by enemy
    }
    function canMoveTo(target) {
        // be on board & unoccupied
        return isOnBoard(target.row, target.col) && isEmpty(target.row, target.col)
    }
    function isOnBoard(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    function isEmpty(row, col) {
        return !boardState[row][col];
    }
    function wouldJumpEnemy(target, piece) {
        var betweenSquare = getBetweenSquare(target, piece);
        return isEnemy(betweenSquare);
    }
    function isEnemy(coords) {
        var square = boardState[coords.row][coords.col];
        return square && square.color != chosenOne.color;
    }
    function getBetweenSquare(target, piece) {
        var squareCoords = {}
        squareCoords.row = (Number(target.row) + Number(piece.row)) / 2;
        squareCoords.col = (Number(target.col) + Number(piece.col)) / 2;
        return squareCoords;
    }
    function isHighlighted(targetRow, targetCol) {
        return $('#' + targetRow + targetCol).hasClass('highlight')
    }
    function endTurn() {
        if (turn === 'white') {
            turn = 'black';
        }
        else {
            turn = 'white';
        }
        chosenOne = null;
        removeHighlights();
        jumped = false;
        $('button').removeClass('show-button');
    }
    function didJump(piece, targetRow) {
        if (Math.abs(piece.row - targetRow) === 2) {
            return true;
        }
        return false;
    }
    function removeHighlights() {
        $('.highlight').removeClass('highlight')
    }
    function captureEnemy(piece, row, col) {
        var enemy = getBetweenSquare({row: row, col: col}, piece)
        removePiece(enemy);
    }
    function removePiece(enemy) {
        removePieceBS(enemy);
        removePieceDOM(enemy);
    }
    function removePieceBS(coords) {
        boardState[coords.row][coords.col] = null;
    }
    function removePieceDOM(coords) {
        $('#' + coords.row + coords.col).html('');
    }
    function kingPiece(piece) {
        // when piece reaches opposite side of board from starting side, change 'kinged' to true.
        if ((piece.color === 'white' && piece.row === '7') || (piece.color === 'black' && piece.row === '0')) {
            piece.kinged = true;
        }
        addCrown(piece);

    }
    function addCrown(piece) {
        if (piece.kinged === true) {
            removePieceDOM(piece);
            if (piece.color === 'white') {
                $('#' + piece.row + piece.col).html('<img src ="assets/kinged-white.png">')
            }
            else {
                $('#' + piece.row + piece.col).html('<img src ="assets/kinged-black.png">')
            }
        }
    }
    function endGame (turn) {
        var oppColor = turn === 'white' ? 'black' : 'white';
        for (var i = 0; i < boardState.length; i++) {
            for (var j = 0; j < boardState[i].length; j++){
                if (boardState[i][j] && boardState[i][j].color === oppColor) {
                    return;
                }
            }
        }
        alert("GAME OVER. " + turn + " has won the game.")
    }
});
