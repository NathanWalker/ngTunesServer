var express = require('express') //web dev framework
  , request = require('request') //HTTP request client
  , oauth = require('./oauth.js') //OAuth-related functions
  , app = express();

app.set('port', (process.env.PORT || 5000));

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
				consumer_key: '	Uh9zeGyTlzRZQmuw1OVlFjYfv',
				consumer_secret: '7afZJTYaN3LanUeCshd8COdm7fYXFicZATrQw7OhBeF2dauo81',
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
    form.append("status", "Check this out!!");





	} else {
		console.log("Could not authenticate user. Redirecting to /");
		res.redirect('/');
	}
});

app.get('/login', oauth.login);
app.get('/callback', oauth.callback);

app.listen(app.get('port'), function() {
  console.log('ngTunesServer app is running on port', app.get('port'));
});
