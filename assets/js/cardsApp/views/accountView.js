var cardsApp = cardsApp || {}

cardsApp.AccountView = Backbone.View.extend({

    tagName: 'div',
    template: $("#accountTemplate").html(),
    events: {
    	//"click .start-session" : "startSession"
    },

    initialize: function() {

        // this.cardsForLearning = new cardsApp.CardsCollection();

        // var that = this;
        // var categories = new cardsApp.CategoriesCollection();
        // categories.fetch().done(function(){
        //     that.categories = categories;
        //     that.render();
        //     that.$el.find(".selectpicker").selectpicker();
        // });

        this.render();
    },

    render: function() {
        var tmpl = _.template(this.template);
        this.$el.append(tmpl( /*{ "categories": this.categories }*/ ));
        return this;
    }

});
