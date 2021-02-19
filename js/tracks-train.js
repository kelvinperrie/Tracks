

var TrainModel = function(game, tile, connection, origin, target) {
    var self = this;

    self.game = game;
    self.currentTile = tile;
    self.currentConnection = connection;
    self.originOnTile = origin;
    self.targetOnTile = target;


    self.GetCoordinatesForConnectionPoint = function(connection) {
        var x = self.currentTile.x * self.game.tileWidth;
        var y = self.currentTile.y * self.game.tileHeight;
        if(connection.side == "left") {
            y += connection.fromEdge;
        } else if(connection.side == "right") {
            y += connection.fromEdge;
        } else if(connection.side == "top") {
            x += connection.fromEdge;
        } else if(connection.side == "bottom") {
            x += connection.fromEdge;
            y += self.game.tileHeight;
        }
        return { x, y }
    };

    console.log(self.originOnTile)
    console.log(self.targetOnTile)
    self.currentCoordinates = self.GetCoordinatesForConnectionPoint(self.originOnTile);
    self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);

    console.log(self.currentCoordinates)
    console.log(self.targetCoordinates)

    self.theta = angle(self.currentCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.x, self.targetCoordinates.y);
    self.theta_radians = self.theta * (Math.PI/180);

    self.Create = function() {
        
    };

    self.DistanceToTarget = function() {
        var deltaX = self.currentCoordinates.x - self.targetCoordinates.x;
        var deltaY = self.currentCoordinates.y - self.targetCoordinates.y;
        var distanceToTarget = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return distanceToTarget;
    };

    self.MoveDistance = function(distance) {
        var adjacent = Math.cos(self.theta ) * distance;
        console.log("adjacent is " + adjacent)
        // what is the opposite (Y)
        var opposite = Math.sin(self.theta ) * distance;
        console.log("opposite is " + opposite)

        console.log("old coordinates are: " + self.currentCoordinates.x + "," + self.currentCoordinates.y)

        self.currentCoordinates.x = self.currentCoordinates.x - opposite;
        self.currentCoordinates.y = self.currentCoordinates.y - adjacent;

        console.log("new coordinates are: " + self.currentCoordinates.x + "," + self.currentCoordinates.y)
    }

    self.TurnAround = function() {
        console.log("DOING TURNAROUND")
        var oldTarget = self.targetOnTile;
        self.targetOnTile = self.originOnTile;
        self.originOnTile = oldTarget;
        self.currentCoordinates = self.GetCoordinatesForConnectionPoint(self.originOnTile);
        self.targetCoordinates = self.GetCoordinatesForConnectionPoint(self.targetOnTile);
        self.theta = getAngle(self.currentCoordinates.x, self.targetCoordinates.x, self.currentCoordinates.y, self.targetCoordinates.y);
        self.theta_radians =  self.theta * (Math.PI/180);
    };

    self.Move = function() {
        var distance = 5;

        var distanceToTarget = self.DistanceToTarget();
        console.log("distanceToTarget: " + distanceToTarget)
        console.log("self.theta: " + self.theta)
        console.log("self.theta_radians: " + self.theta_radians)
        if(distanceToTarget == 0) {
            self.TurnAround();
            self.MoveDistance(distance);
        } else  if(distanceToTarget < distance) {
            // if turning around
            var distanceInOtherDirection = distance - distanceToTarget;
            self.TurnAround();
            self.MoveDistance(distanceInOtherDirection);
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