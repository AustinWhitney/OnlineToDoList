// Import packages
//const taskController = require("./controllers/TaskController");
const express = require("express");

const socketIO = require("socket.io");
const path = require("path");
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var dateFormat = require('dateformat')
// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');



var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// db instance connection

const dbURI =
  'mongodb://Aust9n:guillo3life@ds257564.mlab.com:57564/mydb';

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10,
  useNewUrlParser:true,
  keepAlive:1,
  
            
};

MongoClient.connect(dbURI, (err, client) => {
  if (err) return console.log(err)
  dbo = client.db('mydb') // whatever your database name is
  app.listen(PORT, () => {
    console.log('listening on 3000')
  })
})






app.post("/addname", function(req, res) {
  console.log(req.body.Action);
  var myobj = {
    Action: req.body.Action,
    DueDate: req.body.DueDate
  };

  dbo.collection('dbcollection').save(myobj, function(err, result) {
    if (err) return console.log(err);

    console.log('saved to database');
    res.redirect('/');
  });
});



app.post("/deleteEntry", function(req, res) {
  console.log(req.body.Action);
  var myobj = {
    Action: req.body.Action,
    DueDate: req.body.DueDate
  };

  dbo.collection('dbcollection').deleteOne(myobj, function(err, result) {
    if (err) return console.log(err);

    console.log('deleted Entry');
    res.redirect('/');
  });
});


function deleteEntry(delaction,deldate){
  var myobj = {Action: delaction, DueDate: deldate};
  dbo.collection('dbcollection').deleteOne(myobj, function(err, result) {
    if (err) return console.log(err);

    console.log('deleted entry');
    res.redirect('/');
  });
}

app.get("/", (req, res) => {
  

       console.log("called");
  var mysort = {DueDate: 1};
    dbo.collection('dbcollection').find().sort(mysort).toArray(function(err,result){
      let resulta = '<table = border="1">';
      resulta += "<tr><th>" + "Action" + "</th><th>"+ "Due Date" + "</th></tr>"
       for(var i =0 ; i<result.length;i++){
        
        resulta += "<tr><td>" + result[i].Action + "</td><td>" + dateFormat(result[i].DueDate, "dddd, mmmm dS, yyyy, h:MM:ss TT") + "</td><td>" + "<form method=\"post\" action=\"/deleteEntry\"> <input type=\"hidden\" name=\"Action\" id=\"Action\" value=\""+result[i].Action+"\" >  <input type=\"hidden\" name=\"DueDate\" id=\"DueDate\" value =\""+result[i].DueDate+"\">  <input type=\"submit\" value=\"Delete\" > </form>" + "</td></tr>"
      }
      resulta += '</table>'
      resulta += '<form method="post" action="/addname"  >    <input type="text" name="Action" id="Action" placeholder="Type in the Action here.." required>    <input type="datetime-local" name="DueDate" id="DueDate"  required>    <input type="submit" value="Add Action">  <!-- Client Code -->    </form>'
      res.send(resulta);
    })
   
});


// Start server
// const server = express()
//   .use((req, res) => res.sendFile(INDEX) )
//  .listen(PORT, () => console.log("Listening on localhost:" + PORT));

// Initiatlize SocketIO
// const io = socketIO(server);

// Register "connection" events to the WebSocket
// io.on("connection", function(socket) {
//   // Register "join" events, requested by a connected client
//   socket.on("join", function (room) {
//     // join channel provided by client
//     socket.join(room)
//     // Register "image" events, sent by the client
//     socket.on("image", function(msg) {
//       // Broadcast the "image" event to all other clients in the room
//       socket.broadcast.to(room).emit("image", msg);
//     });
//   })
// });












//MI3lYKW51cegs8yb