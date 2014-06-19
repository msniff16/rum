/* RUM - Real Time User Monitoring JS
   Last Updated: 6-02-2014
   V 0.0.1
   Tracks real-time performance of pages. Includes support for tracking
   window.load (full page load), DOM load (document.ready), individual time
   tracking of scripts, JS console errors, and AJAX calls.
   Will return a rum object that times the events above.
*/

define([
  'jquery',
  'preso-common/js/utils/oocharts.js'
], function(oocharts) {

  //New rum object
  var rum = new RUM();

  //object constructor
  function RUM() {
    this.times = window.times;
  }

  //Iterate thru dictionary
  RUM.prototype.getTimes = function () {
    var analyticsUtil  = require('preso-common/js/utils/analytics/google-analytics');

      //Call to measure timing events from Episodes
      EPISODES.getTimes();
      this.episodes = window.aEpisodes;
      console.log(this.episodes);

      //loop thru properties inside the object
      for (var key in this.episodes) {
         var obj = this.episodes[key];
         /*for (var prop in obj) {
            // don't show the prototype of primitive object
            if(obj.hasOwnProperty(prop)){
              alert(key + ": " + prop + " = " + obj[prop]);
            }
         }*/

        //specific timing event
        key = key.replace(/\s+/g, '');

        //line marker event
        if(key == 'done' || key == 'starttime' || key == 'firstbyte') {
          $("#metrics").append('<div class="lineWrap"><div class="line" id=' + key + 'line></div> <p id=' + key + 'linep><p></div>');
          var duration = obj[1] - obj[0];
          this.times[key] = duration;
          var text = document.getElementById(key + 'linep');
          text.innerHTML = key + " time";
          if(key == 'done') {
            $('#' + key + "line").css( { marginLeft : ((this.episodes['total load time'][1] - this.episodes['total load time'][0])) / 5 } );
          }
        }

        //bar graph event
        else if(key !== 'pageloadtime' && key !== 'onload') {
          $("#metrics").append('<div id=' + key + 'wrap><div id='+ key + '></div><div id=' + key + 'bar class="bar"></div></div>');
          var duration = obj[1] - obj[0];
          this.times[key] = duration;
          var text = document.getElementById(key);
          text.innerHTML = key + ": " + duration + " ms";
          $('#' + key + "bar").width(duration / 5);
          if(key == 'frontend') {
            $('#' + key + "wrap").css( { marginLeft : ((this.episodes['backend'][1] - this.episodes['backend'][0])) / 5 } );
          }
        }

        analyticsUtil.trackPerformance('dom', key, duration);
        }


setTimeout(function(){

          //Display chart of past 5 days of data for each metric
          oo.setAPIKey("ba9115dc8dfc4b1f320f888a6d3fc7f37527ddd8");
          oo.load(function(){
              var bar = new oo.Column("84464658", "5d");

              bar.addMetric("ga:avgUserTimingValue", "Timings");

              bar.setDimension("ga:userTimingVariable");

              bar.draw('chartOO');
          });


},5000);

      return this.times;

  };

  return rum;

});
