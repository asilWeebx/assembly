import re

with open('service-edu-jo.html', 'r', encoding='utf-8') as f:
    target_html = f.read()

with open('main_extracted.html', 'r', encoding='utf-8') as f:
    main_html = f.read()

# Custom styles to mimic assembly.uz missing tailwind classes
custom_styles = """
    <style>
      .bg-navy-900 { background-color: #051024; }
      .bg-navy-800 { background-color: #0b1a38; }
      .from-navy-900 { --tw-gradient-from: #051024 var(--tw-gradient-from-position); --tw-gradient-to: rgba(5, 16, 36, 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
      .to-navy-900 { --tw-gradient-to: #051024 var(--tw-gradient-to-position); }
      .via-navy-800 { --tw-gradient-to: rgba(11, 26, 56, 0)  var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), #0b1a38 var(--tw-gradient-via-position), var(--tw-gradient-to); }
      .text-gradient-gold {
         background: linear-gradient(to right, #e2c365, #f5df96);
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
      }
      .badge-gold {
         display: inline-flex; align-items: center; gap: 0.25rem; border-radius: 9999px; background-color: rgba(212, 175, 55, 0.1); padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 500; color: #e2c365; border: 1px solid rgba(212, 175, 55, 0.2);
      }
      .text-gold-400 { color: #e2c365; }
      .bg-gold-500\/10 { background-color: rgba(212, 175, 55, 0.1); }
      
      /* Reset inline opacity/transform for animations since we don't have their JS */
      [style*="opacity:0"] {
          opacity: 1 !important;
          transform: none !important;
      }
    </style>
"""

# Replace main content
target_html = re.sub(r'<main.*?</main>', main_html, target_html, flags=re.DOTALL)

# Inject custom styles before </head>
target_html = target_html.replace('</head>', custom_styles + '\n  </head>')

with open('service-edu-jo.html', 'w', encoding='utf-8') as f:
    f.write(target_html)

print("Pitched successfully!")
