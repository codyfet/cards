var cardsApp = cardsApp || {}

cardsApp.CategoriesCollection = Backbone.Collection.extend({
	model: cardsApp.CategoryModel,
    initialize: function(models, options){

    },
    // pass "All" or empty value as 'category' if you want to fetch all categories
    fetchCategory: function(category, options){
        var condition = "";
        if (category!= undefined && category!="All"){
            condition = "categoryName=" + encodeURIComponent("'" + category + "'")
        }
        var opt = $.extend({}, options, { "condition" : condition });
        return this.fetch(opt);
    },
    // use fetch() - for getting them all
});