var cardsApp = cardsApp || {}

cardsApp.CardsCollection = Backbone.Collection.extend({
	model: cardsApp.CardModel,
    initialize: function(models, options){

    },
    // use fetch() - for getting all cards

    filterByCategory: function(categoryName){
        var filtered = this.filter(function (card) {
            return card.get("category") == categoryName;
        });
        // creating new instance of collection:
        return new cardsApp.CardsCollection(filtered);
        //return filtered;
    },
    // returns list of categories
    getCategories: function(){
        var categories = [];
        this.each(function(model, index) {
            var category = model.get("category");
            if($.inArray(category, categories) == -1){
                categories.push(category);
            }
        });
        return categories;
    }
});