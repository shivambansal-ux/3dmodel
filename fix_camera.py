import re

content = open('src/components/CityCanvas.tsx', 'r').read()

# Make isometric view closer to what the image shows
new_pos = """
          // 'master_plan' is essentially our Isometric view
          gsap.to(camera.position, {
            x: 0,
            y: 350,
            z: 350,
            duration: 1.5,
            ease: 'power3.inOut'
          });
          gsap.to(controls.target, {
            x: 0, y: 0, z: 0,
            duration: 1.5,
            ease: 'power3.inOut'
          });
"""

content = re.sub(r"// 'master_plan'.*?ease: 'power3\.inOut'\n          \}\);", new_pos.strip(), content, flags=re.DOTALL)

with open('src/components/CityCanvas.tsx', 'w') as f:
    f.write(content)

print("Camera fixed.")
