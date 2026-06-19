(function () {
  var root = document.documentElement;
  var themePresets = {
    light: { "--dark-color-lightness": "17%", "--white-color-lightness": "100%", "--light-color-lightness": "92%" },
    dark: { "--dark-color-lightness": "95%", "--white-color-lightness": "20%", "--light-color-lightness": "15%" },
    black: { "--dark-color-lightness": "95%", "--white-color-lightness": "10%", "--light-color-lightness": "0%" }
  };

  function readPreferences() {
    try {
      return {
        theme: localStorage.getItem("themeChoice") || "dark",
        accentHue: localStorage.getItem("accentHue") || localStorage.getItem("color") || "352",
        textSize: localStorage.getItem("textSize") || "16"
      };
    } catch (e) {
      return {
        theme: "dark",
        accentHue: "352",
        textSize: "16"
      };
    }
  }

  function applyTheme(choice) {
    var preset = themePresets[choice] || themePresets.dark;
    Object.keys(preset).forEach(function (prop) {
      root.style.setProperty(prop, preset[prop]);
    });
  }

  function applyPreferences(preferences) {
    var prefs = preferences || readPreferences();
    applyTheme(prefs.theme);
    root.style.setProperty("--primary-color-hue", prefs.accentHue);
    root.style.fontSize = prefs.textSize + "px";
    return prefs;
  }

  window.displayPreferences = {
    read: readPreferences,
    apply: applyPreferences,
    applyTheme: applyTheme
  };

  applyPreferences();
})();
