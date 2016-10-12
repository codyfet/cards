var cardsApp = cardsApp || {}

cardsApp.AccountView = Backbone.View.extend({

    tagName: 'div',
    template: $("#accountTemplate").html(),
    events: {

    },

    initialize: function(options) {
        this.options=options;
    },

    render: function() {
        var tmpl = _.template(this.template);
        var userModel = new cardsApp.UserModel(appModel.get("loggedUser"));
        this.$el.append(tmpl( { "userModel": userModel } ));
        return this;
    }

});
