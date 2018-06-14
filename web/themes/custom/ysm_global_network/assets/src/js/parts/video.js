(function ($) {
  var GN = self.GN;
  GN.fitVids = function () {
    if ((typeof brightcove !== "undefined" && brightcove !== null)) {
      $('iframe.BrightcoveExperience, iframe[src*="players.brightcove.net/"]').each(function () {
        return $(this).wrap('<div class="fluid-width-video-wrapper" style="padding-top: 56.25%;">');
      });
      brightcove.createExperiences();
    }
    $('.media-youtube-video, .embeddedContent, .media_embed').fitVids();
    return $('iframe.BrightcoveExperience').parent().addClass('brightcove');
  };
})(jQuery);