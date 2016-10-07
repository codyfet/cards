var cardsApp = cardsApp || {}

cardsApp.MainView = Backbone.View.extend({

    tagName: 'div',
    template: $("#mainWrapper").html(),
    events: {
        "click #create-account": "showRegbox",
        "click #sign-in": "showLogbox",
        "click .enter-btn": "loginFunc",
        "click .register-btn": "registerFunc",

        "focusout input": "focusoutField",
        "focus input": "focusField"

    },

    initialize: function() {
        //bind listeners for header menu items
        $(".user-pic").bind("click", function(){
            router.navigate('account', true);
        });
        var that = this;
        $(".login-header").click(function(){
            that.openLoginModal();
        });
        $(".register-header").click(function(){
            that.openRegisterModal();
        });
    },

    render: function() {
        var tmpl = _.template(this.template);
        this.$el.append(tmpl());
        return this;
    },

    showRegbox: function() {
        this.clearAllFields();
        this.$el.find("#logbox").hide();
        this.$el.find("#regbox").show();
    },

    showLogbox: function() {
        this.clearAllFields();
        this.$el.find("#logbox").show();
        this.$el.find("#regbox").hide();
    },

    clearAllFields: function(){
        this.$el.find("#logbox, #regbox").find("input").val("").removeClass("invalid");
    },

    registerFunc: function() {
        var userData = {
            username: $("#regbox input[name='user[name]']").val(),
            password: $("#regbox input[name='user[password]']").val(),
            email: $("input[name='user[email]']").val()
        }
        if(this.validateRegForm()==true){
            this.registerUser(userData);
        }
        else {
            $("#status").html("вы ввели некорректные значения");
        }
    },

    loginFunc: function() {
        var userData = {
            //username : $("#logbox input[name='user[name]']").val(),
            password: $("#logbox input[name='user[password]']").val(),
            email: $("#logbox input[name='user[email]']").val()
        }
        if(this.validateLogForm()==true){
            this.loginUserAsync(userData);
        }
        else {
            $("#status").html("вы ввели некорректные значения");
        }
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
        $(".navbar-nav.logged-header").show();
        $(".navbar-nav.not-logged-header").hide();
    },

    handleFault: function(backendlessFault) {
        console.log("Server reported an error - ");
        console.log(backendlessFault.message);
        console.log(backendlessFault.statusCode);
    },

    validateRegForm: function(){
        var that = this;
        var inputs = $("#regbox form input");
        var isFormValid = true;
        $.each(inputs, function(index, el){
            var isFieldValid = that.validateField(el);
            if(isFieldValid==false){
                isFormValid=false;
            }
        });
        return isFormValid;
    },

    validateLogForm: function(){
        var that = this;
        var inputs = $("#logbox form input");
        var isFormValid = true;
        $.each(inputs, function(index, el){
            var isFieldValid = that.validateField(el);
            if(isFieldValid==false){
                isFormValid=false;
            }
        });
        return isFormValid;
    },

    focusoutField: function(e){
        var element = e.target;
        this.validateField(element);
    },

    validateField: function(element){
        //var element = e.target;
        var isValid = true;
        switch(element.name){
            case "user[name]":
                // required
                if(element.value==""){
                    $(element).addClass("invalid");
                    isValid=false;
                }
                break;
            case "user[password]":
                // required
                if(element.value==""){
                    $(element).addClass("invalid");
                    isValid=false;
                }
                break;
            case "user[password2]":
                // required
                // equals to password
                if(element.value=="" || element.value!=$("input[name='user[password]']").val()){
                    $(element).addClass("invalid");
                    isValid=false;
                }
                break;
            case "user[email]":
                // required
                // email format
                if(element.value=="" || !this.isValidEmailAddress(element.value)){
                    $(element).addClass("invalid");
                    isValid=false;
                }
                break;
        }
        return isValid;

    },

    focusField: function(e){
        // remove red border on focus event
        $(e.target).removeClass("invalid");
    },

    isValidEmailAddress: function(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    },

    openRegisterModal: function(){
        $('#registerModal').on('shown.bs.modal', function () {
            $(this).find('input').first().focus();
        });
        $('#registerModal').modal('show');
    },
    openLoginModal: function(){
        $('#loginModal').on('shown.bs.modal', function () {
            $(this).find('input').first().focus();
        });
        $('#loginModal').modal('show');
    }

});
