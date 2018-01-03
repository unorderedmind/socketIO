const express = require('express');
const bodyParser = require('body-Parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');


const container = require('./container');



container.resolve(function(users, _) {

  //path of database
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/footballkik', {useMongoClient: true});

  const app = SetupExpress();

  function SetupExpress(){
      const app = express();
      const server = http.createServer(app);
      server.listen(3000, function(){
          console.log('Listening on port 3000');
      });
      ConfigureExpress(app);

      //Setup router users.js
      const router = require('express-promise-router')();
      users.SetRouting(router);

      app.use(router);
    }



    function ConfigureExpress(app){
      require('./passport/passport-local');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        //database validation, session, Store
        app.use(validator());
        app.use(session({
            secret: 'addyourownsecretkey',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));

        app.use(flash());

        //passport initialize and session
        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
    }
});
