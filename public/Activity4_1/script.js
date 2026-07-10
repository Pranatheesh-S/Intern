const ITEMS = [
    { id: 'wooden_block', name: 'Wooden block', material: 'Wood', magnetic: false, emoji: '🪵' },
    { id: 'iron_nail', name: 'Iron nail', material: 'Iron', magnetic: true, emoji: '🔨' },
    { id: 'steel_screw', name: 'Steel screw', material: 'Steel', magnetic: true, emoji: '🔩' },
    { id: 'rubber_eraser', name: 'Rubber eraser', material: 'Rubber', magnetic: false, emoji: '🧽' },
    { id: 'paper_clip', name: 'Paper clip', material: 'Steel', magnetic: true, emoji: '📎' },
    { id: 'copper_wire', name: 'Copper wire', material: 'Copper', magnetic: false, emoji: '🪢' },
    { id: 'iron_key', name: 'Iron key', material: 'Iron', magnetic: true, emoji: '🔑' },
    { id: 'plastic_sharpener', name: 'Plastic sharpener', material: 'Plastic', magnetic: false, emoji: '✏️' },
    { id: 'iron_pins', name: 'Iron pins', material: 'Iron', magnetic: true, emoji: '📍' },
    { id: 'matchbox', name: 'Matchbox', material: 'Cardboard', magnetic: false, emoji: '🪔' },
    { id: 'marker', name: 'Marker', material: 'Plastic', magnetic: false, emoji: '🖍️' },
    { id: 'glass', name: 'Glass', material: 'Glass', magnetic: false, emoji: '🥛' },
    { id: 'scissors', name: 'Scissors', material: 'Steel', magnetic: true, emoji: '✂️' },
    { id: 'plastic_syringe', name: 'Plastic syringe', material: 'Plastic', magnetic: false, emoji: '💉' },
    { id: 'plastic_ruler', name: 'Plastic ruler', material: 'Plastic', magnetic: false, emoji: '📏' },
    { id: 'metal_stapler', name: 'Metal stapler', material: 'Steel', magnetic: true, emoji: '🖇️' },
    { id: 'pencil', name: 'Pencil', material: 'Wood', magnetic: false, emoji: '✏️' },
    { id: 'cloth', name: 'Cloth', material: 'Fabric', magnetic: false, emoji: '👕' }
];

let state = {
    predictions: {}, // id -> 'magnetic' | 'non-magnetic'
    testedCount: 0,
    items: [] // Will hold shuffled items
};

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playClickSound() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function shuffle(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

const phases = {
    instructions: document.getElementById('phase-instructions'),
    prediction: document.getElementById('phase-prediction'),
    workspace: document.getElementById('phase-workspace'),
    results: document.getElementById('phase-results')
};

document.addEventListener('DOMContentLoaded', () => {
    initPrediction();
    switchPhase('prediction');
});

function switchPhase(phaseName) {
    Object.values(phases).forEach(p => p.classList.add('hidden'));
    phases[phaseName].classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Phase 1: Instructions
function initInstructions() {
    const steps = document.querySelectorAll('.step');
    let delay = 300;
    
    // Reset any previous state for retry
    steps.forEach(step => step.classList.remove('visible'));
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('visible');
        }, delay);
        delay += 500;
    });

    const btnStartPred = document.getElementById('btn-start-prediction');
    // Ensure we don't duplicate event listeners on retry
    const newBtn = btnStartPred.cloneNode(true);
    btnStartPred.parentNode.replaceChild(newBtn, btnStartPred);
    
    newBtn.addEventListener('click', () => {
        initPrediction();
        switchPhase('prediction');
    });
}

