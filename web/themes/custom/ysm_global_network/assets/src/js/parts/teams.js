(function ($) {
  var GN = self.GN;
  GN.teamPerformance = function () {
    $('.js-stock-box').each(function () {
      $(this).stockPlotter();
    });
    $('.js-team-holdings').each(function () {
      $(this).teamHoldings($(this).attr('data-url'));
    });
    $('body').on('click touch', '.js-team-list__team', function (e) {
      // Make full object clickable, but not anchor links
      if (!$(e.target).is('a')) {
        window.location = $(this).attr('data-url');
      }
    });
  }
})(jQuery);