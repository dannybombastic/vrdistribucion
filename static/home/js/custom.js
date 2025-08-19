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

//  n(function () {}), n(window).on("load", function () {});

  // Arrays convertidos a objetos { src, title }
  const centros = [
    { src: "centro_de_mesa_Boda_15_años_herreria_personalizados_54.jpg",
      title: "Item 10",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img"
    },
    {
      src: "centro_de_mesa_Boda_15_años_herreria_personalizados_59.jpg",
      title: "Centros de mesa Boda",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "centro_de_mesa_Boda_15_años_herreria_personalizados_60.jpg",
      title: "Centros de mesa XV Años",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "centro_de_mesa_Boda_15_años_herreria_personalizados_61.jpg",
      title: "Centros de mesa Corporativas",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "centro_de_mesa_Boda_15_años_herreria_personalizados_62.jpg",
      title: "Centros de mesa Bautizo",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "centro_de_mesa_Boda_15_años_herreria_personalizados_63.jpg",
      title: "Centros de mesa Baby Shower",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "centro_de_mesa_Boda_15_años_herreria_personalizados_64.jpg",
      title: "Botellas Personalizadas",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "centro_de_mesa_Boda_15_años_herreria_personalizados_65.jpg",
      title: "Centro de Mesa Boda 65",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "centro_de_mesa_Boda_15_años_herreria_personalizados_66.jpg",
      title: "Centro de Mesa Boda 66",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
  ];

  const invitaciones = [
    {
      src: "Invitacion_personalizada_15_años_boda_Bautizo_lasser_62.jpg",
      title: "Invitaciones de Boda",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Invitacion_personalizada_15_años_boda_Bautizo_lasser_63.jpg",
      title: "Invitaciones de XV Años",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Invitacion_personalizada_15_años_boda_Bautizo_lasser_64.jpg",
      title: "Invitaciones de Corporativas",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Invitacion_personalizada_15_años_boda_Bautizo_lasser_65.jpg",
      title: "Invitaciones Bautizo",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Invitacion_personalizada_15_años_boda_Bautizo_lasser_66.jpg",
      title: "Invitaciones Baby Shower",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Invitacion_personalizada_15_años_boda_Bautizo_lasser_67.jpg",
      title: "Etiquetas",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Invitacion_personalizada_15_años_boda_Bautizo_lasser_68.jpg",
      title: "Cajas personalizadas",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Invitacion_personalizada_Bautizo_3.jpg",
      title: "Complementos",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Invitacion_personalizada_Boda_7.jpg",
      title: "Invitaciones Infantiles",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
  ];

  const corporativo = [
    {
      src: "toldo_tela_rotulacion_en-tela_estructuras_Herreria.jpg",
      title: "Estructuras y Toldos",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "toldos_abatibles_tela_estructura_aluminio.jpg",
      title: "Papelería",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "toldos_de_tela_toldo_estructuras.jpg",
      title: "Lonas pequeño y Gran formato",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "toldos_pcv_estructuras_instalacion_herreria.jpg",
      title: "Viniles",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "toldos_sombrillas_cortinas_telas_umbrella.jpg",
      title: "señalización",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "vinil_estatico_para_vidrio.jpg",
      title: "Neon Flexible y Cajas de Luz",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Vinil_rotulacion_Gran_formato_instalacion.jpg",
      title: "Proyectos",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "Vinil_rotulacion_instalacio.jpg",
      title: "Vinil ",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "viniles_rotulacion_vinil_gran_formato.jpg",
      title: "Viniles Rotulación",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
  ];

  const velas = [
    {
      src: "1000002619.jpg",
      title: "Vela 2619",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "1000002633.jpg",
      title: "Vela 2633",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "1000002671.jpg",
      title: "Vela 2671",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "1000002731.jpg",
      title: "Vela 2731",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "1000002771.jpg",
      title: "Vela 2771",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "1000002842.jpg",
      title: "Vela 2842",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "1000002887.jpg",
      title: "Vela 2887",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "1000002913.jpg",
      title: "Vela 2913",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
    {
      src: "1000002914.jpg",
      title: "Vela 2914",
      href: "/aparador",
      static: "https://vrdistribucion.s3.eu-west-3.amazonaws.com/vrdistribucion/home/img",
    },
  ];

  const contenedor = document.getElementById("productos");

  // Función para mezclar aleatoriamente los elementos de un array
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Función que genera el HTML para cada imagen utilizando objetos { src, title }
  function putPictures(context, archivos) {
    const images = [];
    archivos.forEach((archivo, indice) => {
      // Se construye la ruta completa; si el src ya contiene "/", se usa tal cual
      const rutaCompleta = archivo.src.includes("/")
        ? archivo.src
        : archivo.static + "/" + context + "/" + archivo.src;

      const html = `
      <div class="single-item col-6 col-lg-4 ${context}">
        <a class="portfolio-item" href="${rutaCompleta}" data-lightbox>
          <div class="portfolio-wrapper">
            <img class="img-fluid" alt="${archivo.title}" src="${rutaCompleta}" />
            <div class="item-content">
              <h6 class="content-title">${archivo.title}</h6>
              <span class="content-more"><a href="${archivo.href}" target="_blank">Mas info</a></span>
            </div>
          </div>
        </a>
      </div>
      `;
      images.push(html);
    });
    return images;
  }

  const randomImages = [
    ...putPictures("invitaciones", invitaciones),
    ...putPictures("Corporativo", corporativo),
    ...putPictures("velas", velas),
    ...putPictures("centros", centros),
  ];

  // Insertamos el HTML mezclado en el contenedor
  contenedor.innerHTML = shuffleArray(randomImages).join("");
})(jQuery);
