import re

content = open('src/components/CityCanvas.tsx', 'r').read()

# Add zoneLabelsRef
if "const zoneLabelsRef = useRef" not in content:
    content = content.replace("const tooltipRef = useRef<HTMLDivElement | null>(null);",
                              "const tooltipRef = useRef<HTMLDivElement | null>(null);\n  const zoneLabelsRef = useRef<(HTMLDivElement | null)[]>([]);")

# Add zone update logic right after the tooltip logic
zone_update_logic = """
      // Update Zone Labels 3D to 2D projection
      if (cameraRef.current && rendererRef.current) {
        ZONES.forEach((zone, i) => {
          const labelEl = zoneLabelsRef.current[i];
          if (!labelEl) return;
          
          const pos = new THREE.Vector3(zone.centerPos[0], 25, zone.centerPos[2]);
          pos.project(cameraRef.current);
          
          if (pos.z < 1 && pos.z > -1) {
            const x = (pos.x * 0.5 + 0.5) * rendererRef.current.domElement.clientWidth;
            const y = (-(pos.y * 0.5) + 0.5) * rendererRef.current.domElement.clientHeight;
            
            labelEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            
            // Only show full opacity when not in building/road view
            if (cameraMode === 'master_plan' || cameraMode === 'top_view' || cameraMode === 'isometric') {
                labelEl.style.opacity = '1';
                labelEl.style.pointerEvents = 'auto';
            } else {
                labelEl.style.opacity = '0.3';
                labelEl.style.pointerEvents = 'none';
            }
          } else {
            labelEl.style.opacity = '0';
          }
        });
      }
"""

# Find the end of tooltip logic
content = content.replace("tooltipRef.current.style.opacity = '0';\n      }\n\n      if (rendererRef.current && sceneRef.current && cameraRef.current) {", 
                          "tooltipRef.current.style.opacity = '0';\n      }\n" + zone_update_logic + "\n      if (rendererRef.current && sceneRef.current && cameraRef.current) {")


new_return = """
  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden select-none"
    >
      {/* Zone Labels Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
        {ZONES.map((zone, i) => (
          <div
            key={zone.id}
            ref={el => zoneLabelsRef.current[i] = el}
            className="absolute top-0 left-0 opacity-0 transition-opacity duration-300 pointer-events-none"
            onClick={(e) => {
                e.stopPropagation();
                onSelectZone(zone.id);
            }}
          >
            <div 
              className="px-3 py-1 rounded-md backdrop-blur-sm bg-slate-900/50 border shadow-lg hover:bg-slate-800/80 cursor-pointer transition-colors"
              style={{ borderColor: zone.color }}
            >
              <p className="text-white font-bold text-[10px] tracking-widest uppercase whitespace-nowrap" style={{ color: zone.color }}>
                {zone.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Building Tooltip Overlay */}
      <div 
        ref={tooltipRef} 
        className="absolute top-0 left-0 pointer-events-none opacity-0 transition-opacity duration-200 z-50 transform -translate-x-1/2 -translate-y-full mb-4"
      >
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-slate-700/50 shadow-2xl shadow-black/50 text-center relative">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-slate-900/90 border-r-[8px] border-r-transparent"></div>
          {selectedBuilding && (() => {
            const zoneName = ZONES.find(z => z.id === selectedBuilding.zoneId)?.name || 'Zone';
            return (
              <>
                <div className="text-xs font-bold text-sky-400 mb-1 uppercase tracking-wider">{zoneName}</div>
                <div className="text-sm font-semibold whitespace-nowrap">{selectedBuilding.name}</div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
"""

content = re.sub(r"return \(\n\s*<div\n\s*ref=\{containerRef\}.*?/>\n\s*\);\n\}", new_return.strip() + "\n}", content, flags=re.DOTALL)

with open('src/components/CityCanvas.tsx', 'w') as f:
    f.write(content)

print("Zone labels added.")
