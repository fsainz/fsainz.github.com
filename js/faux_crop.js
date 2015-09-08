// Name    : Jquery Faux Crop
// Author  : Fernando Sainz, fsainz.com, @fsainz
// Version : 0.01
// Repo    : https://github.com/fsainz/jqueryFauxCrop

jQuery(function() {
  $.faux_crop = function(element, options) {
    this.settings = {};
    this.$element = $(element);
    this.init = function() {
      this.settings = $.extend({}, this.defaults, options);
      if (this.settings.original_crop_x != null) {
        this.settings.coordinates_for_cropping = true;
      }
      return this.$element.html(this.output());
    };
    this.output = function() {
      return "<div class='faux_crop' style='" + (this.css_style_for_container()) + "'>\n  <img src='" + this.settings.image_path + "' style='" + (this.css_style_for_image()) + "'>\n</div>";
    };
    this.css_style_for_container = function() {
      return "position: relative; overflow:hidden; width:" + this.settings.target_size + "px; height:" + this.settings.target_size + "px";
    };
    this.css_style_for_image = function() {
      var css_style;
      if (this.settings.coordinates_for_cropping) {
        css_style = this.css_style_for_cropped_image();
      } else {
        css_style = this.css_style_for_gravity_crop();
      }
      return css_style;
    };
    this.css_style_for_cropped_image = function() {
      var css_style, frame_multiplier, new_width, offset_multiplier, x_offset, y_offset;
      frame_multiplier = this.settings.width / this.settings.original_crop_size;
      offset_multiplier = this.settings.target_size / this.settings.original_crop_size;
      new_width = this.settings.target_size * frame_multiplier;
      x_offset = -this.settings.original_crop_x * offset_multiplier;
      y_offset = -this.settings.original_crop_y * offset_multiplier;
      return css_style = "width:" + new_width + "px; max-width:none;height:auto; margin-left:" + x_offset + "px; margin-top:" + y_offset + "px; display:block;";
    };
    this.css_style_for_gravity_crop = function() {
      var css_style, normalized_height, normalized_width, offset, ratio;
      ratio = this.settings.width / this.settings.height;
      if (ratio > 1) {
        normalized_width = this.settings.target_size * ratio;
        offset = (this.settings.target_size - normalized_width) / 2;
        css_style = "height:" + this.settings.target_size + "px; width:auto; max-width:none;margin-left:" + offset + "px;display:block;";
      } else {
        normalized_height = this.settings.target_size / ratio;
        offset = (this.settings.target_size - normalized_height) / 2;
        css_style = "width:" + this.settings.target_size + "px; height:auto;margin-top:" + offset + "px;display:block;";
      }
      return css_style;
    };
    this.init();
    return this;
  };
  $.faux_crop.prototype.defaults = {};
  return $.fn.faux_crop = function(options) {
    return this.each(function() {
      var $this, data_options;
      $this = $(this);
      data_options = {
        image_path: $this.data("image-path"),
        width: $this.data("width"),
        height: $this.data("height"),
        target_size: $this.data("target-size"),
        original_crop_x: $this.data("original-crop-x"),
        original_crop_y: $this.data("original-crop-y"),
        original_crop_size: $this.data("original-crop-size")
      };
      options = $.extend({}, data_options, options);
      return new $.faux_crop(this, options);
    });
  };
});
