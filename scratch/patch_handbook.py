import re
with open('scratch/pottery_components.jsx', 'r', encoding='utf-8') as f:
    pottery_code = f.read()

with open('src/science/class6/chapter6/MaterialsAroundUs/components/Educational/InvestigationHandbook.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix imports
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect, useRef } from 'react';")

# 2. Insert pottery_components
content = content.replace('export default function InvestigationHandbook', pottery_code + '\nexport default function InvestigationHandbook')

# 3. Replace the historical spotlight content
target_start = "<div style={{ background: '#fdf6e3', border: '2px solid #eab308'"
target_end = "National Museum, New Delhi</strong>.</p>\n              </div>"
start_idx = content.find(target_start)
end_idx = content.find(target_end)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + "<PotterySpotlight />" + content[end_idx + len(target_end):]
    print('Replaced section.')
else:
    print('Failed to find replacement section!')

with open('src/science/class6/chapter6/MaterialsAroundUs/components/Educational/InvestigationHandbook.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched successfully!')
