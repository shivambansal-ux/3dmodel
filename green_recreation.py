import re

content = open('src/components/CityBuilder.ts', 'r').read()

new_func = """
  private buildGreenRecreationZone() {
    const parkGroup = new THREE.Group();
    parkGroup.position.set(0, 0, 135);

    // Green base for the park (130x130)
    const baseGeo = new THREE.PlaneGeometry(136, 136);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = 0.13;
    parkGroup.add(baseMesh);

    // Lake (large rounded shape)
    const lakeShape = new THREE.Shape();
    lakeShape.moveTo(0, -30);
    lakeShape.bezierCurveTo(40, -30, 60, -10, 40, 30);
    lakeShape.bezierCurveTo(20, 50, -20, 40, -40, 20);
    lakeShape.bezierCurveTo(-60, 0, -40, -30, 0, -30);

    const lakeGeo = new THREE.ShapeGeometry(lakeShape);
    const lakeMat = new THREE.MeshStandardMaterial({ color: '#0ea5e9', roughness: 0.1, metalness: 0.8 });
    const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
    lakeMesh.rotation.x = -Math.PI / 2;
    lakeMesh.position.set(-10, 0.15, 0);
    parkGroup.add(lakeMesh);

    // Add some sports courts on the side
    const courtGeo = new THREE.PlaneGeometry(28, 16);
    const courtMat = new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.3 }); // Orange basketball/tennis courts
    const court1 = new THREE.Mesh(courtGeo, courtMat);
    court1.rotation.x = -Math.PI / 2;
    court1.position.set(45, 0.14, 0);
    parkGroup.add(court1);

    const court2 = new THREE.Mesh(courtGeo, courtMat);
    court2.rotation.x = -Math.PI / 2;
    court2.position.set(45, 0.14, 25);
    parkGroup.add(court2);

    this.scene.add(parkGroup);
  }
"""

content = content.replace("this.buildCentralPark();", "this.buildCentralPark();\n    this.buildGreenRecreationZone();")
content = content + new_func

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Green & Recreation Zone builder added.")
