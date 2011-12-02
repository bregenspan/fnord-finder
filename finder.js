$.noConflict();

(function($) {

    /* fnords are usually hidden in every second
     * paragraph containing "by".
     *
     * they occur 7 words prior to the last
     * "the" in said paragraphs 
     */
    var paragraphs = $('.mod-articletext p:contains("by "), .articleBody p:contains("by ")');
    for (var i = 1, len = paragraphs.length; i < len; i += 2) {

        /*  To avoid breaking HTML or using complicated
         *  regexes that *attempt* to avoid doing so, we
         *  replace in two steps:
         *  1. identify unique string of text in HTML-stripped
         *      paragraph contents
         *  2. attempt to replace that string in the actual,
                non-HTML-stripped paragraph
         */
        var tokens = $(paragraphs[i]).text().split(' ');

        var textToPrependFnord = false;

        // count backwards from last "the"
        for (var jlen = tokens.length, j = jlen; j >= 0; j--) {
           if (tokens[j] === 'the') {
               if (tokens[j - 7]) {
                  // get reasonably long enough string to match against
                  // without likelihood of encountering duplicates
                  var slice = tokens.slice(j - 7, j - 3);
                  textToPrependFnord = slice.join(' ');
                  break;
               }
           }
        }

        // add the discovered fnord

        if (textToPrependFnord) {
            var html = $(paragraphs[i]).html().replace(
                textToPrependFnord, '<span class="fnord">fnord</span> '
                + textToPrependFnord); 
            $(paragraphs[i]).html(html);
        }
    }

    var fnords = $('.fnord');
    if (fnords.length) {

        // Tell extension to show page action icon
        chrome.extension.sendRequest({ fnordsFound: true });

        // Handle click of page action icon by switching fnord
        chrome.extension.onRequest.addListener(function(request, sender) {
            if (typeof request === 'object' && request.switchFnord) {

                // show first fnord if none selected yet, otherwise next fnord
                var selected = fnords.filter('.selected').first();
                if (selected.length) {
                    selected.removeClass('selected');
                    selected = fnords.eq(selected.index('.fnord') + 1).addClass('selected');
                }
                // this is a first run or we've looped back to first el
                if (!selected.length) {
                    selected = fnords.first().addClass('selected');
                }
                // scroll to and highlight the fnord
                $('html, body').stop().animate({
                    scrollTop: $(selected).offset().top - 20
                }, 1000, function() {
                    fnords.filter('.selected').stop().css('backgroundColor', '#ffff9c')
                        .animate({ backgroundColor: "#fff" }, 2000);
                });
            } 
        });
    }

})(jQuery);
