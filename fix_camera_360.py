import re

with open('src/components/CityCanvas.tsx', 'r') as f:
    content = f.read()

# Add isCameraAnimating ref
if "const isCameraAnimating =" not in content:
    content = content.replace("const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));", 
                              "const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));\n  const isCameraAnimating = useRef(false);")

# Update OrbitControls setup
controls_setup = """
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // don't go below ground
    controls.minDistance = 2;
    controls.maxDistance = 600;
    
    // Allow free 360 rotation by interrupting camera animations when user interacts
    controls.addEventListener('start', () => {
      isCameraAnimating.current = false;
    });
    
    controlsRef.current = controls;
"""
content = re.sub(r"const controls = new OrbitControls\(camera, renderer.domElement\);.*?controlsRef\.current = controls;", controls_setup.strip(), content, flags=re.DOTALL)

# Update the animation loop
anim_loop = """
      // Smooth camera interpolation
      if (cameraRef.current && controlsRef.current) {
        if (isCameraAnimating.current) {
          cameraRef.current.position.lerp(targetCamPos.current, 0.05);
          controlsRef.current.target.lerp(targetLookAt.current, 0.05);
          
          if (cameraRef.current.position.distanceTo(targetCamPos.current) < 0.5 &&
              controlsRef.current.target.distanceTo(targetLookAt.current) < 0.5) {
            isCameraAnimating.current = false;
          }
        }
        controlsRef.current.update();
      }
"""
content = re.sub(r"// Smooth camera interpolation.*?controlsRef\.current\.update\(\);\n      \}", anim_loop.strip(), content, flags=re.DOTALL)

# Trigger animation on mode changes
mode_effect = """
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    isCameraAnimating.current = true;

    if (cameraMode === 'master_plan') {
"""
content = content.replace("useEffect(() => {\n    if (!cameraRef.current || !controlsRef.current) return;\n\n    if (cameraMode === 'master_plan') {", mode_effect)

# also set isCameraAnimating for road view
road_effect = """
  useEffect(() => {
    if (cameraMode !== 'road_view') return;

    isCameraAnimating.current = true;
"""
content = content.replace("useEffect(() => {\n    if (cameraMode !== 'road_view') return;\n", road_effect)


with open('src/components/CityCanvas.tsx', 'w') as f:
    f.write(content)

print("Fixed 360 degree camera view.")
