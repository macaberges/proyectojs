// VARIABLES

let carrito = [];
const divisa = "$";
const miLocalStorage = window.localStorage;
let baseDeDatos = null;
let DOMitems = document.getElementById("items");
let DOMcarritoContainer = document.getElementById("chango");
let DOMcarrito = document.getElementById("carrito");
let DOMswiper = document.getElementById("swiper");
let DOMtotal = document.getElementById("total");

// FUNCIONES

// Función renderizar productos:
function renderizarProductos(productos) {
  if (typeof DOMitems != "undefined" && DOMitems != null) {
    productos.forEach((prod) => {
      // Estructura
      const card = document.createElement("div");
      card.classList.add("card", "col-sm-6", "col-md-4", "col-lg-3");
      // Body
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      // Titulo
      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      cardTitle.textContent = prod.title;
      // Imagen
      const cardImage = document.createElement("img");
      cardImage.classList.add("img-fluid");
      cardImage.setAttribute("src", prod.image);
      // Precio
      const cardPrice = document.createElement("p");
      cardPrice.classList.add("card-text");
      cardPrice.textContent = `${divisa}${prod.price}`;
      // Botón
      const cardButton = document.createElement("button");
      cardButton.classList.add("btn", "btn-outline", "d-flex");
      cardButton.textContent = "Add to Cart";
      cardButton.setAttribute("marcador", prod.id);
      cardButton.addEventListener("click", agregarProducto);
      cardBody.appendChild(cardImage);
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardPrice);
      cardBody.appendChild(cardButton);
      card.appendChild(cardBody);
      DOMitems.appendChild(card);
    });
  }
}

// Función renderizar Swiper:
function renderizarSwiper(productos) {
  if (typeof DOMswiper != "undefined" && DOMswiper != null) {
    const divWrapper = document.createElement("div");
    divWrapper.classList.add("swiper-wrapper");
    productos.slice(0, 9).forEach((prod) => {
      // Estructura
      const divSwiperSlide = document.createElement("div");
      divSwiperSlide.classList.add("swiper-slide");
      divSwiperSlide.innerHTML = `<div class="indexcard">
      <div class="imgslide">
        <img src="${prod.image}"/>
        <h4 class="indexcard-title pt-3">${prod.title}</h4>
           <button class="btn btn-outline mx-auto w-100" 
           marcador="${prod.id}" onclick="agregarProducto(event)">Add to Cart
          </button>
      </div> 
      </div>`;

      divWrapper.appendChild(divSwiperSlide);
    });
    DOMswiper.appendChild(divWrapper);

    new Swiper(".mySwiper", {
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
      breakpoints: {
        400: {
          slidesPerView: 1,
          spaceBetween: 10,
          slidesPerGroup: 1,
        },
        680: {
          slidesPerView: 2,
          spaceBetween: 40,
          slidesPerGroup: 2,
        },
        920: {
          slidesPerView: 2,
          spaceBetween: 40,
          slidesPerGroup: 2,
        },
        1240: {
          slidesPerView: 3,
          spaceBetween: 50,
          slidesPerGroup: 3,
        },
      },
      loop: true,
      loopFillGroupWithBlank: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
}

//Función añadir producto a carrito

function agregarProducto(evento) {
  let prod = baseDeDatos.filter((itemBaseDatos) => { return itemBaseDatos.id === parseInt(evento.target.getAttribute("marcador")); });
  if (prod.length > 0) {
    carrito.push(prod[0].id);
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
    if (DOMcarritoContainer.getAttribute("aria-expanded") === "false") {
      DOMcarritoContainer.click();
    }
    Toastify({
      text: `You added "${prod[0].title}" to your shopping cart.`,
      duration: 1500,
      newWindow: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#f4eaee",
        color: "#db679e",
      },
    }).showToast();
  }
}

//Función renderizar productos en carrito

function renderizarCarrito() {
  // Vacía todo el html
  DOMcarrito.textContent = "";
  const liNoElements = document.createElement("li");
  liNoElements.setAttribute("id", "noElements");
  if (carrito.length == 0) {
    liNoElements.style.display = "block";
    liNoElements.classList.add("text-center", "p-3");
    liNoElements.textContent = "You cart is empty";
    DOMcarrito.prepend(liNoElements);
  }

// No duplicar productos en el carrito
  const carritoSinDuplicados = [...new Set(carrito)];
  carritoSinDuplicados.forEach((item) => {
    const searchedItem = baseDeDatos.filter((itemBaseDatos) => {
      return itemBaseDatos.id === parseInt(item);
    });

    if (searchedItem.length > 0) {
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {
        return itemId === item ? (total += 1) : total;
      }, 0);

      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "text-right", "mx-3");
      const label = document.createElement("label");
      label.style.lineHeight = "38px";
      label.textContent = `${numeroUnidadesItem} x ${searchedItem[0].title} - ${divisa}${searchedItem[0].price}`;
      listItem.appendChild(label);

  // Botón de borrar
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn", "btn-outline-danger", "mx-2");
      const trashicon = document.createElement("i");
      trashicon.classList.add("bi", "bi-trash3-fill");
      trashicon.dataset.item = item;
      deleteBtn.innerHTML = trashicon;
      deleteBtn.innerHTML =
        "<i class='bi bi-trash3-fill' data-item='" + item + "'></i>";
      deleteBtn.style.float = "right";
      deleteBtn.dataset.item = item;
      deleteBtn.addEventListener("click", borrarItemCarrito);

      listItem.appendChild(deleteBtn);
      DOMcarrito.appendChild(listItem);
    }
  });

// Precio total
  DOMtotal.textContent = calcularTotal();
}

