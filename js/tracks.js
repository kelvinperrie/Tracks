
var gameData = {
    tileCountInWidth : 6,
    tileCountInHeight : 5,
    tiles : [
        {
            x: 2,
            y: 2,
            text: "wow"
        },
        {
            x: 3,
            y: 2,
            text: "hi"
        }
    ]
};

var gameModel = function() {
    var self = this;

    self.board;
    self.gameData;
    self.tileHeight = 100;
    self.tileWidth = 100;

    self.canvas = document.getElementById('canvas');
    self.ctx = self.canvas.getContext('2d');

    self.SetupBoard = function(gameData) {
        self.gameData = gameData;
        self.board = [gameData.tileCountInHeight];
        // for each row add in a column
        for(var i = 0; i < gameData.tileCountInHeight; i++) {
            self.board[i] = [gameData.tileCountInWidth]
        }
        // for each title, put it into the board
        for(var i = 0; i < gameData.tiles.length; i++) {
            var newTile = gameData.titles[i];
            self.board[newTile.y][newTile.x] = {
                text: newTile.text
            }
        }
    };
    self.SetupBoard(gameData);

    self.DrawLoop = function() {
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        
        setTimeout(self.DrawLoop, 100);
    }
    self.DrawLoop();
}
