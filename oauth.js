var oauth = require('oauth').OAuth;
//http://localhost:4200/callback
var callbackURL = "https://vast-hollows-93220.herokuapp.com/callback"
  , CONSUMER_KEY = "Uh9zeGyTlzRZQmuw1OVlFjYfv"
  , CONSUMER_SECRET = "7afZJTYaN3LanUeCshd8COdm7fYXFicZATrQw7OhBeF2dauo81";

var clientApp = 'http://127.0.0.1:4200/login';
  
var oa = new oauth(
  "https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	CONSUMER_KEY,
	CONSUMER_SECRET,
	"1.0",
	callbackURL,
	"HMAC-SHA1"
);

function login(req, res) {
  console.log("login called..");
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			res.send("Error returned: "+error);

		} else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			req.session.oauth.token_secret = oauth_token_secret;
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token);
		}
	});
}

function callback(req, res) {
	if (req.session.oauth !== undefined) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier, function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error) {
				console.log("Error: Twitter login failed: ", error);
				res.end("Error occured with callback: "+ error);
			} else {
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth.access_token_secret = oauth_access_token_secret;
				req.session.oauth.screen_name = results.screen_name;

				res.redirect(clientApp + '?access_token=' + oauth_access_token + '&access_token_secret=' + oauth_access_token_secret + '&screen_name=' + results.screen_name);
				// console.log("Logged in to Twitter");
				// console.log(results);
        
				// var output = '<html><head></head><body onload="window.close();">Close this window</body></html>';
				// res.writeHead(200, {'Content-Type': 'text/html'});
        // res.end(output);
			}
		});
	} else {
		res.redirect('/');
	}
}

function upload(url, accessToken, accessTokenSecret, post_body, callback) {
	url = url.replace(/\!/g, "%21")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
  console.log("upload called..");
	oa.post(url, accessToken, accessTokenSecret, post_body, "application/x-www-form-urlencoded", callback);
}

exports.login = login;
exports.upload = upload;
exports.callback = callback;
