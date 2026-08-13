import re

content = open('src/data/cityData.ts', 'r').read()

content = re.sub(r"id:\s*'rb_inner_nw',.*?name:\s*'[^']+',", r"id: 'rb_inner_nw', name: 'Residential & Business Roundabout',", content)
content = re.sub(r"id:\s*'rb_inner_ne',.*?name:\s*'[^']+',", r"id: 'rb_inner_ne', name: 'Healthcare & Edu Roundabout',", content)
content = re.sub(r"id:\s*'rb_inner_se',.*?name:\s*'[^']+',", r"id: 'rb_inner_se', name: 'Logistics & Recreation Roundabout',", content)
content = re.sub(r"id:\s*'rb_inner_sw',.*?name:\s*'[^']+',", r"id: 'rb_inner_sw', name: 'Industrial & Business Roundabout',", content)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("Roundabouts updated.")
