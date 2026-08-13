import re

content = open('src/components/CityBuilder.ts', 'r').read()

new_buffer = """
  private buildZoneBufferBelts() {
    const bufferGroup = new THREE.Group();

    // Cross Buffer Corridors (N-S and E-W green buffer belts, 16m wide)
    const matBuffer = new THREE.MeshStandardMaterial({
      color: '#16a34a',
      roughness: 0.7,
    });

    // N-S Buffer Belts (at x = -70, 70)
    const nsBuffer1 = new THREE.Mesh(new THREE.PlaneGeometry(16, 420), matBuffer);
    nsBuffer1.rotation.x = -Math.PI / 2;
    nsBuffer1.position.set(-70, 0.08, 0);

    const nsBuffer2 = new THREE.Mesh(new THREE.PlaneGeometry(16, 420), matBuffer);
    nsBuffer2.rotation.x = -Math.PI / 2;
    nsBuffer2.position.set(70, 0.08, 0);

    // E-W Buffer Belts (at z = -70, 70)
    const ewBuffer1 = new THREE.Mesh(new THREE.PlaneGeometry(420, 16), matBuffer);
    ewBuffer1.rotation.x = -Math.PI / 2;
    ewBuffer1.position.set(0, 0.08, -70);

    const ewBuffer2 = new THREE.Mesh(new THREE.PlaneGeometry(420, 16), matBuffer);
    ewBuffer2.rotation.x = -Math.PI / 2;
    ewBuffer2.position.set(0, 0.08, 70);

    bufferGroup.add(nsBuffer1, nsBuffer2, ewBuffer1, ewBuffer2);

    this.scene.add(bufferGroup);
  }
"""

content = re.sub(r"private buildZoneBufferBelts\(\) \{.*?this\.scene\.add\(bufferGroup\);\n  \}", new_buffer.strip(), content, flags=re.DOTALL)

with open('src/components/CityBuilder.ts', 'w') as f:
    f.write(content)

print("Zone buffer belts updated.")
