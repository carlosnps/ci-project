(function ($) {
  var GN = self.GN;
  GN.slideshow = function (obj) {
    if (typeof $().bxSlider === 'undefined') {
      return;
    }
    $slider = $(obj);
    var sliderID = $slider.attr('id');
    var _slider = {
      $currentCardSlot: {},
      $previousCardSlot: {},
      // create a container for the slides
      $slideContainer: $('#' + sliderID).find('.slider__list'),
      // create a pause for automatic slideshows
      $toggleButton: $('<div class="slider__toggle" aria-label="pause" aria-controls="' + sliderID + '" ></div>'),
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
          $slider.addClass('sliderLoaded');
          _slider.$previousCardSlot = _getCardSlot(currentIndex);
          _slider.$currentCardSlot = _slider.$previousCardSlot;
          _slider.$currentCardSlot.addClass('slider__item--active');
        },
        onSlideBefore: function ($slideElement, oldIndex, newIndex) {
          _slider.$currentCardSlot.removeClass('slider__item--active');
          _slider.$previousCardSlot = _slider.$currentCardSlot;
          _slider.$currentCardSlot = _getCardSlot(newIndex);
        },

        onSlideAfter: function ($slideElement, oldIndex, newIndex) {
          _slider.$currentCardSlot.addClass('slider__item--active');
          _slider.sliderConfig.startSlide = newIndex;
          _slider.currentcardSlotIndex = newIndex;
        }
      }
    }
    var _getCardSlot = function (index) {
      return _slider
        .$slideContainer
        .children()
        .not('.bx-clone')
        .eq(index);
    };
    if (_slider.$slideContainer.find('.slider__item').length > 1) {
      //Collect the pager
      $slider.append(_slider.$sliderControls);
      _slider.$slideContainer.find('.slider__item').each(function (i) {
        var tab = $('<a href="" class="slider__controls--item">');
        tab.attr('data-slide-index', i)
          .attr('aria-controls', 'slider__item-' + (i + 1))
          .appendTo(_slider.$sliderControls);
      });
      _slider.$slideContainer.bxSlider(_slider.sliderConfig);
    }
  }
})(jQuery);