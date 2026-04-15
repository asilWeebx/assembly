with open('service-edu-jo.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix heroBadge
html = html.replace('</svg data-i18n="eduJob.heroBadge">Образование</span>', '</svg><span data-i18n="eduJob.heroBadge">Образование</span>')

# Fix heroStatus
# Original replace was: html.replace('>Активен</span>', ' data-i18n="eduJob.heroStatus">Активен</span>')
# This probably replaced the `</span>` before it: `</span data-i18n="...">Активен</span>`
html = html.replace('</span data-i18n="eduJob.heroStatus">Активен</span>', '</span><span data-i18n="eduJob.heroStatus">Активен</span>')

# Check buttons
# html.replace('>Направления</a>', ' data-i18n="eduJob.heroSecondaryBtn">Направления</a>')
# This replaced `href="#tracks">Направления</a>` -> `href="#tracks" data-i18n="eduJob.heroSecondaryBtn">Направления</a>` which is fine!

# Tracks section
# tracksBadge: html = html.replace('Учебные направления</span>', '<span data-i18n="eduJob.tracksBadge">Учебные направления</span></span>')
# This is fine.

# Fin Title and others
# html.replace('>Финансовый Mенеджмент</h3>', ' data-i18n="eduJob.finTitle">Финансовый Mенеджмент</h3>')
# This probably replaced `<h3 class="...">Финансовый Mенеджмент</h3>` to `<h3 class="..." data-i18n="...">Финансовый Mенеджмент</h3>` - this is fine!

# Lists
# html.replace('>Корпоративные Финансы</li>', ' data-i18n="eduJob.fin1">Корпоративные Финансы</li>')
# It probably replaced the svg closing tag: `</svg data-i18n="eduJob.fin1">Корпоративные Финансы</li>`
import re
html = re.sub(r'</svg data-i18n="([^"]+)">([^<]+)</li>', r'</svg><span data-i18n="\1">\2</span></li>', html)

# Partners
# html.replace('>Крупные производственные предприятия</span>', ' data-i18n="eduJob.partner1">Крупные производственные предприятия</span>')
# Probably the same svg closing tag issue.
html = re.sub(r'</svg data-i18n="([^"]+)">([^<]+)</span>', r'</svg><span data-i18n="\1">\2</span></span>', html)

with open('service-edu-jo.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed malformed html tags")
