const express = require('express');
const app = express();
const path = require('path'); 
const hbs = require('hbs'); 
const route = require('./route');  

app.use(express.static(path.join(__dirname, 'public')));  

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'html');
app.engine('html', hbs.__express);

route(app); 

app.listen(5555, ()=> {
  console.log('Server running at http://127.0.0.1:5555/');
});
