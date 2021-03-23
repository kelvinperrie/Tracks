


var GameModel = function(gameData, levelCompleteCallback) {
    var self = this;

    self.board;
    self.gameData = gameData;
    self.tileHeight = 100;
    self.tileWidth = 100;
    self.showIds = true;
    self.colours = {
        default: "#552255",
        moveable: "#993366",
        track1: "#FFAA66",
        track2: "#FFF",
        selection: "#FFFFFF"
    }
    self.levelCompleteCallback = levelCompleteCallback;
    self.trains = [];

    self.selectedTile = null;

    self.canvas = document.getElementById('canvas');
    self.ctx = self.canvas.getContext('2d');

    self.IsEditorActive = function() {
        // maybe put this somewhere other than a global or something
        return editorActive;
    };

    self.SetupBoard = function(gameData) {
        self.gameData = gameData;
        
        // setup the size of the canvas - I guess they can be different sizes?
        // we set the values in the attributes rather than in the css because otherwise some weird scaling thing happens
        var canvasWidth = self.tileWidth * self.gameData.tileCountInWidth;
        $('#canvas').attr("width", canvasWidth);
        var canvasHeight = self.tileHeight * self.gameData.tileCountInHeight;
        $('#canvas').attr("height", canvasHeight);

        // create the tiles we need
        self.board = [gameData.tileCountInHeight];
        // for each row add in a column
        for(var i = 0; i < gameData.tileCountInHeight; i++) {
            // make an array of however many columns/width we need and populate it with empty objects
            self.board[i] = Array(gameData.tileCountInWidth).fill({});
        }

        // for each tile we have in our game data, put its details into the board
        for(var i = 0; i < gameData.tiles.length; i++) {
            var newTile = gameData.tiles[i];
            // set some defaults if not passed in the data
            if(!newTile.hasOwnProperty('isMoveable')) {
                newTile.isMoveable = true;
            }
            for(var c = 0; c < newTile.connections.length; c++) {
                if(!newTile.connections[c].hasOwnProperty('trackType')) {
                    newTile.connections[c].trackType = 1;
                }
            }
            self.board[newTile.y][newTile.x] = newTile;
        }

        //var train = new TrainModel(self, gameData.tiles[1], gameData.tiles[1].connections[0], { side: gameData.tiles[1].connections[0].side1, fromEdge: gameData.tiles[1].connections[0].fromEdge1 }, { side: gameData.tiles[1].connections[0].side2, fromEdge: gameData.tiles[1].connections[0].fromEdge2 })
        //self.trains.push(train);

    };
    //self.SetupBoard(self.gameData);

    // a connection has coordinates relative to the tile it is on, this method returns the absolute coordinates for 
    // the connection based on where the file is on the board
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

    // returns true/false if the connection is a curve vs straight line
    // used when determining how to draw the line on the tile
    self.IsConnectionACurve = function(connection) {
        if((connection.side1 == "left" || connection.side1 == "right") && (connection.side2 == "top" || connection.side2 == "bottom")) {
            return true;
        }
        if((connection.side1 == "top" || connection.side1 == "bottom") && (connection.side2 == "left" || connection.side2 == "right")) {
            return true;
        }
        return false;
    }

    // this draws the game tiles
    self.DrawLoop = function() {
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        if(self.board) {

            // draw each tile
            for(var y = 0; y < self.board.length; y++) {
                for(var x = 0; x < self.gameData.tileCountInWidth; x++) {
                    var tile = self.board[y][x];
                    //console.log(tile)

                    if(tile && tile.id) {
                        
                        var xpos = x * self.tileWidth;
                        var ypos = y * self.tileHeight;
                        self.ctx.save();
                        if(tile.isMoveable) {
                            self.ctx.fillStyle = self.colours.moveable;
                        } else {
                            self.ctx.fillStyle = self.colours.default;
                        }
                        self.ctx.fillRect(xpos,ypos,self.tileWidth,self.tileHeight);
                        if(self.showIds) {
                            self.ctx.font = '20px serif';
                            self.ctx.fillStyle = self.colours.selection;
                            self.ctx.fillText(tile.id, xpos, ypos + 20);
                        }
                        // draw a guide around each square if the editor is active
                        //console.log("wow, editor is " + self.IsEditorActive());
                        if(self.IsEditorActive()) {
                            self.ctx.save();
                            self.ctx.strokeStyle = "#fff";
                            self.ctx.lineWidth = "1";
                            self.ctx.beginPath();
                            self.ctx.rect(xpos,ypos,self.tileWidth,self.tileHeight);
                            self.ctx.stroke();
                            self.ctx.restore();
                        }
                        // draw any connections on this tile
                        if(tile.connections) {
                            for(var c = 0; c < tile.connections.length; c++) {
                                var start = self.GetCoordinatesForConnection(xpos,ypos,tile.connections[c].side1,tile.connections[c].fromEdge1);
                                var end =   self.GetCoordinatesForConnection(xpos,ypos,tile.connections[c].side2,tile.connections[c].fromEdge2);
                                self.ctx.save();
                                self.ctx.beginPath();
                                // colour the track based on the type it is
                                self.ctx.strokeStyle = self.colours['track'+tile.connections[c].trackType];
                                self.ctx.moveTo(start.x, start.y);
                                self.ctx.lineWidth = "2";
                                if(self.IsConnectionACurve(tile.connections[c])) {
                                    // todo this only works if height and width = 100
                                    self.ctx.arcTo(xpos+self.tileWidth/2, ypos+self.tileHeight/2, end.x, end.y, 50);
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
            if(self.selectedTile && self.selectedTile.id) {
                var xpos = self.selectedTile.x * self.tileWidth;
                var ypos = self.selectedTile.y * self.tileHeight;
                self.ctx.save();
                self.ctx.strokeStyle = self.colours.selection;
                self.ctx.lineWidth = "3";
                self.ctx.beginPath();
                self.ctx.rect(xpos,ypos,self.tileWidth,self.tileHeight);
                self.ctx.stroke();
                self.ctx.restore();
            }
            // draw any trains
            for(var i = 0; i < self.trains.length; i++) {
                self.trains[i].Draw(self.ctx);
            }
        }

        setTimeout(self.DrawLoop, 100);
    }
    self.DrawLoop();

    // setup any handlers
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
        if(clickedTile && clickedTile.id) {
            // have they clicked one that is not movable? do nothing ... well, clear the selected I guess?
            if(!clickedTile.isMoveable) {
                self.ClearSelectedTile();
                return;
            }
            // do we already have a tile selected?
            if(self.selectedTile) {
                // is the selected tile the same as the one just clicked? if yes then deselected it, if no then select the clicked one
                if(self.selectedTile.id == clickedTile.id) {
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
        } else {
            // clicked out of the tiles somewhere
            self.ClearSelectedTile();
        }
    }

    // checks to see if the game is complete
    self.CheckForCompletion = function() {
        // if we're in the editor then do nothing
        if(self.IsEditorActive()) return;
        var noMatches = self.CheckAllConnectionsHaveMatches();
        console.log(noMatches);
        if(noMatches.length == 0) {
            self.NotifyLevelComplete();
        }
    };
    
    self.NotifyLevelComplete = function() {
        levelCompleteCallback();
    };

    self.SwapTiles = function(tile1, tile2) {
        
        var t1id = tile1.id;
        var t1con = tile1.connections;

        self.board[tile1.y][tile1.x].id = tile2.id;
        self.board[tile1.y][tile1.x].connections = tile2.connections;
        self.board[tile2.y][tile2.x].id = t1id;
        self.board[tile2.y][tile2.x].connections = t1con;

    };
    // returns whatever tile the user has clicked on (if any)
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
    // given x and y coordinates get the tile that matches
    self.GetTileAtCoordinates = function(x,y) {
        var tile = self.board[y][x];
        return tile;
    };

    // returns a list of tile ids that don't have connections matches up with a neighbour
    self.CheckAllConnectionsHaveMatches = function() {
        // go through each tile and confirm that for each connection it has there is a tile next to it with a connection
        var noMatches = [];
        for(var r =0; r < self.board.length; r++) {
            for(var c=0; c < self.board[r].length; c++) {
                var tile = self.board[r][c];
                if(tile.id) { // is this a tile or empty spot?
                    var hasMatches = true;
                    for(var con = 0; con < tile.connections.length; con++) {
                        var connect = tile.connections[con];
                        if(!self.CheckForConnectionMatch(tile, connect.side1, connect.fromEdge1, connect.trackType) || !self.CheckForConnectionMatch(tile, connect.side2, connect.fromEdge2, connect.trackType)) {
                            hasMatches = false;
                            break;
                        }
                    }
                    if(hasMatches) {
                        //console.log(tile.id + " DOES have all matches");
                    } else {
                        //console.log(tile.id + " doesn't have all matches");
                        noMatches.push(tile.id);
                    }
                }
            }
        }
        return noMatches;
    };
    // check a single tile to see if the connections it has have matches
    self.CheckForConnectionMatch = function(tile, side, fromEdge, trackType) {
        var neighborTile = self.GetNeighborTile(tile, side);
        
        if(neighborTile && neighborTile.id) {
            // go through all the connections on the neighbor tile and see if they have a connection we can match with
            var sideToFind = self.WhatIsOppositeSide(side);
            if(neighborTile.connections) {
                for(var c = 0; c < neighborTile.connections.length; c++) {
                    var con = neighborTile.connections[c];
                    if(con.side1 == sideToFind && con.fromEdge1 == fromEdge && con.trackType == trackType) {
                        return true;
                    }
                    if(con.side2 == sideToFind  && con.fromEdge2 == fromEdge && con.trackType == trackType) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    // get the neightbour of the supplied tile, in the direction specified by 'side'
    self.GetNeighborTile = function(tile, side) {
        //console.log("getting neighbor tile on side " + side + " where tile is " + tile.x + "," + tile.y);
        if(side == "top" && tile.y > 0) {
            return self.GetTileAtCoordinates(tile.x,tile.y-1);
        } else if(side == "bottom" && tile.y < self.gameData.tileCountInHeight - 1) {
            return self.GetTileAtCoordinates(tile.x,tile.y+1);
        } else if(side =="left" && tile.x > 0) {
            return self.GetTileAtCoordinates(tile.x-1,tile.y);
        } else if(side =="right" && tile.x < self.gameData.tileCountInWidth) {
            return self.GetTileAtCoordinates(tile.x+1,tile.y);
        }
        return null;
    };
    // determines the opposide side of a given side
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


