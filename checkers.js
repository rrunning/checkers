$('document').ready (function() {
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
    function buildBoard () {
        for(var i = 0; i < 8; i++){
            addRow(i);
            for(var j = 0; j < 8; j++) {
                addColumn(i, j);
            };
        };
    }
    function addRow (i) {
        var newDiv = $("<div>", {id: "row" + i, "class": "row"});
        $('#master-div').append(newDiv);
    }
    function addColumn (i, j) {
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
        if (chosenOne) {
            movePiece(chosenOne, row, col);
            chosenOne = null;
        }
        else if (clickedCell) {
            chosenOne = clickedCell;
            highlightMoves(piece);
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
    }
    function highlightMoves(piece) {
        var direction = piece.color === 'white' ? piece.row + 1 : piece.row - 1;
        function selectHighlights(piece) {
            var potentialRow = direction;
            var potentialColRight = piece.col + 1;
            var potentialColLeft piece.col - 1;
            if (potentialColLeft > 8 || potentialColLeft < 0){
                addToArr(direction, )
            }
            if (potentialColRight > 8 || potentialColRight < 0){
            }

        }
    }
});
