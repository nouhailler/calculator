// Variables de la calculatrice
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

// Mémoire
let memoryValue = 0;

// Historique des calculs
let history = [];

const currentOperandElement = document.getElementById('current-operand');
const previousOperandElement = document.getElementById('previous-operand');
const historyContent = document.getElementById('historyContent');
const historyPanel = document.getElementById('historyPanel');
const buttons = document.getElementById('buttons');
const memoryDisplay = document.getElementById('memoryDisplay');
const memoryIndicator = document.getElementById('memoryIndicator');
const memoryValueElement = document.getElementById('memoryValue');

// Charger l'historique depuis localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

// Charger la mémoire depuis localStorage
function loadMemory() {
    const savedMemory = localStorage.getItem('calculatorMemory');
    if (savedMemory) {
        memoryValue = parseFloat(savedMemory);
        updateMemoryDisplay();
    }
}

// Sauvegarder l'historique dans localStorage
function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// Sauvegarder la mémoire dans localStorage
function saveMemory() {
    localStorage.setItem('calculatorMemory', memoryValue.toString());
}

// Mettre à jour l'affichage de la mémoire
function updateMemoryDisplay() {
    if (memoryValue !== 0) {
        memoryIndicator.textContent = 'M';
        memoryValueElement.textContent = memoryValue.toString();
        memoryDisplay.style.display = 'flex';
    } else {
        memoryDisplay.style.display = 'none';
    }
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
        case '%':
            computation = prev % current;
            break;
        case '^':
            computation = Math.pow(prev, current);
            expression = `${previousOperand}^${currentOperand}`;
            break;
        default:
            return;
    }
    
    // Formater le résultat
    let result = formatResult(computation);
    
    // Ajouter à l'historique
    addToHistory(expression, result);
    
    currentOperand = result;
    operation = undefined;
    previousOperand = '';
    resetScreen = true;
    updateDisplay();
}

// Formater le résultat
function formatResult(value) {
    if (isNaN(value) || !isFinite(value)) {
        return 'Erreur';
    }
    
    if (Number.isInteger(value)) {
        return value.toString();
    } else {
        let result = value.toString();
        // Limiter les décimales
        if (result.length > 12) {
            result = parseFloat(result).toFixed(8).toString();
        }
        return result;
    }
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

// Changer le signe
function toggleSign() {
    if (currentOperand === '0') return;
    if (currentOperand.startsWith('-')) {
        currentOperand = currentOperand.slice(1);
    } else {
        currentOperand = '-' + currentOperand;
    }
    updateDisplay();
}

// Pourcentage
function percentage() {
    if (currentOperand === '') return;
    const value = parseFloat(currentOperand) / 100;
    currentOperand = formatResult(value);
    updateDisplay();
}

// Fonctions scientifiques
function scientificFunction(func) {
    let value = parseFloat(currentOperand);
    let result;
    let expression = func + '(' + currentOperand + ')';
    
    switch (func) {
        case 'sin':
            result = Math.sin(value * Math.PI / 180);
            expression = 'sin(' + currentOperand + ')';
            break;
        case 'cos':
            result = Math.cos(value * Math.PI / 180);
            expression = 'cos(' + currentOperand + ')';
            break;
        case 'tan':
            result = Math.tan(value * Math.PI / 180);
            expression = 'tan(' + currentOperand + ')';
            break;
        case 'pi':
            result = Math.PI;
            expression = 'π';
            break;
        case 'e':
            result = Math.E;
            expression = 'e';
            break;
        case 'log':
            result = Math.log10(value);
            expression = 'log(' + currentOperand + ')';
            break;
        case 'ln':
            result = Math.log(value);
            expression = 'ln(' + currentOperand + ')';
            break;
        case 'sqrt':
            result = Math.sqrt(value);
            expression = '√(' + currentOperand + ')';
            break;
        case 'square':
            result = value * value;
            expression = currentOperand + '²';
            break;
        case 'power':
            // Attendre la prochaine entrée pour l'exposant
            operation = '^';
            previousOperand = currentOperand;
            currentOperand = '';
            updateDisplay();
            return;
        case 'factorial':
            result = factorial(value);
            expression = currentOperand + '!';
            break;
        case '10pow':
            result = Math.pow(10, value);
            expression = '10^(' + currentOperand + ')';
            break;
        case 'inverse':
            result = 1 / value;
            expression = '1/(' + currentOperand + ')';
            break;
        case 'exp':
            result = Math.exp(value);
            expression = 'e^(' + currentOperand + ')';
            break;
        default:
            return;
    }
    
    currentOperand = formatResult(result);
    resetScreen = true;
    updateDisplay();
    
    // Ajouter à l'historique
    addToHistory(expression, currentOperand);
}

// Calcul de factorielle
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Fonctions mémoire
function memoryClear() {
    memoryValue = 0;
    saveMemory();
    updateMemoryDisplay();
}

function memoryRecall() {
    currentOperand = memoryValue.toString();
    resetScreen = true;
    updateDisplay();
}

function memoryAdd() {
    const value = parseFloat(currentOperand);
    if (!isNaN(value)) {
        memoryValue += value;
        saveMemory();
        updateMemoryDisplay();
    }
}

function memorySubtract() {
    const value = parseFloat(currentOperand);
    if (!isNaN(value)) {
        memoryValue -= value;
        saveMemory();
        updateMemoryDisplay();
    }
}

// Changer la taille des boutons
function changeButtonSize() {
    const sizeSelect = document.getElementById('buttonSize');
    const size = sizeSelect ? sizeSelect.value : 'medium';
    
    // Retirer toutes les classes de taille
    buttons.classList.remove('small', 'medium', 'large');
    
    // Appliquer aux boutons principaux
    if (size === 'small' || size === 'medium' || size === 'large') {
        buttons.classList.add(size);
    }
    
    // Appliquer aussi aux boutons scientifiques
    const scientificButtons = document.querySelectorAll('.scientific-buttons');
    scientificButtons.forEach(btnGroup => {
        btnGroup.classList.remove('small', 'medium', 'large');
        if (size === 'small' || size === 'medium' || size === 'large') {
            btnGroup.classList.add(size);
        }
    });
    
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
    loadMemory();
    loadPreferences();
    updateMemoryDisplay();
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
    } else if (e.key === 'm' || e.key === 'M') {
        memoryAdd();
    } else if (e.key === 'r' || e.key === 'R') {
        memoryRecall();
    } else if (e.key === 'c' || e.key === 'C') {
        memoryClear();
    } else if (e.key === 'p' || e.key === 'P') {
        toggleSign();
    } else if (e.key === '%') {
        percentage();
    } else if (e.key === 's' || e.key === 'S') {
        scientificFunction('sin');
    } else if (e.key === 'o' || e.key === 'O') {
        scientificFunction('cos');
    } else if (e.key === 't' || e.key === 'T') {
        scientificFunction('tan');
    } else if (e.key === 'q' || e.key === 'Q') {
        scientificFunction('sqrt');
    } else if (e.key === 'l' || e.key === 'L') {
        scientificFunction('log');
    } else if (e.key === 'n' || e.key === 'N') {
        scientificFunction('ln');
    }
});
