'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  console.log('request', req.url);

  switch (req.method) {
    case 'GET':
      if (req.url.indexOf('/css') === 0 || req.url.indexOf('/js') === 0 || req.url.indexOf('/image') === 0) {
        serveFile(`./public${req.url}`, req, res);
      } else if (req.url.indexOf('/add') === 0 && req.url.substring(1).indexOf('/') === -1) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(generateAddComplimentPageHtml(), 'utf-8');
      } else {
        sendCompliment(req, res);
      }
      break;
    case 'POST':
      if (req.url === '/') {
        addCompliment(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('The requested file could not be found.', 'utf-8');
      }
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('The requested file could not be found.', 'utf-8');
      break;
  }
}).listen(8000, () => {
  console.log('Server now listening on port 8000.');
});

function serveFile(filePath, req, res) {
  fs.readFile(filePath, function(err, fileContent) {
    if (err) {
      if (err.code == 'ENOENT') {
        // error - no file
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('The requested file could not be found.', 'utf-8');
      } else {
        // error - other
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('The server encountered an unexpected error.', 'utf-8');
      }
    } else {
      // success
      const fileExtension = String(path.extname(filePath)).toLowerCase();
      switch (fileExtension) {
        case '.css':
          res.writeHead(200, { 'Content-Type': 'text/css' });
          break;
        case '.js':
          res.writeHead(200, { 'Content-Type': 'text/javascript' });
          break;
        case '.png':
          res.writeHead(200, { 'Content-Type': 'image/png' });
          break;
        case '.jpg':
          res.writeHead(200, { 'Content-Type': 'image/jpg' });
          break;
        case '.gif':
          res.writeHead(200, { 'Content-Type': 'image/gif' });
          break;
      }
      res.end(fileContent, 'utf-8');
    }

  });
}

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

function sendCompliment(req, res) {
  const pathAfterSlash = req.url.substring(1);
  let nameParam;
  if (pathAfterSlash.indexOf('/') !== -1) {
    // more than one piece of path, error out
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('The requested file could not be found.', 'utf-8');
    return;
  } else if (pathAfterSlash.length > 0) {
    nameParam = pathAfterSlash;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  let responseMessage;
  if (nameParam) {
    responseMessage = nameParam + ', ' + compliments[Math.floor(Math.random() * compliments.length)];
  } else {
    responseMessage = compliments[Math.floor(Math.random() * compliments.length)];
  }
  res.end(generateMainPageHtml(responseMessage, colorClasses[Math.floor(Math.random() * colorClasses.length)]), 'utf-8');
}

function generateMainPageHtml(message, colorClass) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Emergency Compliments</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" rel="stylesheet">
  <link href="/css/main.css" rel="stylesheet">
</head>
<body class="${colorClass}">
  <h1>${message}</h1>
</body>
</html>`;
}

function generateAddComplimentPageHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Emergency Compliments</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" rel="stylesheet">
  <link href="/css/main.css" rel="stylesheet">
</head>
<body>
  <h2>Add a New Compliment:</h2>
  <form action="/" method="POST">
    <label for="new-compliment-text">New compliment</label>
    <input name="new-compliment-text" id="new-compliment-text" type="text" />
    <input type="submit" value="submit" />
  </form>
</body>
</html>`;
}

function addCompliment(req, res) {
  let bodyData = '';
  req.on('data', function (dataChunk) {
    bodyData += dataChunk;
  });
  req.on('end', function () {
    console.log('Response body ready', bodyData);
    const urlEncDataVars = bodyData.split('&');
    let newCompliment;
    urlEncDataVars.forEach(urlEncVar => {
      const splitVar = urlEncVar.split('=');
      if (splitVar[0] === 'new-compliment-text') {
        newCompliment = splitVar[1];
      }
    });

    newCompliment = newCompliment.replace(/\+/g, ' ');

    compliments.push(newCompliment);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`Uploaded successfully: \"${newCompliment}\". <a href=\"/\">Return to homepage</a>.`, 'utf-8');
  });

}
