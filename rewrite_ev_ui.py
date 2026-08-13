import re

content = open('src/components/UIOverlay.tsx', 'r').read()

# I want to add some UI updates for the zones

content = content.replace("selectedZoneId === zone.id ? zone.color : undefined,", "selectedZoneId === zone.id ? zone.color : 'transparent',")

with open('src/components/UIOverlay.tsx', 'w') as f:
    f.write(content)

print("UI Overlay updated.")
