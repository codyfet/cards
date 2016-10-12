var cardsApp = cardsApp || {}

cardsApp.LearningView = Backbone.View.extend({

    tagName: 'div',
    template: $("#learningTemplate").html(),
    events: {
    	"click .start-session" : "startSession"
    },

    initialize: function(options) {
        this.options = options;
        this.cardsForLearning = new cardsApp.CardsCollection();
    },

    render: function() {
        var tmpl = _.template(this.template);
        this.$el.append(tmpl( { "categories": this.options.categories } ));
        this.$el.find(".selectpicker").selectpicker();
        //setTimeout(function(){$("a.info-tooltip").tooltip()}, 1500);
        return this;
    },
    startSession: function(){

        var categoryName = $("#category-list-session").find("option:selected").val();

        var settings = {
            "language" : $("#language").find("option:selected").attr("value"),
            "order": $("#order").find("option:selected").attr("value"),
            "count": parseInt($("#count").find("option:selected").text())
        }

        var that = this;
        this.categories.fetchCategory(categoryName).done(function(){
            var counterCards = 0;
            that.categories.each(function(category){
                var cardsCollection = new cardsApp.CardsCollection();
                cardsCollection = category.get("cards");
                if(cardsCollection.length>0){
                    cardsCollection.each(function(card){
                        // check if we populate all cards that we need for this session
                        // if it's enough -> exit from the loop
                        if(counterCards>=settings.count){
                            return false;
                        }
                        card.set("learned", false);
                        that.cardsForLearning.add(card);
                        counterCards+=1;
                    });
                }
            });

            var $elem = $(that.el).html("");
            var session = new cardsApp.SessionView({
                model: that.cardsForLearning,
                el: $elem,
                settings: settings
            });
        });



    }

});
