(function ($) {
  var GN = self.GN;
  GN.floatingPlaceholders = function () {
    $('#e2ma_signup .e2ma_signup_form_row').each(function () {
      var label = $(this).find('.e2ma_signup_form_label');
      var input = $(this).find('.e2ma_signup_form_element input[type=text],.e2ma_signup_form_element input[type=email]');
      var checkbox = $(this).find('.e2ma_signup_form_element input[type=checkbox],.e2ma_signup_form_element input[type=radio]');
      input
        .after('<label class="e2ma_signup_form_label" for="' + input.attr('id') + '">' + label.html() + '</label>')
        .parent().addClass('floating-placeholder');
      checkbox.parent().before(checkbox).html(label.text()); // Use label header to replace 'Yes' value
      label.remove();
    });

    function updateText(event) {
      var input = $(this);
      setTimeout(function () {
        var val = input.val();
        if (val != "")
          input.parent().addClass("floating-placeholder-float");
        else
          input.parent().removeClass("floating-placeholder-float");
      }, 1)
    }
    $(".floating-placeholder input").keydown(updateText);
    $(".floating-placeholder input").change(updateText);
  }
})(jQuery);