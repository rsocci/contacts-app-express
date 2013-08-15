App.Models.Contact = Backbone.Model.extend({
		idAttribute: '_id',
		validate: function(attrs) {
			if ( !attrs.firstName || !attrs.lastName || !attrs.email ) {
				return 'You must provide first name, last name, and email.';
			}
		}
});