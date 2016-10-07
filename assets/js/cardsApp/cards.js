var cardsApp = cardsApp || {}

//Backendless: defaults
var Defaults = {
    APPLICATION_ID: '1B8C4310-53E6-0409-FF76-74B60348EA00',
    SECRET_KEY: '2444C798-2894-0B46-FFC5-CFE0D5D57500',
    VERSION: 'v1'
};

if (!Defaults.APPLICATION_ID || !Defaults.SECRET_KEY || !Defaults.VERSION) {
    alert("Missing application ID and secret key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in app.js");
}

Backendless.initApp(Defaults.APPLICATION_ID, Defaults.SECRET_KEY, Defaults.VERSION);

var appModel = new cardsApp.AppModel();

var Router = Backbone.Router.extend({
    routes: {
        "main": "openMain",
        "cardsTable": "openCardsTable",
        "learning": "openLearning",
        "account": "openAccount"

        // "edit/:index": "editToDo",
        // "delete/:index": "delteToDo"
    },
    'openMain': function(){
        $('.main-container').html('');

        if(appModel.get("loggedUser")==""){
            $(".navbar-nav.logged-header").hide();
            $(".navbar-nav.not-logged-header").show();
        }
        else {
            $(".navbar-nav.logged-header").show();
            $(".navbar-nav.not-logged-header").hide();
        }

        var mainView = new cardsApp.MainView({
            //model: appModel,
            el: $('.main-container')
        });
        mainView.render();
    },
    'openCardsTable': function() {
        $('.main-container').html('');

        var mainSection = new cardsApp.CardsTableView({
            el: $('.main-container')
        });
    },

    'openLearning': function() {
        $('.main-container').html('');

        var mainSection = new cardsApp.LearningView({
            el: $('.main-container')
        });
    },

    'openAccount': function() {
        $('.main-container').html('');

        var mainSection = new cardsApp.AccountView({
            el: $('.main-container')
        });
    }

});

var router = new Router();

Backbone.history.start();

// open main page when application starts
router.navigate("main", true);