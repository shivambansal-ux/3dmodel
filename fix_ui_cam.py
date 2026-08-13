import re

content = open('src/components/UIOverlay.tsx', 'r').read()

# Let's fix the ISOMETRIC button not turning green when active
content = content.replace("cameraMode === 'master_plan'\n              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'\n              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'", "cameraMode === 'master_plan'\n              ? 'bg-fuchsia-500 text-slate-950 shadow-lg shadow-fuchsia-500/20'\n              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'")

with open('src/components/UIOverlay.tsx', 'w') as f:
    f.write(content)

print("Camera button fixed.")
