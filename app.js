const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const routes = require('./src/routes/routes.js');

app.use(bodyParser.json());
app.use(function(err, req, res, callback) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
         res.status(403).send({
             error: true,
             message: "Wrong Body of json",
             response: null
         })
          res.end()
    }
});
app.use(express.json());

app.use('/', routes);

app.get('/', (req, res) => {
    res.send('Poke-Wiki-To-Notion 1.0.0 ' + new Date().toString());
});

app.listen(port, () => {
    console.log('Poke-Wiki-To-Notion listening on port ' + port)
});