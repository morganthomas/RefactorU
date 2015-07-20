module.exports = {
  luminosity: function(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  darken: function(r,g,b) {
    return [r * 0.8, g * 0.8, b * 0.8];
  }
};
