

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

    self.GetCoordinatesForConnectionPoint = function(connectionPoint) {
        var x = self.currentTile.x * self.game.tileWidth;
        var y = self.currentTile.y * self.game.tileHeight;
        if(connectionPoint.side == "left") {
            y += connectionPoint.fromEdge;
        } else if(connectionPoint.side == "right") {
            y += connectionPoint.fromEdge;
            x += self.game.tileWidth;
        } else if(connectionPoint.side == "top") {
            x += connectionPoint.fromEdge;
        } else if(connectionPoint.side == "bottom") {
            x += connectionPoint.fromEdge;
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

    // these are used for movement on a curved connection
    self.currentlyOnCurve = false;
    self.currentCurveCenterCoordinates = null;
    self.currentCurveAngle = 0;
    self.angleToOrigin = 0;
    self.angleToTarget = 0;
    self.angleIncrement = 0;

    self.Create = function() {
        
    };

    self.DealWithTileSwap = function(tile1, tile2) {
        var xOffSet = self.currentCoordinates.x - (self.currentTile.x * self.game.tileWidth);
        var yOffSet = self.currentCoordinates.y - (self.currentTile.y * self.game.tileHeight);
        //console.log("OFFSET IS x: " + xOffSet +", y: " + yOffSet);

        //console.log("tile1.id: " + tile1.id + "; tile2.id: " + tile2.id + "; self.currentTile.id: " + self.currentTile.id);
        if(tile1.id == self.currentTile.id) {
            //console.log("train is on swapped tile 1!")
            self.currentTile = tile2;
            self.currentCoordinates.x = (self.currentTile.x * self.game.tileWidth) + xOffSet;
            self.currentCoordinates.y = (self.currentTile.y * self.game.tileHeight) + yOffSet;
                    
            self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);

            self.currentCurveCenterCoordinates = self.GetCurveCenterCoordinates(self.currentConnection);
        } else if(tile2.id == self.currentTile.id) {
            //console.log("train is on swapped tile 2!")
            self.currentTile = tile1;
            self.currentCoordinates.x = (self.currentTile.x * self.game.tileWidth) + xOffSet;
            self.currentCoordinates.y = (self.currentTile.y * self.game.tileHeight) + yOffSet;
                    
            self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);

            self.currentCurveCenterCoordinates = self.GetCurveCenterCoordinates(self.currentConnection);
        }
    };

    self.DistanceToTarget = function() {
        var deltaX = self.currentCoordinates.x - self.targetCoordinates.x;
        var deltaY = self.currentCoordinates.y - self.targetCoordinates.y;
        var distanceToTarget = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return distanceToTarget;
    };

    self.MoveDistance = function(distance) {
        if(self.currentlyOnCurve) {
            // move us around the curve
            self.currentCurveAngle = self.currentCurveAngle + self.angleIncrement;
            // check to see if we're at the end of the curve
            if(self.angleToOrigin < self.angleToTarget) {
                // our angle is increasing
                if(self.currentCurveAngle > self.angleToTarget) {
                    //console.log("setting currentCurveAngle to angleToTarget 1")
                    self.currentCurveAngle = self.angleToTarget;
                }
            } else {
                if(self.currentCurveAngle < self.angleToTarget) {
                    //console.log("setting currentCurveAngle to angleToTarget 2")
                    self.currentCurveAngle = self.angleToTarget;
                }
            }
            var currentCurveAngle_radians = self.currentCurveAngle * (Math.PI/180);
            var adjacent = Math.cos(currentCurveAngle_radians) * 50;
            var opposite = Math.sin(currentCurveAngle_radians) * 50;    // only works on curve that starts/ends at 50px
            self.currentCoordinates.x = self.currentCurveCenterCoordinates.x + adjacent;
            self.currentCoordinates.y = self.currentCurveCenterCoordinates.y + opposite;

        } else {
            // move us along a straight line
            var adjacent = Math.cos(self.theta_radians ) * distance;
            //console.log("adjacent is " + adjacent)
            // what is the opposite (Y)
            var opposite = Math.sin(self.theta_radians ) * distance;
            //console.log("opposite is " + opposite)

            //console.log("old coordinates are: " + self.currentCoordinates.x + "," + self.currentCoordinates.y)

            self.currentCoordinates.x = self.currentCoordinates.x + adjacent;
            self.currentCoordinates.y = self.currentCoordinates.y + opposite;
        }
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
        self.SetupMovedToTileCurveDetails();
    };

    // gets the tile on the side of the target i.e. the tile we would like to move to based on our current connection
    self.GetTileToMoveTo = function() {
        if(self.game.CheckForConnectionMatch(self.currentTile, self.targetOnTile.side, self.targetOnTile.fromEdge, self.currentConnection.trackType)) {
            var neighbour = self.game.GetNeighborTile(self.currentTile,self.targetOnTile.side)
            return neighbour;
        }
        return null;
    };

    self.GetCurveCenterCoordinates = function(connection) {
        // this will screw up if fromEdge is ever not 50
        var x = self.currentTile.x * self.game.tileWidth;
        var y = self.currentTile.y * self.game.tileHeight;
        if(connection.side1 == "left" || connection.side2 == "left") {

        } else if(connection.side1 == "right" || connection.side2 == "right") {
            x += self.game.tileWidth;
        }
        if(connection.side1 == "top" || connection.side2 == "top") {

        } else if(connection.side1 == "bottom" || connection.side2 == "bottom") {
            y += self.game.tileHeight;
        }
        return { x, y }
    };

    // if we've just moved to a curving tile then initialise the various stupid variables
    self.SetupMovedToTileCurveDetails = function() {
        var isCurve = self.game.IsConnectionACurve(self.currentConnection);
        if(isCurve) {
            self.currentlyOnCurve = true;
            self.currentCurveCenterCoordinates = self.GetCurveCenterCoordinates(self.currentConnection);

            self.angleToOrigin = angle(self.currentCurveCenterCoordinates.x,self.currentCurveCenterCoordinates.y,self.currentCoordinates.x,self.currentCoordinates.y);
            self.angleToTarget = angle(self.currentCurveCenterCoordinates.x,self.currentCurveCenterCoordinates.y,self.targetCoordinates.x, self.targetCoordinates.y);
            
            //console.log("just set curve center coords to x: " + self.currentCurveCenterCoordinates.x + ", y: " + self.currentCurveCenterCoordinates.y);
            //console.log("ANGLE TO ORIGIN: " + self.angleToOrigin);
            //console.log("ANGLE TO TARGET: " + self.angleToTarget);

            // some edge cases as 0 = 360, which screws up working out the direction we want to travel
            if(self.angleToOrigin == 270 && self.angleToTarget == 0) {
                self.angleIncrement = 5;
            } else if(self.angleToOrigin == 0 && self.angleToTarget == 270) {
                self.angleIncrement = -5;
            } else if(self.angleToOrigin < self.angleToTarget) {
                self.angleIncrement = 5;
            } else if(self.angleToTarget < self.angleToOrigin) {
                self.angleIncrement = -5;
            }
            // put our current curve angle at the start of the connection
            self.currentCurveAngle = self.angleToOrigin;

        } else {
            self.currentlyOnCurve = false;
            // reset other curve related vars??? does it matter?
        }
    };

    self.MoveToNewTile = function() {

        // see if there is a tile we can move to (adjacent to our current target)
        var moveToTile = self.GetTileToMoveTo();
        if(moveToTile != null) {

            self.currentTile = moveToTile;
            // get details about our current connection point
            var sideToFind = self.game.WhatIsOppositeSide(self.targetOnTile.side);
            var fromEdge = self.targetOnTile.fromEdge;
            var trackType = self.currentConnection.trackType;
            
            // go through all the connections on the tile we want to move to and see if any of them have a connection point 
            // that matches our current target - if yes then we can move to that tile
            for(var con = 0; con < moveToTile.connections.length; con++) {
                var connect = moveToTile.connections[con];
                if(connect.side1 == sideToFind && connect.fromEdge1 == fromEdge && connect.trackType == trackType) {
                    console.log("FOUND TILE TO MOVE TO")
                    self.currentConnection = connect;
                    self.originOnTile = { side: connect.side1, fromEdge: connect.fromEdge1 };
                    self.targetOnTile = { side: connect.side2, fromEdge: connect.fromEdge2 };   
                    self.currentCoordinates = self.GetCoordinatesForConnectionPoint(self.originOnTile);
                    self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);
                    self.theta = angle(self.currentCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.x, self.targetCoordinates.y);
                    //console.log("new angle is " + self.theta);
                    self.theta_radians = self.theta * (Math.PI/180);
                    //console.log("new theta_radians is " + self.theta_radians);

                    self.SetupMovedToTileCurveDetails();

                    return true;
                }
                if(connect.side2 == sideToFind  && connect.fromEdge2 == fromEdge && connect.trackType == trackType) {
                    console.log("FOUND TILE TO MOVE TO")
                    self.currentConnection = connect;
                    self.originOnTile = { side: connect.side2, fromEdge: connect.fromEdge2 };
                    self.targetOnTile = { side: connect.side1, fromEdge: connect.fromEdge1 };  
                    self.currentCoordinates = self.GetCoordinatesForConnectionPoint(self.originOnTile);
                    self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);
                    self.theta = angle(self.currentCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.x, self.targetCoordinates.y);
                    //console.log("new angle is " + self.theta)
                    self.theta_radians = self.theta * (Math.PI/180);
                    //console.log("new theta_radians is " + self.theta_radians)

                    self.SetupMovedToTileCurveDetails();

                    return true;
                }
            }
            // we shouldn't get here!
            console.log("we found a neighbouring tile with a match but then couldn't move to it??????? lets panic");
        }
        return false;
    }

    // this is the movement loop
    self.Move = function() {
        
        var distance = 5;   // how far to move on a straight tile

        if(self.currentlyOnCurve == true) {

            // how far have we travelled around the curve?
            var travelled = Math.abs(self.currentCurveAngle - self.angleToOrigin);
            //console.log("so far we have travelled " + travelled);

            // if we have travelled 90 degress then that's a full corner
            if(travelled >= 90) {
                // we're at our target, so either move to a new tile or turn around
                if(self.MoveToNewTile()) {
                    console.log("IN THEORY WE'RE ON THE NEW CURVE TILE?")
                } else {
                    // unable to get a tile to move to, so turn us around
                    self.TurnAround();
                }
                self.MoveDistance(distance);

            } else {
                // we haven't travelled far enough, keep going
                self.MoveDistance();
            }
            
        } else {

            // how far have we travelled along the straight
            var distanceToTarget = self.DistanceToTarget();

            if(distanceToTarget == 0) {
                // we've arrived at the target, so either move to a new tile (if there is one) or turn around
                if(self.MoveToNewTile()) {
                    console.log("IN THEORY WE'RE ON THE NEW STRAIGHT TILE?")
                } else {
                    // unable to get a tile to move to, so turn us around
                    self.TurnAround();
                }
                self.MoveDistance(distance);

            } else  if(distanceToTarget < distance) {
                // we're almost at our target - the distance we need to get there is less than our normal travel distance
                if(self.MoveToNewTile()) {
                    console.log("IN THEORY WE'RE ON THE NEW TILE?")
                    self.MoveDistance(distance);
                } else {
                    var distanceInOtherDirection = distance - distanceToTarget;
                    self.TurnAround();
                    self.MoveDistance(distanceInOtherDirection);
                }

            } else {
                // we haven't travelled far enough, keep going
                self.MoveDistance(distance);
            }
        }

        setTimeout(self.Move, 100);
    };
    self.Move();

    self.Draw = function(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#FFAA66";
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
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}