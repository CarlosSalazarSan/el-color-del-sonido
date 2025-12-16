// incluir-partes.js para incluir la cabecera y el footer de menera sincrona en todas las páginas.
document.addEventListener("DOMContentLoaded", async () => {
  const cabeceraCont = document.getElementById("contenedor-cabecera");
  const footerCont = document.getElementById("contenedor-footer");

  try {
    const [cabeceraResp, footerResp] = await Promise.all([
      fetch("cabecera.html"),
      fetch("footer.html")
    ]);

    cabeceraCont.innerHTML = await cabeceraResp.text();
    footerCont.innerHTML = await footerResp.text();

  } catch (e) {
    console.warn("No se pudieron cargar cabecera/footer", e);
  } finally {
    // marca como listo (para quitar el “flash”)
    document.body.classList.add("partes-cargadas");
  }
});