// Global app view. Responsible to get everything up and running.
App.Views.App = Backbone.View.extend({
initialize: function() {
		vent.on('contact:edit', this.editContact, this);
		var addContactView = new App.Views.AddContact({ collection: App.contacts });
		var allContactsView = new App.Views.Contacts({ collection: App.contacts }).render();
		$('#allContacts').append( allContactsView.el );
	},

	editContact: function(contact) {
		var editContactView = new App.Views.EditContact({ model: contact });
		$('#editContact').html(editContactView.el);
	}
});

// Add contact view
App.Views.AddContact = Backbone.View.extend({
	el: '#addContact',

	initialize: function() {
		this.first_name = $('#first_name');
		this.last_name = $('#last_name');
		this.email = $('#email');
	},

	events: {
		'submit': 'addContact'
	},

	addContact: function(e) {
		e.preventDefault();

		this.collection.create({ // fires ajax request to server.
			firstName: this.first_name.val(),
			lastName: this.last_name.val(),
			email: this.email.val(),
		}, {wait: true}); // waits before setting new values

		this.clearForm();
	},

	clearForm: function() {
		this.first_name.val('');
		this.last_name.val('');
		this.email.val('');
	}
});

// Edit Contact View
App.Views.EditContact = Backbone.View.extend({
	template: template('editContactTemplate'),

	initialize: function() {
		this.render();
		this.form = this.$('form');
		this.first_name = this.form.find('#edit_first_name');
		this.last_name = this.form.find('#edit_last_name');
		this.email = this.form.find('#edit_email');
	},

	events: {
		'submit form': 'submit',
		'click button.cancel': 'cancel'
	},

	submit: function(e) {
		e.preventDefault();
		// grab related model
		// update its attributes
		// sync
		this.model.save({
			firstName: this.first_name.val(),
			lastName: this.last_name.val(),
			email: this.email.val()
		});

		this.remove();
	},

	cancel: function() {
		this.remove();
	},

	render: function() {
		var html = this.template( this.model.toJSON() );
		this.$el.html(html);
		return this;
	}
});

// All contacts view
App.Views.Contacts = Backbone.View.extend({
	tagName: 'tbody',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.collection.each( this.addOne, this );
		return this;
	},

	addOne: function(contact) {
		var contactView = new App.Views.Contact({ model: contact });
		this.$el.append(contactView.render().el);
	}
});

// single contact view
App.Views.Contact = Backbone.View.extend({
	tagName: 'tr',

	template: template('allContactsTemplate'),

	initialize: function() {
		this.model.on('destroy', this.unrender, this);
		this.model.on('change', this.render, this);
	},

	events: {
		'click a.delete': 'deleteContact',
		'click a.edit': 'editContact'
	},

	deleteContact: function() {
		this.model.destroy();
	},

	editContact: function() {
		vent.trigger('contact:edit', this.model);
	},

	render: function() {
		this.$el.html( this.template( this.model.toJSON() ));
		return this;
	},

	unrender: function() {
		this.remove(); // this.$el.remove();
	}
});
