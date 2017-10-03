// Dependencies
const express = require('express');
const bodyParser = require('body-parser');

// App setup
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/', express.static('./public'));

// Compliment data

const compliments = [
  "Your instructors love you",
  "High five = ^5",
  "Chris thinks you\'re wicked smart!",
  "Britney Jo is sooo proud of you! :)",
  "Nicole would totally hire you.",
  "It\'s almost beer o\'clock!",
  "You\'re a full-stack unicorn! 🦄"
];

const colorClasses = [
  "bg-red",
  "bg-pink",
  "bg-purple",
  "bg-blue",
  "bg-light-blue",
  "bg-teal",
  "bg-green",
  "bg-orange"
];

// App routes
app.get('/', function(req, res) {
  const myCompliment = compliments[Math.floor(Math.random()*compliments.length)];
  res.render('main', {
    message: myCompliment,
    bodyClass: colorClasses[Math.floor(Math.random()*colorClasses.length)]
  });
});

app.get('/add', function(req, res) {
  res.render('add');
});

app.get('/:name', function(req, res) {
  const myCompliment = compliments[Math.floor(Math.random()*compliments.length)];
  res.render('main', {
    message: `${req.params.name}, ${myCompliment}`,
    bodyClass: colorClasses[Math.floor(Math.random()*colorClasses.length)]
  });
});

app.post('/add', (req, res) => {
  const newCompliment = req.body['new-compliment-text'];
  if (newCompliment && newCompliment.length > 0) {
    compliments.push(newCompliment);
    // send "SUCCESS" response
    res.send(`Successfully added compliment: "${newCompliment}"`);
  } else {
    // send "ERROR" message (invalid string, or not long enough)
    res.send('Invalid compliment. Make sure your compliment is long enough.');
  }
});

// App start
app.listen(3000, function() {
  console.log('Server running on port 3000');
});
