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
            notLearnedCards : new Backbone.Collection(this.model.toJSON()), // cloned sesionCards
            currentPos : 1,
            order : options.settings.order // sequential or randowm
        }
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
        // random mode
        if(this.session.order=="random"){
            var randomNumber = this.randomIntFromInterval(0, this.session.notLearnedCards.models.length-1);

            // if all cards are already learned -> return from function
            if(this.session.notLearnedCards.length==0){
                this.finishSession();
                return false;
            }
            var randomNotLearnedCard = this.session.notLearnedCards.at(randomNumber);
            var originalCard = this.session.sessionCards.where({objectId: randomNotLearnedCard.get("objectId")})[0];
            var index = this.session.sessionCards.indexOf(originalCard);
            this.session.currentPos = index+1;
        }
        // sequential mode
        else if("sequential"){
            if(currentPos!=this.session.sessionCards.models.length){
                this.session.currentPos += 1;
            }
            // if it is the last card in sequence -> return from function
            else{
                this.finishSession();
                return false;
            }
        }
        this.render();
    },
    randomIntFromInterval: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    // getNextNotLearnedPos: function(currentPos){
    //     var nextNotLearnedPos=1;
    //     // if next card already learned
    //     // we need to find next not learned
    //     if(this.session.sessionCards.models[currentPos-1].get("learned")==true){
    //         var found = false;
    //         // search in right side
    //         for(var i=currentPos; i<this.session.sessionCards.models.length; i++){
    //             if(this.session.sessionCards.models[i].get("learned")==false){
    //                 nextNotLearnedPos = i+1;
    //                 found = true;
    //                 break;
    //             }
    //         }
    //         // search in left side
    //         if(!found){
    //             for(var i=0; i<this.session.sessionCards.models.length; i++){
    //                 if(this.session.sessionCards.models[i].get("learned")==false){
    //                     nextNotLearnedPos = i+1;
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     else {
    //         nextNotLearnedPos += 1;
    //     }
    //     return nextNotLearnedPos;
    // },
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

        this.session.notLearnedCards.remove(cardModel);

        this.nextCard();
    },
    finishSession: function(){
        console.log("FINISH");
    }
});
