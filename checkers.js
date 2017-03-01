$('document').ready (function() {
    function buildBoard () {
        for(var i = 0; i < 8; i++){
            addRow(i);
            for(var j = 0; j < 8; j++) {
                addColumn(i, j);
            };
        };
    }
    buildBoard();
    function addRow (i) {
        var newDiv = $("<div>", {id: "row" + i, "class": "row"});
        $('#master-div').append(newDiv);
    }
    function addColumn (i, j) {
        var newCol = $("<div>", {id: '' + i + j, 'class': 'column ' + ((i + j) % 2 === 0 ? 'red-cell' : '')});
        $('#row' + i).append(newCol);
    }
});
