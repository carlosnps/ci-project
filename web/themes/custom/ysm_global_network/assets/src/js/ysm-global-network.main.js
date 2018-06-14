// This is a required alias to the main stlyes file inside the "src" folder.
// DO NOT REMOVE OR MODIFIY THIS!
require('src:styles');

// The is a required alias to all the static images inside the "src" folder.
// These images are in stylesheets and/or a <img> tags.
// The second argument decides if sub directories should also be searched.
// DO NOT REMOVE OR MODIFIY THIS!
require.context('src:images', true, /\.(gif|png|jpe?g|svg)$/);

require('jquery.nicescroll/dist/jquery.nicescroll.js');
require('bxslider/dist/jquery.bxslider.min.js');
require('jquery-outside-events/jquery.ba-outside-events.js'); // forked from cowboy/jquery-outside-events
require('fitvids/jquery.fitvids.js');

/* Global Network, master scripts file.
 * Author: Square360
 * square360.com
 *
 */
// Create custom function array
self.GN = function () {};
// !----- Import Parts Files -----
require('parts/navigation.js');
require('parts/video.js');
require('parts/news.js');
require('parts/search.js');
require('parts/teams.js');
require('parts/hero_slideshow.js');
require('parts/school_slideshow.js');
require('parts/slideshow.js');
require('parts/myemma_form.js');

(function ($) {
  "use strict";
  $(document).ready(function () {
    if ($('article').hasClass('course-type__global-network-week-course')) {
      console.log('i have this');
      $('ul.level-1 li.network-weeks').addClass('nav__item--active-trail');
      $('ul.level-1 li.network-weeks').addClass('nav__item--expanded');
      $('ul.level-1 li.network-courses').removeClass('nav__item--active-trail');
      $('ul.level-1 li.network-courses').removeClass('nav__item--expanded');
    }

    GN.floatingPlaceholders();
    GN.openNews();
    GN.bodyTop();
    GN.topMenu();
    GN.toggleSubnav();
    GN.fitVids();
    GN.searchToggle();
    GN.teamPerformance();
    GN.slideshow('.slider');
    GN.schoolSlideshow('.school-slider');
    return GN.heroSlideshow('.hero-slider');
  });
  $(window).bind('scroll', function () {
    return GN.bodyTop();
  });
})(jQuery);