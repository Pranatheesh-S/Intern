import sys

file_path = r'c:\futurax\Futura-Edtech\src\social\class6\locating_places\LocatingPlaces\components\CoordinatesPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I need to replace the img tag that uses /orange_wedge_isolated.jpg
old_img_block = '''<img 
                  src="/orange_wedge_isolated.jpg" 
                  alt="Selected Orange Wedge" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain', 
                    mixBlendMode: 'screen',
                    transform: 'rotate(-10deg)',
                    animation: 'wedgeFloat 4s ease-in-out infinite' 
                  }} 
                />'''

new_img_block = '''<img 
                  src="/single_orange_wedge.png" 
                  alt="Selected Orange Wedge" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain', 
                    transform: 'rotate(-10deg)',
                    animation: 'wedgeFloat 4s ease-in-out infinite' 
                  }} 
                />'''

if old_img_block in content:
    content = content.replace(old_img_block, new_img_block)
else:
    print("Could not find the exact old img block. Attempting a less strict replacement.")
    # Fallback to replace just the source and the mixBlendMode
    content = content.replace('"/orange_wedge_isolated.jpg"', '"/single_orange_wedge.png"')
    content = content.replace("mixBlendMode: 'screen',", "")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated successfully.')
