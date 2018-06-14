(function ($) {
  var GN = self.GN;
  GN.searchToggle = function () {
    var search_block = $('#block-exposedformsearch-api-pagesearch-block');
    search_block.prepend('<div id="js--search__toggle" class="search__toggle" role="button" tabindex="0"/>')
    $('#js--search__toggle').on('click keypress', function (e) {
      if ((e.type == 'keypress' && e.which == 13) || e.type == 'click') {
        search_block.toggleClass('active');
        if (search_block.hasClass('active')) {
          search_block.find('input[type=text]').focus();
        }
      }
    });
  }
})(jQuery);