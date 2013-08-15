var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect:true});
db = new Db('contact', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to database");
        db.collection('contact', {strict:true}, function(err, collection) {
            if (err) {
                console.log("Collection doesn't exist");
            }
        });
    }
});


exports.getAllContacts = function(req, res) {
    db.collection('contact', function(err, collection) {
        if (err) {
            return console.dir(err);
        }
        else {
            collection.find().toArray(function(err, items) {
            if (err) {
                return console.dir(err);
            }
            else {
                res.send(items);
            }
            });
        }
    });
};

exports.getContact = function(req, res) {
    var id = req.params.id;
    db.collection('contact', function(err, collection) {
        if (err) {
            return console.dir(err);
        }
        else {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            if (err) {
                return console.dir(err);
            }
            else {
                res.send(item);
            }
            });
        }
    });
};

exports.addContact = function(req, res) {
    var contact = req.body;
    db.collection('contact', function(err, collection) {
        collection.insert(contact, {safe:true}, function(err, result) {
            if(err) {
                res.send({'error':'an error has occurred. unable to add contact'});
            }
            else {
                console.log('contact added successfully');
                res.send(result[0]);
            }
        });
    });
};

exports.updateContact = function(req, res) {
    var id = req.params.id;
    var contact = req.body; // hash of attr to be changed.
    db.collection('contact', function(err, collection) {
        delete contact['_id']
        collection.update({'_id':new BSON.ObjectID(id)}, {$set: contact}, {safe:true}, function(err, result) {
            if (err) {
                console.log('error updating contact: ' + err);
                res.send({'error':'an error has occured. unable to update.'});
            }
            else {
                console.log('' + result + ' document(s) updated');
                res.send(contact);
            }
        });
    });
};

exports.deleteContact = function(req, res) {
    var id = req.params.id;
    db.collection('contact', function(err, collection) {
        console.log(new BSON.ObjectID(id));
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'error occurred - ' + err});
            }
            else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};












