import re

with open('src/data/cityData.ts', 'r') as f:
    content = f.read()

def clear_array(array_name, type_annotation=""):
    global content
    pattern = r"export const " + array_name + r"(:\s*[^=]+)?\s*=\s*\[.*?\];"
    replacement = f"export const {array_name}{type_annotation} = [];"
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

clear_array("BUILDINGS", ": BuildingData[]")
clear_array("ROAD_NETWORKS", ": RoadSegment[]")
clear_array("ROUNDABOUT_JUNCTIONS", ": RoundaboutJunction[]")
clear_array("EV_CHARGING_STATIONS", ": EVChargingStation[]")
clear_array("INITIAL_AV_FLEET", ": Vehicle[]")
clear_array("UNDERGROUND_UTILITIES", ": UndergroundUtility[]")

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("Cleared all arrays.")
