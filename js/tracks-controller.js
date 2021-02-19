
var GameController = function() {
    var self = this;

    self.currentLevel = 0;
    self.gameData = gameData;
    self.gameModel = new GameModel(gameData[self.currentLevel]);

    self.DisplayLevelInfo = function() {
        console.log("updating level info")
        var title = self.gameModel.gameData.level + ": " + self.gameModel.gameData.title;
        console.log(title);
        $(".title").html(title);
        if(self.IsANextLevel()) {
            $(".next-level-trigger").addClass("clickable");
        } else {
            $(".next-level-trigger").removeClass("clickable");
        }
        if(self.IsAPreviousLevel()) {
            $(".previous-level-trigger").addClass("clickable");
        } else {
            $(".previous-level-trigger").removeClass("clickable");
        }
    };
    self.LoadCurrentLevel = function() {
        //self.gameModel = new GameModel(gameData[self.currentLevel]);
        self.gameModel.SetupBoard(self.gameData[self.currentLevel]);
        self.DisplayLevelInfo();
    }
    self.GotoSpecificLevel = function(level) {
        self.currentLevel = level;
        self.LoadCurrentLevel();
    }
    self.GotoNextLevel = function() {
        console.log("going to next level")
        if(self.IsANextLevel()) {
            self.currentLevel++;
            self.LoadCurrentLevel();
        }
    }
    self.GotoPreviousLevel = function() {
        console.log("going to previous level")
        if(self.IsAPreviousLevel()) {
            self.currentLevel--;
            self.LoadCurrentLevel();
        }
    }
    self.IsANextLevel = function() {
        return (self.currentLevel < self.gameData.length -1);
    }
    self.IsAPreviousLevel = function() {
        return (self.currentLevel > 0);
    }

    self.Initialize = function() {
        self.LoadCurrentLevel();
    }
    self.Initialize();

    $(document).ready(function() {
        $(".next-level-trigger").on("click", self.GotoNextLevel);
        $(".previous-level-trigger").on("click", self.GotoPreviousLevel);
    });
}