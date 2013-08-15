var express = require('express'),
	contacts = require('./controller/contact');
var app = express();

app.use(express.bodyParser());
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
	res.sendfile('static/index.html');
});

app.get('/contacts', contacts.getAllContacts);
app.get('/contacts/:id', contacts.getContact);
app.post('/contacts', contacts.addContact);
app.put('/contacts/:id', contacts.updateContact);
app.delete('/contacts/:id', contacts.deleteContact);

app.listen(8080);