(function ($) {
  var GN = self.GN;
  GN.topMenu = function () {
    $('.region-header').niceScroll({
      cursorcolor: "#888",
      cursorborder: "none",
      horizrailenabled: false
    });
    // Toggle navigation bar
    $('#primary-nav__toggle').on('click touchstart keypress', function (e) {
      if ((e.type == 'keypress' && e.which == 13) || e.type == 'click' || e.type == 'touchstart') {
        $('html').toggleClass('nav-primary__open');
        if ($('html').hasClass('nav-primary__open')) {
          $('#block-ysm-global-network-main-menu-menu').attr('tabindex', '-1').addClass('focus-forced').focus().on('blur', function () {
            $(this).removeClass('focus-forced');
          });
        }
        $('.region-header').getNiceScroll().resize();
      }
      return false;
    });
    // Repeat .nav__primary--sitename to modify location on smaller screens
    // $('#nav--sitename').clone().appendTo('#yalesom-logo');
  }
  GN.toggleSubnav = function () {
    $('.nav__secondary .level-0 > .nav__item').on('click touchstart focus', function (e) {
      console.log(e.target);
      if (!$(e.target).is('a') && e.target == this) {
        $(this).toggleClass('nav__secondary--open');
        return false;
      }
    });
  }
  GN.stickyTop = function () {
    // Calculate the height of the nav bar, if present
    var stickyTop = 0;
    stickyTop += $('#toolbar-administration').outerHeight() || 0;
    stickyTop += $('#toolbar-administration .toolbar-tray-horizontal.is-active').first().outerHeight() || 0;
    return stickyTop;
  }
  // Sticky banner position
  GN.bodyTop = function () {
    if ($(window).scrollTop() <= GN.stickyTop()) {
      $('body').addClass('body-top');
    } else {
      $('body').removeClass('body-top');
    }
  }
})(jQuery);