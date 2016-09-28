var cardsApp = cardsApp || {}

cardsApp.CategoryModel = Backbone.Model.extend({

    defaults: {
        categoryName: "All",                 // collection will contain all categories by default
        cards: [],                           // array of card models
        userId: null
    },
    schemaName: "Category",
    idAttribute: 'categoryName',
    initialize: function(opt) {

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