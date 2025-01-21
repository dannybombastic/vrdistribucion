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

  n(function () {}), n(window).on("load", function () {


   // create empty array to store the images


    const invitaciones = [
        "Invitacion_personalizada_1.jpg",
        "Invitacion_personalizada_2.jpg",
        "Invitacion_personalizada_4.jpg",
        "Invitacion_personalizada_15_años_5.jpg",
        "Invitacion_personalizada_15_años_Acrilico_6.jpg",
        "Invitacion_personalizada_15_años_boda_8.jpg",
        "Invitacion_personalizada_15_años_boda_9.jpg",
        "Invitacion_personalizada_15_años_boda_10.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_11.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_12.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_13.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_14.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_15.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_16.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_17.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_18.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_19.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_20.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_22.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_23.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_24.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_25.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_26.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_27.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_28.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_29.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_30.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_31.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_32.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_33.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_34.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_35.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_36.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_37.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_38.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_39.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_40.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_41.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_42.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_43.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_44.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_45.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_46.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_47.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_48.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_49.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_50.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_51.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_52.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_54.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_55.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_56.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_57.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_58.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_59.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_60.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_62.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_63.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_64.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_65.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_66.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_67.jpg",
        "Invitacion_personalizada_15_años_boda_Bautizo_lasser_68.jpg",
        "Invitacion_personalizada_Bautizo_3.jpg",
        "Invitacion_personalizada_Boda_7.jpg",
      ];

      const corporativo = [
        "anuncios_de_luz_cajas_de_luz_impresion_en_lona.jpg",
        "cajas_de_luz_letrero.jpg",
        "cortinas_abatibles_con_ventana_estructuras.jpg",
        "cortinas_abatibles_estructuras_de_aluminio_corte_de_letras_letrasblock.jpg",
        "cortinas_abatibles_lona_pvc_vinil_rotulacion.jpg",
        "cortinas_abatibles_toldos_de_pvc.jpg",
        "cortinas_batibles_a_medida_tela.jpg",
        "cortinas_y_ toldos_de_pvc.jpg",
        "estructuras_anuncios_luminosos.jpg",
        "estructuras_herreria_rotulacion_vinil.jpg",
        "iluminacion_led_estructuras_vinil_trovicel_impreso.jpg",
        "letras_corporeas_estructuras_toldos.jpg",
        "lonas_estructuras_proyectos.jpg",
        "lonas_gran_formato_intalacion_herreria.jpg",
        "Lonas_gran_formato_lonas_espectaculares.jpg",
        "lonas_gran_formato_Viniles.jpg",
        "lonas_pvc_toldos_herreria-estructuras.jpg",
        "luz_led_estructuras_vinil_corte_de_letras.jpg",
        "luz_led_letras_corporeas_neon_flexible.jpg",
        "rotulacion_vehicular_corte_de_vinil.jpg",
        "rotulacion_vehicular_vinil_instalaciones.jpg",
        "rotulacion_vinil.jpg",
        "toldo_tela_rotulacion_en-tela_estructuras_Herreria.jpg",
        "toldos_abatibles_tela_estructura_aluminio.jpg",
        "toldos_de_tela_toldo_estructuras.jpg",
        "toldos_pcv_estructuras_instalacion_herreria.jpg",
        "toldos_sombrillas_cortinas_telas_umbrella.jpg",
        "vinil_estatico_para_vidrio.jpg",
        "Vinil_rotulacion_Gran_formato_instalacion.jpg",
        "Vinil_rotulacion_instalacio.jpg",
        "viniles_rotulacion_vinil_gran_formato.jpg",
      ];
      const velas = [
        "1000002619.webp",
        "1000002633.webp",
        "1000002671.webp",
        "1000002731.webp",
        "1000002771.webp",
        "1000002842.webp",
        "1000002887.webp",
        "1000002913.webp",
        "1000002914.webp"
      ];
      const contenedor2 = document.getElementById("productos");

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
        // const contenedor = document.getElementById(context + "-pic");


        // Recorremos la lista de archivos para generar el HTML y añadirlo al contenedor
        archivos.forEach((archivo, indice) => {
          // Ajusta la ruta si las imágenes no están en la carpeta "img"
          // (por ejemplo, podría ser "assets/images/" + archivo)
          const rutaCompleta = archivo.includes("/")
            ? archivo
            : "img/" + context + "/" + archivo;

          const html = `
          <div class="single-item col-6 col-lg-4 ${context}">
            <a class="portfolio-item" href="${rutaCompleta}" data-lightbox>
              <div class="portfolio-wrapper">
                <img class="img-fluid" alt="Invitación ${
                  indice + 1
                }" src="${rutaCompleta}" />
                <div class="item-content">
                  <h6 class="content-title">Invitación ${indice + 1}</h6>
                  <span class="content-more">Más Info</span>
                </div>
              </div>
            </a>
          </div>
        `;

          // Insertamos el HTML en el contenedor
          images.push(html);
        });

        return images;
      }

      console.log("iiinvitaciones", putPictures("invitaciones", invitaciones));
      const randomImages = [...putPictures("invitaciones", invitaciones), ...putPictures("Corporativo", corporativo), ...putPictures("velas", velas)];

      console.log("ramdon",randomImages);

      contenedor2.innerHTML = randomImages.join("");

  });


})(jQuery);