// Phase 2: Prediction
function initPrediction() {
    const tbody = document.getElementById('prediction-body');
    tbody.innerHTML = '';
    
    state.predictions = {};
    
    const btnStartExp = document.getElementById('btn-start-experiment');
    btnStartExp.disabled = true;
    
    ITEMS.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="object-cell">
                    <div class="emoji-icon">${item.emoji}</div>
                    <span>${item.name}</span>
                </div>
            </td>
            <td>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="pred_${item.id}" value="magnetic"> Magnetic
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="pred_${item.id}" value="non-magnetic"> Not Magnetic
                    </label>
                </div>
            </td>
        `;
        tbody.appendChild(tr);

        const radios = tr.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.predictions[item.id] = e.target.value;
                checkPredictionsComplete();
            });
        });
    });

    const newBtn = btnStartExp.cloneNode(true);
    btnStartExp.parentNode.replaceChild(newBtn, btnStartExp);
    
    newBtn.addEventListener('click', () => {
        initWorkspace();
        switchPhase('workspace');
    });
}

function checkPredictionsComplete() {
    const keys = Object.keys(state.predictions);
    const btn = document.getElementById('btn-start-experiment');
    if (keys.length === ITEMS.length) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// Phase 3: Workspace
let draggingClone = null;
let originalCard = null;
let offsetX = 0;
let offsetY = 0;

function initWorkspace() {
    const grid = document.getElementById('objects-grid');
    grid.innerHTML = '';
    state.testedCount = 0;
    
    state.items = shuffle(ITEMS);
    
    state.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'object-card';
        div.dataset.id = item.id;
        div.dataset.magnetic = item.magnetic;
        div.innerHTML = `
            <div class="icon-container">
                <div class="emoji-display">${item.emoji}</div>
            </div>
            <div class="name">${item.name}</div>
        `;
        grid.appendChild(div);
    });

    const btnViewResults = document.getElementById('btn-view-results');
    btnViewResults.classList.add('hidden');
    
    if(!window.dragInitialized) {
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
        window.dragInitialized = true;
        
        document.body.addEventListener('pointerdown', () => {
            if(audioCtx.state === 'suspended') audioCtx.resume();
        }, {once:true});
    }
    
    const newBtnViewResults = btnViewResults.cloneNode(true);
    btnViewResults.parentNode.replaceChild(newBtnViewResults, btnViewResults);
    newBtnViewResults.addEventListener('click', () => {
        initResults();
        switchPhase('results');
    });
}

function onPointerDown(e) {
    if(phases.workspace.classList.contains('hidden')) return;
    
    const card = e.target.closest('.object-card');
    if (!card || card.classList.contains('tested') || card.classList.contains('being-dragged')) return;
    
    e.preventDefault();
    originalCard = card;
    
    const rect = originalCard.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    draggingClone = originalCard.cloneNode(true);
    draggingClone.classList.add('clone-card');
    document.body.appendChild(draggingClone);
    
    draggingClone.style.position = 'fixed';
    draggingClone.style.left = `${rect.left}px`;
    draggingClone.style.top = `${rect.top}px`;
    draggingClone.style.width = `${rect.width}px`;
    draggingClone.style.height = `${rect.height}px`;
    draggingClone.style.zIndex = '9999';
    draggingClone.style.margin = '0';
    draggingClone.style.pointerEvents = 'none';
    
    originalCard.classList.add('being-dragged');
}

function onPointerMove(e) {
    if (!draggingClone) return;
    draggingClone.style.left = `${e.clientX - offsetX}px`;
    draggingClone.style.top = `${e.clientY - offsetY}px`;
}

function onPointerUp(e) {
    if (!draggingClone) return;
    
    const isMagnetic = originalCard.dataset.magnetic === 'true';
    const clone = draggingClone;
    const origin = originalCard;
    
    draggingClone = null;
    originalCard = null;
    
    const magnet = document.getElementById('magnet');
    const magnetRect = magnet.getBoundingClientRect();
    const cloneRect = clone.getBoundingClientRect();
    
    const cloneCenter = {
        x: cloneRect.left + cloneRect.width/2,
        y: cloneRect.top + cloneRect.height/2
    };
    
    const magnetCenter = {
        x: magnetRect.left + magnetRect.width/2,
        y: magnetRect.top + magnetRect.height/2
    };
    
    const dist = Math.hypot(cloneCenter.x - magnetCenter.x, cloneCenter.y - magnetCenter.y);
    
    if (dist < 220) {
        origin.classList.remove('being-dragged');
        origin.style.display = 'none'; // Completely hide from tray so others flow up
        origin.classList.add('tested');
        state.testedCount++;
        
        if (isMagnetic) {
            playClickSound();
            clone.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            clone.style.left = `${magnetCenter.x - cloneRect.width/2}px`;
            clone.style.top = `${magnetRect.bottom - cloneRect.height}px`;
            
            clone.classList.add('glow-green', 'vibrate');
            
            setTimeout(() => {
                clone.classList.remove('vibrate');
            }, 600);
            
        } else {
            clone.style.transition = 'all 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
            clone.classList.add('shake-drop');
            clone.style.top = `${window.innerHeight + 200}px`;
            clone.style.transform = `rotate(${Math.random() * 90 - 45}deg)`;
            
            setTimeout(() => {
                clone.remove();
            }, 600);
        }
        
        checkExperimentComplete();
    } else {
        const returnRect = origin.getBoundingClientRect();
        clone.style.transition = 'all 0.3s ease-out';
        clone.style.left = `${returnRect.left}px`;
        clone.style.top = `${returnRect.top}px`;
        
        setTimeout(() => {
            clone.remove();
            origin.classList.remove('being-dragged');
        }, 300);
    }
}

function checkExperimentComplete() {
    if (state.testedCount === ITEMS.length) {
        document.getElementById('btn-view-results').classList.remove('hidden');
    }
}

// Phase 4: Results
function initResults() {
    // Remove any remaining stuck magnetic items from the screen
    document.querySelectorAll('.clone-card').forEach(el => el.remove());

    const tbody = document.getElementById('results-body');
    tbody.innerHTML = '';
    
    ITEMS.forEach(item => {
        const predStr = state.predictions[item.id];
        const isPredMagnetic = predStr === 'magnetic';
        const actual = item.magnetic;
        const isCorrect = isPredMagnetic === actual;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="object-cell">
                    <div class="emoji-icon">${item.emoji}</div>
                    <span>${item.name}</span>
                </div>
            </td>
            <td><span class="${isPredMagnetic ? 'pill-magnetic' : 'pill-non-magnetic'}">${isPredMagnetic ? 'Magnetic' : 'Not Magnetic'}</span></td>
            <td><span class="${actual ? 'pill-magnetic' : 'pill-non-magnetic'}">${actual ? 'Magnetic' : 'Not Magnetic'}</span></td>
            <td class="${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '✔ Correct' : '✖ Incorrect'}
            </td>
        `;
        tbody.appendChild(tr);
    });

    const btnRetry = document.getElementById('btn-retry');
    const newBtnRetry = btnRetry.cloneNode(true);
    btnRetry.parentNode.replaceChild(newBtnRetry, btnRetry);
    
    newBtnRetry.addEventListener('click', () => {
        document.querySelectorAll('.clone-card').forEach(el => el.remove());
        
        initPrediction();
        switchPhase('prediction');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
