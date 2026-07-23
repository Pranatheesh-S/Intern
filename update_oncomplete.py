import os

def update_index(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update export default function ActivityName({ onBackToDashboard }) to include onComplete
    if '{ onBackToDashboard }' in content:
        content = content.replace('{ onBackToDashboard }', '{ onBackToDashboard, onComplete }')
    
    # 2. Find handleQuizComplete or similar and add onComplete
    for handler in ['handleQuizComplete', 'handleStage4Complete']:
        if f'const {handler} = () => {{\n    setProgress(prev => ({{ ...prev, quiz: true }}));\n' in content:
            content = content.replace(f'const {handler} = () => {{\n    setProgress(prev => ({{ ...prev, quiz: true }}));\n', 
                                      f'const {handler} = () => {{\n    setProgress(prev => ({{ ...prev, quiz: true }}));\n    if (onComplete) onComplete();\n')
            break
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def update_challenge(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove onComplete() from handleNext
    if 'setIsFinished(true);\n      onComplete();' in content:
        content = content.replace('setIsFinished(true);\n      onComplete();', 'setIsFinished(true);')
        
    # Add continue button
    try_again_btn = """<button onClick={resetChallenge} className="outline" style={{ padding: '0.75rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RotateCcw size={18} /> Try Again
        </button>"""
        
    new_buttons = """<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={resetChallenge} className="outline" style={{ padding: '0.75rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={18} /> Try Again
          </button>
          {onComplete && (
            <button onClick={onComplete} className="primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Continue to Next Part <ArrowRight size={18} />
            </button>
          )}
        </div>"""
        
    if try_again_btn in content:
        content = content.replace(try_again_btn, new_buttons)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Update the files
activities = ['MagneticPoles', 'SuspendedMagnet', 'MagneticCompass', 'MagnetInteraction']
for act in activities:
    update_index(f'src/activities/{act}/index.jsx')

# Activity4_6 and 4_7 use ChallengeMode
for act in ['Activity4_6', 'Activity4_7']:
    update_index(f'src/activities/{act}/index.jsx')
    update_challenge(f'src/activities/{act}/ChallengeMode.jsx')
