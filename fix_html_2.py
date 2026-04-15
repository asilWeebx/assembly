with open('service-edu-jo.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix heroStatus missing close tag for outer element
target = '</span><span data-i18n="eduJob.heroStatus">Активен</span>'
replacement = '</span><span data-i18n="eduJob.heroStatus">Активен</span></span>'
html = html.replace(target, replacement)

# Fix tracksBadge missing close tag?
# Original: 'Учебные направления</span>', '<span data-i18n="eduJob.tracksBadge">Учебные направления</span></span>' 
# This looks already closed (span replaces text, leaving original </span> which is fine)

with open('service-edu-jo.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fix applied")
