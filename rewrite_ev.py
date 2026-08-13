import re

content = open('src/data/cityData.ts', 'r').read()

# Update Commercial EV (Business Hub) - West
content = re.sub(r"id:\s*'ev_station_comm',.*?x:\s*[-]?\d+,.*?z:\s*[-]?\d+,", r"id: 'ev_station_comm',\n    name: 'Commercial Hub Ultra-Fast EV Plaza',\n    x: -120,\n    z: 0,", content, flags=re.DOTALL)

# Update Residential EV - North-West
content = re.sub(r"id:\s*'ev_station_res',.*?x:\s*[-]?\d+,.*?z:\s*[-]?\d+,", r"id: 'ev_station_res',\n    name: 'Residential Green Sanctuary EV Docks',\n    x: -120,\n    z: -120,", content, flags=re.DOTALL)

# Update Education EV - North
content = re.sub(r"id:\s*'ev_station_edu',.*?x:\s*[-]?\d+,.*?z:\s*[-]?\d+,", r"id: 'ev_station_edu',\n    name: 'University Innovation EV Chargers',\n    x: 0,\n    z: -120,", content, flags=re.DOTALL)

# Update Healthcare EV - North-East
content = re.sub(r"id:\s*'ev_station_hosp',.*?x:\s*[-]?\d+,.*?z:\s*[-]?\d+,", r"id: 'ev_station_hosp',\n    name: 'MediCity Emergency EV Rapid Dock',\n    x: 120,\n    z: -120,", content, flags=re.DOTALL)

# Update Industrial EV - South-West
content = re.sub(r"id:\s*'ev_station_ind',.*?x:\s*[-]?\d+,.*?z:\s*[-]?\d+,", r"id: 'ev_station_ind',\n    name: 'Gigafactory Heavy Freight Charging Hub',\n    x: -120,\n    z: 120,", content, flags=re.DOTALL)

# Update Park EV - Central (keep same)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("EV stations updated.")
