
var GameControllerModel = function(settings) {
    var self = this;

    self.currentLevel = 0;
    self.settings = settings;
    self.gameData = gameData;

    self.Initialize = function() {
        var cookieValue = getCookie("LevelCompleted");
        console.log("cookieValue: "+ cookieValue);
        self.currentLevel = cookieValue ?? 0;
        self.gameModel = new GameModel(gameData[self.currentLevel], self.settings, self.LevelCompleteCallback);
        self.LoadCurrentLevel();
    };

    self.LevelCompleteCallback = function() {
        self.ShowLevelCompletePopup();
    };


    self.CloseLevelCompletePopup = function() {
        $("#level-completion-popup").hide();
    };
    self.ShowLevelCompletePopup = function() {
        // record the fact that this level has just been completed - over write existing
        console.log("setting cookie to " + self.currentLevel);
        setCookie("LevelCompleted",self.currentLevel);

        document.cookie = "Testing=Crap";
        var asdf = getCookie("Testing")
        console.log("asdf: " + asdf)


        // give us a bit of a pause before slaming that popup in our face
        setTimeout(function() { $("#level-completion-popup").show(); } , 500);
    };

    self.DisplayLevelInfo = function() {
        var title = self.gameModel.gameData.level + ": " + self.gameModel.gameData.title;
        $(".title").html(title);
        if(self.IsANextLevel()) {
            $(".next-level-trigger").addClass("clickable");
            $(".next-level-on-popup").text("go to next level!")
        } else {
            $(".next-level-trigger").removeClass("clickable");
            $(".next-level-on-popup").text("Nice, you've done all the levels!")
        }
        if(self.IsAPreviousLevel()) {
            $(".previous-level-trigger").addClass("clickable");
        } else {
            $(".previous-level-trigger").removeClass("clickable");
        }
    };
    self.LoadCurrentLevel = function() {
        // if they just completed a level the popup might be open, so close it
        self.CloseLevelCompletePopup();
        //self.gameModel = new GameModel(gameData[self.currentLevel]);
        self.gameModel.SetupBoard(self.gameData[self.currentLevel]);
        self.DisplayLevelInfo();
    }
    self.GotoSpecificLevel = function(level) {
        self.currentLevel = level;
        self.LoadCurrentLevel();
    }
    self.GotoNextLevel = function() {
        if(self.IsANextLevel()) {
            self.currentLevel++;
            self.LoadCurrentLevel();
        }
    }
    self.GotoPreviousLevel = function() {
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

    self.Initialize();

    $(document).ready(function() {
        $(".next-level-trigger").on("click", self.GotoNextLevel);
        $(".previous-level-trigger").on("click", self.GotoPreviousLevel);
        $(".close-popup-trigger").on("click", self.CloseLevelCompletePopup);
    });
}


// https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}