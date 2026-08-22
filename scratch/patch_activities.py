import re
filepath = r'c:\Users\GANES\Futura-Edtech\src\activities\MaterialsAroundUs\index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove left back button
content = re.sub(
    r'\{\(currentNode\.type !== \'mission\' && currentNode\.id !== \'stage1\'\) && \(\s*<button[\s\S]*?<ArrowLeft[\s\S]*?</button>\s*\)\}',
    '',
    content
)

# 2. Remove right back buttons
content = re.sub(
    r'\{currentNode\.id === \'stage1\' && activityView === \'page2\' && \(\s*<button[\s\S]*?<ArrowLeft[\s\S]*?</button>\s*\)\}',
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
content = content.replace(
    "const handleStageComplete = () => {\n    setStageCompleted(true);\n  };",
    "const handleStageComplete = () => {\n    setStageCompleted(true);\n  };\n" + helper
)

# 4. Insert the back button in the activity content areas
# For quiz/summary:
quiz_replace = """<currentNode.component
                key={`${currentNode.id}-${resetKey}`}
                {...(currentNode.props || {})}
                onComplete={handleStageComplete}
                addXp={addXp}
              />
              {renderBackButton()}"""
content = re.sub(
    r'<\s*currentNode\.component\s*key=\{`\$\{currentNode\.id\}-\$\{resetKey\}`\}\s*\{\.\.\.\(currentNode\.props \|\| \{\}\)\}\s*onComplete=\{handleStageComplete\}\s*addXp=\{addXp\}\s*/>',
    quiz_replace,
    content
)

# For Handbook:
# We just append it to the Handbook container
handbook_replace = """<InvestigationHandbook
                      highestUnlockedIndex={highestUnlockedIndex}
                      currentFlowIndex={currentFlowIndex}
                      stageCompleted={stageCompleted}
                      fullPageMode={currentNode.id === 'stage1' && activityView === 'page1'}
                    />
                    {renderBackButton()}"""
content = re.sub(
    r'<InvestigationHandbook\s*highestUnlockedIndex=\{highestUnlockedIndex\}\s*currentFlowIndex=\{currentFlowIndex\}\s*stageCompleted=\{stageCompleted\}\s*fullPageMode=\{currentNode\.id === \'stage1\' && activityView === \'page1\'\}\s*/>',
    handbook_replace,
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated activities/MaterialsAroundUs/index.jsx")
