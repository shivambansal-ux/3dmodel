import re

content = open('src/components/CityBuilder.ts', 'r').read()

# find first buildEVChargingStations3D and remove it (the simple one we just restored)
simple_ev = """  private buildEVChargingStations3D() {
    const stationGeo = new THREE.BoxGeometry(4, 3, 2);
    const stationMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.3 }); // Green charging box
    
    EV_CHARGING_STATIONS.forEach(station => {
      const mesh = new THREE.Mesh(stationGeo, stationMat);
      mesh.position.set(station.x, 1.5, station.z);
      mesh.castShadow = true;
      this.scene.add(mesh);
    });
  }"""

if simple_ev in content:
    content = content.replace(simple_ev, "")
    with open('src/components/CityBuilder.ts', 'w') as f:
        f.write(content)
    print("Fixed duplicate")
else:
    print("Could not find the simple one.")
