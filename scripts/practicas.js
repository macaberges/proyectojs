document.addEventListener("DOMContentLoaded", () => {
  async function getProducts() {
    return await fetch("scripts/database.js").then(res => res.json());
  }

  // Variables
  let carrito = [];
  const divisa = "$";
  const DOMitems = document.getElementById("items");
  const DOMcarritoContainer = document.getElementById("chango");
  const DOMcarrito = document.getElementById("carrito");
  const DOMtotal = document.getElementById("total");
  const DOMbotonVaciar = document.getElementById("boton-vaciar");
  const DOMbotonFinalizar = document.getElementById("boton-finalizar");

  // Funciones

  function renderizarProductos(productos) {
    if (DOMitems != null) {
      productos.forEach(prod => {
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
        cardButton.textContent = "Agregar al carrito";
        cardButton.setAttribute("marcador", prod.id);
        cardButton.addEventListener("click", addProduct);

        cardBody.appendChild(cardImage);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardPrice);
        cardBody.appendChild(cardButton);
        card.appendChild(cardBody);
        DOMitems.appendChild(card);
      });
    }
  }

  //Añadir producto a carrito

  function addProduct(evento) {
    carrito.push(evento.target.getAttribute("marcador"));
    renderizarCarrito();
    if (DOMcarritoContainer.getAttribute("aria-expanded") === "false") {
      DOMcarritoContainer.click();
    }
    Toastify({
      text: "¡Agregado al carrito!",
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

  function renderizarCarrito() {
    // Vacía todo el html
    DOMcarrito.textContent = "";
    const liNoElements = document.createElement("li");
    liNoElements.setAttribute("id", "noElements");
    if (carrito.length == 0) {
      liNoElements.style.display = "block";
      liNoElements.classList.add("text-center", "p-3");
      liNoElements.textContent = "Aún no tienes productos en tu carrito";
      DOMcarrito.prepend(liNoElements);
    }

    // No duplicar productos en el carrito
    const carritoSinDuplicados = [...new Set(carrito)];

    carritoSinDuplicados.forEach((item) => {
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        return itemBaseDatos.id === parseInt(item);
      });
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {
        return itemId === item ? (total += 1) : total;
      }, 0);

      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "text-right", "mx-3");

      const label = document.createElement("label");
      label.style.lineHeight = "38px";
      label.textContent = `${numeroUnidadesItem} x ${miItem[0].title} - ${divisa}${miItem[0].price}`;

      listItem.appendChild(label);

      // Boton de borrar
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
  }
  /**
   * Función precio total teniendo en cuenta los productos repetidos
   */
  function calcularTotal() {
    return carrito
      .reduce((total, item) => {
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
          return itemBaseDatos.id === parseInt(item);
        });
        return total + miItem[0].price;
      }, 0)
      .toFixed(2);
  }

  //Función vaciar carrito
  function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
  }

  // Eventos
  DOMbotonVaciar.addEventListener("click", vaciarCarrito);
  DOMbotonFinalizar.addEventListener("click", () => {
    Swal.fire(
      "¡Muchas gracias por tu compra!",
      "Pronto recibiras un e-mail con los detalles.",
      "success"
    );
  });

  // Inicio

  getProducts().then((productos) => {
    console.log(productos);
    baseDeDatos = productos;
    renderizarProductos(productos);
  });

  renderizarCarrito();

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
