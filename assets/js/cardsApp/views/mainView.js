var cardsApp = cardsApp || {}

cardsApp.MainView = Backbone.View.extend({

    tagName: 'div',
    template: $("#mainWrapper").html(),
    events: {
        "click #create-account": "showRegbox",
        "click #sign-in": "showLogbox",
        "click .enter-btn": "loginFunc",
        "click .register-btn": "registerFunc"
    },

    initialize: function() {

    },

    render: function() {
        var tmpl = _.template(this.template);
        this.$el.append(tmpl());
        return this;
    },

    showRegbox: function() {
        this.$el.find("#logbox").hide();
        this.$el.find("#regbox").show();
    },

    showLogbox: function() {
        this.$el.find("#logbox").show();
        this.$el.find("#regbox").hide();
    },

    registerFunc: function() {

        var userData = {
            username: $("#regbox input[name='user[name]']").val(),
            password: $("#regbox input[name='user[password]']").val(),
            email: $("input[name='user[email]']").val()
        }

        this.registerUser(userData);
    },

    loginFunc: function() {

        var userData = {
            //username : $("#logbox input[name='user[name]']").val(),
            password: $("#logbox input[name='user[password]']").val(),
            email: $("#logbox input[name='user[email]']").val()
        }

        this.loginUserAsync(userData);
    },


    // BACKENDLESS REGISTRATION FUNCTIONS
    registerUser: function(userData) {
        var user = new Backendless.User();
        user.email = userData.email;
        user.password = userData.password;
        user.name = userData.username;
        $("#status").html("регистрация пользователя...");
        Backendless.UserService.register(user, new Backendless.Async(this.userRegistered, this.gotError));
    },

    userRegistered: function(user) {
        $("#status").html("регистрация прошла успешно!");
        var user = new cardsApp.UserModel(user);
        appModel.set("loggedUser", user);
        router.navigate('cardsTable', true);
        $(".user-pic").removeClass("empty-avatar");
        $(".navbar-nav").find("li").show();
    },

    gotError: function(err) { // see more on error handling
        $("#status").html("к сожалению, сервер вернул ошибку " + err.message);
        console.log("error message - " + err.message);
        console.log("error code - " + err.statusCode);
    },

    // BACKENDLESS LOGIN FUNCTIONS
    loginUserAsync: function(userData) {
        var callback = new Backendless.Async(this.handleResponse, this.handleFault);
        Backendless.UserService.login(userData.email, userData.password, callback);
    },

    handleResponse: function(loggedInUser) {
        console.log("User has been logged in - " + loggedInUser.objectId);
        $("#status").html("вы успешно вошли как " + loggedInUser.name);
        appModel.set("loggedUser", loggedInUser);
        router.navigate('cardsTable', true);
        $(".user-pic").removeClass("empty-avatar");
        $(".navbar-nav").find("li").show();
    },

    handleFault: function(backendlessFault) {
        console.log("Server reported an error - ");
        console.log(backendlessFault.message);
        console.log(backendlessFault.statusCode);
    }

});
