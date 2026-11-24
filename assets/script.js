// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://motlsamrilejevobaxki.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4ZAdMKh80n29lqjGQPOKDA_it_KPF9c';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Respaldo local por si aún no cargas los datos en Supabase
const productosRespaldo = [
    { id: 1, nombre: "Picada Familiar", categoria: "fuertes", precio: 198000, descripcion: "Frijoles, arroz, chicharrón crujiente, carne molida, chorizo, huevo frito, tajada de plátano y arepa.", imagen: "./assets/img/picada-f.jpg" },
    { id: 2, nombre: "Mojarra Frita", categoria: "fuertes", precio: 35000, descripcion: "Mojarra frita acompañada de arroz, ensalada, tajadas de plátano y arepa.", imagen: "./assets/img/mojarra.jpg" },
    { id: 3, nombre: "Parrillada", categoria: "fuertes", precio: 35000, descripcion: "Parrillada de carnes con papa criolla, yuca frita, ensalada y arepa.", imagen: "./assets/img/parrilada.jpeg" },
    { id: 4, nombre: "Sopa Sancocho", categoria: "entradas", precio: 10000, descripcion: "Sopa tradicional de sancocho criollo con ingredientes frescos de la granja.", imagen: "./assets/img/sopa-sancocho.jpeg" },
    { id: 5, nombre: "Sancocho Especial", categoria: "entradas", precio: 39000, descripcion: "Sancocho completo con presa seleccionada, mazorca, yuca, plátano, arroz y aguacate.", imagen: "./assets/img/sancocho-esp.jpeg" },
    { id: 6, nombre: "Porción de Arepas", categoria: "porciones", precio: 4000, descripcion: "Arepas de maíz tierno a la plancha con abundante queso campesino derretido.", imagen: "./assets/img/arepas.jpg" },
    { id: 7, nombre: "Porción Chorizo", categoria: "porciones", precio: 11000, descripcion: "Porción de chorizo al estilo de la abuela.", imagen: "./assets/img/chorizo.jpg" },
    { id: 8, nombre: "Plátano con queso y bocadillo", categoria: "porciones", precio: 10000, descripcion: "Plátano maduro con queso y bocadillo.", imagen: "./assets/img/platanosqb.jpg" }
];

let productos = [];
let carrito = JSON.parse(localStorage.getItem('atahualpa_cart')) || [];

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

// Elementos Admin
const openAdminBtn = document.getElementById('open-admin-btn');
const modalAdminLogin = document.getElementById('modal-admin-login');
const closeLoginModal = document.getElementById('close-login-modal');
const adminLoginForm = document.getElementById('admin-login-form');
const modalAdminPanel = document.getElementById('modal-admin-panel');
const closePanelModal = document.getElementById('close-panel-modal');
const logoutAdminBtn = document.getElementById('logout-admin-btn');
const productForm = document.getElementById('product-form');
const adminProductsList = document.getElementById('admin-products-list');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// ==========================================
// INICIALIZACIÓN Y CARGA DE MENÚ
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
    actualizarCarrito();
    setupEventListeners();
    initScrollAnimations();
});

async function cargarProductos() {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*')
            .order('id', { ascending: true });

        if (error || !data || data.length === 0) {
            productos = productosRespaldo;
        } else {
            productos = data;
        }
    } catch (e) {
        productos = productosRespaldo;
    }

    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.category || 'todos';
    filtrarYRenderizar(activeFilter);
    renderAdminList();
}

function filtrarYRenderizar(category) {
    if (category === 'todos') {
        renderProducts(productos);
    } else {
        renderProducts(productos.filter(p => p.categoria === category));
    }
}

function renderProducts(items) {
    productsContainer.innerHTML = '';
    items.forEach((prod, index) => {
        const card = document.createElement('div');
        card.classList.add('product-card', 'reveal-zoom');
        card.style.transitionDelay = `${(index % 4) * 0.1}s`;
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${prod.nombre}</h3>
                <p class="product-desc">${prod.descripcion}</p>
                <div class="product-bottom">
                    <span class="product-price">$${Number(prod.precio).toLocaleString('es-CO')}</span>
                    <button class="add-cart-btn" onclick="agregarAlCarrito(${prod.id})">
                        <i class="fa-solid fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
    initScrollAnimations();
}

// ==========================================
// ANIMACIONES SCROLL REVEAL
// ==========================================
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-left, .reveal-right, .reveal-zoom');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filtrarYRenderizar(e.target.dataset.category);
        });
    });

    cartIconWrapper.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', procesarPedidoWhatsApp);

    bookingForm.addEventListener('submit', procesarReserva);
    closeModalBtn.addEventListener('click', () => modalReservation.classList.remove('active'));

    // Eventos Administrador
    openAdminBtn.addEventListener('click', verificarSesionAdmin);
    closeLoginModal.addEventListener('click', () => modalAdminLogin.classList.remove('active'));
    closePanelModal.addEventListener('click', () => modalAdminPanel.classList.remove('active'));
    adminLoginForm.addEventListener('submit', iniciarSesionAdmin);
    logoutAdminBtn.addEventListener('click', cerrarSesionAdmin);
    productForm.addEventListener('submit', guardarProductoAdmin);
    cancelEditBtn.addEventListener('click', resetFormularioAdmin);
}

