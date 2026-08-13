import re

content = open('src/data/cityData.ts', 'r').read()

def update_building(bld_id, new_zone, new_x, new_z):
    global content
    
    # find building block
    pattern = r"(id:\s*'" + bld_id + r"',.*?zoneId:\s*')([^']*)('.*?x:\s*)([-]?\d+)(,.*?z:\s*)([-]?\d+)(,)"
    
    def replacer(match):
        return f"{match.group(1)}{new_zone}{match.group(3)}{new_x}{match.group(5)}{new_z}{match.group(7)}"
        
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)


# Residential (NW)
update_building('bld_res_tower_1', 'residential', -160, -160)
update_building('bld_res_tower_2', 'residential', -120, -160)
update_building('bld_res_afford_1', 'residential', -160, -120)
update_building('bld_res_afford_2', 'residential', -120, -120)
update_building('bld_res_villas', 'residential', -160, -80)
update_building('bld_res_clubhouse', 'residential', -100, -80)

# Education (N)
update_building('bld_edu_main', 'education', 0, -160)
update_building('bld_edu_ai_hub', 'education', 40, -160)
update_building('bld_edu_library', 'education', -40, -160)
update_building('bld_edu_hostels', 'education', 40, -110)

# Healthcare (NE)
update_building('bld_hospital_main', 'healthcare', 140, -160)
update_building('bld_hospital_diag', 'healthcare', 100, -160)
update_building('bld_hospital_trauma', 'healthcare', 140, -110)

# Commercial / Business (W)
update_building('bld_biz_tower_1', 'business_hub', -160, 0)
update_building('bld_biz_stock', 'business_hub', -160, -45)
update_building('bld_biz_it_park', 'business_hub', -160, 45)
update_building('bld_biz_mall', 'business_hub', -110, 0)

# Public Services (E)
update_building('bld_civic_secretariat', 'public_services', 160, 0)
update_building('bld_civic_iccc', 'public_services', 160, -45)
update_building('bld_civic_police', 'public_services', 160, 45)
update_building('bld_civic_fire', 'public_services', 110, -45)
update_building('bld_civic_post', 'public_services', 110, 45)

# Industrial (SW)
update_building('bld_ind_gigafactory', 'industrial', -160, 160)
update_building('bld_ind_msme_1', 'industrial', -160, 110)

# Logistics (SE)
update_building('bld_ind_logistics', 'logistics', 160, 160)

with open('src/data/cityData.ts', 'w') as f:
    f.write(content)

print("Coordinates updated.")
