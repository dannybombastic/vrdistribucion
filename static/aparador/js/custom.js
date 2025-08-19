/*!
 * Item: Kitzu
 * Description: Personal Portfolio Template
 * Author/Developer: Exill
 * Author/Developer URL: https://themeforest.net/user/exill
 * Version: v2.0.1
 * License: Themeforest Standard Licenses: https://themeforest.net/licenses
 */
!(function (n) {
  "use strict";

  n(function () {}), n(window).on("load", function () {});

  // create empty array to store the images
  const galeria1 = [
    "1000000518.jpg",
    "1000000807.jpg",
    "1000000899.jpg",
    "1000000903.jpg",
    "1000002578.jpg",
    "1000002618.jpg",
    "1000002638.jpg",
    "1000002658.jpg",
    "1000002732.jpg",
    "1000002915.jpg",
  ];

  const galeria2 = [
    "tm-img-01.jpg",
    "tm-img-02.jpg",
    "tm-img-03.jpg",
    "tm-img-04.jpg",
    "tm-img-05.jpg",
    "tm-img-06.jpg",
    "tm-img-07.jpg",
    "tm-img-08.jpg",
    "tm-img-09.jpg",
    "tm-img-10.jpg",
    "tm-img-11.jpg",
    "tm-img-12.jpg",
    "tm-img-13.jpg",
    "tm-img-14.jpg",
    "tm-img-15.jpg",
    "tm-img-16.jpg",
  ];

  const contenedor1 = document.getElementById("galeria1");
  const contenedor2 = document.getElementById("galeria2");
  const contenedor3 = document.getElementById("galeria3");

  function shuffleArray(array) {
    // Realizamos una copia para no mutar el array original,
    // aunque si quieres modificar el original, puedes quitar
    // esta línea y trabajar directamente sobre 'array'.
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      // Elegimos un índice aleatorio entre 0 e i
      const j = Math.floor(Math.random() * (i + 1));
      // Intercambiamos elementos arr[i] y arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  function putPictures(context, archivos) {
    const images = [];
    // // Obtenemos el contenedor donde se van a colocar los elementos

    // Recorremos la lista de archivos para generar el HTML y añadirlo al contenedor
    archivos.forEach((archivo, indice) => {
      // Ajusta la ruta si las imágenes no están en la carpeta "img"
      // (por ejemplo, podría ser "assets/images/" + archivo)
      const rutaCompleta = archivo.includes("/")
        ? archivo
        : "https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/aparador/img/" + context + "/" + archivo;

      const html = `
            <div class="grid-item">
            <figure class="effect-sadie">
                <img src="${rutaCompleta.replace(".jpg", "-tn.jpg")}" alt="${context} ${indice + 1}"
                    class="img-fluid tm-img">
                <figcaption>
                    <h2 class="tm-figure-title">${context} <span><strong>${
        indice + 1
      }</strong></span></h2>
                    <p class="tm-figure-description">Decoraciones modernas para un ambiente
                        contemporáneo.</p>
                    <a href="${rutaCompleta.replace("-tn","")}">Ver más</a>
                </figcaption>
            </figure>
            </div>
      `;

      // Insertamos el HTML en el array
      images.push(html);
    });

    // Devolvemos el array con todo el HTML generado
    return images;
  }
  const temporal = putPictures("galeria1", galeria1).join("");
  // Insertamos el HTML en el contenedor
  contenedor1.innerHTML = temporal;
  contenedor2.innerHTML = putPictures("galeria2", galeria2).join("");
  contenedor3.innerHTML = temporal;

})(jQuery);
