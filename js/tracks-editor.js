
// gonna make some assumptions about accessing the controller in this ...


var Editor = function() {

};

Editor();

var gameData = [
    {
        level: 0,
        title : "Editor",
        tileCountInWidth : 6,
        tileCountInHeight : 5,
        tiles : []
    }
];

console.log(gameData);
var tileCounter = 1;
for(var y = 0; y < gameData[0].tileCountInHeight; y++) {
    console.log("y is " + y)
    for(var x = 0; x < gameData[0].tileCountInWidth; x++) {
        console.log("x is " + x)
        var newTile = {
                x: x,
                y: y,
                id: tileCounter,
                connections: []
            };
        console.log(newTile);
        gameData[0].tiles.push(newTile);
        tileCounter++;

    }

}
console.log(gameData);