$.fn.FeedReader = function(params) {

  var ul_set = this;
  
  var data =  {
    feedUrl: 'feedUrl',
    item_count: 'item_count',
    entryBuilder: function() {
      //entry_builder
    }
  };

  $.extend(data, params);

  
  
  function initializeFeed() {
    var feed = new google.feeds.Feed(data.feedUrl);
    feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
    if (data._item_count) {
      feed.setNumEntries(data.item_count);
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
        if (data.entryBuilder) {
          var list = data.entryBuilder(entries);
        } else {
          var list = getItems(entries);
        }
        $(ul_set).append(list);             
      }
    });
  }
  
  /**
   * Pull the content from the feed
   * items and add it to the ul
   */
  function getItems(entries) {
    var list = "";
    $.each(entries, function(i, entry) {
      var date = new Date(entry['pubDate']);
      date = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();

      list_item = "";    
      list_item += "<div class='thumb'><img src='/templates/__custom/img/thumb-author.jpg' alt=''></div><div class='col'>";   
      list_item += "<div class='author'><a href='" + entry['link'] + "'>";
      list_item += entry['author'] + "</a></div>";
      list_item += "<div class='content'>" + $("<div>" + entry['description'] + "</div>").text().substr(0,130) + "...</div>";
      list_item += "<div class='time'>" + date + "</div></div>";
      list += "<li class='clearfix'>" + list_item + "</li>";
    });
    return list;
  }

   /**
   * Load the  Feed API
   * and load the feed
   */
  $.getScript("https://www.google.com/jsapi", function() {
    google.load("feeds", "1", {"callback": initializeFeed});      
  }); 

    /**
   * Pull the first image from an feed item's content 
   * and return it as an HTML <img /> element
   */
  function getImageFromContent(content) {
    var img = content.match(/<img[^>+]*>/i);
    if(img) {
      var source = img[0].match(/src="[^"+]*"/i),
      alt = img[0].match(/alt="[^"+]*"/i);
      return "<img " + source + " " + alt + " />";
    }
    return "";
  }

  /**
   * Format a date according to a supplied
   * format string using PHP date format
   * http://php.net/manual/en/function.date.php
   */
  function getFormattedDate(date, format) {
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    date = new Date(Date.parse(date)),
    formatted_date = "";
    
    for (var i = 0; i < format.length; i += 1) {
      switch(format.charAt(i)) {
        case 'd':
          // Day of the month, 2 digits with leading zeros
          formatted_date += prependZeros(date.getDate());
          break;
        case 'D':
          // A textual representatino of a day, three letters
          formatted_date += days[date.getDay()].substring(0,3);
          break;
        case 'j':
          // Day of the month without leading zeros
          formatted_date += date.getDate();          
          break;
        case 'l':
          // A full textual representation of the day of the week
          formatted_date += days[date.getDay()];
          break;
        case 'N':
          // Numeric representation of the day of the week (1 - 7)
          formatted_date += date.getDay() + 1;
          break;
        case 'S':
          // English ordian suffix for the day of the month, 2 characters (st, nd, rd)
          formatted_date += getDateSuffix(date.getDate());
          break;
        case 'w':
          // Numeric representation of the day of the week (0 - 6)
          formatted_date += date.getDay();
          break;
        case 'z':
          // The day of the year (starting from 0)
          // not implemented
          break;
        case 'W':
          // Week number of year, weeks starting on Monday
          // not implemented
          break;
        case 'F':
          // A full textural representation of a month, such as 'January' or 'March'
          formatted_date += months[date.getMonth()];
          break;
        case 'm':
          // Numeric representation of a month, with leading zeroes (01 - 12)
          formatted_date += prependZeros(date.getMonth());
          break;
        case 'M':
          // A short textural representation of a month, three letters ('Jan' - 'Dec')
          formatted_date += months[date.getMonth()].substring(0,3);
          break;
        case 'n':
          // Numeric representation of a month, without leading zeros (1 - 12)
          formatted_date += date.getMonth() + 1;
          break;
        case 't':
          // Number of days in the given month
          // Not implemented
          break;
        case 'L':
          // Whether it's a leap year
          // Not implemented
          break;
        case 'o':
        case 'Y':
          // A full numeric representation of a year, 4 digits
          formatted_date += date.getFullYear();
          break;
        case 'y':
          // A two-digit representation of a year
          formatted_date += date.getFullYear().toString().substring(-2);
          break;
        case 'a':
          // Lowercase Ante meridiem and Post meridiem
          formatted_date += (date.getHours() < 12) ? "am" : "pm";
          break;
        case 'A':
          // Uppercase Ante meridiem and Post meridiem
          formatted_date += (date.getHours() < 12) ? "AM" : "PM";
          break;
        case 'B':
          // Swatch internet time
          // not implemented
          break;
        case 'g':
          // 12-hour format of an hour without leading zeros (1 - 12)
          formatted_date += (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
          break;
        case 'G':
          // 24-hour format of an hour without leading zeros (1 - 24)
          formatted_date += date.getHours();
          break;
        case 'h':
          // 12-hour format of an hour with leading zeros (01 - 12)
          formatted_date += prependZeros((date.getHours() > 12) ? date.getHours() - 12 : date.getHours());
          break;
        case 'H':
          // 24-hour format of an hour with leading zeros (01 - 24)
          formatted_date += prependZeros(date.getHours());
          break;
        case 'i':
          // Minutes, with leading zeros (00 - 59)
          formatted_date += prependZeros(date.getSeconds());
          break;
        case 's':
          // Seconds, with leading zeros (00 - 59)
          formatted_date += prependZeros(date.getDate());
          break;
        case 'u':
          // Microseconds (654321)
          formatted_date += date.getMilliseconds();
          break;
        case 'e':
          // Timezone identifier ('UTC', 'GMT')
          // not implemented
          break;
        case 'O':
        case 'P':
          // Difference to Greenwich time (GMT) in hours (+0200)
          formatted_date += date.getTimezoneOffset();
          break;
        case 'T':
          // Timezone abbreviation ('EST', 'MDT')
          // not implemented
          break;
        case 'Z':
          // Timezone offset in seconds
          // not implemented
          break;
        case 'c':
          // Full UTC date
          formatted_date += date.toUTCString();
          break;
        case 'r':
          // Full date string
          formatted_date += date.toDateString();
          break;
        case 'U':
          // Seconds since the epoch
          formatted_date += date.valueOf();
          break;
        default:
          // Non-meaningful character, just append it
          formatted_date += format.charAt(i);
          break;
      }
    }
    
    return formatted_date;
  }
  
  /**
   * Determine the correct suffix
   * for a date of the month
   */
  function getDateSuffix(date) {
    var day = parseInt(date.toString().substring(date.toString().length-1));
    switch (day) {
      case 1:
        return "st";
        break;
      case 2:
        return "nd";
        break;
      case 3:
        return "rd";
        break;
      default:
        return "th";
        break;
    }
  }
   
  
  /**
   * Add a leading zero to single-digit numbers
   */
  function prependZeros(input) {
    var str = input.toString();
    if(str.length < 2) {
      str = "0" + str;
    }
    return str;
  }
 
}