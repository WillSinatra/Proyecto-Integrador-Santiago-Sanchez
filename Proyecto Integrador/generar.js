// generar.js - Validación y generación de contraseñas (mejorado)

/**
 * chequearLongitud: (same rules as before)
 */
function chequearLongitud(longitud) {
  if (longitud === undefined || longitud === null || longitud === '') {
    return "debe ingresar la longitud";
  }
  if (typeof longitud !== 'string') {
    return "La longitud recibida no es válida";
  }
  const num = parseInt(longitud, 10);
  if (isNaN(num)) return "La longitud recibida no es válida";
  if (num < 3) return "La longitud debe ser mayor o igual a 3";
  if (num > 10) return "La longitud debe ser menor o igual a 10";
  return longitud;
}

/**
 * generarContrasena:
 * - Asegura incluir al menos 1 caracter de cada tipo seleccionado.
 * - Evita repetir código usando un array de "checks" y un bucle.
 */
function generarContrasena(longitud, especiales, numeros, mayusculas) {
  // validar longitud (chequearLongitud recibe string)
  const validacion = chequearLongitud(String(longitud));
  if (isNaN(parseInt(validacion, 10))) {
    return validacion;
  }
  const len = parseInt(validacion, 10);

  const pools = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    special: '!@#$%^&*()_+-=[]{}|;:,.<>/?`~'
  };

  // Construir pool total
  let poolTotal = pools.lower;
  if (mayusculas === true) poolTotal += pools.upper;
  if (numeros === true) poolTotal += pools.numbers;
  if (especiales === true) poolTotal += pools.special;

  // Si, por alguna razón, no hay pool (no debería pasar), usar minúsculas
  if (!poolTotal) poolTotal = pools.lower;

  // array para forzar al menos 1 caracter por opción seleccionada
  const requiredChars = [];

  // Construimos un array de checks con su pool y condición
  const options = [
    { enabled: mayusculas === true, pool: pools.upper },
    { enabled: numeros === true, pool: pools.numbers },
    { enabled: especiales === true, pool: pools.special }
  ];

  // Si la longitud es menor que la cantidad de opciones activas, no podemos asegurar una por cada una
  const activeOptionsCount = options.reduce((acc, o) => acc + (o.enabled ? 1 : 0), 0);
  if (len < activeOptionsCount) {
    // Retornamos un mensaje apropiado
    return `La longitud debe ser mayor o igual a ${activeOptionsCount}`;
  }

  // Usar Web Crypto cuando esté disponible
  function secureRandomInt(max) {
    if (window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      return arr[0] % max;
    } else {
      return Math.floor(Math.random() * max);
    }
  }

  // Añadir 1 caracter de cada tipo seleccionado (evita código repetido con loop)
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    if (opt.enabled) {
      const p = opt.pool;
      const idx = secureRandomInt(p.length);
      requiredChars.push(p[idx]);
    }
  }

  // Rellenar el resto de la contraseña desde poolTotal
  const remaining = len - requiredChars.length;
  const generated = [];
  for (let i = 0; i < remaining; i++) {
    const idx = secureRandomInt(poolTotal.length);
    generated.push(poolTotal[idx]);
  }

  // Unir requiredChars + generated y barajar para no dejar los required al inicio
  const allChars = requiredChars.concat(generated);

  // Fisher-Yates shuffle
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const tmp = allChars[i];
    allChars[i] = allChars[j];
    allChars[j] = tmp;
  }

  return allChars.join('');
}

/* DOM integration (si está presente el formulario) */
document.addEventListener('DOMContentLoaded', function () {
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const resultInput = document.getElementById('result');
  if (generateBtn) {
    generateBtn.addEventListener('click', function () {
      const lengthInput = document.getElementById('length');
      const specialCheckbox = document.getElementById('special');
      const numbersCheckbox = document.getElementById('numbers');
      const uppercaseCheckbox = document.getElementById('uppercase');

      const longitud = parseInt(lengthInput.value, 10) || 12;
      const especiales = !!(specialCheckbox && specialCheckbox.checked);
      const numeros = !!(numbersCheckbox && numbersCheckbox.checked);
      const mayusculas = !!(uppercaseCheckbox && uppercaseCheckbox.checked);

      const contrasena = generarContrasena(longitud, especiales, numeros, mayusculas);

      if (resultInput) {
        resultInput.value = contrasena;
        resultInput.focus();
        resultInput.select();
      } else {
        console.log('Contraseña generada:', contrasena);
      }
    });
  }

  if (copyBtn && resultInput) {
    copyBtn.addEventListener('click', async function () {
      if (!resultInput.value) return;
      try {
        await navigator.clipboard.writeText(resultInput.value);
        copyBtn.textContent = 'Copiado';
        setTimeout(() => (copyBtn.textContent = 'Copiar'), 1400);
      } catch (e) {
        resultInput.select();
        try { document.execCommand('copy'); copyBtn.textContent = 'Copiado'; setTimeout(() => (copyBtn.textContent = 'Copiar'), 1400); } catch (_) {}
      }
    });
  }
});