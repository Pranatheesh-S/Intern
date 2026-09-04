import json
import sys

path = r'C:\Users\Varun\.gemini\antigravity-ide\brain\badefeac-e2d4-4add-b275-ea5f67e8742f\.system_generated\logs\transcript_full.jsonl'
lab_basic_seq_code = ''
lab_tri_hex_code = ''

with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'LabBasicSequences = () => {' in line or 'LabTriangularToHexagonal = () => {' in line:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if 'args' in tc and 'ReplacementContent' in tc['args']:
                        rc = tc['args']['ReplacementContent']
                        if 'LabBasicSequences = () => {' in rc:
                            lab_basic_seq_code = rc
                        if 'LabTriangularToHexagonal = () => {' in rc:
                            lab_tri_hex_code = rc

print('Found Basic:', len(lab_basic_seq_code))
print('Found TriHex:', len(lab_tri_hex_code))

if not lab_basic_seq_code or not lab_tri_hex_code:
    print("Could not find components!")
    sys.exit(1)

# The ReplacementContent actually contained extra lines before the component like `    </div>\n  );\n};\n\n`.
# We need to extract just the components.
def extract_component(code, comp_name):
    start = code.find(f"const {comp_name} = () => {{")
    if start == -1: return ""
    return code[start:]

basic_clean = extract_component(lab_basic_seq_code, "LabBasicSequences")
tri_clean = extract_component(lab_tri_hex_code, "LabTriangularToHexagonal")

with open(r"c:\futurax\Futura-Edtech\src\maths\class6\chapter1\RelationsAmongSequences.jsx", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("export default function RelationsAmongSequences")
if idx == -1:
    sys.exit(1)

new_content = content[:idx] + basic_clean + "\n\n" + tri_clean + "\n\n" + content[idx:]

with open(r"c:\futurax\Futura-Edtech\src\maths\class6\chapter1\RelationsAmongSequences.jsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Restored successfully.")
