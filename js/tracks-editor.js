
// gonna make some assumptions about accessing the controller in this ...


var EditorModel = function(gameController) {
    var self = this;

    console.log("here comes gamecontr");
    console.log(gameController);
    self.gameController = gameController;

    self.HandleOutputJsonClick = function() {
        $("#output-json").text(JSON.stringify(self.gameController.gameModel.gameData))
    };
    self.HandleMakeMovableClick = function() {
        console.log(self.gameController.gameModel.selectedTile);
        if(self.gameController.gameModel.selectedTile) {
            self.gameController.gameModel.selectedTile.isMoveable = true;
        }
        console.log(self.gameController.gameModel.selectedTile);
    }
    self.HandleMakeNotMovableClick = function() {
        console.log(self.gameController.gameModel.selectedTile);
        if(self.gameController.gameModel.selectedTile) {
            self.gameController.gameModel.selectedTile.isMoveable = false;
        }
        console.log(self.gameController.gameModel.selectedTile);
    };
    self.HandleAddConnectionClick = function(clickedElement) {
        var c1 = $(clickedElement).data("c1");
        var c2 = $(clickedElement).data("c2");
        var trackType = $('#track-type').val()
        if(self.gameController.gameModel.selectedTile) {
            var newConnection = { 
                side1: c1,
                fromEdge1: 50,
                side2: c2,
                fromEdge2: 50,
                trackType: trackType
            }
            self.gameController.gameModel.selectedTile.connections.push(newConnection);
        }
    };
    self.HandleClearConnectionsClick = function() {
        if(self.gameController.gameModel.selectedTile) {
            self.gameController.gameModel.selectedTile.connections = [];
        }
    };
    $(document).ready(function() {
        $(".output-json-trigger").on("click", function() { self.HandleOutputJsonClick(); })
        $(".set-moveable-trigger").on("click", function() { self.HandleMakeMovableClick(); })
        $(".set-not-moveable-trigger").on("click", function() { self.HandleMakeNotMovableClick(); })
        $(".add-connection").on("click", function(event) { self.HandleAddConnectionClick($(this)); })
        $(".clear-connection-trigger").on("click", function() { self.HandleClearConnectionsClick(); })
    });
};


var gameData = [
    {
        level: 0,
        title : "Editor",
        tileCountInWidth : 6,
        tileCountInHeight : 5,
        tiles : []
    }
];

var tileCounter = 1;
for(var y = 0; y < gameData[0].tileCountInHeight; y++) {
    for(var x = 0; x < gameData[0].tileCountInWidth; x++) {
        var newTile = {
                x: x,
                y: y,
                id: tileCounter,
                connections: []
            };
        gameData[0].tiles.push(newTile);
        tileCounter++;
    }
}
