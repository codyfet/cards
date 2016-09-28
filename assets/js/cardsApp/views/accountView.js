var cardsApp = cardsApp || {}

cardsApp.AccountView = Backbone.View.extend({

    tagName: 'div',
    template: $("#accountTemplate").html(),
    events: {

    },

    initialize: function() {
        this.render();
    },

    render: function() {
        var tmpl = _.template(this.template);
        this.$el.append(tmpl( /*{ "categories": this.categories }*/ ));
        return this;
    }

});
