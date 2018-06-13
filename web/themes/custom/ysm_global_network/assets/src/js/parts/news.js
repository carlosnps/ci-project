(function ($) {
  var GN = self.GN;
  GN.openNews = function () {
    var newsOpenTimeout = setTimeout(function () {}, 0);
    $('.js--expanding-teaser .js--expanding-teaser--content').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend mouseover', function () {
      var _self = $(this);
      if (_self.height() > 0) {
        _self.parent().addClass('open');
      };
      GN.closeNewsOutside();
    });
    $('.js--expanding-teaser h2 a').on('focus', function () {
      $(this).parent().parent().addClass('open');
    });
  }
  GN.closeNewsOutside = function () {
    if (typeof newsCloseTimeout !== "undefined") clearTimeout(newsCloseTimeout); // clearTimeout if it exists
    var newsCloseTimeout = setTimeout(function () {}, 0);
    $('.js--expanding-teaser--container').on('mouseoveroutside', function () {
      var _self = $(this);
      newsCloseTimeout = setTimeout(function () {
        _self.find('.js--expanding-teaser').removeClass('open');
      }, 2000);
      _self.unbind('mouseoveroutside');
    }).on('mouseover', function () {
      clearTimeout(newsCloseTimeout);
    });
  }
})(jQuery);