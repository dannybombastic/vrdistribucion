/**
 * VR Distribución Gallery - MCP Material Design 3
 * Galería interactiva con componentes MD3 generados por MCP
 */

class VRGalleryMCP {
  constructor() {
    this.currentCategory = 'todos';
    this.lightbox = null;
    this.currentImageIndex = 0;
    this.images = [];
    this.imageData = this.initializeImageData();
    
    this.init();
  }

  initializeImageData() {
    return {
      todos: [], // Se llenará con todas las imágenes
      invitaciones: [
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_1.jpg', title: 'Invitación Personalizada Elegante', category: 'invitaciones', description: 'Diseño único para eventos especiales' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_5.jpg', title: 'Invitación 15 Años', category: 'invitaciones', description: 'Diseño especial para quinceañeras' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_Acrilico_6.jpg', title: 'Invitación Acrílico 15 Años', category: 'invitaciones', description: 'Invitación en acrílico transparente' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_boda_10.jpg', title: 'Invitación Boda Elegante', category: 'invitaciones', description: 'Diseño sofisticado para bodas' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_boda_8.jpg', title: 'Invitación Boda Clásica', category: 'invitaciones', description: 'Estilo clásico y elegante' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_boda_9.jpg', title: 'Invitación Boda Moderna', category: 'invitaciones', description: 'Diseño contemporáneo' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_boda_Bautizo_11.jpg', title: 'Invitación Bautizo', category: 'invitaciones', description: 'Delicado diseño para bautizos' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_boda_Bautizo_12.jpg', title: 'Invitación Bautizo Premium', category: 'invitaciones', description: 'Diseño premium para bautizos' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_boda_Bautizo_lasser_15.jpg', title: 'Invitación Láser Cut', category: 'invitaciones', description: 'Corte láser de precisión' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_15_años_boda_Bautizo_lasser_20.jpg', title: 'Invitación Láser Detallada', category: 'invitaciones', description: 'Detalles intrincados con láser' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_2.jpg', title: 'Invitación Personalizada 2', category: 'invitaciones', description: 'Diseño único personalizado' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_4.jpg', title: 'Invitación Personalizada 4', category: 'invitaciones', description: 'Estilo personalizado exclusivo' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_Bautizo_3.jpg', title: 'Invitación Bautizo Especial', category: 'invitaciones', description: 'Diseño especial para bautizos' },
        { src: '/static/home/img/invitaciones/Invitacion_personalizada_Boda_7.jpg', title: 'Invitación Boda Premium', category: 'invitaciones', description: 'Calidad premium para bodas' }
      ],
      centros: [
        { src: '/static/home/img/centros/centro_de_mesa_Boda_15_años_herreria_personalizados_1.jpg', title: 'Centro de Mesa Herrería', category: 'centros', description: 'Diseño en herrería personalizado' },
        { src: '/static/home/img/centros/centro_de_mesa_Boda_15_años_herreria_personalizados_2.jpg', title: 'Centro de Mesa Elegante', category: 'centros', description: 'Elegancia en herrería artesanal' },
        { src: '/static/home/img/centros/centro_de_mesa_Boda_15_años_herreria_personalizados_3.jpg', title: 'Centro de Mesa Clásico', category: 'centros', description: 'Estilo clásico en herrería' },
        { src: '/static/home/img/centros/centro_de_mesa_Boda_15_años_herreria_personalizados_10.jpg', title: 'Centro de Mesa Moderno', category: 'centros', description: 'Diseño moderno y sofisticado' },
        { src: '/static/home/img/centros/centro_de_mesa_Boda_15_años_herreria_personalizados_15.jpg', title: 'Centro de Mesa Artístico', category: 'centros', description: 'Arte en herrería personalizada' },
        { src: '/static/home/img/centros/centro_de_mesa_Boda_15_años_herreria_personalizados_20.jpg', title: 'Centro de Mesa Único', category: 'centros', description: 'Diseño único y exclusivo' },
        { src: '/static/home/img/centros/centro_de_mesa_Boda_15_años_herreria_personalizados_25.jpg', title: 'Centro de Mesa Premium', category: 'centros', description: 'Calidad premium en herrería' },
        { src: '/static/home/img/centros/centro_de_mesa_Boda_15_años_herreria_personalizados_30.jpg', title: 'Centro de Mesa Decorativo', category: 'centros', description: 'Decoración especializada' }
      ],
      corporativo: [
        { src: '/static/home/img/Corporativo/Lonas_gran_formato_lonas_espectaculares.jpg', title: 'Lonas Gran Formato', category: 'corporativo', description: 'Impresión de gran formato para eventos corporativos' },
        { src: '/static/home/img/Corporativo/Vinil_rotulacion_Gran_formato_instalacion.jpg', title: 'Rotulación Vinil', category: 'corporativo', description: 'Rotulación profesional en vinil' },
        { src: '/static/home/img/Corporativo/anuncios_de_luz_cajas_de_luz_impresion_en_lona.jpg', title: 'Anuncios Luminosos', category: 'corporativo', description: 'Cajas de luz para publicidad' },
        { src: '/static/home/img/Corporativo/cajas_de_luz_letrero.jpg', title: 'Cajas de Luz', category: 'corporativo', description: 'Letreros iluminados profesionales' },
        { src: '/static/home/img/Corporativo/estructuras_anuncios_luminosos.jpg', title: 'Estructuras Luminosas', category: 'corporativo', description: 'Estructuras para anuncios luminosos' },
        { src: '/static/home/img/Corporativo/letras_corporeas_estructuras_toldos.jpg', title: 'Letras Corpóreas', category: 'corporativo', description: 'Letras corpóreas tridimensionales' },
        { src: '/static/home/img/Corporativo/rotulacion_vehicular_vinil_instalaciones.jpg', title: 'Rotulación Vehicular', category: 'corporativo', description: 'Rotulación profesional para vehículos' },
        { src: '/static/home/img/Corporativo/toldos_de_tela_toldo_estructuras.jpg', title: 'Toldos Corporativos', category: 'corporativo', description: 'Toldos para espacios corporativos' }
      ],
      galeria1: [
        { src: '/static/aparador/img/galeria1/1000000518.jpg', title: 'Proyecto Especial 1', category: 'galeria1', description: 'Proyecto único y personalizado' },
        { src: '/static/aparador/img/galeria1/1000000807.jpg', title: 'Proyecto Especial 2', category: 'galeria1', description: 'Diseño exclusivo y elegante' },
        { src: '/static/aparador/img/galeria1/1000000899.jpg', title: 'Proyecto Especial 3', category: 'galeria1', description: 'Creación artística personalizada' },
        { src: '/static/aparador/img/galeria1/1000000903.jpg', title: 'Proyecto Especial 4', category: 'galeria1', description: 'Trabajo de alta calidad' },
        { src: '/static/aparador/img/galeria1/1000002578.jpg', title: 'Proyecto Especial 5', category: 'galeria1', description: 'Diseño innovador' },
        { src: '/static/aparador/img/galeria1/1000002618.jpg', title: 'Proyecto Especial 6', category: 'galeria1', description: 'Arte personalizado único' },
        { src: '/static/aparador/img/galeria1/1000002638.jpg', title: 'Proyecto Especial 7', category: 'galeria1', description: 'Creación exclusiva' },
        { src: '/static/aparador/img/galeria1/1000002658.jpg', title: 'Proyecto Especial 8', category: 'galeria1', description: 'Diseño sofisticado' },
        { src: '/static/aparador/img/galeria1/1000002732.jpg', title: 'Proyecto Especial 9', category: 'galeria1', description: 'Trabajo artesanal' },
        { src: '/static/aparador/img/galeria1/1000002915.jpg', title: 'Proyecto Especial 10', category: 'galeria1', description: 'Proyecto de calidad premium' }
      ],
      galeria2: [
        { src: '/static/aparador/img/galeria2/tm-img-01.jpg', title: 'Colección TM 1', category: 'galeria2', description: 'Primera pieza de la colección TM' },
        { src: '/static/aparador/img/galeria2/tm-img-02.jpg', title: 'Colección TM 2', category: 'galeria2', description: 'Segunda pieza de la colección TM' },
        { src: '/static/aparador/img/galeria2/tm-img-03.jpg', title: 'Colección TM 3', category: 'galeria2', description: 'Tercera pieza de la colección TM' },
        { src: '/static/aparador/img/galeria2/tm-img-04.jpg', title: 'Colección TM 4', category: 'galeria2', description: 'Cuarta pieza de la colección TM' },
        { src: '/static/aparador/img/galeria2/tm-img-05.jpg', title: 'Colección TM 5', category: 'galeria2', description: 'Quinta pieza de la colección TM' },
        { src: '/static/aparador/img/galeria2/tm-img-06.jpg', title: 'Colección TM 6', category: 'galeria2', description: 'Sexta pieza de la colección TM' },
        { src: '/static/aparador/img/galeria2/tm-img-07.jpg', title: 'Colección TM 7', category: 'galeria2', description: 'Séptima pieza de la colección TM' },
        { src: '/static/aparador/img/galeria2/tm-img-08.jpg', title: 'Colección TM 8', category: 'galeria2', description: 'Octava pieza de la colección TM' }
      ],
      velas: [
        { src: '/static/home/img/velas/1000002619.jpg', title: 'Vela Aromática 1', category: 'velas', description: 'Vela personalizada con aroma exclusivo' },
        { src: '/static/home/img/velas/1000002633.jpg', title: 'Vela Aromática 2', category: 'velas', description: 'Vela decorativa artesanal' },
        { src: '/static/home/img/velas/1000002671.jpg', title: 'Vela Aromática 3', category: 'velas', description: 'Vela con diseño único' },
        { src: '/static/home/img/velas/1000002731.jpg', title: 'Vela Aromática 4', category: 'velas', description: 'Vela personalizada elegante' },
        { src: '/static/home/img/velas/1000002771.jpg', title: 'Vela Aromática 5', category: 'velas', description: 'Vela decorativa especial' },
        { src: '/static/home/img/velas/1000002842.jpg', title: 'Vela Aromática 6', category: 'velas', description: 'Vela artesanal premium' },
        { src: '/static/home/img/velas/1000002887.jpg', title: 'Vela Aromática 7', category: 'velas', description: 'Vela personalizada única' },
        { src: '/static/home/img/velas/1000002913.jpg', title: 'Vela Aromática 8', category: 'velas', description: 'Vela decorativa exclusiva' },
        { src: '/static/home/img/velas/1000002914.jpg', title: 'Vela Aromática 9', category: 'velas', description: 'Vela artesanal de calidad' }
      ]
    };
  }

