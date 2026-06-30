const display = document.getElementById('display');
const historyEl = document.getElementById('history');
const keys = document.querySelector('.keys');

let current = '0';        // value currently shown
let previous = null;      // stored left-hand operand
let operator = null;      // pending operator
let justEvaluated = false; // true right after pressing "="

function updateScreen(){
  display.textContent = formatForDisplay(current);
  historyEl.textContent = previous !== null
    ? `${formatForDisplay(previous)} ${operator ?? ''}`
    : '\u00A0'; // non-breaking space keeps the line height stable
}

function formatForDisplay(value){
  const num = Number(value);
  if (Number.isNaN(num)) return 'Error';
  if (!isFinite(num)) return 'Error';
  // keep user-typed trailing decimal point/zeros intact
  if (typeof value === 'string' && (value.endsWith('.') )) return value;
  const str = num.toString();
  if (str.length > 12) return num.toExponential(5);
  return str;
}

function inputDigit(digit){
  if (justEvaluated){
    current = digit;
    justEvaluated = false;
    return;
  }
  current = current === '0' ? digit : current + digit;
}

function inputDecimal(){
  if (justEvaluated){
    current = '0.';
    justEvaluated = false;
    return;
  }
  if (!current.includes('.')) current += '.';
}

function chooseOperator(nextOperator){
  if (operator && previous !== null && !justEvaluated){
    current = String(compute(previous, current, operator));
  }
  previous = Number(current);
  operator = nextOperator;
  current = '0';
  justEvaluated = false;
}

function compute(a, b, op){
  switch(op){
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function equals(){
  if (operator === null || previous === null) return;
  const result = compute(previous, Number(current), operator);
  historyEl.textContent = `${formatForDisplay(previous)} ${operator} ${formatForDisplay(current)} =`;
  current = String(result);
  previous = null;
  operator = null;
  justEvaluated = true;
  display.textContent = formatForDisplay(current);
  return; // skip the normal updateScreen so the full equation stays visible briefly
}

function clearAll(){
  current = '0';
  previous = null;
  operator = null;
  justEvaluated = false;
}

function negate(){
  if (current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
}

function percent(){
  current = String(Number(current) / 100);
}

function flashKey(button){
  if (!button) return;
  button.classList.add('is-pressed');
  setTimeout(() => button.classList.remove('is-pressed'), 100);
}

function pressByValue(selector){
  const btn = keys.querySelector(selector);
  flashKey(btn);
}

// click / tap handling
keys.addEventListener('click', (e) => {
  const button = e.target.closest('.key');
  if (!button) return;
  const { action, value } = button.dataset;

  switch(action){
    case 'num': inputDigit(value); break;
    case 'decimal': inputDecimal(); break;
    case 'op': chooseOperator(value); break;
    case 'equals': equals(); break;
    case 'clear': clearAll(); break;
    case 'negate': negate(); break;
    case 'percent': percent(); break;
  }

  if (action !== 'equals') updateScreen();
});

// keyboard support
window.addEventListener('keydown', (e) => {
  const { key } = e;

  if (/^[0-9]$/.test(key)){
    inputDigit(key);
    pressByValue(`[data-action="num"][data-value="${key}"]`);
    updateScreen();
    return;
  }

  const opMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  if (opMap[key]){
    e.preventDefault();
    chooseOperator(opMap[key]);
    pressByValue(`[data-action="op"][data-value="${opMap[key]}"]`);
    updateScreen();
    return;
  }

  if (key === '.'){
    inputDecimal();
    pressByValue('[data-action="decimal"]');
    updateScreen();
    return;
  }

  if (key === 'Enter' || key === '='){
    e.preventDefault();
    pressByValue('[data-action="equals"]');
    equals();
    return;
  }

  if (key === 'Backspace'){
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateScreen();
    return;
  }

  if (key === 'Escape'){
    clearAll();
    pressByValue('[data-action="clear"]');
    updateScreen();
    return;
  }

  if (key === '%'){
    percent();
    pressByValue('[data-action="percent"]');
    updateScreen();
  }
});

updateScreen();
