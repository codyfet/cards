var rateApp = rateApp || {}

var rowTemplate = "<tr><td class='name'><img class='results-poster' src='<%= poster_path %>'></td><td class='age'><%= title %></td><td class='year'><%= release_date %></td><td class='intersectionImageCell'><% $.each(actorsArray, function(index, model){ var imagePath = $('#actorid_'+model).find('img').attr('src'); %> <img class='intersectionImage' src=<%= imagePath %>> <%}); %></td></tr>";

rateApp.TableView = Backbone.View.extend({
    tagName: $("#tableResultsTemplate").html(),
    initialize: function () {
        _.bindAll(this, 'render', 'renderOne');
        //if (this.model) {
        this.collection.on('change reset add remove', this.render, this);
        //this.collection.sort_by_release_date()
        this.collection.sort_by_actors_count();
        //}
    },
    render: function () {
        this.collection.each(this.renderOne);
        return this;
    },
    renderOne: function (model) {
        var row = new RowView({
                model: model
            });
        this.$el.append(row.render().$el);
        return this;
    }
});

var RowView = Backbone.View.extend({
    events: {
        "click .age": function () {
            console.log(this.model.get("name"));
        }
    },
    initialize: function () {
        this.model.on('change', this.render, this);
    },
    //model: peopleCollection.models,
    render: function () {
        console.log("this.model.attributes");
        console.log(this.model.attributes);
         var html=_.template(rowTemplate,this.model.attributes);
         this.setElement( $(html) );
         return this;
    },
});