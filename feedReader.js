$.fn.FeedReader = function(params) {

  var targetElement = this;
  
  var config =  {
    feedUrl: 'feedUrl',
    item_count: 'item_count',
    entryBuilder: function(entries) {
      // entry builder function.  Entries is an array of entries
      // taken from the RSS feed.  You can loop through the entries
      // and access specific elements of the entry - for example pubDate
      // and description
    }
  };

  $.extend(config, params);

  
  function init() {
    var feed = new google.feeds.Feed(config.feedUrl);
    feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
    if (config._item_count) {
      feed.setNumEntries(config.item_count);
    } else {
      feed.setNumEntries(5);
    }
    
    feed.load(function(result) {
      //console.log(result);
      //var startingNode = result.xmlDocument.childNodes;
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
        if (config.entryBuilder) {
          var list = config.entryBuilder(entries);
        } else {
          // entry builder not defined, use some default?
        }
        $(targetElement).append(list);             
      }
    });
  }
  
 
   // -------------------------------
   // Load Feed API and load the feed
   // -------------------------------
  $.getScript("https://www.google.com/jsapi", function() {
    google.load("feeds", "1", {"callback": init});      
  });  
}