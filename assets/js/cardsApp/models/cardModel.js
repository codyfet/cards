var cardsApp = cardsApp || {}

cardsApp.CardModel = Backbone.Model.extend({

    defaults: {
        term: "Term",
        translation: "Default name",
        category: "Default category",
        status: true
    },
    schemaName: "Card",
    initialize: function() {
        this.bind("remove", function() {
            this.destroy();
        });

    }
    //https://www.npmjs.com/package/backendless-backbone
});

// cardsApp.CardModel.bind("remove", function() {
//     console.log("REMOVED eventr");
//     this.destroy();
// });

