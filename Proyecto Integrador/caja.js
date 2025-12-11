// caja.js - lógica de la Caja Fuerte
// Nota: la variable requerida por la consigna se llama exactamente `contadorIntentos`
let contadorIntentos = 0;
let savedCode = null;
let locked = false;

document.addEventListener('DOMContentLoaded', () => {
  const secretInput = document.getElementById('secretCode');
  const attemptsInput = document.getElementById('maxAttempts');
  const saveBtn = document.getElementById('saveBtn');

  const tryInput = document.getElementById('tryCode');
  const validateBtn = document.getElementById('validateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusP = document.getElementById('status');

  function setStatus(msg, isError = false) {
    statusP.textContent = msg;
    statusP.style.color = isError ? 'crimson' : '';
  }

  function lockSetup() {
    secretInput.disabled = true;
    attemptsInput.disabled = true;
    saveBtn.disabled = true;
    locked = true;
    document.querySelector('.card').classList.add('locked');
  }

  function unlockSetup() {
    secretInput.disabled = false;
    attemptsInput.disabled = false;
    saveBtn.disabled = false;
    locked = false;
    document.querySelector('.card').classList.remove('locked');
  }

  // GUARDAR
  saveBtn.addEventListener('click', () => {
    const code = (secretInput.value || '').trim();
    const attempts = parseInt(attemptsInput.value, 10);

    // Validaciones: código debe ser 4 dígitos numéricos; intentos entre 1 y 5
    if (!/^\d{4}$/.test(code)) {
      setStatus('El código debe tener exactamente 4 dígitos numéricos.', true);
      return;
    }
    if (isNaN(attempts) || attempts < 1 || attempts > 5) {
      setStatus('La cantidad de intentos debe estar entre 1 y 5.', true);
      return;
    }

    savedCode = code;
    contadorIntentos = attempts;
    lockSetup();
    setStatus(`Código guardado. Intentos disponibles: ${contadorIntentos}`);
    console.log(`Programador: código guardado (${savedCode}), intentos = ${contadorIntentos}`);
  });

  // VALIDAR CÓDIGO
  validateBtn.addEventListener('click', () => {
    if (!savedCode) {
      setStatus('Aún no se ha configurado un código. Usa GUARDAR primero.', true);
      return;
    }
    if (contadorIntentos <= 0) {
      setStatus('Intentos agotados. Acceso bloqueado.', true);
      return;
    }

    const attempt = (tryInput.value || '').trim();
    if (!/^\d{4}$/.test(attempt)) {
      setStatus('Ingresa un código de 4 dígitos.', true);
      return;
    }

    if (attempt === savedCode) {
      // acceso concedido (simular un pequeño delay)
      setStatus('Acceso concedido. ¡Bienvenido!');
      console.log(`Acceso concedido con el código correcto.`);
      // opcional: deshabilitar validar si quieres
      validateBtn.disabled = true;
    } else {
      // código inválido: descontar intento, informar en consola
      contadorIntentos -= 1;
      console.warn(`Programador: intento inválido. Quedan ${contadorIntentos} intentos.`);
      if (contadorIntentos > 0) {
        setStatus(`Código inválido. Intentos restantes: ${contadorIntentos}`, true);
      } else {
        setStatus('Intentos agotados. Acceso bloqueado.', true);
        console.error('Programador: Se han agotado los intentos.');
        // bloquear validar
        validateBtn.disabled = true;
      }
    }
  });

  // RESET: limpia configuración y permite volver a guardar
  resetBtn.addEventListener('click', () => {
    savedCode = null;
    contadorIntentos = 0;
    secretInput.value = '';
    attemptsInput.value = '3';
    tryInput.value = '';
    validateBtn.disabled = false;
    unlockSetup();
    setStatus('Configuración reiniciada.');
    console.log('Programador: configuración reiniciada.');
  });
});