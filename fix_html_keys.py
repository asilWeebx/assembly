with open('service-edu-jo.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('data-i18n="eduJob.', 'data-i18n="')

with open('service-edu-jo.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed eduJob prefix")
