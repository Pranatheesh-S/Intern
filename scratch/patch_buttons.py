import re

def remove_theme_toggle(content):
    # Remove imports
    content = re.sub(r'import\s+\{\s*useTheme\s*\}\s+from\s+[\'"].*?ThemeContext\.jsx[\'"];\n', '', content)
    content = re.sub(r',\s*Sun,\s*Moon', '', content)
    content = re.sub(r'Sun,\s*Moon,\s*', '', content)
    
    # Remove hook
    content = re.sub(r'// Global Theme Hook\s*const\s*\{\s*theme,\s*toggleTheme\s*\}\s*=\s*useTheme\(\);\s*', '', content)
    
    # Remove toggle button block
    content = re.sub(r'<button[^>]*onClick=\{toggleTheme\}[^>]*>[\s\S]*?</button>\s*', '', content)
    return content

for filepath in [
    r'c:\Users\GANES\Futura-Edtech\src\activities\MaterialsAroundUs\index.jsx',
    r'c:\Users\GANES\Futura-Edtech\src\science\class6\chapter6\MaterialsAroundUs\index.jsx'
]:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = remove_theme_toggle(content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Theme toggle removed from index.jsx files.")
