
var gameData = {
    tileCountInWidth : 6,
    tileCountInHeight : 5,
    tiles : [
        {
            x: 2,
            y: 1,
            text: "0 0",
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "bottom",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 2,
            y: 3,
            text: "wow",
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "right",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 2,
            y: 2,
            text: "hi",
            connections: [
                { 
                    side1: "bottom",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 1,
            text: "hi3",
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "bottom",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 2,
            text: "hi2",
            connections: [
                { 
                    side1: "right",
                    fromEdge1: 50,
                    side2: "bottom",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 3,
            text: "hi1",
            isMoveable: false,
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        }
    ]
};

var gameModel = function() {
    var self = this;

    self.board;
    self.gameData;
    self.tileHeight = 100;
    self.tileWidth = 100;

    self.selectedTile = null;

    self.canvas = document.getElementById('canvas');
    self.ctx = self.canvas.getContext('2d');

    self.SetupBoard = function(gameData) {
        self.gameData = gameData;
        
        // setup the size of the canvas
        var canvasWidth = self.tileWidth * self.gameData.tileCountInWidth;
        //$('#canvas').css("width", canvasWidth + "px");
        $('#canvas').attr("width", canvasWidth);
        var canvasHeight = self.tileHeight * self.gameData.tileCountInHeight;
        //$('#canvas').css("height", canvasHeight + "px");
        $('#canvas').attr("height", canvasHeight);

        self.board = [gameData.tileCountInHeight];

        // for each row add in a column
        for(var i = 0; i < gameData.tileCountInHeight; i++) {
            var boop = [{},{},{},{},{},{}]; // todo fix me
            self.board[i] = boop;
        }
        // for each tile, put it into the board
        for(var i = 0; i < gameData.tiles.length; i++) {
            var newTile = gameData.tiles[i];
            // set some defaults if not passed in the data
            if(!newTile.hasOwnProperty('isMoveable')) {
                console.log("set is movable for " + newTile.text)
                newTile.isMoveable = true;
            }
            self.board[newTile.y][newTile.x] = newTile;
        }

    };
    self.SetupBoard(gameData);

    self.GetCoordinatesForConnection = function(tileXPos, tileYPos, side, fromEdge) {
        if(side == "top") {
            return {
                x : tileXPos + fromEdge,
                y : tileYPos
            }
        } else if(side == "bottom") {
            return {
                x : tileXPos + fromEdge,
                y : tileYPos + self.tileHeight
            }
        } else if(side == "left") {
            return {
                x : tileXPos,
                y : tileYPos + fromEdge
            }
        } else if(side == "right") {
            return {
                x : tileXPos + self.tileWidth,
                y : tileYPos + fromEdge
            }
        } else {
            console.log("DAAAAAAAAAAAAAAAAAAAAAMMMNNN")
        }
    };

    self.IsConnectionACurve = function(connection) {
        if((connection.side1 == "left" || connection.side1 == "right") && (connection.side2 == "top" || connection.side2 == "bottom")) {
            return true;
        }
        if((connection.side1 == "top" || connection.side1 == "bottom") && (connection.side2 == "left" || connection.side2 == "right")) {
            return true;
        }
        return false;
    }


    self.DrawLoop = function() {
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        // draw each tile
        for(var y = 0; y < self.board.length; y++) {
            for(var x = 0; x < self.gameData.tileCountInWidth; x++) {
                var tile = self.board[y][x];
                if(tile && tile.text) {
                    var xpos = x * self.tileWidth;
                    var ypos = y * self.tileHeight;
                    self.ctx.save();
                    self.ctx.fillStyle = 'green';
                    self.ctx.fillRect(xpos,ypos,self.tileWidth,self.tileHeight);
                    //self.ctx.stroke;
                    self.ctx.font = '20px serif';
                    self.ctx.fillStyle = 'blue';
                    self.ctx.fillText(tile.text, xpos, ypos + 20);
                    // draw any connections on this tile
                    if(tile.connections) {
                        for(var c = 0; c < tile.connections.length; c++) {
                            var start = self.GetCoordinatesForConnection(xpos,ypos,tile.connections[c].side1,tile.connections[c].fromEdge1);
                            var end =   self.GetCoordinatesForConnection(xpos,ypos,tile.connections[c].side2,tile.connections[c].fromEdge2);
                            self.ctx.save();
                            self.ctx.beginPath();
                            self.ctx.moveTo(start.x, start.y);
                            if(self.IsConnectionACurve(tile.connections[c])) {
                                // todo this only works if height and width = 100
                                ctx.arcTo(xpos+50, ypos+50, end.x, end.y, 50);
                            } else {
                                self.ctx.lineTo(end.x, end.y);
                            }
                            self.ctx.stroke();
                            self.ctx.restore();
                        }
                    }
                    self.ctx.restore();
                }
            }
        }
        // draw an indicator around the selected tile
        if(self.selectedTile && self.selectedTile.text) {
            var xpos = self.selectedTile.x * self.tileWidth;
            var ypos = self.selectedTile.y * self.tileHeight;
            self.ctx.save();
            self.ctx.strokeStyle = 'yellow';
            self.ctx.lineWidth = "3";
            self.ctx.beginPath();
            self.ctx.rect(xpos,ypos,self.tileWidth,self.tileHeight);
            self.ctx.stroke();
            self.ctx.restore();
        }

        setTimeout(self.DrawLoop, 100);
    }
    self.DrawLoop();


    $(document).ready(function() {
        $("#canvas").on("click", function(event) {
            var offset = $(this).offset();
            var clickX = event.pageX - offset.left;
            var clickY = event.pageY - offset.top;

            self.HandleClick(clickX, clickY);
        });
    });


    self.HandleClick = function(clickX, clickY) {
        // was the click on a tile?
        var clickedTile = self.GetTileAtPixels(clickX, clickY);
        if(clickedTile && clickedTile.text) {
            // have they clicked one that is not movable? do nothing ... well, clear the selected I guess?
            if(!clickedTile.isMoveable) {
                self.ClearSelectedTile();
                return;
            }
            // do we already have a tile selected?
            if(self.selectedTile) {
                // is the selected tile the same as the one just clicked?
                if(self.selectedTile.text == clickedTile.text) {
                    self.ClearSelectedTile();
                    console.log("clicked the selected tile again, so clearing selected")
                } else {
                    // swap the tile positions
                    console.log("should swap the tiles")
                    self.SwapTiles(clickedTile, self.selectedTile);
                    self.ClearSelectedTile();
                    self.CheckForCompletion();
                }
            } else {
                console.log("setting tile as selected")
                self.SetSelectedTile(clickedTile);
            }
        }
    }
    self.CheckForCompletion = function() {
        var noMatches = self.CheckAllConnectionsHaveMatches();
        console.log(noMatches);
    };

    self.SwapTiles = function(tile1, tile2) {
        
        var t1text = tile1.text.valueOf();
        var t1con = tile1.connections;

        self.board[tile1.y][tile1.x].text = tile2.text;
        self.board[tile1.y][tile1.x].connections = tile2.connections;
        self.board[tile2.y][tile2.x].text = t1text;
        self.board[tile2.y][tile2.x].connections = t1con;

    };
    self.GetTileAtPixels = function(clickX, clickY) {
        var x = Math.floor(clickX / self.tileWidth);
        var y = Math.floor(clickY / self.tileHeight);
        return self.GetTileAtCoordinates(x,y);
    }
    self.SetSelectedTile = function(tile) {
        self.selectedTile = tile;
    };
    self.ClearSelectedTile = function() {
        self.selectedTile = null;
    };
    self.GetTileAtCoordinates = function(x,y) {
        var tile = self.board[y][x];
        return tile;
    };

    self.CheckAllConnectionsHaveMatches = function() {
        // go through each tile and confirm that for each connection it has there is a tile next to it with a connection
        var noMatches = [];
        for(var r =0; r < self.board.length; r++) {
            for(var c=0; c < self.board[r].length; c++) {
                var tile = self.board[r][c];
                if(tile.text) { // is this a tile or empty spot?
                    var hasMatches = true;
                    for(var con = 0; con < tile.connections.length; con++) {
                        var connect = tile.connections[con];
                        if(!self.CheckForConnectionMatch(tile, connect.side1, connect.fromEdge1) || !self.CheckForConnectionMatch(tile, connect.side2, connect.fromEdge2)) {
                            hasMatches = false;
                            break;
                        }
                    }
                    if(hasMatches) {
                        console.log(tile.text + " DOES have all matches");
                    } else {
                        console.log(tile.text + " doesn't have all matches");
                        noMatches.push(tile.text);
                    }
                }
            }
        }
        return noMatches;
    };
    self.CheckForConnectionMatch = function(tile, side, fromEdge) {
        var neighborTile = self.GetNeighborTile(tile, side);
        
        if(neighborTile && neighborTile.text) {
            // go through all the connections on the neighbor tile and see if they have a connection we can match with
            var sideToFind = self.WhatIsOppositeSide(side);
            if(neighborTile.connections) {
                for(var c = 0; c < neighborTile.connections.length; c++) {
                    var con = neighborTile.connections[c];
                    if(con.side1 == sideToFind && con.fromEdge1 == fromEdge) {
                        return true;
                    }
                    if(con.side2 == sideToFind  && con.fromEdge2 == fromEdge) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    self.GetNeighborTile = function(tile, side) {
        if(side == "top" && tile.y > 0) {
            return self.GetTileAtCoordinates(tile.x,tile.y-1);
        } else if(side == "bottom" && tile.y < self.gameData.tileCountInHeight) {
            return self.GetTileAtCoordinates(tile.x,tile.y+1);
        } else if(side =="left" && tile.x > 0) {
            return self.GetTileAtCoordinates(tile.x-1,tile.y);
        } else if(side =="right" && tile.x < self.gameData.tileCountInWidth) {
            return self.GetTileAtCoordinates(tile.x+1,tile.y);
        }
        return null;
    };
    self.WhatIsOppositeSide = function(side) {
        if(side == "top") {
            return "bottom";
        } else if(side == "bottom") {
            return "top";
        } else if(side =="left") {
            return "right";
        } else if(side =="right") {
            return "left";
        }
    }
}

gameModel();