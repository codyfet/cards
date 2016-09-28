var cardsApp = cardsApp || {}

cardsApp.UserModel = Backbone.Model.extend({

    defaults: {
        email: "default@email.com",
        name: "Default name"
        // created:1475051535000
        // email:"test@test1.com"
        // name:"Лев"
        // objectId:"969674D6-CF45-3AF9-FF81-8F5FB8DEA600"
        // ownerId:"969674D6-CF45-3AF9-FF81-8F5FB8DEA600"
        // updated:null
        // userStatus:"ENABLED"
    },
    schemaName: "Users",
    initialize: function() {

    }
    //https://www.npmjs.com/package/backendless-backbone
});