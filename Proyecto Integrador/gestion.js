// Array de perfiles de usuarios (datos de ejemplo)
const perfiles = [
  { usuario: "Alice", codigo: "1234", nivel: "bajo", antiguedad: 12 },
  { usuario: "Bob", codigo: "5678", nivel: "medio", antiguedad: 24 },
  { usuario: "Charlie", codigo: "9101", nivel: "alto", antiguedad: 35 },
  { usuario: "Diana", codigo: "1122", nivel: "admin", antiguedad: 48 },
  { usuario: "Eve", codigo: "3344", nivel: "bajo", antiguedad: 6 },
  { usuario: "Frank", codigo: "5566", nivel: "medio", antiguedad: 12 },
  { usuario: "Grace", codigo: "7788", nivel: "alto", antiguedad: 18 },
  { usuario: "Hank", codigo: "9900", nivel: "admin", antiguedad: 30 },
  { usuario: "Ivy", codigo: "1235", nivel: "bajo", antiguedad: 36 },
  { usuario: "Jack", codigo: "5679", nivel: "medio", antiguedad: 48 },
  { usuario: "Karen", codigo: "9102", nivel: "alto", antiguedad: 6 },
  { usuario: "Leo", codigo: "1123", nivel: "admin", antiguedad: 24 }
];

// Funciones requeridas según la consigna
function verPerfilesPorAntiguedad() {
  return [...perfiles].sort((a, b) => b.antiguedad - a.antiguedad);
}

function verAdministradores() {
  return perfiles.filter(perfil => perfil.nivel === "admin");
}

function actualizarCodigoAcceso(usuario, nuevoCodigoAcceso) {
  if (typeof usuario !== 'string' || usuario.trim() === '') {
    return "Error: Usuario no valido";
  }
  if (!/^\d{4}$/.test(nuevoCodigoAcceso)) {
    return "Error: Código no valido, debe ser 4 números";
  }
  const perfil = perfiles.find(p => p.usuario.toLowerCase() === usuario.toLowerCase());
  if (!perfil) {
    return "Error: Usuario no encontrado";
  }
  perfil.codigo = nuevoCodigoAcceso;
  return `Código de acceso actualizado para ${perfil.usuario}`;
}

// Exponer funciones
window.perfiles = perfiles;
window.verPerfilesPorAntiguedad = verPerfilesPorAntiguedad;
window.verAdministradores = verAdministradores;
window.actualizarCodigoAcceso = actualizarCodigoAcceso;

// Integración con UI
document.addEventListener('DOMContentLoaded', () => {
  const viewSelect = document.getElementById('viewSelect');
  const btnVer = document.getElementById('btnVer');
  const btnAntiguedad = document.getElementById('btnAntiguedad');
  const btnAdmins = document.getElementById('btnAdmins');
  const usuarioAcceso = document.getElementById('usuarioAcceso');
  const nuevoCodigoAcceso = document.getElementById('nuevoCodigoAcceso');
  const btnActualizar = document.getElementById('btnActualizar');
  const messages = document.getElementById('messages');
  const resultado = document.getElementById('resultado');

  function formatearResultado(arr) {
    if (!arr || arr.length === 0) return "No hay resultados";
    return arr.map(p => `${p.usuario} - ${p.codigo} - ${p.nivel} - ${p.antiguedad}`).join('\n');
  }

  function mostrarMensaje(texto, esError = true) {
    messages.style.color = esError ? '#b00' : '#1b7a1b';
    messages.textContent = texto;
    resultado.textContent = '';
  }

  btnVer.addEventListener('click', () => {
    const opcion = viewSelect.value;
    if (opcion === '') {
      mostrarMensaje("Por favor selecciona una opción", true);
      return;
    }

    let datos = [];
    if (opcion === 'todos') {
      datos = perfiles;
    } else if (opcion === 'antiguedad') {
      datos = verPerfilesPorAntiguedad();
    } else if (opcion === 'admins') {
      datos = verAdministradores();
    }

    if (datos.length === 0) {
      mostrarMensaje("No hay perfiles para mostrar", false);
    } else {
      resultado.textContent = formatearResultado(datos);
      messages.textContent = '';
    }
  });

  btnAntiguedad.addEventListener('click', () => {
    const datos = verPerfilesPorAntiguedad();
    resultado.textContent = formatearResultado(datos);
    messages.textContent = '';
  });

  btnAdmins.addEventListener('click', () => {
    const datos = verAdministradores();
    if (datos.length === 0) {
      mostrarMensaje("No hay administradores", false);
    } else {
      resultado.textContent = formatearResultado(datos);
      messages.textContent = '';
    }
  });

  btnActualizar.addEventListener('click', () => {
    const usuario = usuarioAcceso.value;
    const codigo = nuevoCodigoAcceso.value;

    const res = actualizarCodigoAcceso(usuario, codigo);
    if (res.startsWith("Error")) {
      mostrarMensaje(res, true);
    } else {
      mostrarMensaje(res, false);
      usuarioAcceso.value = '';
      nuevoCodigoAcceso.value = '';
      resultado.textContent = formatearResultado(perfiles);
    }
  });
});