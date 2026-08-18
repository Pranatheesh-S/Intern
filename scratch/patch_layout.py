import re
import os

filepath = r'c:\Users\GANES\Futura-Edtech\src\science\class6\chapter6\MaterialsAroundUs\index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove left back button
content = re.sub(
    r'\{\(isStage1Page1 \|\| currentNode\?\.id === \'stage2\'\) && \(\s*<button[\s\S]*?<ArrowLeft[\s\S]*?</button>\s*\)\}',
    '',
    content
)

# 2. Remove right back buttons
content = re.sub(
    r'\{isStage1Page2 \? \(\s*<button[\s\S]*?<ArrowLeft[\s\S]*?</button>\s*\) : \(!isStage1Page1 && currentNode\?\.id !== \'stage2\'\) && \(\s*<button[\s\S]*?<ArrowLeft[\s\S]*?</button>\s*\)\}',
    '',
    content
)

# 3. Add BackButton helper function to index.jsx
helper = """
  const renderBackButton = () => (
    <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex' }}>
      <button
        onClick={() => {
          if (currentNode.id === 'stage1' && activityView === 'page2') {
            setActivityView('page1');
          } else if (currentFlowIndex > 0) {
            setCurrentFlowIndex(prev => prev - 1);
          } else {
            setShowIntroSpread(true);
          }
        }}
        className="proper-back-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          background: 'white',
          color: '#1e293b',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#f8fafc';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        }}
      >
        <ArrowLeft size={18} /> Back
      </button>
    </div>
  );
"""
# Insert helper after the addXp definition or similar.
# Let's insert it right after `const handleStageComplete = () => { setStageCompleted(true); };`
content = content.replace(
    "const handleStageComplete = () => {\n    setStageCompleted(true);\n  };",
    "const handleStageComplete = () => {\n    setStageCompleted(true);\n  };\n" + helper
)

# 4. Insert the back button in the activity content areas
# For stage2:
stage2_replace = """<currentNode.component
                key={`${currentNode.id}-${resetKey}`}
                {...(currentNode.props || {})}
                onComplete={handleStageComplete}
                addXp={addXp}
              />
              {renderBackButton()}
            </div>"""
content = re.sub(
    r'<currentNode\.component\s*key=\{`\$\{currentNode\.id\}-\$\{resetKey\}`\}\s*\{\.\.\.\(currentNode\.props \|\| \{\}\)\}\s*onComplete=\{handleStageComplete\}\s*addXp=\{addXp\}\s*/>\s*</div>',
    stage2_replace,
    content,
    count=1
)

# For quiz/summary:
quiz_replace = """<currentNode.component 
                key={`${currentNode.id}-${resetKey}`}
                {...(currentNode.props || {})} 
                onComplete={handleStageComplete} 
                addXp={addXp} 
              />
              {renderBackButton()}"""
content = re.sub(
    r'<\s*currentNode\.component\s*key=\{`\$\{currentNode\.id\}-\$\{resetKey\}`\}\s*\{\.\.\.\(currentNode\.props \|\| \{\}\)\}\s*onComplete=\{handleStageComplete\}\s*addXp=\{addXp\}\s*/>(?!\s*</div>)',
    quiz_replace,
    content,
    count=1
)

# For stage1 (page1 and page2):
# We need to insert renderBackButton() at the bottom of the flex columns.
content = content.replace(
    "{/* Left Side: Handbook */}",
    "{/* Left Side: Handbook */}"
) # finding the spot
# Actually, the grid layout:
# <div style={{ display: 'grid', gridTemplateColumns: (currentNode.layout || '1fr 1fr'), gap: '1.5rem', flex: 1, minHeight: 0, padding: '1.5rem' }}>
# Let's just insert it after the grid layout wrapper.
# Wait, for stage1 page1/2 and standard activities, there is a grid wrapper or flex wrapper.

# Let's use string manipulation for standard activity (the one with the grid)
standard_grid = """<div style={{ display: 'grid', gridTemplateColumns: (currentNode.layout || '1fr 1fr'), gap: '1.5rem', flex: 1, minHeight: 0, padding: '1.5rem' }}>
                {/* Left Side: Handbook */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <InvestigationHandbook 
                    highestUnlockedIndex={highestUnlockedIndex}
                    currentFlowIndex={currentFlowIndex}
                    stageCompleted={stageCompleted}
                  />
                  {renderBackButton()}
                </div>"""

content = re.sub(
    r'<div style=\{\{\s*display:\s*\'grid\',\s*gridTemplateColumns:\s*\(currentNode\.layout \|\|\s*\'1fr 1fr\'\),\s*gap:\s*\'1\.5rem\',\s*flex:\s*1,\s*minHeight:\s*0,\s*padding:\s*\'1\.5rem\'\s*\}\}>\s*\{/\*\s*Left Side: Handbook\s*\*/\}\s*<div style=\{\{\s*display:\s*\'flex\',\s*flexDirection:\s*\'column\',\s*minHeight:\s*0\s*\}\}>\s*<InvestigationHandbook\s*highestUnlockedIndex=\{highestUnlockedIndex\}\s*currentFlowIndex=\{currentFlowIndex\}\s*stageCompleted=\{stageCompleted\}\s*/>\s*</div>',
    standard_grid,
    content
)

# For stage1 page 1
stage1p1 = """{isStage1Page1 ? (
                  <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <InvestigationHandbook 
                      highestUnlockedIndex={highestUnlockedIndex}
                      currentFlowIndex={currentFlowIndex}
                      stageCompleted={stageCompleted}
                      fullPageMode={true}
                    />
                    {renderBackButton()}
                  </div>
                )"""
content = re.sub(
    r'\{isStage1Page1 \? \(\s*<div style=\{\{\s*flex:\s*1,\s*minHeight:\s*0,\s*overflow:\s*\'hidden\',\s*display:\s*\'flex\',\s*flexDirection:\s*\'column\'\s*\}\}>\s*<InvestigationHandbook\s*highestUnlockedIndex=\{highestUnlockedIndex\}\s*currentFlowIndex=\{currentFlowIndex\}\s*stageCompleted=\{stageCompleted\}\s*fullPageMode=\{true\}\s*/>\s*</div>\s*\)',
    stage1p1,
    content
)

# For stage1 page 2
stage1p2 = """{/* Right Side: Activity */}
                  <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '4px' }}>
                    <currentNode.component 
                      key={`${currentNode.id}-${resetKey}`}
                      {...(currentNode.props || {})} 
                      onComplete={handleStageComplete} 
                      addXp={addXp} 
                    />
                    {renderBackButton()}
                  </div>"""
content = re.sub(
    r'\{/\*\s*Right Side: Activity\s*\*/\}\s*<div style=\{\{\s*flex:\s*1,\s*minHeight:\s*0,\s*position:\s*\'relative\',\s*display:\s*\'flex\',\s*flexDirection:\s*\'column\',\s*overflowY:\s*\'auto\',\s*paddingRight:\s*\'4px\'\s*\}\}>\s*<currentNode\.component\s*key=\{`\$\{currentNode\.id\}-\$\{resetKey\}`\}\s*\{\.\.\.\(currentNode\.props \|\| \{\}\)\}\s*onComplete=\{handleStageComplete\}\s*addXp=\{addXp\}\s*/>\s*</div>',
    stage1p2,
    content
)

# Save
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MaterialsAroundUs/index.jsx")
