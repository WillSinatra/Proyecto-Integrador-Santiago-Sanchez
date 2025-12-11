// monitoreo.js

// Array principal según la consigna
const actividadesSospechosas = [];

/*
  Funciones solicitadas:

  agregarActividad(descripcion, nivel)
  EliminarActividadSospechosa(indice)
  filtrarActividadesPorRiesgo(nivel)
  generarReportedeActividades()
*/

// a) agregarActividad
function agregarActividad(descripcion, nivel) {
  // validar no vacíos (strings)
  if (typeof descripcion !== 'string' || typeof nivel !== 'string' || descripcion.trim() === '' || nivel.trim() === '') {
    return "Descripcion o nivel de riesgo no valido";
  }

  const nivelLower = nivel.trim().toLowerCase();
  if (!['bajo','medio','alto'].includes(nivelLower)) {
    return "Nivel de riesgo no valido, el nivel debe ser: bajo, medio o alto";
  }

  // Formato: "Descripcion: 'descripcion', Riesgo - 'nivelRiesgo'"
  const actividadStr = `Descripcion: '${descripcion.trim()}', Riesgo - '${nivelLower}'`;
  actividadesSospechosas.push(actividadStr);

  return `Actividad: '${descripcion.trim()}' con Nivel de riesgo: '${nivelLower}' fue agregada con exito`;
}

// b) EliminarActividadSospechosa(indice)
function EliminarActividadSospechosa(indice) {
  // validar tipo number
  if (typeof indice !== 'number' || Number.isNaN(indice)) {
    return "El indice no es valido, debe ser un numero";
  }

  // validar rango: no menor a 0 ni mayor al tamaño del listado
  // Consideramos válido índices 0 .. actividadesSospechosas.length - 1
  if (indice < 0 || indice >= actividadesSospechosas.length) {
    return "El indice no es valido, se encuentra fuera del rango";
  }

  actividadesSospechosas.splice(indice, 1);
  return "Actividad eliminada con exito";
}

// c) filtrarActividadesPorRiesgo(nivel)
function filtrarActividadesPorRiesgo(nivel) {
  if (typeof nivel !== 'string' || nivel.trim() === '') {
    return "Nivel de riesgo no valido";
  }

  const nivelLower = nivel.trim().toLowerCase();
  if (!['bajo','medio','alto'].includes(nivelLower)) {
    return "Nivel de riesgo no valido, el nivel debe ser: bajo, medio o alto";
  }

  // Filtrar las actividades que contienen la palabra del nivel (bajo/medio/alto)
  const filtradas = actividadesSospechosas.filter(act => {
    // act tiene formato "Descripcion: 'desc', Riesgo - 'nivel'"
    return act.toLowerCase().includes(`riesgo - '${nivelLower}'`);
  });

  if (filtradas.length === 0) {
    return "No hay actividades con este nivel de riesgo";
  }

  // regresar nuevo arreglo con las actividades filtradas
  return filtradas.slice();
}

// d) generarReportedeActividades()
function generarReportedeActividades() {
  if (actividadesSospechosas.length === 0) {
    return "No hay actividades para mostrar";
  }

  // crear nuevo array con formato:
  // "Id: 0, Descripcion: 'descripción', Riesgo - 'nivelRiesgo'"
  const reporte = actividadesSospechosas.map((act, idx) => {
    // extraer la parte de Descripcion y Riesgo de la string existente
    // act === "Descripcion: 'desc', Riesgo - 'nivel'"
    // construimos la nueva linea con Id
    return `Id: ${idx}, ${act}`;
  });

  return reporte;
}

/* ---- Exponer funciones al window por si se quieren usar en consola o tests ---- */
window.actividadesSospechosas = actividadesSospechosas;
window.agregarActividad = agregarActividad;
window.EliminarActividadSospechosa = EliminarActividadSospechosa;
window.filtrarActividadesPorRiesgo = filtrarActividadesPorRiesgo;
window.generarReportedeActividades = generarReportedeActividades;

/* ---- Integración con la UI ---- */
document.addEventListener('DOMContentLoaded', () => {
  const descripcionInput = document.getElementById('descripcion');
  const nivelSelect = document.getElementById('nivel');
  const btnAgregar = document.getElementById('btnAgregar');
  const messages = document.getElementById('messages');
  const listaEl = document.getElementById('listaActividades');
  const resultadoEl = document.getElementById('resultado');

  const eliminarIndexInput = document.getElementById('eliminarIndex');
  const btnEliminar = document.getElementById('btnEliminar');

  const filtroNivel = document.getElementById('filtroNivel');
  const btnMostrar = document.getElementById('btnMostrar');

  const btnReporte = document.getElementById('btnReporte');

  function renderLista() {
    listaEl.innerHTML = '';
    actividadesSospechosas.forEach((act, idx) => {
      const li = document.createElement('li');
      li.textContent = `${idx} | ${act}`; // mostramos índice para facilitar eliminación
      listaEl.appendChild(li);
    });
  }

  function showMessage(text, isError = true) {
    messages.style.color = isError ? '#b00' : '#1b7a1b';
    messages.textContent = text;
    // limpiar resultado textual cuando hay mensaje
    resultadoEl.textContent = '';
  }

  btnAgregar.addEventListener('click', () => {
    const desc = descripcionInput.value;
    const nivel = nivelSelect.value;
    const res = agregarActividad(desc, nivel);
    // según la consigna, los mensajes de error son strings específicos
    if (res === "Descripcion o nivel de riesgo no valido" || res === "Nivel de riesgo no valido, el nivel debe ser: bajo, medio o alto") {
      showMessage(res, true);
      return;
    }
    // agregado con éxito
    showMessage(res, false);
    descripcionInput.value = '';
    nivelSelect.value = '';
    renderLista();
  });

  btnEliminar.addEventListener('click', () => {
    const idxVal = eliminarIndexInput.value;
    if (idxVal === '') {
      showMessage("El indice no es valido, debe ser un numero", true);
      return;
    }
    const idx = Number(idxVal);
    const res = EliminarActividadSospechosa(idx);
    if (res === "El indice no es valido, debe ser un numero" || res === "El indice no es valido, se encuentra fuera del rango") {
      showMessage(res, true);
      return;
    }
    showMessage(res, false);
    eliminarIndexInput.value = '';
    renderLista();
  });

  btnMostrar.addEventListener('click', () => {
    const nivel = filtroNivel.value;
    const res = filtrarActividadesPorRiesgo(nivel);
    if (res === "Nivel de riesgo no valido" || res === "Nivel de riesgo no valido, el nivel debe ser: bajo, medio o alto" || res === "No hay actividades con este nivel de riesgo") {
      // mostrar mensaje o resultado acorde
      if (typeof res === 'string') {
        showMessage(res, true);
      } else {
        resultadoEl.textContent = JSON.stringify(res, null, 2);
      }
      // en caso de "No hay..." lo pedimos como información (no error crítico)
      if (res === "No hay actividades con este nivel de riesgo") {
        showMessage(res, false);
        resultadoEl.textContent = '';
      }
      return;
    }
    // res es el arreglo filtrado
    resultadoEl.textContent = res.join('\n');
    messages.textContent = '';
  });

  btnReporte.addEventListener('click', () => {
    const rep = generarReportedeActividades();
    if (rep === "No hay actividades para mostrar") {
      showMessage(rep, true);
      resultadoEl.textContent = '';
      return;
    }
    // rep es array de strings
    resultadoEl.textContent = rep.join('\n');
    messages.textContent = '';
  });

  // render inicial
  renderLista();
});