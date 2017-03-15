$('document').ready(function() {
    var chosenOne;
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
    function buildBoard() {
        for(var i = 0; i < 8; i++){
            addRow(i);
            for(var j = 0; j < 8; j++) {
                addColumn(i, j);
            };
        };
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
    setup();
    $('.red-cell').click(function(){
        var id = $(this).attr('id');
        var row = id[0];
        var col = id[1];
        var clickedCell = boardState[row][col];
        console.log(clickedCell);
        if(chosenOne) {
            movePiece(chosenOne, row, col);
            chosenOne = null;
        }
        else if(clickedCell) {
            chosenOne = clickedCell;
            highlightMoves(clickedCell);
        }
    });
    function movePiece(piece, trgtRow, trgtCol) {
        movePieceDOM(piece, trgtRow, trgtCol);
        movePieceBS(piece, trgtRow, trgtCol);
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
        $('.highlight').removeClass('highlight')
    }
    function highlightMoves(piece) {
        var targets = getMoves(piece);
        for (var i = 0; i < targets.length; i++){
            highlight(targets[i]);
        }
    }
    function highlight (target) {
        var targetId = '' + target.row + target.col;
        $('#' + targetId).addClass('highlight');
    }
    function getMoves(piece) {
        var potentialMoves = [];
        getSingleMoves(piece, potentialMoves);
        getJumpMoves(piece, potentialMoves);
        return potentialMoves;
    }
    function getSingleMoves(piece, moveArr) {
        var leftTarget = genTargetCoords('single', 'left', piece);
        var rightTarget = genTargetCoords('single', 'right', piece);
        if(canMoveTo(leftTarget)){
            moveArr.push(leftTarget);
        }
        if(canMoveTo(rightTarget)){
            moveArr.push(rightTarget);
        }
        return moveArr;
    }
    function getJumpMoves(piece, moveArr) {
        var leftTarget = genTargetCoords ('jump', 'left', piece)
        var rightTarget = genTargetCoords ('jump', 'right', piece)
        if(canJumpTo(leftTarget, piece)){
            moveArr.push(leftTarget);
        }
        if(canJumpTo(rightTarget, piece)){
            moveArr.push(rightTarget);
        }
    }
    function genTargetCoords(type, side, piece){
        var verticalDir = piece.color === 'white' ? 1 : -1;
        var horizontalDir = side === 'left' ? -1 : 1;
        var rowOffset = type === 'single' ? verticalDir : verticalDir * 2;
        var colOffset = type === 'single' ? horizontalDir : horizontalDir * 2;
        return {
            row: piece.row + rowOffset,
            col: piece.col + colOffset
        };
    }
    function canJumpTo(target, piece) {
        // canMoveTo(target);
        return wouldJumpEnemy(target, piece);
        // check if in between square is occupied by enemy
    }
    function canMoveTo(target) {
        // be on board & unoccupied
        return isOnBoard(target.row, target.col) && isEmpty(target.row, target.col);
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
        squareCoords.row = (target.row + piece.row) / 2;
        squareCoords.col = (target.col + piece.col) / 2;
        return squareCoords;
    }
});
