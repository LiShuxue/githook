const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const route = require('./route');
const logger = require('./utils/logger');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

route(app);

app.listen(5555, () => {
  logger.info('Server running at http://127.0.0.1:5555/');
});
