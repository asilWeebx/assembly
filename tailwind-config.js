tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "on-background": "var(--on-background)",
        surface: "var(--surface)",
        "on-surface": "var(--on-surface)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        "navy-900": "var(--navy-900)",
        "navy-800": "var(--navy-800)",
        "on-navy": "var(--on-navy)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"]
      }
    },
  },
};
