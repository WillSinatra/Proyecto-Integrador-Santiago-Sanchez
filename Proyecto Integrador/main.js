// main.js - pequeño helper para la landing page
document.addEventListener('DOMContentLoaded', function () {
  // 1) Actualiza el año en el footer automáticamente
  var footerPara = document.querySelector('.footer__inner p') || document.querySelector('footer p');
  if (footerPara) {
    var year = new Date().getFullYear();
    // Reemplaza el primer grupo de 4 dígitos por el año actual, si existe.
    footerPara.textContent = footerPara.textContent.replace(/\d{4}/, year);
  }

  // 2) Mejora de accesibilidad: detectar si el usuario usa Tab para mostrar outlines
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
});