(function ($) {
  var GN = self.GN;
  GN.schoolSlideshow = function (obj) {
    if (typeof $().bxSlider === 'undefined') {
      return;
    }
    $schoolSlider = $(obj);
    var sliderID = $schoolSlider.attr('id');
    var _schoolSlider = {
      $currentCardSlot: {},
      $previousCardSlot: {},
      // create a container for the slides
      $slideContainer: $('#' + sliderID).find('.school-slider__list'),
      // create a pause for automatic slideshows
      $toggleButton: $('<div class="school-slider__toggle" aria-label="pause" aria-controls="' + sliderID + '" ></div>'),
      // create a container for the next/prev controls
      $sliderControls: $('<div class="slider__controls" role="tablist"/>'),
      $nextButton: $('<div class="slider__controls__next" aria-label="next" role="button" aria-controls="' + sliderID + '" />'),
      $prevButton: $('<div class="slider__controls__prev" aria-label="previous" role="button" aria-controls="' + sliderID + '" />'),

      // how many cards there are in the slider
      cardCount: 0,

      // a check to see if the slider was loaded or not
      // used in the _reloadSlider function, it prevents an
      // error from being thown because you can't reload a
      // slider that isn't loaded yet
      sliderLoaded: false,

      // slider configuration
      sliderConfig: {
        // slideWidth: 435,
        // auto: true,
        // autoHover: true,
        minSlides: 1,
        maxSlides: 1,
        slideMargin: 20,
        startSlide: 0,
        pager: true,
        pagerCustom: '.slider__controls',
        speed: 250,
        controls: false,
        onSliderLoad: function (currentIndex) {
          $schoolSlider.addClass('sliderLoaded');
          _schoolSlider.$previousCardSlot = _getCardSlot(currentIndex);
          _schoolSlider.$currentCardSlot = _schoolSlider.$previousCardSlot;
          _schoolSlider.$currentCardSlot.addClass('school-slider__item--active');
        },
        onSlideBefore: function ($slideElement, oldIndex, newIndex) {
          _schoolSlider.$currentCardSlot.removeClass('school-slider__item--active');
          _schoolSlider.$previousCardSlot = _schoolSlider.$currentCardSlot;
          _schoolSlider.$currentCardSlot = _getCardSlot(newIndex);
        },

        onSlideAfter: function ($slideElement, oldIndex, newIndex) {
          _schoolSlider.$currentCardSlot.addClass('school-slider__item--active');
          _schoolSlider.sliderConfig.startSlide = newIndex;
          _schoolSlider.currentcardSlotIndex = newIndex;
        }
      }
    }
    var _getCardSlot = function (index) {
      return _schoolSlider
        .$slideContainer
        .children()
        .not('.bx-clone')
        .eq(index);
    };
    if (_schoolSlider.$slideContainer.find('.school-slider__item').length > 1) {
      //Collect the pager
      $schoolSlider.append(_schoolSlider.$sliderControls);
      _schoolSlider.$slideContainer.find('.school-slider__item').each(function (i) {
        var tab = $('<a href="" class="slider__controls--item">');
        tab.attr('data-slide-index', i)
          .attr('aria-controls', 'school-slider__item-' + (i + 1))
          .appendTo(_schoolSlider.$sliderControls);
      });
      _schoolSlider.$slideContainer.bxSlider(_schoolSlider.sliderConfig);
    }
  }
})(jQuery);