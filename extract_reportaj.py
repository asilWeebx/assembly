import re

with open('scratch_live_reportaj.html', 'r', encoding='utf-8') as f:
    html = f.read()

match = re.search(r'<main[^>]*>.*?</main>', html, re.DOTALL)
if match:
    main_html = match.group(0)
    # let's add some linebreaks to make it readable
    main_html = main_html.replace('><', '>\n<')
    with open('main_reportaj.html', 'w', encoding='utf-8') as f:
        f.write(main_html)
    print("Success, extracted main block")
else:
    print("not found")
