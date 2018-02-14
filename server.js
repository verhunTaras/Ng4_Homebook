var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://tverhun:tverhun1@ds123146.mlab.com:23146/mongotest',
  { useMongoClient: true }
);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Connected!!!")
});
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  name: String
})
const User = mongoose.model('users', userSchema);

const billSchema = mongoose.Schema({
  value: Number,
  currency: String
})
const Bill = mongoose.model('bill', billSchema);

const categorySchema = mongoose.Schema({
  name: String,
  capacity: Number,
  id: Number
})
const Category = mongoose.model('categories', categorySchema);

const eventSchema = mongoose.Schema({
  type: String,
  amount: Number,
  category: Number,
  date: String,
  description: String,
  id: Number,
})
const Event = mongoose.model('events', eventSchema);

app.post('/users', function (req, resp) {
  new User(req.body).save().then(
    res=>resp.sendStatus(204),
    err=>resp.sendStatus(500)
  );
});

app.get('/users', function (req, resp) {
  User.find({email: req.query.email}).exec().then(
    res=>resp.json(res),
    err=>resp.sendStatus(500)
  );
});

app.get('/bill', function (req, resp) {
  Bill.find().exec().then(
    res => resp.json(res),
    err => resp.sendStatus(500)
  );
});

app.put('/bill', function (req, resp) {
  console.log(req.body);
  Bill.update({currency: req.body.currency},
              {$set:{currency: req.body.currency,
                     value: req.body.value}})
    .then(
      res => resp.sendStatus(204),
      err => resp.sendStatus(500)
    )
});

app.get('/categories', function (req, resp) {
  Category.find().exec().then(
    res=>resp.json(res),
    err=>resp.sendStatus(500)
  );
});

app.post('/categories', function (req, resp) {
  var cat = new Category(req.body);
  cat.save(function (err, category) {
    if(err) throw err;
    resp.send(category);
  })
});

app.get('/categories/:id', function (req, resp) {
  Category.find({id: req.params.id}).then(
    res=>resp.json(res),
    err=>resp.sendStatus(500)
  );
});

app.put('/categories/:id', function (req, resp) {
  Category.findOne({id: req.params.id}, function (err, category) {
    category.name = req.body.name;
    category.capacity = req.body.capacity;
    category.save(function (err, c) {
      resp.json(c);
    })
  })
})

app.get('/events', function (req, resp) {
  Event.find().then(
    res=>resp.json(res),
    err=>resp.sendStatus(500)
  );
});

app.post('/events', function (req, resp) {
  new Event(req.body).save(function (err, event) {
    if(err) throw err;
    resp.send(event);
  })
});

app.get('/events/:id', function (req, resp) {
  Event.find({id: req.params.id}).then(
    res=>resp.json(res),
    err=>resp.sendStatus(500)
  );
})



app.listen(3030, function(){
  console.log('Connected, Taras')
})
