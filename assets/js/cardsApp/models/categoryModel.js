var cardsApp = cardsApp || {}

cardsApp.CategoryModel = Backbone.Model.extend({

    defaults: {
        categoryName: "All",                // collection will contain all categories by default
        cards: []                           // array of card models
    },
    schemaName: "Category",
    idAttribute: 'categoryName',
    initialize: function(opt) {
        // console.log("this categoryModel befor");
        // console.log(this);
        // // console.log("opt");
        // // console.log(opt);
        // var cards = this.get("cards");
        // this.cards = new cardsApp.CardsCollection(cards);
        // console.log("this categoryModel after");
        // console.log(this);
    },
    addCard: function(card){
        if (card instanceof cardsApp.CardModel) {
            var cards = this.get("cards");
            cards.push(card);
            this.setCards(cards);
        }
    },
    setCards: function(cards) {
        if(typeof cards == "object") {
            this.set("cards", cards);
        }
        this.save();
    },
    removeCard: function(cardId){
        this.get("cards").get(cardId).destroy();
    }
});