//Borrar elemento del carrito (evento)
function borrarItemCarrito(evento) {
  const id = evento.target.dataset.item;
  carrito = carrito.filter((carritoId) => {
    return carritoId !== id;
  });
  renderizarCarrito();
  guardarCarritoEnLocalStorage();
}

//Función precio total teniendo en cuenta los productos repetidos

function calcularTotal() {
  return carrito
    .reduce((total, item) => {
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        return itemBaseDatos.id === parseInt(item);
      });
      let price = 0;
      if (miItem.length > 0) {
        price = miItem[0].price;
      }
      return total + price;
    }, 0)
    .toFixed(2);
}

//Función vaciar carrito
function vaciarCarrito() {
  carrito = [];
  renderizarCarrito();
  miLocalStorage.clear();
}

function finalizarCompra() {
  // Si el carrito no tiene elementos, finalizarCompra no hace nada
  if (carrito.length == 0) {
    return;
  }

  if (DOMcarritoContainer.getAttribute("aria-expanded") === "true") {
    DOMcarritoContainer.click();
  }
  vaciarCarrito();
  Swal.fire(
    "Successful purchase!",
    "You will soon receive an email with the details.",
    "success"
  );
}

//LocalStorage

function guardarCarritoEnLocalStorage() {
  miLocalStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
  if (miLocalStorage.getItem("carrito") !== null) {
    carrito = JSON.parse(miLocalStorage.getItem("carrito"));
  }
}

//DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    async function obtenerProductos() {
      return await fetch("scripts/database.js").then((res) => res.json());
  }

// Variables

  const DOMbotonVaciar = document.getElementById("boton-vaciar");
  const DOMbotonFinalizar = document.getElementById("boton-finalizar");
  DOMitems = document.getElementById("items");
  DOMcarritoContainer = document.getElementById("chango");
  DOMcarrito = document.getElementById("carrito");
  DOMswiper = document.getElementById("swiper");
  DOMtotal = document.getElementById("total");

// Eventos
  DOMbotonVaciar.addEventListener("click", vaciarCarrito);
  DOMbotonFinalizar.addEventListener("click", finalizarCompra);

// Inicio
  obtenerProductos().then((productos) => {
    baseDeDatos = productos;
    renderizarSwiper(productos);
    renderizarProductos(productos);
    cargarCarritoDeLocalStorage();
    renderizarCarrito();
  });

//Agregar efecto al scrollear en navbar

  let nav = document.querySelector("nav");
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 100) {
      nav.classList.add("bg-light", "shadow");
    } else {
      nav.classList.remove("bg-light", "shadow");
    }
  });
});
