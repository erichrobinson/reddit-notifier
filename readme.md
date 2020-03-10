# Requirements
- MongoDB
- nodemon
- SendGrid API key

# Getting Started
- `npm install`
- `npm start`
- create .env file with `SENDGRID_API_KEY=SGKEY`

# Endpoints
**POST** `/users/:user`
For creating new users
Request Body:
<pre><code>
	{
		"email": "yourEmail",
		"name": "yourName"
	}
</code></pre>

**PUT** `/users/:user`
For updating user active status. If user is inactive, they won't receive emails.
Request Body:
<pre><code>
	{
		"active": "booleanVal"
	}
</code></pre>

**POST** `/users/:user/channels`
For creating new subreddits associated with a user
Just the base subreddit name not preceded with 'r/'
ex. "nature" NOT "r/nature"
Request Body:
<pre><code>
	{
		"channels": ["some", "list", "of", "channels"]
	}
</code></pre>

**GET** `/users/:user/channels`
For getting all subreddits associated with a user

**PUT** `/users/:user/channels/:channel`
For updating the active status of a channel. Inactive channels will not be included in the daily digest.
Request Body:
<pre><code>
	{
		"active": "booleanVal"
	}
</code></pre>
