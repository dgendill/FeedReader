/* feedReader.js - https://github.com/dgendill/FeedReader */
(function($) {

  $.fn.FeedReader = function(params) {
  
    var targetElement = this;
    $(targetElement).addClass('loading');
    
    var config =  {
      feedUrl: 'feedUrl',
      itemCount: 'itemCount',
      entryBuilder: function(entries) {
        // entry builder function.  Entries is an array of entries
        // taken from the RSS feed.  You can loop through the entries
        // and access specific elements of the entry - for example pubDate
        // and description
      }
    };
  
    $.extend(config, params);
  
    // ------------------
    // PLUGIN ENTRY POINT 
    // ------------------
    function init() {
      var feed = new google.feeds.Feed(config.feedUrl);
      feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
      if (config.itemCount) {
        feed.setNumEntries(config.itemCount);
      } else {
        feed.setNumEntries(5);
      }
      
      feed.load(function(result) {
        //console.log(result);
        //var startingNode = result.xmlDocument.childNodes;
        if (!result.xmlDocument) {
          //console.log(result);
        	throw 'Cannot load feed. Check to make sure the XML RSS feed URL is correct.';
        	return;
        }
        var startingNode = result.xmlDocument.documentElement.childNodes;
        var items = startingNode[0].getElementsByTagName('item');
        //console.log(items);
  
        var entries = [];
        for(var a = 0; a < items.length; a++) {
           entries[a] = {};
           var childNodes = items[a].childNodes;
           for(var b = 0; b < childNodes.length; b++) {
              var val = childNodes[b].childNodes[0];
              //console.log(val);
              if (val) {
                entries[a][childNodes[b].nodeName] = val.data;
              }        
             //console.log(childNodes[b].childNodes[0]);
           }
        }
  
        //console.log(entries);
        
        if(!result.error){
          var list = getFormattedFeed(entries);
          $(targetElement).removeClass('loading');
          $(targetElement).append(list);             
        }
      });
    };
  
    function getFormattedFeed(entries) {
      if (!config.entryBuilder) {
        throw "'entryBuilder' parameter not provided when in the plugin was initalized.";
      }
  
      if (config.entryBuilder === "twitter") {
        return twitterBuilder(entries);
      } else if (config.entryBuilder === "facebook") {
        return facebookBuilder(entries);
      } else if (typeof config.entryBuilder === "function") {
        return config.entryBuilder(entries);
      } else {
        throw "'entryBuilder' parameter was provided but is incorrect.";
      }
    };
    
   
     // -------------------------------
     // Load Feed API and load the feed
     // -------------------------------
    $.getScript("https://www.google.com/jsapi", function() {
      google.load("feeds", "1", {"callback": init});      
    });
  
    function twitterBuilder(entries) {
      // function for building the entries for a twitter feed.
      //console.log(entries);
      //
      var userName = config.feedUrl.match(/[a-zA-Z0-9_-]+(?=.rss)/gi);
      if (userName) {
        userName = userName[0];
      } else {
        throw "Could not parse twitter username in native twitterBuilder function.";
      }
      var list = "";
      $.each(entries, function(i, entry) {
        var date = new Date(entry['pubDate']);
        date = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
  
        var user = "<a href='"+ entry['link'] +"'>@" + userName + "</a>";
        var url_match = entry['description'].match(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi);
        var description = entry['description'].replace(/natural_current: /i, user);
        if (url_match) {
          description = description.replace(url_match[0], "<a href='" + url_match[0] + "'>" + url_match[0] + "</a>");
        }
  
        // http://api.twitter.com/1/users/profile_image/#{screen_name}?size={normal|mini|bigger}
        var thumbnailURL = "http://api.twitter.com/1/users/profile_image/" + userName + "?size=mini";
  
        list_item = "";    
        list_item += "<div class='thumb'><img src='" +  thumbnailURL +"' alt=''></div><div class='inner'>";
        list_item += "<div class='content'>" + description + "</div></div>";
        list += "<div>" + list_item + "</div>";
      });
      return list;
    };
  
    function facebookBuilder(entries) {
      // function for building the entries for a facebook feed
      var list = "";
      var userID = config.feedUrl.match(/[0-9]+$/gi);
      if (userID) {
        userID = userID[0];
      } else {
        throw "Could not parse facebook username in native facebookBuilder function.";
      }
  
      var thumbnailURL = "http://graph.facebook.com/" + userID + "/picture?type=square";
  
      $.each(entries, function(i, entry) {
        var date = new Date(entry['pubDate']);
        date = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
  
        list_item = "";    
        list_item += "<div class='thumb'><img src='" + thumbnailURL + "' alt=''></div><div class='col'>";   
        list_item += "<div class='author'><a href='" + entry['link'] + "'>";
        list_item += entry['author'] + "</a></div>";
        list_item += "<div class='content'>" + $("<div>" + entry['description'] + "</div>").text().substr(0,130) + "...</div>";
        list_item += "<div class='time'>" + date + "</div></div>";
        list += "<li class='clearfix'>" + list_item + "</li>";
      });
      return list;
    };
  
  }; // end jQuery Plugin

}(jQuery));
