(function ($) {
  var GN = self.GN;
  GN.heroSlideshow = function (obj) {
    if (typeof $().bxSlider === 'undefined') {
      return;
    }
    $heroSlider = $(obj);
    var sliderID = $heroSlider.attr('id');
    var getTouchStatus = function () {
      if (Modernizr.touchevents) {
        return true;
      }
      return false;
    }
    var _heroSlider = {
      $currentCardSlot: {},
      $previousCardSlot: {},
      // create a container for the slides
      $slideContainer: $('#' + sliderID).find('.hero-slider__list'),
      // create a pause for automatic slideshows
      $toggleButton: $('<div class="hero-slider__toggle" aria-label="pause" aria-controls="' + sliderID + '" ></div>'),
      // create a container for the next/prev controls
      $sliderControls: $('<div class="hero-slider__controls" role="tablist"/>'),
      $nextButton: $('<div class="hero-slider__controls__next" aria-label="next" role="button" aria-controls="' + sliderID + '" />'),
      $prevButton: $('<div class="hero-slider__controls__prev" aria-label="previous" role="button" aria-controls="' + sliderID + '" />'),

      // how many cards there are in the slider
      cardCount: 0,

      // a check to see if the slider was loaded or not
      // used in the _reloadSlider function, it prevents an
      // error from being thown because you can't reload a
      // slider that isn't loaded yet
      sliderLoaded: false,

      // slider configuration
      sliderConfig: {
        minSlides: 1,
        maxSlides: 1,
        slideMargin: 20,
        startSlide: 0,
        pager: true,
        pagerCustom: '.hero-slider__controls',
        speed: 250,
        controls: false,
        touchEnabled: getTouchStatus(),
        onSliderLoad: function (currentIndex) {
          $heroSlider.addClass('sliderLoaded');
          _heroSlider.$previousCardSlot = _getCardSlot(currentIndex);
          _heroSlider.$currentCardSlot = _heroSlider.$previousCardSlot;
          _heroSlider.$currentCardSlot.addClass('hero-slider__item--active');
        },
        onSlideBefore: function ($slideElement, oldIndex, newIndex) {
          _heroSlider.$currentCardSlot.removeClass('hero-slider__item--active');
          _heroSlider.$previousCardSlot = _heroSlider.$currentCardSlot;
          _heroSlider.$currentCardSlot = _getCardSlot(newIndex);
        },

        onSlideAfter: function ($slideElement, oldIndex, newIndex) {
          _heroSlider.$currentCardSlot.addClass('hero-slider__item--active');
          _heroSlider.sliderConfig.startSlide = newIndex;
          _heroSlider.currentcardSlotIndex = newIndex;
        }
      }
    }
    var _getCardSlot = function (index) {
      return _heroSlider
        .$slideContainer
        .children()
        .not('.bx-clone')
        .eq(index);
    };
    //Collect the pager
    $heroSlider.append(_heroSlider.$sliderControls);
    _heroSlider.$slideContainer.find('.hero-slider__item-title').each(function (i) {
      var tab = $(this);
      tab.attr('data-slide-index', i);
      tab.appendTo(_heroSlider.$sliderControls);
    });
    _heroSlider.$slideContainer.bxSlider(_heroSlider.sliderConfig);

    // Make full slide clickable
    $('body').on('click touch', '.node-teaser__homepage-slide', function (e) {
      // Make full object clickable, but not anchor links
      if (!$(e.target).is('a') && $(this).attr('data-url') != undefined) {
        window.location = $(this).attr('data-url');
      }
    });
  }
})(jQuery);