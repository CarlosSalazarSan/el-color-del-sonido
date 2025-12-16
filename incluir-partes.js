// incluir-partes.js para incluir la cabecera y el footer de menera sincrona en todas las páginas.
document.addEventListener("DOMContentLoaded", () => {
  // Cargar cabecera
  fetch("cabecera.html")
    .then(respuesta => respuesta.text())
    .then(html => {
      document.getElementById("contenedor-cabecera").innerHTML = html;
    });

  // Cargar footer de página
  fetch("footer.html")
    .then(respuesta => respuesta.text())
    .then(html => {
      document.getElementById("contenedor-footer").innerHTML = html;
    });
});
