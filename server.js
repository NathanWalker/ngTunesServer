var express = require('express') //web dev framework
  , request = require('request') //HTTP request client
  , oauth = require('./oauth.js') //OAuth-related functions
  , app = express();

app.set('port', (process.env.PORT || 5000));

var consumer_key = 'Uh9zeGyTlzRZQmuw1OVlFjYfv';
var consumer_secret = '7afZJTYaN3LanUeCshd8COdm7fYXFicZATrQw7OhBeF2dauo81';
var callBackUrl = 'http://10.0.0.1:4200/callback';
var cookieParser = require('cookie-parser')
var session = require('express-session');
// Setup middleware
app.use(cookieParser('tweet much?'));
app.use(session());
app.use(express.static(__dirname));


app.get('/tweetpic', function(req, res) {

  if (req.session.oauth !== undefined && req.session.oauth.screen_name !== undefined) {
	
  /**
   * Below is code to illustrate how to send a status update to Twitter
   **/

    var url = 'https://api.twitter.com/1.1/statuses/update.json';
    
    var oauth_params = {
				consumer_key: consumer_key,
				consumer_secret: consumer_secret,
        token: req.session.oauth.access_token,
				token_secret: req.session.oauth.access_token_secret
			};

		var r = request.post({url:url, oauth:oauth_params}, function(error, response, body) {
      
			if (error) {
				console.log("Error occured: "+ error);
				res.end();
			} else {
				res.end("Tweet sent successfully! Check out your Twitter page");
			}
		});
    
    /**
     * Edit line below to change the status message
     **/
    var form = r.form();
    form.append("status", req.tweet);





	} else {
		console.log("Could not authenticate user. Redirecting to /");
		res.redirect('/');
	}
});

app.post('/upload', function (req, res) {
	// console.log('REQUEST KEYS: =====');
	// console.log(req);
	// for (var key in req.session) {
	// 	console.log(key);
	// }
  // if (req.session.oauth !== undefined && req.session.oauth.screen_name !== undefined) {
	
  /**
   * Below is code to illustrate how to send a status update to Twitter
   **/

    var url = 'https://upload.twitter.com/1.1/media/upload.json';
    
    // var oauth_params = {
		// 		consumer_key: consumer_key,
		// 		consumer_secret: consumer_secret,
    //     token: req.session.oauth.access_token,
		// 		token_secret: req.session.oauth.access_token_secret
		// 	};dd
	for (var key in req) {
		console.log(key);
		}
	console.log('REQ.session =====');
		for (var key in req.session) {
			console.log('req.session ----');
		console.log(key);
	}

		oauth.upload(url, req.body.access_token, req.body.access_token_secret, { media_data: req.body.media_data}, function (err, body, response) {
        console.log('URL [%s]', url);
        if (!err && response.statusCode == 200) {
					// success(body);
					console.log("SUCCESS UPLOAD");
					res.end(body);
        } else {
					res.end();
            // error(err, response, body);
        }
    });		
		// var r = request.post({url:url, oauth:oauth_params}, function(error, response, body) {
      
		// 	if (error) {
		// 		console.log("Error occured: "+ error);
		// 		res.end();
		// 	} else {
		// 		res.end("Tweet sent successfully! Check out your Twitter page");
		// 	}
		// });
    
    /**
     * Edit line below to change the status message
     **/
    // var form = r.form();
		// form.append("status", req.tweet);
    // form.append("status", req.tweet);





	// } else {
	// 	console.log("Could not authenticate user. Redirecting to /");
	// 	res.redirect('/');
	// }
});

app.get('/login', oauth.login);
app.get('/callback', oauth.callback);

app.listen(app.get('port'), function() {
  console.log('ngTunesServer app is running on port', app.get('port'));
});
