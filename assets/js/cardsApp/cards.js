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

// Override View.remove()'s default behavior
Backbone.View = Backbone.View.extend({
    remove: function() {
        // Empty the element and remove it from the DOM while preserving events
        $(this.el).empty().detach();

        return this;
    }
});

var appModel = new cardsApp.AppModel();

var Router = Backbone.Router.extend({
    routes: {
        "": "showMain",
        "cardsTable": "showCardsTable",
        "learning": "showLearning",
        "account": "showAccount"

        // "edit/:index": "editToDo",
        // "delete/:index": "delteToDo"
    },
    initialize: function(el) {
        this.el = el;
        this.showMain();

    },
    currentView: null,
    switchView: function(view) {
        if (this.currentView) {
            // Detach the old view
            this.currentView.remove();
        }

        // Move the view element into the DOM (replacing the old content)
        this.el.html(view.el);

        // Render view after it is in the DOM (styles are applied)
        view.render();

        this.currentView = view;
    },
    'showMain': function(){
        var mainView = new cardsApp.MainView();
        this.switchView(mainView);
    },
    showCardsTable: function(){
        var that = this;
        var categories = new cardsApp.CategoriesCollection();
        categories.fetchCategory().done(function(){
            var cardsTableView = new cardsApp.CardsTableView({"categories":categories });
            that.switchView(cardsTableView);
            removeBlocker();

            if(appModel.get("loggedUser")==""){
                $(".navbar-nav.logged-header").hide();
                $(".navbar-nav.not-logged-header").show();
            }
            else {
                $(".navbar-nav.logged-header").show();
                $(".navbar-nav.not-logged-header").hide();
            }
        });
    },
    showLearning: function(){
        var that = this;
        var categories = new cardsApp.CategoriesCollection();
        categories.fetchCategory().done(function(){
            var learningView = new cardsApp.LearningView({ "categories":categories });
            that.switchView(learningView);
        });
    },
    showAccount: function(){
        var accountView = new cardsApp.AccountView();
        this.switchView(accountView);
    }

});

var router = new Router($('.main-container'));

Backbone.history.start();

function showBlocker(){
    $.blockUI({
        css: {
            "border": 0,
            "background-color": "transparent",
            "height": "55px"
        },
        message: " ",
        blockMsgClass: 'gear-spinner'
    });
}

function removeBlocker(){
    $.unblockUI();
}