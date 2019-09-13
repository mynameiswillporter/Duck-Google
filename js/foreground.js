// Everytime a page loads in the browser
$(document).ready(function() {

    function displayDanger() {
      var overlay = $('<div />').appendTo('body');
      overlay.attr('class', 'duck_google_overlay');

      var message = $(
        `<div>
        <p>
          Duck Google! Google has a long history of <a href="https://en.wikipedia.org/wiki/Privacy_concerns_regarding_Google">privacy concerns</a>.
          Please consider using <a href="https://www.duckduckgo.com">DuckDuckGo</a> instead.
        </p>
        <p>
          <a href="https://www.duckduckgo.com">
            <button class="duck_google_button">Take Me There!</button>
          </a>
        </p>
        </div>`
      ).appendTo(overlay);
      message.attr('class', 'duck_google_message');

      var searchform = $('#searchform');
      var original_searchform_display = searchform.css('display');

      var banner = $('#gb');
      var original_banner_display = banner.css('display');

      searchform.css('display', 'none');
      banner.css('display', 'none');
    }

    chrome.storage.sync.get('state', function(data) {
        if (data.state === 'on') {
            chrome.runtime.sendMessage({
                greeting: "inspectPage"
            }, function(response) {
              if(response['danger']) {
                displayDanger();
              }
           });
        }
    });
});