  init() {
    this.setupImageData();
    this.renderTabs();
    this.renderGallery();
    this.setupEventListeners();
    this.setupLightbox();
    
    console.log('🎨 VR Distribución Gallery MCP MD3 inicializada');
  }

  setupImageData() {
    // Combinar todas las imágenes en la categoría 'todos'
    this.imageData.todos = [
      ...this.imageData.invitaciones,
      ...this.imageData.centros,
      ...this.imageData.corporativo,
      ...this.imageData.galeria1,
      ...this.imageData.galeria2,
      ...this.imageData.velas
    ];
  }

  renderTabs() {
    const tabsContainer = document.querySelector('.md-gallery-tabs');
    if (!tabsContainer) return;

    const categories = [
      { id: 'todos', label: 'Todos', count: this.imageData.todos.length },
      { id: 'invitaciones', label: 'Invitaciones', count: this.imageData.invitaciones.length },
      { id: 'centros', label: 'Centros de Mesa', count: this.imageData.centros.length },
      { id: 'corporativo', label: 'Corporativo', count: this.imageData.corporativo.length },
      { id: 'galeria1', label: 'Galería General', count: this.imageData.galeria1.length },
      { id: 'galeria2', label: 'Colección TM', count: this.imageData.galeria2.length },
      { id: 'velas', label: 'Velas Decorativas', count: this.imageData.velas.length }
    ];

    const tabsHTML = `
      <div class="md-tabs">
        <div class="md-tabs__header">
          ${categories.map(cat => `
            <button 
              class="md-tab ${cat.id === this.currentCategory ? 'md-tab--active' : ''}" 
              data-category="${cat.id}"
              aria-label="Ver ${cat.label} (${cat.count} elementos)"
            >
              <span class="md-tab__label">${cat.label}</span>
              <span class="md-chip">${cat.count}</span>
              <div class="md-tab__indicator"></div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    tabsContainer.innerHTML = tabsHTML;
  }

