import re

content = open('src/components/CityCanvas.tsx', 'r').read()

# Add ref for tooltip
if "const tooltipRef = useRef" not in content:
    content = content.replace("const rendererRef = useRef<THREE.WebGLRenderer | null>(null);",
                              "const rendererRef = useRef<THREE.WebGLRenderer | null>(null);\n  const tooltipRef = useRef<HTMLDivElement | null>(null);")

# Add tooltip element to JSX
tooltip_jsx = """
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
"""
content = content.replace("</div>\n  );\n}", tooltip_jsx.strip() + "\n  );\n}")

# Add tooltip update in RAF loop
update_logic = """
      if (frameCountRef.current % 20 === 0 && onUpdateFleet) {
        onUpdateFleet([...vehiclesRef.current]);
      }

      // Update Tooltip 3D to 2D projection
      if (selectedBuilding && tooltipRef.current && cameraRef.current && rendererRef.current) {
        // Find the actual mesh bounding box to get accurate top center
        let heightOffset = selectedBuilding.height + 15; // Hover above building
        const bPos = new THREE.Vector3(selectedBuilding.x, heightOffset, selectedBuilding.z);
        bPos.project(cameraRef.current);
        
        // Convert to screen coordinates
        const x = (bPos.x * 0.5 + 0.5) * rendererRef.current.domElement.clientWidth;
        const y = (-(bPos.y * 0.5) + 0.5) * rendererRef.current.domElement.clientHeight;
        
        // Only show if the building is in front of the camera
        if (bPos.z < 1 && bPos.z > -1) {
          tooltipRef.current.style.transform = `translate(${x}px, ${y}px) translateY(-10px)`;
          tooltipRef.current.style.opacity = '1';
        } else {
          tooltipRef.current.style.opacity = '0';
        }
      } else if (tooltipRef.current) {
        tooltipRef.current.style.opacity = '0';
      }
"""
content = re.sub(r"if \(frameCountRef\.current % 20 === 0 && onUpdateFleet\) \{\n\s*onUpdateFleet\(\[\.\.\.vehiclesRef\.current\]\);\n\s*\}", update_logic.strip(), content)

with open('src/components/CityCanvas.tsx', 'w') as f:
    f.write(content)
print("Tooltip added.")
