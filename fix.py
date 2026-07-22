with open('src/science/class6/chapter6/MaterialsAroundUs/storyEngine.js', 'r') as f:
    content = f.read()

content = content.replace(']\n    dialogue:', '],\n    dialogue:')
content = content.replace('  },,', '  },')

with open('src/science/class6/chapter6/MaterialsAroundUs/storyEngine.js', 'w') as f:
    f.write(content)