  renderGallery() {
    const galleryContainer = document.querySelector('.md-gallery-content');
    console.log('🎨 Renderizando galería, container encontrado:', !!galleryContainer);
    
    if (!galleryContainer) return;

    const images = this.imageData[this.currentCategory] || [];
    console.log('🖼️ Imágenes para renderizar:', images.length, 'categoría:', this.currentCategory);
    
    if (images.length === 0) {
      galleryContainer.innerHTML = `
        <div class="md-gallery-empty">
          <h3 class="md-gallery-empty__title">No hay imágenes en esta categoría</h3>
          <p class="md-gallery-empty__description">Selecciona otra categoría para ver más contenido.</p>
        </div>
      `;
      return;
    }

    const galleryHTML = `
      <div class="md-gallery-section" id="gallery-${this.currentCategory}">
        <div class="md-gallery-grid">
          ${images.map((image, index) => `
            <div class="md-gallery-card md-animate-fade-in" 
                 data-index="${index}" 
                 style="animation-delay: ${index * 0.1}s">
              <div class="md-gallery-card__media">
                <img 
                  class="md-gallery-card__image" 
                  src="${image.src}" 
                  alt="${image.title}"
                  loading="lazy"
                />
                <div class="md-gallery-card__overlay"></div>
                <div class="md-gallery-card__category">${this.getCategoryLabel(image.category)}</div>
              </div>
              <div class="md-gallery-card__content">
                <h3 class="md-gallery-card__title">${image.title}</h3>
                <p class="md-gallery-card__description">${image.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    galleryContainer.innerHTML = galleryHTML;
    this.images = images;
    console.log('✅ Galería renderizada exitosamente');
  }

  getCategoryLabel(category) {
    const labels = {
      invitaciones: 'Invitaciones',
      centros: 'Centros',
      corporativo: 'Corporativo',
      galeria1: 'Galería',
      galeria2: 'Colección TM',
      velas: 'Velas'
    };
    return labels[category] || category;
  }

  setupEventListeners() {
    console.log('🎯 Configurando event listeners para galería');
    
    // Tab clicks
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('.md-tab');
      if (tab) {
        console.log('🖱️ Click en tab detectado:', tab.dataset.category);
        const category = tab.dataset.category;
        if (category) {
          e.preventDefault();
          e.stopPropagation();
          this.switchCategory(category);
        }
      }
    });

