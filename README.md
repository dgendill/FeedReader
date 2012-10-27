FeedReader
==========

Flexible RSS Feed Reader with built in Twitter and Facebook support.

Usage
=====

* Include jQuery

* Call FeedReader on a ul element.

```javascript
    var twitterFeed = "https://twitter.com/statuses/user_timeline/aplusk.rss";
    var facebookFeed = "http://www.facebook.com/feeds/page.php?format=rss20&id=56759922819";
    
	$("#TwitterRSSFeed").FeedReader({
		feedUrl: twitterFeed,
		itemCount: 5,
		entryBuilder: 'twitter'
	});

	$("#FacebookRSSFeed").FeedReader({
		feedUrl: facebookFeed,
		itemCount: 5,
		entryBuilder: 'facebook'
	});
    
	$("#CustomRSSFeed").FeedReader({
		feedUrl: facebookFeed,
		itemCount: 5,
		entryBuilder: function(entries) {
			// entries is an array of entries from the
			// rss feed. loop over them and pull whatever
			// content you need. return a string of HTML
			// which will be inserted into the ul element.
		}
	});
```    
* Include the markup.

```HTML
	<ul id="TwitterRSSFeed"></ul>
	<ul id="FacebookRSSFeed"></ul>
	<ul id="CustomRSSFeed"></ul>
```