var http = require("http");

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/nodejs';


var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    //console.log(docs)
    callback(docs);

  });
}


var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.deleteOne({ a : 1 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 1");
    callback(result);
  });
}

var indexCollection = function(db, callback) {
  db.collection('documents').createIndex(
    { "h": 2 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};


http.createServer(function (request, response) {

   // Send the HTTP header
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  /*removeDocument(db, function() {

  }); */


  	insertDocuments(db, function() {

  		indexCollection(db, function() {

    		findDocuments(db, function(docs) {
    			console.log("hello")
          console.log(docs)
          //var string = JSON.parse(docs)
          response.writeHead(200, {'Content-Type': 'text/plain'});


          docs.forEach(function(doc) {
            response.write(" " + doc.a )
          });

          response.end()

          // Send the response body as "Hello World"
          //response.end( " " + docs[1].a);

      			db.close();
    		});
  		});
  	});
});



   //response.writeHead(404, {'Content-Type': 'text/html'});

   // Send the response body as "Hello World"
   //response.end('<html><body><b>Hello World</b></body></html>');

}).listen(8081);
