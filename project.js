var express = require('express');
var app = express();

var session = require('express-session');
var bodyParser = require('body-parser');
var uuid = require('uuid/v1');
var mongoose=require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var assert = require('assert');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/project');

// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.engine('pug', require('pug').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


app.use(session({
  genid: function(request) {
    return uuid();
  },
  resave: false,
  saveUninitialized: false,
  secret: 'apollo slackware prepositional expectations'
}));

var Schema = mongoose.Schema;
var userSchema=new Schema({
  username:{type:String,
            unique:true,
            index:true},
  email: String,
  firstname:String,
  lastname:String,
  hashedPassword:String
},{collection:'user'});
var User = mongoose.model('user',userSchema);

var restaurantSchema=new Schema({
  restaurantName:String,
  username:String,
  address:String,
  rating:String,
  comments:String,
  image:String
},{collection:'restaurantComment'});
var Comments = mongoose.model('restaurantComment',restaurantSchema);

app.get('/', function(request, response) {
  var session = request.session;
  var username = '';
  if (session.username) {
    username = session.username;
  }
  response.render('index', {title: '',
                            username: username});
});

app.get('/register', function(request, response) {
  var username=request.session.username;
  response.render('register',{username:username});
});

app.post('/processRegistration', function(request, response) {
  var username = request.body.username;
  var firstname=request.body.firstname;
  var lastname=request.body.lastname;
  var email = request.body.email;
  var password = request.body.pwd;
  var hashedPassword=bcrypt.hashSync(password);
  if(password.length<8){
    response.render('register',{errorMessage:'Password too short, It must be at least 8 characters'})
  }else if(username.length==0){
    response.render('register',{errorMessage:'Username can not be empty'})
  }else if(firstname.length==0){
    response.render('register',{errorMessage:'First Name can not be empty'})
  }else if(lastname.length==0){
    response.render('register',{errorMessage:'Last Name can not be empty'})
  }else{
    var newUser = new User({username:username,
                            firstname:firstname,
                            lastname:lastname,
                            email:email,
                            hashedPassword:hashedPassword});
    newUser.save(function(error){
      if(error){
        console.log('unable to register:'+error);
        response.render('register',{errorMessage:'Unable to register user, username already taken'});
      }else{
        request.session.username=username;
        response.render('registrationSuccess',{username:username,
                                               title:'Welcome aboard'});
      }
    });
  };
});

app.get('/login',function(request,response){
  response.render('login',{username:username});
});

app.post('/processLogin', function(request, response) {
  var username = request.body.username;
  var password = request.body.pwd;
  //key_words=request.body.page_back;
  var key_words=request.body.back_to_main;
  User.find({username: username}).then(function(results){
    if(results.length==0){
      response.render('login',{title:'Incorrect Account Information',
                               errormessage:'Login failed'})
    }else {
      if (bcrypt.compareSync(password, results[0].hashedPassword)) {
        request.session.username = username;
        response.render('loginSuccess',{username:username})
     }else{
       response.render('login',{title:'Incorrect Account Information',
                                errormessage:'Login failed'})
     }
   }
 });
});


app.get('/logout', function(request, response) {
  request.session.username = '';
  var username='';
  response.render('logoutSuccess',{username:username});
});

app.get('/restaurant',function(request,response){
  var username=request.session.username;
  response.render('restaurant',{username:username});
});

app.get('/Rlayout',function(request,response){
  response.render('Rlayout');
});

app.get('/Rlayout2',function(request,response){
  response.render('Rlayout2');
});

var user_name="";
var restaurantN="";
var Address="";
var rating="";
var customer_rating="";
var key_words="monster";
var image="";
/*
function reloadComment(response,request){
  username=request.session.username;
  restaurantN=request.body.restaurantN;
  Address=request.body.restaurantAdress;
  rating=request.body.restaurantRating;
  key_words=request.body.key_words;
  Comments.find({restaurantName:restaurantN}).then(function(results){
    if(results.length==0){
      response.render('Rlayout2',{restaurantName:restaurantN,
                                 address:Address,
                                 rating:rating,
                                 username:username,
                                 key_words:key_words});
    }else{
        response.render('Rlayout',{restaurantName:restaurantN,
                                   address:Address,
                                   rating:rating,
                                   username:username,
                                   users:results});
    };
   });
};*/

app.post('/restaurantComment',function(request,response){
   username=request.session.username;
   restaurantN=request.body.restaurantN;
   Address=request.body.restaurantAddress;
   rating=request.body.restaurantRating;
   key_words=request.body.key_words;
   image=request.body.restaurant_image;

   if(!username || (username==='')){
     response.writeHead(200,{'Content-type':'text/html'});
     response.write('<h1>Please Log in</h1>')
     response.write('<p>Thank You</p>')
     response.end('<a href="/'+key_words+'">back</a>')
   }else{
     Comments.find({restaurantName:restaurantN}).then(function(results){
       if(results.length==0){
         response.render('Rlayout2',{restaurantName:restaurantN,
                                    address:Address,
                                    rating:rating,
                                    username:username,
                                    key_words:key_words,
                                    image:image});
       }else{
           response.render('Rlayout',{restaurantName:restaurantN,
                                      address:Address,
                                      rating:rating,
                                      username:username,
                                      image:image,
                                      users:results});
       };
     })
  };
});

app.get('/commentsTest',function(request,response){
  response.render('commentsTest');
});

app.post('/customerComment',function(request,response){
  var comment=request.body.customer_comment;
  var customer_rating=request.body.customer_rating;
  var newcomment=new Comments({restaurantName:restaurantN,
                               username:username,
                               address:Address,
                               rating:customer_rating,
                               comments:comment,
                               image:image});


  newcomment.save(function(error){
    if(error){
      console.log(error);
    }else{
      response.render('back_to_comment');
  }
  });
});

app.get('/back_to_comment',function(request,response){
  response.render('back_to_comment');
});

app.post('/back_to_user_comment',function(request,response){
  Comments.find({restaurantName:restaurantN}).then(function(results){
    if(results.length==0){
      response.render('Rlayout2',{restaurantName:restaurantN,
                                 address:Address,
                                 rating:rating,
                                 username:username,
                                 key_words:key_words});
    }else{
        response.render('Rlayout',{restaurantName:restaurantN,
                                   address:Address,
                                   rating:rating,
                                   username:username,
                                   image:image,
                                   users:results});
    };
  });
});

app.get('/bar',function(request,response){
  var username=request.session.username;
  response.render('bar',{username:username});
});



app.get('/shopping_mall',function(request,response){
  var username=request.session.username;
  response.render('shopping_mall',{username:username});
});
app.get('/pet_store',function(request,response){
  var username=request.session.username;
  response.render('pet_store',{username:username});
});
app.get('/cafe',function(request,response){
  var username=request.session.username;
  response.render('cafe',{username:username});
});
app.listen(3002, function() {
  console.log('Listening on port 3002');
});
