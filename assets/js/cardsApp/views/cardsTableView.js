var cardsApp = cardsApp || {}

cardsApp.CardsTableView = Backbone.View.extend({

    tagName: 'div',
    template: $("#cardsTableTemplate").html(),
    events: {
        "click .add-new-card" : "openCard",
        "changed.bs.select .selectpicker#category-list" : "changeCategory", // special event of select, see for details  https://silviomoreto.github.io/bootstrap-select/options/
        "click .add-btn" : "addCard",
        "click .add-category-btn" : "addCategory",
        "click .remove-btn" : "removeCard",
    	"click .status" : "changeStatus",
        "change select[name='cards-storage_length']": "changePageLength"
    },

    initialize: function(options) {
        this.options = options;
        this.options.pageLength=10; // default pageLength
        this.cardsForShowing = new cardsApp.CardsCollection();
        // this.cardsForShowing.bind('add', this.redrawTable, this);
        // this.model.bind('change', this.onModelAdded, this);
        // this.model.bind('remove', this.onModelAdded, this);
    },

    render: function() {
        var tmpl = _.template(this.template);
        this.$el.append(tmpl({ "categories" : this.options.categories }));
        this.$el.find(".selectpicker").selectpicker();

        // load all by default
        this.loadCategoryTable("Все");
        return this;
    },
    redrawTable: function(){
        console.log("REDRAW!!!!!");
        var currenCategory = $("#category-list").val();
        this.loadCategoryTable(currenCategory);
    },
    changeCategory: function(e){
        var category = e.target.value;
        this.loadCategoryTable(category);
    },
    loadCategoryTable: function(categoryName){

        this.cardsForShowing.reset();

        var that = this;
        var categories = new cardsApp.CategoriesCollection();

        $.when(categories.fetchCategory(categoryName)).then(function(){
            categories.each(function(category){
                // get all cards for this category
                var cardsCollection = new cardsApp.CardsCollection();
                cardsCollection = category.get("cards");
                if(cardsCollection.length>0){
                    cardsCollection.each(function(card){
                        that.cardsForShowing.add(card);
                    });
                }
            });
            var tableTemplate = _.template($('#categoryTableTemplate').html());
            that.$el.find(".table-wrapper").html(tableTemplate({"cards": that.cardsForShowing}));
            that.$el.find('#cards-storage').dataTable({
                "columns": [
                    { "width": "25%" },
                    { "width": "25%" },
                    { "width": "20%" },
                    { "width": "10%" },
                    { "width": "5%" },
                    { "width": "5%" }
                ],
                pageLength: that.options.pageLength
            });
           removeBlocker();
        });

    },
    addCard: function(){
        var selectedCategory = $("#category-list-add").val();
        var newCard = new cardsApp.CardModel({
            "term": $("#term").val(),
            "translation": $("#translation").val(),
            "category": selectedCategory,
            "status": true,
            "userId": appModel.get("loggedUser").objectId
        });
        // this logic do save request to server with new card
        var that = this;
        var categories = new cardsApp.CategoriesCollection();
        categories.fetchCategory(selectedCategory).done(function(){
            var category = categories.at(0);
            category.bind("change", that.redrawTable, that);
            category.addCard(newCard);
        });
        $('#myModal').modal('hide');
    },
    addCategory: function(){
        var newCategory = new cardsApp.CategoryModel({
            categoryName: $("#category").val(),
            userId: appModel.get("loggedUser").objectId
        });
        newCategory.save();
        // update selecpicker, add new option after creating new category
        this.$el.find(".selectpicker#category-list")
            .append("<option>" + newCategory.get("categoryName") + "</option>")
            .selectpicker('refresh');
        $('#myModalAddCategory').modal('hide');
    },
    removeCard: function(e){
        var that = this;
        var cardId = $(e.target).closest("tr").attr("id");
        var categoryName = $(e.target).closest("tr").find(".category-label").html();
        var categories = new cardsApp.CategoriesCollection();
        showBlocker();
        categories.fetchCategory(categoryName).done(function(){
            var category = categories.at(0);
            var cardsCollection = category.get("cards");
            var cardToRemove = cardsCollection.get(cardId);
            cardToRemove.destroy().done(function(){
                that.redrawTable();
            });
        });

    },
    changeStatus: function(e){
        var element = e.target;
        var status = "";
        if($(element).hasClass("inactive")){
            $(element).removeClass("inactive");
            status=true;
            $(element).html("Активна");
        }
        else {
            $(element).addClass("inactive");
            status=false;
            $(element).html("Неактивна");
        }
        var that = this;
        var cardId = $(e.target).closest("tr").attr("id");
        var categoryName = $(e.target).closest("tr").find(".category-label").html();
        var categories = new cardsApp.CategoriesCollection();
        categories.fetchCategory(categoryName).done(function(){
            var category = categories.at(0);
            var cardsCollection = category.get("cards");
            //cardsCollection.bind("change", that.redrawTable, that);
            var cardToChange = cardsCollection.get(cardId);
            cardToChange.set("status",status);
            cardToChange.save();
        });
    },
    changePageLength: function(e){
        this.options.pageLength=e.target.value;
    }

});
