// Variables de la calculatrice
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

// Historique des calculs
let history = [];

const currentOperandElement = document.getElementById('current-operand');
const previousOperandElement = document.getElementById('previous-operand');
const historyContent = document.getElementById('historyContent');
const historyPanel = document.getElementById('historyPanel');
const buttons = document.getElementById('buttons');

// Charger l'historique depuis localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

// Sauvegarder l'historique dans localStorage
function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// Mettre à jour l'affichage de l'historique
function updateHistoryDisplay() {
    if (history.length === 0) {
        historyContent.innerHTML = '<p class="history-empty">Aucun calcul dans l\'historique</p>';
        return;
    }
    
    historyContent.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="useHistoryItem(${index})">
            <span class="expression">${item.expression}</span>
            <span class="result">= ${item.result}</span>
        </div>
    `).join('');
}

// Utiliser un élément de l'historique
function useHistoryItem(index) {
    const item = history[index];
    currentOperand = item.result.toString();
    previousOperand = '';
    operation = undefined;
    resetScreen = true;
    updateDisplay();
    toggleHistory();
}

// Effacer l'historique
function clearHistory() {
    history = [];
    saveHistory();
    updateHistoryDisplay();
}

// Ajouter à l'historique
function addToHistory(expression, result) {
    history.unshift({
        expression: expression,
        result: result,
        timestamp: new Date().toISOString()
    });
    
    // Limiter à 20 entrées
    if (history.length > 20) {
        history.pop();
    }
    
    saveHistory();
    updateHistoryDisplay();
}

// Afficher/Masquer l'historique
function toggleHistory() {
    historyPanel.classList.toggle('show');
}

function updateDisplay() {
    currentOperandElement.innerText = currentOperand;
    if (operation != null) {
        previousOperandElement.innerText = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.innerText = previousOperand;
    }
}

function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    
    if (number === '.' && currentOperand.includes('.')) return;
    
    currentOperand += number;
    updateDisplay();
}

function appendOperator(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculate();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function calculate() {
    if (operation === undefined || currentOperand === '') return;
    
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let expression = `${previousOperand} ${operation} ${currentOperand}`;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }
    
    // Formater le résultat
    let result = computation;
    if (Number.isInteger(computation)) {
        result = computation.toString();
    } else {
        result = computation.toString();
        // Limiter les décimales
        if (result.length > 10) {
            result = parseFloat(result).toFixed(6).toString();
        }
    }
    
    // Ajouter à l'historique
    addToHistory(expression, result);
    
    currentOperand = result;
    operation = undefined;
    previousOperand = '';
    resetScreen = true;
    updateDisplay();
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteLast() {
    if (currentOperand === '0') return;
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// Changer la taille des boutons
function changeButtonSize() {
    const sizeSelect = document.getElementById('buttonSize');
    const size = sizeSelect ? sizeSelect.value : 'medium';
    
    // Retirer toutes les classes de taille
    buttons.classList.remove('small', 'medium', 'large');
    
    // Ajouter la classe correspondante
    if (size === 'small' || size === 'medium' || size === 'large') {
        buttons.classList.add(size);
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('buttonSize', size);
}

// Changer le thème de couleurs
function changeColorTheme() {
    const themeSelect = document.getElementById('colorTheme');
    const theme = themeSelect ? themeSelect.value : 'default';
    
    // Retirer tous les thèmes
    document.body.classList.remove('default-theme', 'light-theme', 'dark-theme', 'colorful-theme', 'monochrome-theme');
    
    // Ajouter le thème sélectionné
    if (theme) {
        document.body.classList.add(theme + '-theme');
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('colorTheme', theme);
}

// Charger les préférences sauvegardées
function loadPreferences() {
    const savedSize = localStorage.getItem('buttonSize') || 'medium';
    const savedTheme = localStorage.getItem('colorTheme') || 'default';
    
    // Appliquer la taille
    const sizeSelect = document.getElementById('buttonSize');
    if (sizeSelect) {
        sizeSelect.value = savedSize;
        changeButtonSize();
    }
    
    // Appliquer le thème
    const themeSelect = document.getElementById('colorTheme');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        changeColorTheme();
    }
}

// Initialisation
function init() {
    updateDisplay();
    loadHistory();
    loadPreferences();
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Gestion du clavier
window.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key === 'h' || e.key === 'H') {
        toggleHistory();
    }
});
