// Base de datos de productos (Menú Criollo Colombiano)
const productos = [
    {
        id: 1,
        nombre: "Picada Familiar",
        categoria: "fuertes",
        precio: 38000,
        descripcion: "Frijoles, arroz, chicharrón crujiente, carne molida, chorizo, huevo frito, tajada de plátano y arepa.",
        imagen: "./assets/img/picada-f.jpg"
    },
    {
        id: 2,
        nombre: "Ajiaco Santafereño",
        categoria: "fuertes",
        precio: 32000,
        descripcion: "Sopa tradicional con tres tipos de papa, pollo desmechado, mazorca, servido con alcaparras y crema de leche.",
        imagen: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        nombre: "Parrilada",
        categoria: "fuertes",
        precio: 35000,
        descripcion: "Parrillada de carnes con papa criolla, yuca frita, ensalada y arepa.",
        imagen: "./assets/img/parrilada.jpeg"
    },
    {
        id: 4,
        nombre: "Sopa Sancocho",
        categoria: "entradas",
        precio: 15000,
        descripcion: "Empanadas de masa de maíz crujiente rellenas de carne desmechada y papa criolla. Acompañadas con ají.",
        imagen: "./assets/img/sopa-sancocho.jpeg"
    },
    {
        id: 5,
        nombre: "Sancocho Especcial",
        categoria: "entradas",
        precio: 12000,
        descripcion: "Dulce arepa de maíz tierno a la plancha con abundante queso campesino derretido.",
        imagen: "./assets/img/sancocho-esp.jpeg"
    },
    {
        id: 6,
        nombre: "Porcion de Arepas",
        categoria: "bebidas",
        precio: 8000,
        descripcion: "Frutas colombianas: Lulo, Maracuyá, Mango, Mora o Guanábana.",
        imagen: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        nombre: "Porcion Chorizo",
        categoria: "bebidas",
        precio: 14000,
        descripcion: "Porcion de chorizo al estilo de la abuela.",
        imagen: "./assets/img/chorizo.jpg"
    },
];

// Estado del Carrito
let carrito = [];

// Elementos DOM
const productsContainer = document.getElementById('products-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartIconWrapper = document.getElementById('open-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const bookingForm = document.getElementById('booking-form');
const modalReservation = document.getElementById('modal-reservation');
const closeModalBtn = document.getElementById('close-modal');
const reservationMsg = document.getElementById('reservation-message');
const mobileMenuBtn = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(productos);
    setupEventListeners();
    initScrollAnimations();
});

// Renderizar Productos en el Menú con animaciones reveal
function renderProducts(items) {
    productsContainer.innerHTML = '';
    items.forEach((prod, index) => {
        const card = document.createElement('div');
        card.classList.add('product-card', 'reveal-zoom');
        card.style.transitionDelay = `${(index % 4) * 0.1}s`; // Efecto cascada
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${prod.nombre}</h3>
                <p class="product-desc">${prod.descripcion}</p>
                <div class="product-bottom">
                    <span class="product-price">$${prod.precio.toLocaleString('es-CO')}</span>
                    <button class="add-cart-btn" onclick="agregarAlCarrito(${prod.id})">
                        <i class="fa-solid fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
    // Volver a vincular los observadores para los nuevos elementos agregados
    initScrollAnimations();
}

// ==========================================
// ANIMACIONES SCROLL REVEAL (Intersection Observer)
// ==========================================
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-left, .reveal-right, .reveal-zoom');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    });

    revealElements.forEach(el => observer.observe(el));
}

// Configurar Event Listeners
function setupEventListeners() {
    // Menú móvil toggle
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Cerrar menú móvil al hacer clic en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    // Filtros de categoría
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.dataset.category;
            if (category === 'todos') {
                renderProducts(productos);
            } else {
                const filtrados = productos.filter(p => p.categoria === category);
                renderProducts(filtrados);
            }
        });
    });

    // Abrir/Cerrar Carrito
    cartIconWrapper.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Envío por WhatsApp
    checkoutBtn.addEventListener('click', procesarPedidoWhatsApp);

    // Formulario de Reserva con Formspree vía AJAX
    bookingForm.addEventListener('submit', procesarReservaFormspree);
    closeModalBtn.addEventListener('click', () => modalReservation.classList.remove('active'));
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Funciones del Carrito
window.agregarAlCarrito = function(id) {
    const producto = productos.find(p => p.id === id);
    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
};

function cambiarCantidad(id, delta) {
    const item = carrito.find(p => p.id === id);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }
    }
    actualizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarrito();
}

function actualizarCarrito() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalCount = 0;

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center" style="color:#888; margin-top:30px;">Tu carrito está vacío</p>';
    } else {
        carrito.forEach(item => {
            const itemTotal = item.precio * item.cantidad;
            total += itemTotal;
            totalCount += item.cantidad;

            const cartItemHTML = document.createElement('div');
            cartItemHTML.classList.add('cart-item');
            cartItemHTML.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.nombre}</div>
                    <div class="cart-item-price">$${itemTotal.toLocaleString('es-CO')}</div>
                    <div class="cart-controls">
                        <button class="qty-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="qty-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                </div>
                <i class="fa-solid fa-trash remove-item" onclick="eliminarDelCarrito(${item.id})"></i>
            `;
            cartItemsContainer.appendChild(cartItemHTML);
        });
    }

    cartTotalElement.textContent = `$${total.toLocaleString('es-CO')} COP`;
    cartCountElement.textContent = totalCount;
}

// Procesar pedido enviándolo a WhatsApp
function procesarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega platos antes de realizar el pedido.");
        return;
    }

    let mensaje = "¡Hola Hacienda Atahualpa! Quisiera realizar el siguiente pedido:\n\n";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.cantidad}x ${item.nombre} - $${subtotal.toLocaleString('es-CO')}\n`;
    });

    mensaje += `\n*Total a Pagar:* $${total.toLocaleString('es-CO')} COP\n`;
    mensaje += "¡Quedo atento a la confirmación de mi pedido!";

    const telefono = "573001234567";
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// INTEGRACIÓN FORMSPREE CON AJAX (Para no recargar la página)
async function procesarReservaFormspree(e) {
    e.preventDefault();

    // 1. Capturamos los valores ANTES de enviar o limpiar el formulario
    const nombre = document.getElementById('nombre').value;
    const personas = document.getElementById('personas').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    const btn = document.getElementById('submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    const data = new FormData(bookingForm);
    
    try {
        const response = await fetch(bookingForm.action, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // 2. Armamos el mensaje de confirmación con los datos capturados
            reservationMsg.innerHTML = `Muchas gracias <strong>${nombre}</strong>. Hemos recibido tu reserva para <strong>${personas} personas</strong> el día <strong>${fecha}</strong> a las <strong>${hora}</strong>. Te llegará una notificación de confirmación al correo.`;
            modalReservation.classList.add('active');
            
            // 3. Ahora sí limpiamos el formulario
            bookingForm.reset();
        } else {
            alert("Hubo un error al enviar la reserva. Asegúrate de configurar correctamente tu ID de Formspree.");
        }
    } catch (error) {
        alert("Ocurrió un error de conexión al procesar el envío.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}