var cardsApp = cardsApp || {}

cardsApp.LearningView = Backbone.View.extend({

    tagName: 'div',
    template: $("#learningTemplate").html(),
    events: {
    	"click .start-session" : "startSession"
    },

    initialize: function() {

        this.cardsForLearning = new cardsApp.CardsCollection();

        var that = this;
        var categories = new cardsApp.CategoriesCollection();
        categories.fetchCategory().done(function(){
            that.categories = categories;
            that.render();
            that.$el.find(".selectpicker").selectpicker();
        });
    },

    render: function() {
        var tmpl = _.template(this.template);
        this.$el.append(tmpl( { "categories": this.categories } ));
        setTimeout(function(){$("a.info-tooltip").tooltip()}, 1500);
        return this;
    },
    startSession: function(){

        var categoryName = $("#category-list").find("option:selected").val();

        var settings = {
            "language" : $("#language").find("option:selected").text(),
            "order": $("#order").find("option:selected").text(),
            "count": $("#count").find("option:selected").text()
        }

        var that = this;

        var defCat = "";
        if(categoryName=="Все"){
            defCat = that.categories.fetch();
        }
        else {
            defCat = that.categories.fetchCategory(categoryName);
        }

        that.categories.each(function(category){
            var cardsCollection = new cardsApp.CardsCollection();
            cardsCollection = category.get("cards");
            if(cardsCollection.length>0){
                cardsCollection.each(function(card){
                    card.set("learned", false);
                    that.cardsForLearning.add(card);
                });
            }
        });
        var $elem = $(that.el).html("");
        var session = new cardsApp.SessionView({
            model: that.cardsForLearning,
            el: $elem,
            settings: settings
        });

    }

});
