var cardsApp = cardsApp || {}

cardsApp.CategoriesCollection = Backbone.Collection.extend({
	model: cardsApp.CategoryModel,
    initialize: function(models, options){

    },
    // pass "All" or empty value as 'category' if you want to fetch all categories
    fetchCategory: function(category, options){
        // where userId = [current user id]
        var condition = "userId=" + encodeURIComponent("'" + appModel.get("loggedUser").objectId + "'");
        // where userId = [current user id] AND categoryName = [category]
        if (category!= undefined && category!="Все"){
            condition += " AND categoryName=" + encodeURIComponent("'" + category + "'")
        }
        var opt = $.extend({}, options, { "condition" : condition });
        return this.fetch(opt);
    },
    // use fetch() - for getting them all
});