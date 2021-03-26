

var TrainModel = function(game, tile, connection, origin, target) {
    var self = this;

    self.game = game;
    self.currentTile = tile;
    if(connection) {
        self.currentConnection = connection;
        self.originOnTile = origin;
        self.targetOnTile = target;
    } else {
        // no connection passed in so just use the first one on the tile
        self.currentConnection = tile.connections[0];
        self.originOnTile = { side: tile.connections[0].side1, fromEdge: tile.connections[0].fromEdge1 };
        self.targetOnTile = { side: tile.connections[0].side2, fromEdge: tile.connections[0].fromEdge2 };
    }

    self.GetCoordinatesForConnectionPoint = function(connection) {
        var x = self.currentTile.x * self.game.tileWidth;
        var y = self.currentTile.y * self.game.tileHeight;
        if(connection.side == "left") {
            y += connection.fromEdge;
        } else if(connection.side == "right") {
            y += connection.fromEdge;
            x += self.game.tileWidth;
        } else if(connection.side == "top") {
            x += connection.fromEdge;
        } else if(connection.side == "bottom") {
            x += connection.fromEdge;
            y += self.game.tileHeight;
        }
        return { x, y }
    };

    self.currentCoordinates = self.GetCoordinatesForConnectionPoint(self.originOnTile);
    self.currentCoordinatesRelative = { x:0, y:0};
    self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);

    console.log("self.originOnTile")
    console.log(self.originOnTile)
    console.log("self.currentCoordinates")
    console.log(self.currentCoordinates)
    console.log("self.targetOnTile")
    console.log(self.targetOnTile)
    console.log("self.targetCoordinates")
    console.log(self.targetCoordinates)

    self.theta = angle(self.currentCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.x, self.targetCoordinates.y);
    self.theta_radians = self.theta * (Math.PI/180);

    self.Create = function() {
        
    };

    self.DealWithTileSwap = function(tile1, tile2) {
        var xOffSet = self.currentCoordinates.x - (self.currentTile.x * self.game.tileWidth);
        var yOffSet = self.currentCoordinates.y - (self.currentTile.y * self.game.tileHeight);
        console.log("OFFSET IS x: " + xOffSet +", y: " + yOffSet);

        console.log("tile1.id: " + tile1.id + "; tile2.id: " + tile2.id + "; self.currentTile.id: " + self.currentTile.id);
        if(tile1.id == self.currentTile.id) {
            console.log("train is on swapped tile 1!")
            self.currentTile = tile2;
            self.currentCoordinates.x = (self.currentTile.x * self.game.tileWidth) + xOffSet;
            self.currentCoordinates.y = (self.currentTile.y * self.game.tileHeight) + yOffSet;
                    
            self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);
        } else if(tile2.id == self.currentTile.id) {
            console.log("train is on swapped tile 2!")
            self.currentTile = tile1;
            self.currentCoordinates.x = (self.currentTile.x * self.game.tileWidth) + xOffSet;
            self.currentCoordinates.y = (self.currentTile.y * self.game.tileHeight) + yOffSet;
                    
            self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);
        }
    };

    self.DistanceToTarget = function() {
        var deltaX = self.currentCoordinates.x - self.targetCoordinates.x;
        var deltaY = self.currentCoordinates.y - self.targetCoordinates.y;
        var distanceToTarget = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return distanceToTarget;
    };

    self.MoveDistance = function(distance) {
        var adjacent = Math.cos(self.theta_radians ) * distance;
        //console.log("adjacent is " + adjacent)
        // what is the opposite (Y)
        var opposite = Math.sin(self.theta_radians ) * distance;
        //console.log("opposite is " + opposite)

        //console.log("old coordinates are: " + self.currentCoordinates.x + "," + self.currentCoordinates.y)

        self.currentCoordinates.x = self.currentCoordinates.x + adjacent;
        self.currentCoordinates.y = self.currentCoordinates.y + opposite;
        self.currentCoordinatesRelative.x = self.currentCoordinatesRelative.x + adjacent;
        self.currentCoordinatesRelative.y = self.currentCoordinatesRelative.y + adjacent;

        //console.log("new coordinates are: " + self.currentCoordinates.x + "," + self.currentCoordinates.y)
    }

    self.TurnAround = function() {
        console.log("DOING TURNAROUND")
        var oldTarget = self.targetOnTile;
        self.targetOnTile = self.originOnTile;
        self.originOnTile = oldTarget;
        self.currentCoordinates = self.GetCoordinatesForConnectionPoint(self.originOnTile);
        self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);
        self.theta = angle(self.currentCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.x, self.targetCoordinates.y);
        self.theta_radians =  self.theta * (Math.PI/180);
    };

    self.GetTileToMoveTo = function() {
        if(self.game.CheckForConnectionMatch(self.currentTile, self.targetOnTile.side, self.targetOnTile.fromEdge, self.currentConnection.trackType)) {
            console.log("has a connection");
            var neighbour = self.game.GetNeighborTile(self.currentTile,self.targetOnTile.side)
            return neighbour;
        }
        return null;
    };

    self.MoveToNewTile = function() {
        console.log("in movetonewtile")
        var moveToTile = self.GetTileToMoveTo();
        if(moveToTile != null) {


            self.currentTile = moveToTile;
            // find the connection
            var sideToFind = self.game.WhatIsOppositeSide(self.targetOnTile.side);
            var fromEdge = self.targetOnTile.fromEdge;
            var trackType = self.currentConnection.trackType;
            console.log("SIDE TO FIND: " + sideToFind + " ; FROM EDGE: " + fromEdge + " ; TRACK TYPE: " + trackType)
            for(var con = 0; con < moveToTile.connections.length; con++) {
                var connect = moveToTile.connections[con];
                if(connect.side1 == sideToFind && connect.fromEdge1 == fromEdge && connect.trackType == trackType) {
                    self.currentConnection = connect;
                    self.originOnTile = { side: connect.side1, fromEdge: connect.fromEdge1 };
                    self.targetOnTile = { side: connect.side2, fromEdge: connect.fromEdge2 };   
                    self.currentCoordinates = self.GetCoordinatesForConnectionPoint(self.originOnTile);
                    self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);
                    self.theta = angle(self.currentCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.x, self.targetCoordinates.y);
                    console.log("new angle is " + self.theta)
                    self.theta_radians = self.theta * (Math.PI/180);     
                    console.log("new theta_radians is " + self.theta_radians)                   
                    return true;
                }
                if(connect.side2 == sideToFind  && connect.fromEdge2 == fromEdge && connect.trackType == trackType) {
                    self.currentConnection = connect;
                    self.originOnTile = { side: connect.side2, fromEdge: connect.fromEdge2 };
                    self.targetOnTile = { side: connect.side1, fromEdge: connect.fromEdge1 };  
                    self.currentCoordinates = self.GetCoordinatesForConnectionPoint(self.originOnTile);
                    self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);
                    self.theta = angle(self.currentCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.x, self.targetCoordinates.y);
                    console.log("new angle is " + self.theta)
                    self.theta_radians = self.theta * (Math.PI/180);
                    console.log("new theta_radians is " + self.theta_radians)
                    return true;
                }
            }
            // we shouldn't get here!
            console.log("we found a neighbouring tile with a match but then couldn't move to it???????");
        }
        return false;
    }

    self.Move = function() {
        var distance = 5;

        var distanceToTarget = self.DistanceToTarget();
        console.log("distanceToTarget: " + distanceToTarget)
        //console.log("self.theta: " + self.theta)
        //console.log("self.theta_radians: " + self.theta_radians)
        if(distanceToTarget == 0) {
            console.log("DISTANCE TO TARGET IS ZERRRRRRRRRRRRRRRRRROOOO")
            if(self.MoveToNewTile()) {
                console.log("IN THEORY WE'RE ON THE NEW TILE?")
                console.log("origin")
                console.log(self.originOnTile);
                console.log("target")
                console.log(self.targetOnTile);
            } else {
                console.log("WE TURNIN AROUND")
                self.TurnAround();
            }
            self.MoveDistance(distance);
        } else  if(distanceToTarget < distance) {
            if(self.MoveToNewTile()) {
                console.log("IN THEORY WE'RE ON THE NEW TILE?")
            } else {
                console.log("WE TURNIN AROUND")
                var distanceInOtherDirection = distance - distanceToTarget;
                self.TurnAround();
                self.MoveDistance(distanceInOtherDirection);
            }

        } else {
            self.MoveDistance(distance);
        }

        // console.log(self.currentCoordinates);
        // console.log(self.targetCoordinates);
        // var theta = getAngle(self.currentCoordinates.x, self.targetCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.y);

        // console.log("theta is " + theta);
        // var theta_radians = theta * (Math.PI/180);
        

        setTimeout(self.Move, 100);
    };
    self.Move();

    self.Draw = function(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#FF0000";
        ctx.arc(self.currentCoordinates.x, self.currentCoordinates.y, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    };
}

function getAngle(targetA, sourceA) {
    var a = targetA - sourceA;
    a += (a > 180) ? -360 : (a < -180) ? 360 : 0;
    return a;
}
function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}