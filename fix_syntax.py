import re

content = open('src/components/CityBuilder.ts', 'r').read()

# First, find where the class originally ended.
# Actually, the file ended with `}`
# But wait, my script appended to the END of the file:
# content = content + new_func
# So the new functions are after the `}` that closed the class.
# Let's just wrap the whole thing properly.

# Let's find `private buildCentralPark` and move it before the last `}`.
parts = content.split("private buildCentralPark()")

if len(parts) == 2:
    # parts[0] has the class closing `}` somewhere near the end.
    idx = parts[0].rfind('}')
    
    if idx != -1:
        fixed = parts[0][:idx] + "  private buildCentralPark()" + parts[1] + "\n}\n"
        with open('src/components/CityBuilder.ts', 'w') as f:
            f.write(fixed)
        print("Syntax fixed.")
    else:
        print("Could not find closing brace.")
else:
    print("Could not find buildCentralPark.")
