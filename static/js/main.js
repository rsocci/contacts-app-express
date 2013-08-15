(function() {

	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	// use when need to make annoucement
	window.vent = _.extend({}, Backbone.Events);

	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};

})();