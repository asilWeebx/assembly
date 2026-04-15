import re

with open('service-edu-jo.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_text(orig, key):
    return f'<span data-i18n="{key}">{orig}</span>'

# Head title
html = html.replace('<title>Edu Job | Economic Assembly</title>', '<title data-i18n="eduJob.pageTitle">Edu Job | Экономическая Ассамблея</title>')

# all services
html = html.replace('Все услуги</a>', '<span data-i18n="eduJob.allServices">Все услуги</span></a>')

# hero block
html = html.replace('>Образование</span>', ' data-i18n="eduJob.heroBadge">Образование</span>')
html = html.replace('>Активен</span>', ' data-i18n="eduJob.heroStatus">Активен</span>')
html = html.replace('Кадровая<!-- -->', '<span data-i18n="eduJob.heroTitlePrefix">Кадровая</span><!-- -->')
html = html.replace('>Экосистема</span>', ' data-i18n="eduJob.heroTitleAccent">Экосистема</span>')
html = html.replace('Кадровая экосистема для подготовки, развития и трудоустройства квалифицированных специалистов.</p>', 'Кадровая экосистема для подготовки, развития и трудоустройства квалифицированных специалистов.</p>'.replace('Кадровая экосистема для подготовки, развития и трудоустройства квалифицированных специалистов.', '<span data-i18n="eduJob.heroDesc">Кадровая экосистема для подготовки, развития и трудоустройства квалифицированных специалистов.</span>'))
html = html.replace('<span>Регистрация</span>', '<span data-i18n="eduJob.heroPrimaryBtn">Регистрация</span>')
html = html.replace('>Направления</a>', ' data-i18n="eduJob.heroSecondaryBtn">Направления</a>')

# section 2 (Feature cards)
html = html.replace('uppercase mb-3 block">Edu-Job</span>', 'uppercase mb-3 block" data-i18n="eduJob.tagline">Edu-Job</span>')
# Note: "Кадровая Экосистема" is repeated here, it has same html structure, so the replace earlier for heroTitlePrefix and heroTitleAccent actually replaced BOTH which is absolutely correct!

# However, wait, in Python `.replace()` replaces ALL occurrences. 
# Did my heroTitlePrefix replace find the second instance?
# "Кадровая<!-- -->"" is present twice. Yes!

html = html.replace('>Профессиональное Oбразование</h3>', ' data-i18n="eduJob.feature1Title">Профессиональное Oбразование</h3>')
html = html.replace('Современные образовательные программы и профессиональные тренинги по востребованным специальностям</p>', '<span data-i18n="eduJob.feature1Desc">Современные образовательные программы и профессиональные тренинги по востребованным специальностям</span></p>')
html = html.replace('>База Bакансий</h3>', ' data-i18n="eduJob.feature2Title">База Bакансий</h3>')
html = html.replace('Актуальные вакансии и программы стажировок в ведущих компаниях</p>', '<span data-i18n="eduJob.feature2Desc">Актуальные вакансии и программы стажировок в ведущих компаниях</span></p>')
html = html.replace('>Менторство</h3>', ' data-i18n="eduJob.feature3Title">Менторство</h3>')
html = html.replace('Индивидуальное наставничество и профессиональные консультации от опытных экспертов</p>', '<span data-i18n="eduJob.feature3Desc">Индивидуальное наставничество и профессиональные консультации от опытных экспертов</span></p>')
html = html.replace('>Сертификация</h3>', ' data-i18n="eduJob.feature4Title">Сертификация</h3>')
html = html.replace('Получение сертификатов международного образца и повышение профессиональной квалификации</p>', '<span data-i18n="eduJob.feature4Desc">Получение сертификатов международного образца и повышение профессиональной квалификации</span></p>')

# Tracks section
html = html.replace('Учебные направления</span>', '<span data-i18n="eduJob.tracksBadge">Учебные направления</span></span>')
html = html.replace('Профессиональные<!-- -->', '<span data-i18n="eduJob.tracksTitlePrefix">Профессиональные</span><!-- -->')
html = html.replace('>направления</span>', ' data-i18n="eduJob.tracksTitleAccent">направления</span>')
html = html.replace('Профессиональные образовательные программы и возможности сертификации по современным специальностям, соответствующим актуальным требованиям рынка труда.</p>', '<span data-i18n="eduJob.tracksDesc">Профессиональные образовательные программы и возможности сертификации по современным специальностям, соответствующим актуальным требованиям рынка труда.</span></p>')

# Finance Track
html = html.replace('>Финансовый Mенеджмент</h3>', ' data-i18n="eduJob.finTitle">Финансовый Mенеджмент</h3>')
html = html.replace('>Корпоративные Финансы</li>', ' data-i18n="eduJob.fin1">Корпоративные Финансы</li>')
html = html.replace('>Управление Инвестициями</li>', ' data-i18n="eduJob.fin2">Управление Инвестициями</li>')
html = html.replace('>Финансовое Планирование и Aнализ</li>', ' data-i18n="eduJob.fin3">Финансовое Планирование и Aнализ</li>')
html = html.replace('>Управление Финансовыми Рисками</li>', ' data-i18n="eduJob.fin4">Управление Финансовыми Рисками</li>')

# Business Track
html = html.replace('>Бизнес &amp; Менеджмент</h3>', ' data-i18n="eduJob.bizTitle">Бизнес &amp; Менеджмент</h3>')
html = html.replace('>Управление Проектами</li>', ' data-i18n="eduJob.biz1">Управление Проектами</li>')
html = html.replace('>Маркетинг</li>', ' data-i18n="eduJob.biz2">Маркетинг</li>')
html = html.replace('>Основы Финансов</li>', ' data-i18n="eduJob.biz3">Основы Финансов</li>')
html = html.replace('>Управление Персоналом</li>', ' data-i18n="eduJob.biz4">Управление Персоналом</li>')

# Supply Track
html = html.replace('>Цепочка Поставок</h3>', ' data-i18n="eduJob.supplyTitle">Цепочка Поставок</h3>')
html = html.replace('>Планирование</li>', ' data-i18n="eduJob.supply1">Планирование</li>')
html = html.replace('>Закупки и Снабжение</li>', ' data-i18n="eduJob.supply2">Закупки и Снабжение</li>')
html = html.replace('>Производство</li>', ' data-i18n="eduJob.supply3">Производство</li>')
html = html.replace('>Доставка и Логистика</li>', ' data-i18n="eduJob.supply4">Доставка и Логистика</li>')

# Partners Section
html = html.replace('>Компании-партнёры</h3>', ' data-i18n="eduJob.partnersTitle">Компании-партнёры</h3>')
html = html.replace('>Крупные производственные предприятия</span>', ' data-i18n="eduJob.partner1">Крупные производственные предприятия</span>')
html = html.replace('>IT компании</span>', ' data-i18n="eduJob.partner2">IT компании</span>')
html = html.replace('>Банки и финансовые организации</span>', ' data-i18n="eduJob.partner3">Банки и финансовые организации</span>')
html = html.replace('>Торговые сети</span>', ' data-i18n="eduJob.partner4">Торговые сети</span>')
html = html.replace('>Логистические компании</span>', ' data-i18n="eduJob.partner5">Логистические компании</span>')
html = html.replace('>Сфера услуг</span>', ' data-i18n="eduJob.partner6">Сфера услуг</span>')

with open('service-edu-jo.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Mapped i18n tags to service-edu-jo.html")