    // Gallery card clicks
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.md-gallery-card');
      if (card) {
        console.log('🖱️ Click en card detectado');
        const index = parseInt(card.dataset.index);
        if (!isNaN(index)) {
          this.openLightbox(index);
        }
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        this.previousImage();
      } else if (e.key === 'ArrowRight') {
        this.nextImage();
      }
    });

    console.log('✅ Event listeners configurados');
  }

  switchCategory(category) {
    console.log('🔄 Cambio de categoría:', category, 'actual:', this.currentCategory);
    
    if (category === this.currentCategory) return;

    // Update active tab
    document.querySelectorAll('.md-tab').forEach(tab => {
      tab.classList.remove('md-tab--active');
    });
    
    const targetTab = document.querySelector(`[data-category="${category}"]`);
    if (targetTab) {
      targetTab.classList.add('md-tab--active');
    }

    // Update current category and render
    this.currentCategory = category;
    console.log('📊 Imágenes disponibles para', category, ':', this.imageData[category]?.length || 0);
    this.renderGallery();

    // Update URL without reloading
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.replaceState({}, '', url);
  }

  setupLightbox() {
    // Create lightbox if it doesn't exist
    if (!document.querySelector('.md-lightbox')) {
      const lightboxHTML = `
        <div class="md-lightbox" id="gallery-lightbox">
          <div class="md-lightbox__content">
            <button class="md-lightbox__close" aria-label="Cerrar galería">
              <span class="material-icons">close</span>
            </button>
            <img class="md-lightbox__image" src="" alt="" />
            <div class="md-lightbox__info">
              <h3 class="md-lightbox__title"></h3>
              <p class="md-lightbox__description"></p>
              <span class="md-lightbox__counter"></span>
            </div>
            <button class="md-lightbox__nav md-lightbox__prev" aria-label="Imagen anterior">
              <span class="material-icons">chevron_left</span>
            </button>
            <button class="md-lightbox__nav md-lightbox__next" aria-label="Siguiente imagen">
              <span class="material-icons">chevron_right</span>
            </button>
            <!-- Swipe hint for mobile -->
            <div class="md-lightbox__swipe-hint">
              <span class="material-icons">swipe</span>
              Deslizar para navegar
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    this.lightbox = document.querySelector('.md-lightbox');

    // Lightbox event listeners
    this.lightbox.querySelector('.md-lightbox__close').addEventListener('click', () => {
      this.closeLightbox();
    });

    this.lightbox.querySelector('.md-lightbox__prev').addEventListener('click', () => {
      this.previousImage();
    });

    this.lightbox.querySelector('.md-lightbox__next').addEventListener('click', () => {
      this.nextImage();
    });

    // Click outside to close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Touch/Swipe functionality for mobile
    this.setupTouchEvents();

    // Keyboard navigation
    this.setupKeyboardEvents();
  }

  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let startTime = 0;
    let isDragging = false;
    const minSwipeDistance = 30;
    const maxSwipeTime = 500;
    const maxVerticalDistance = 100;

    const lightboxContent = this.lightbox.querySelector('.md-lightbox__content');
    const lightboxImage = this.lightbox.querySelector('.md-lightbox__image');

    // Create swipe indicators
    const leftIndicator = document.createElement('div');
    leftIndicator.className = 'md-lightbox__swipe-indicator left';
    leftIndicator.innerHTML = '<span class="material-icons">chevron_left</span>';
    
    const rightIndicator = document.createElement('div');
    rightIndicator.className = 'md-lightbox__swipe-indicator right';
    rightIndicator.innerHTML = '<span class="material-icons">chevron_right</span>';
    
    lightboxContent.appendChild(leftIndicator);
    lightboxContent.appendChild(rightIndicator);

    // Touch start
    lightboxImage.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      isDragging = false;
      
      // Add touch feedback
      lightboxImage.style.transition = 'none';
    }, { passive: true });

    // Touch move - provide visual feedback
    lightboxImage.addEventListener('touchmove', (e) => {
      if (!isDragging) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = Math.abs(touch.clientY - startY);
        
        // Only start dragging if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > 10 && deltaX > deltaY) {
          isDragging = true;
          lightboxImage.classList.add('swiping');
          
          // Show appropriate indicator
          if (deltaX > 0) {
            leftIndicator.classList.add('show');
            rightIndicator.classList.remove('show');
          } else {
            rightIndicator.classList.add('show');
            leftIndicator.classList.remove('show');
          }
        }
      }
      
      if (isDragging) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        
        // Apply visual transform
        const maxTransform = 30;
        const transform = Math.max(-maxTransform, Math.min(maxTransform, deltaX * 0.3));
        lightboxImage.style.transform = `translateX(${transform}px)`;
        
        e.preventDefault();
      }
    }, { passive: false });

    // Touch end
    lightboxImage.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;

      // Reset visual state
      lightboxImage.style.transition = 'transform 0.3s ease';
      lightboxImage.style.transform = '';
      lightboxImage.classList.remove('swiping');
      leftIndicator.classList.remove('show');
      rightIndicator.classList.remove('show');

      // Check if it's a valid swipe
      if (
        isDragging &&
        Math.abs(deltaX) > minSwipeDistance && // Minimum horizontal distance
        Math.abs(deltaY) < maxVerticalDistance && // Maximum vertical distance
        deltaTime < maxSwipeTime // Maximum time
      ) {
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        
        if (deltaX > 0) {
          // Swipe right - previous image
          this.previousImage();
        } else {
          // Swipe left - next image
          this.nextImage();
        }
      }

      isDragging = false;
    }, { passive: true });

    // Touch cancel
    lightboxImage.addEventListener('touchcancel', () => {
      lightboxImage.style.transition = 'transform 0.3s ease';
      lightboxImage.style.transform = '';
      lightboxImage.classList.remove('swiping');
      leftIndicator.classList.remove('show');
      rightIndicator.classList.remove('show');
      isDragging = false;
    }, { passive: true });
  }

  setupKeyboardEvents() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.previousImage();
          e.preventDefault();
          break;
        case 'ArrowRight':
          this.nextImage();
          e.preventDefault();
          break;
      }
    });
  }

  openLightbox(index) {
    if (!this.images.length) return;

    this.currentImageIndex = index;
    this.updateLightboxImage();

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    this.lightbox.querySelector('.md-lightbox__close').focus();
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  previousImage() {
    if (!this.images.length) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateLightboxImage('prev');
  }

  nextImage() {
    if (!this.images.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateLightboxImage('next');
  }

  updateLightboxImage(direction = null) {
    const image = this.images[this.currentImageIndex];
    const lightboxImage = this.lightbox.querySelector('.md-lightbox__image');
    const lightboxTitle = this.lightbox.querySelector('.md-lightbox__title');
    const lightboxDescription = this.lightbox.querySelector('.md-lightbox__description');

    // Add transition animation
    if (direction) {
      lightboxImage.style.opacity = '0.7';
      lightboxImage.style.transform = direction === 'next' ? 'translateX(20px)' : 'translateX(-20px)';
      
      setTimeout(() => {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.title || 'Imagen de galería';
        lightboxTitle.textContent = image.title || 'Imagen de VR Distribución';
        
        // Hide description if empty
        if (lightboxDescription) {
          if (image.description && image.description.trim()) {
            lightboxDescription.textContent = image.description;
            lightboxDescription.style.display = 'block';
          } else {
            lightboxDescription.style.display = 'none';
          }
        }
        
        // Update counter if exists
        const counter = this.lightbox.querySelector('.md-lightbox__counter');
        if (counter) {
          counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
        }
        
        // Restore image
        setTimeout(() => {
          lightboxImage.style.opacity = '1';
          lightboxImage.style.transform = 'translateX(0)';
        }, 50);
      }, 150);
    } else {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.title || 'Imagen de galería';
      lightboxTitle.textContent = image.title || 'Imagen de VR Distribución';
      
      // Hide description if empty
      if (lightboxDescription) {
        if (image.description && image.description.trim()) {
          lightboxDescription.textContent = image.description;
          lightboxDescription.style.display = 'block';
        } else {
          lightboxDescription.style.display = 'none';
        }
      }
      
      // Update counter if exists
      const counter = this.lightbox.querySelector('.md-lightbox__counter');
      if (counter) {
        counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
      }
    }
  }

  // Public API methods
  static getInstance() {
    if (!window.vrGalleryMCP) {
      window.vrGalleryMCP = new VRGalleryMCP();
    }
    return window.vrGalleryMCP;
  }

  addImage(category, imageData) {
    if (this.imageData[category]) {
      this.imageData[category].push(imageData);
      this.setupImageData(); // Recalculate todos
      if (this.currentCategory === category || this.currentCategory === 'todos') {
        this.renderGallery();
      }
    }
  }

  removeImage(category, index) {
    if (this.imageData[category] && this.imageData[category][index]) {
      this.imageData[category].splice(index, 1);
      this.setupImageData(); // Recalculate todos
      if (this.currentCategory === category || this.currentCategory === 'todos') {
        this.renderGallery();
      }
    }
  }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the gallery page
  if (document.querySelector('.md-gallery-tabs')) {
    // Get category from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'todos';
    
    const gallery = VRGalleryMCP.getInstance();
    if (category !== 'todos') {
      gallery.switchCategory(category);
    }
  }
});

// Export for use in other scripts
window.VRGalleryMCP = VRGalleryMCP;
