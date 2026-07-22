import re

with open('src/science/class6/chapter6/MaterialsAroundUs/storyEngine.js', 'r') as f:
    content = f.read()

# We want to find a checkpoint block and the immediately following summary block.
# Checkpoint block: { type: 'checkpoint', ... }
# Summary block: { type: 'summary', ... }
# There might be comments between them.

pattern = re.compile(
    r"(\{\s*type:\s*'checkpoint'[\s\S]*?)(  \},)\s*(//.*\n)?\s*\{\s*type:\s*'summary'[\s\S]*?dialogue:\s*('.*?'),\s*discoveries:\s*(\[[\s\S]*?\])[\s\S]*?\}",
    re.MULTILINE
)

def replacer(match):
    checkpoint_content = match.group(1)
    end_brace = match.group(2)
    dialogue = match.group(4)
    discoveries = match.group(5)
    
    # We inject dialogue and discoveries into the checkpoint before the closing brace
    new_checkpoint = f"{checkpoint_content}    dialogue: {dialogue},\n    discoveries: {discoveries}\n{end_brace}"
    return new_checkpoint

new_content = pattern.sub(replacer, content)

with open('src/science/class6/chapter6/MaterialsAroundUs/storyEngine.js', 'w') as f:
    f.write(new_content)
