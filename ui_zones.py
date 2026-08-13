import re

content = open('src/components/UIOverlay.tsx', 'r').read()

zones_str = """
{ZONES.map((zone) => (
          <button
            key={zone.id}
            onClick={() => {
              onSetSelectedZone(zone.id);
              onSetCameraMode('zone_view');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedZoneId === zone.id && cameraMode === 'zone_view'
                ? 'bg-slate-100 text-slate-950 border-white shadow-lg'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
            }`}
            style={{
              borderColor: selectedZoneId === zone.id ? zone.color : 'transparent',
            }}
          >
            {zone.name.toUpperCase()}
          </button>
        ))}
"""

# Let's just fix the zone names in cityData instead, it's easier.