// ==========================================
// CARRITO DE COMPRAS Y WHATSAPP
// ==========================================
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

window.agregarAlCarrito = function(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
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

window.cambiarCantidad = function(id, delta) {
    const item = carrito.find(p => p.id === id);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) carrito = carrito.filter(p => p.id !== id);
    }
    actualizarCarrito();
};

window.eliminarDelCarrito = function(id) {
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarrito();
};

function actualizarCarrito() {
    localStorage.setItem('atahualpa_cart', JSON.stringify(carrito));
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

function procesarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega platos antes de realizar el pedido.");
        return;
    }

    const cliente = document.getElementById('cart-customer-name').value.trim();
    const direccion = document.getElementById('cart-address').value.trim();

    let mensaje = "¡Hola *Hacienda Atahualpa*! 🤠 Quisiera realizar el siguiente pedido:\n\n";
    if (cliente) mensaje += `*Cliente:* ${cliente}\n`;
    if (direccion) mensaje += `*Entrega:* ${direccion}\n\n`;

    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.cantidad}x ${item.nombre} - $${subtotal.toLocaleString('es-CO')}\n`;
    });

    mensaje += `\n*Total a Pagar:* $${total.toLocaleString('es-CO')} COP\n`;
    mensaje += "¡Quedo atento a la confirmación de mi pedido!";

    // Número oficial de Hacienda Atahualpa (Bogotá - Usme)
    const telefono = "573115357877";
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// ==========================================
// PANEL DE ADMINISTRADOR (SUPABASE AUTH + CRUD)
// ==========================================
async function verificarSesionAdmin() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        renderAdminList();
        modalAdminPanel.classList.add('active');
    } else {
        modalAdminLogin.classList.add('active');
    }
}
async function iniciarSesionAdmin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const submitBtn = adminLoginForm.querySelector('button[type="submit"]');

    // Verificar si aún no se han puesto las llaves de Supabase
    if (SUPABASE_URL.includes('TU-PROYECTO') || SUPABASE_ANON_KEY.includes('TU-LLAVE')) {
        alert("⚠️ Aún no has pegado tu SUPABASE_URL y SUPABASE_ANON_KEY en las primeras líneas de script.js.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Verificando...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    submitBtn.disabled = false;
    submitBtn.textContent = "Ingresar";

    if (error) {
        if (error.message.includes("Email not confirmed")) {
            alert("⚠️ Tu usuario existe en Supabase, pero falta confirmarlo. Ve a Authentication > Users > tres puntos (...) > Confirm user.");
        } else if (error.message.includes("Invalid login credentials")) {
            alert("❌ Correo o contraseña incorrectos. Verifica en Supabase > Authentication > Users que el correo sea exacto y la contraseña tenga mínimo 6 caracteres.");
        } else {
            alert("❌ Error de Supabase: " + error.message);
        }
    } else {
        adminLoginForm.reset();
        modalAdminLogin.classList.remove('active');
        renderAdminList();
        modalAdminPanel.classList.add('active');
    }
}


async function cerrarSesionAdmin() {
    await supabaseClient.auth.signOut();
    modalAdminPanel.classList.remove('active');
}

function renderAdminList() {
    if (!adminProductsList) return;
    adminProductsList.innerHTML = '';
    productos.forEach(prod => {
        const row = document.createElement('div');
        row.classList.add('admin-prod-row');
        row.innerHTML = `
            <div>
                <strong>${prod.nombre}</strong> 
                <span class="badge-cat">${prod.categoria}</span><br>
                <small>$${Number(prod.precio).toLocaleString('es-CO')} COP</small>
            </div>
            <div class="admin-row-actions">
                <button class="btn-edit" onclick="editarProductoAdmin(${prod.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete" onclick="eliminarProductoAdmin(${prod.id})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        adminProductsList.appendChild(row);
    });
}

