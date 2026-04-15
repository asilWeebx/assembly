import re

biz_darja = open("service-bizness-darja.html").read()

services = [
    {
        "file": "service-edu-jo.html",
        "title": "Edu-Jo | Economic Assembly",
        "label": "Education",
        "h1": "Edu-Jo",
        "desc": "Образовательная платформа для топ-менеджмента и госслужащих с программами развития компетенций."
    },
    {
        "file": "service-br.html",
        "title": "BR | Economic Assembly",
        "label": "Business Relations",
        "h1": "BR",
        "desc": "Международные бизнес-миссии, поиск зарубежных партнеров и усиление экспортной кооперации."
    },
    {
        "file": "service-fr.html",
        "title": "FR | Economic Assembly",
        "label": "Finance Relations",
        "h1": "FR",
        "desc": "Финансовое сопровождение, лизинг, субсидии и грантовая поддержка инновационных инициатив."
    },
    {
        "file": "service-gr.html",
        "title": "GR | Economic Assembly",
        "label": "Government Relations",
        "h1": "GR",
        "desc": "Взаимодействие с государственными структурами и защита интересов бизнеса в регуляторной среде."
    },
    {
        "file": "service-reportaj-go.html",
        "title": "Reportaj GO | Economic Assembly",
        "label": "Analytics",
        "h1": "Reportaj GO",
        "desc": "Система прозрачной отчетности и мониторинга экономических показателей регионов в реальном времени."
    }
]

for svc in services:
    content = biz_darja
    # Replace title
    content = re.sub(r'<title>.*?</title>', f'<title>{svc["title"]}</title>', content, count=1)
    # Replace label
    content = re.sub(r'<span data-i18n="heroLabel">.*?</span>', f'<span data-i18n="heroLabel">{svc["label"]}</span>', content, count=1)
    # Replace H1
    # Original H1: 
    # <span data-i18n="heroTitlePrefix">Biznes</span> <span class="text-gradient" data-i18n="heroTitleAccent">DARCHA</span>
    # We will just replace it with the H1 text (we can split by space for prefix/accent if we want)
    h1_parts = svc["h1"].split(' ', 1)
    if len(h1_parts) > 1:
        prefix, accent = h1_parts
        new_h1 = f'<span data-i18n="heroTitlePrefix">{prefix}</span> <span class="text-gradient" data-i18n="heroTitleAccent">{accent}</span>'
    else:
        new_h1 = f'<span data-i18n="heroTitlePrefix">{svc["h1"]}</span> <span class="text-gradient" data-i18n="heroTitleAccent"></span>'
        
    content = re.sub(r'<h1 class="font-\[\'Manrope\'\] text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4 leading-\[0\.95\] tracking-tight">.*?</h1>', 
                     f'<h1 class="font-[\'Manrope\'] text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4 leading-[0.95] tracking-tight">\n              {new_h1}\n            </h1>', 
                     content, flags=re.DOTALL)
    
    # Replace Description
    content = re.sub(r'<p class="text-on-surface-variant mt-4 md:mt-6 text-base sm:text-lg leading-relaxed max-w-xl" data-i18n="heroDesc">.*?</p>',
                     f'<p class="text-on-surface-variant mt-4 md:mt-6 text-base sm:text-lg leading-relaxed max-w-xl" data-i18n="heroDesc">\n              {svc["desc"]}\n            </p>',
                     content, flags=re.DOTALL)
                     
    with open(svc["file"], "w") as f:
        f.write(content)

print("Generated all files")
