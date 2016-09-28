var cardsApp = cardsApp || {}

cardsApp.SessionView = Backbone.View.extend({

    tagName: 'div',
    template: $("#sessionTemplate").html(),
    //model: that.cardsForLearning,
    events: {
        "click .answer-btn" : "toggleAnswer",
        "click .next-btn" : "nextCard",
        "click .prev-btn" : "previousCard",
        "click .counter " : "loadCard",
        "click .dont-know-btn " : "notLearned",
        "click .know-btn " : "learned"
    },

    initialize: function(options) {

        

        this.session = {
            sessionCards : this.model,
            currentPos : 1
        }

        var that = this;

        console.log("this.session");
        console.log(this.session);
        // filter by categories
        // var categories = options.settings.categories;
        // $.each(this.model, function(index, collection){
        //     collection.each(function(card){
        //         if($.inArray(card.get("category"), categories) != -1){
        //             $.extend(card, {"learned":false})
        //             that.session.sessionCards.push(card);
        //         }
        //     });
        // });

        // console.log("sessionCards");
        // console.log(sessionCards);

        this.render();
    },

    render: function() {
        var tmpl = _.template(this.template);
        this.$el.html("");
        this.$el.append(tmpl({session:this.session}));
        return this;
    },

    toggleAnswer: function(e){

        var element = e.target;
        if(e.target.tagName=="BUTTON"){
            element = $(e.target).find("span");
        }

        if($(element).hasClass("glyphicon-eye-open")){
            $(element).removeClass("glyphicon-eye-open");
            $(element).addClass("glyphicon-eye-close");
            $(".question").hide();
            $(".answer").show();
        }
        else {
            $(element).removeClass("glyphicon-eye-close");
            $(element).addClass("glyphicon-eye-open");
            $(".question").show();
            $(".answer").hide();
        }

    },
    nextCard: function(){
        var currentPos = this.session.currentPos;

        // (function(array, index) {

        //     var right = array.filter(function(e, i) {
        //         return i >= index;
        //     });

        //     var left = array.filter(function(e, i) {
        //         return i < index;
        //     });
        //     var ind = right.indexOf(false);

        //     return (!!~ind) ? ind + left.length : left.indexOf(false);

        // }([false, false, true, false, true], 2));


        // if next card already learned
        // we need to find next not learned
        if(this.session.sessionCards.models[currentPos-1].get("learned")==true){
            var found = false;
            // search in right side
            for(var i=currentPos; i<this.session.sessionCards.models.length; i++){
                if(this.session.sessionCards.models[i].get("learned")==false){
                    currentPos = i+1;
                    found = true;
                    break;
                }
            }
            // search in left side
            if(!found){
                for(var i=0; i<this.session.sessionCards.models.length; i++){
                    if(this.session.sessionCards.models[i].get("learned")==false){
                        currentPos = i+1;
                        break;
                    }
                }
            }
        }
        else {
            currentPos += 1;
        }
        this.session.currentPos = currentPos;
        this.render();

    },
    previousCard: function(){
        var currentPos = this.session.currentPos;
        currentPos -= 1;
        this.session.currentPos = currentPos;
        this.render();
    },
    loadCard: function(e){
        var pos = $(e.target).html();
        this.session.currentPos = parseInt(pos);
        this.render();
    },
    notLearned: function(e){
        var currentPos = this.session.currentPos;
        $(".counter[value='" + this.session.currentPos + "']").addClass("success");
        var cardModel = this.model.at(currentPos-1);
        cardModel.set("learned", false);
        this.nextCard();
    },
    learned: function(e){
        var currentPos = this.session.currentPos;
        $(".counter[value='" + this.session.currentPos + "']").addClass("success");
        var cardModel = this.model.at(currentPos-1);
        cardModel.set("learned", true);
        this.nextCard();
    },
    finishSession: function(){
        console.log("FINISH");
    }
});