window.editarProductoAdmin = function(id) {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;
    document.getElementById('prod-id').value = prod.id;
    document.getElementById('prod-nombre').value = prod.nombre;
    document.getElementById('prod-categoria').value = prod.categoria;
    document.getElementById('prod-precio').value = prod.precio;
    document.getElementById('prod-imagen').value = prod.imagen;
    document.getElementById('prod-descripcion').value = prod.descripcion;

    document.getElementById('save-prod-btn').innerHTML = '<i class="fa-solid fa-check"></i> Actualizar Plato';
    cancelEditBtn.style.display = 'inline-flex';
};

function resetFormularioAdmin() {
    productForm.reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('save-prod-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Plato';
    cancelEditBtn.style.display = 'none';
}

async function guardarProductoAdmin(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const payload = {
        nombre: document.getElementById('prod-nombre').value,
        categoria: document.getElementById('prod-categoria').value,
        precio: parseInt(document.getElementById('prod-precio').value),
        imagen: document.getElementById('prod-imagen').value,
        descripcion: document.getElementById('prod-descripcion').value
    };

    let error;
    if (id) {
        ({ error } = await supabaseClient.from('productos').update(payload).eq('id', id));
    } else {
        ({ error } = await supabaseClient.from('productos').insert([payload]));
    }

    if (error) {
        alert("Error al guardar: " + error.message);
    } else {
        resetFormularioAdmin();
        await cargarProductos();
    }
}

window.eliminarProductoAdmin = async function(id) {
    if (!confirm("¿Seguro que deseas eliminar este plato del menú?")) return;
    const { error } = await supabaseClient.from('productos').delete().eq('id', id);
    if (error) {
        alert("No se pudo eliminar: " + error.message);
    } else {
        await cargarProductos();
    }
};

// ==========================================
// RESERVAS (SUPABASE + FORMSPREE)
// ==========================================
async function procesarReserva(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const personas = parseInt(document.getElementById('personas').value);
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const notas = document.getElementById('notas').value;

    const btn = document.getElementById('submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    const formData = new FormData(bookingForm);

    try {
        // 1. Guardar en Supabase
        const { error: supabaseError } = await supabaseClient
            .from('reservas')
            .insert([{ nombre, email, telefono, personas, fecha, hora, notas }]);

        if (supabaseError) {
            throw new Error('Error al guardar en Supabase: ' + supabaseError.message);
        }

        // 2. Enviar correo con Formspree
        const formspreeResponse = await fetch(bookingForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (!formspreeResponse.ok) {
            throw new Error('Formspree rechazó el envío (revisa el enlace action en index.html)');
        }

        reservationMsg.innerHTML = `Muchas gracias <strong>${nombre}</strong>. Hemos recibido tu reserva para <strong>${personas} personas</strong> el día <strong>${fecha}</strong> a las <strong>${hora}</strong>. Te llegará una notificación de confirmación al correo.`;
        modalReservation.classList.add('active');
        bookingForm.reset();

    } catch (error) {
        console.error(error);
        alert("⚠️ " + error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}  
{


    // ==========================================
// CONFIGURACIÓN DE SUPABASE (Poner arriba en script.js)
// ==========================================
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU-LLAVE-ANON-PUBLIC';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// ENVÍO DOBLE: SUPABASE + FORMSPREE
// ==========================================
async function procesarReservaFormspree(e) {
    e.preventDefault();

    // 1. Capturamos los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const personas = parseInt(document.getElementById('personas').value);
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const notas = document.getElementById('notas').value;

    const btn = document.getElementById('submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    const formData = new FormData(bookingForm);

    try {
        // 2. Ejecutamos ambos envíos en paralelo (Supabase y Formspree)
        const [supabaseResponse, formspreeResponse] = await Promise.all([
            // Envío 1: Guardar en base de datos Supabase
            supabaseClient.from('reservas').insert([
                { nombre, email, telefono, personas, fecha, hora, notas }
            ]),
            // Envío 2: Notificar por correo vía Formspree
            fetch(bookingForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
        ]);

        // Verificamos si alguno de los dos falló
        if (supabaseResponse.error) {
            throw new Error('Error en Supabase: ' + supabaseResponse.error.message);
        }
        if (!formspreeResponse.ok) {
            throw new Error('Error en Formspree');
        }

        // 3. Si ambos tuvieron éxito, mostramos tu modal y limpiamos
        reservationMsg.innerHTML = `Muchas gracias <strong>${nombre}</strong>. Hemos recibido tu reserva para <strong>${personas} personas</strong> el día <strong>${fecha}</strong> a las <strong>${hora}</strong>. Te llegará una notificación de confirmación al correo.`;
        modalReservation.classList.add('active');
        bookingForm.reset();

    } catch (error) {
        console.error(error);
        alert("Hubo un problema al procesar tu reserva. Por favor intenta de nuevo.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
}