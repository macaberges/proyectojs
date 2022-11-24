document.addEventListener("DOMContentLoaded", () => {
  const baseDeDatos = [
    {
      id: 1,
      nombre: "Ramo Estambul",
      precio: 1500,
      imagen: "./img/ramo1.jfif",
    },

    {
      id: 2,
      nombre: "Ramo Kyoto",
      precio: 1800,
      imagen: "./img/ramo2.jfif",
    },
    {
      id: 3,
      nombre: "Ramo Bangkok",
      precio: 2300,
      imagen: "./img/ramo3.jfif",
    },
    {
      id: 4,
      nombre: "Ramo Praga",
      precio: 3000,
      imagen: "./img/ramo4.jfif",
    },
    {
      id: 5,
      nombre: "Ramo Venecia",
      precio: 1500,
      imagen: "./img/ramo5.jfif",
    },
    {
      id: 6,
      nombre: "Ramo Beirut",
      precio: 1800,
      imagen: "./img/ramo6.jfif",
    },
    {
      id: 7,
      nombre: "Ramo Bergen",
      precio: 2300,
      imagen: "./img/ramo7.jfif",
    },
    {
      id: 8,
      nombre: "Ramo Buenos Aires",
      precio: 3000,
      imagen: "./img/ramo8.jfif",
    },
    {
      id: 9,
      nombre: "Ramo Doha",
      precio: 1500,
      imagen: "./img/ramo9.jfif",
    }, 
  
  ];

  let carrito = [];
  const divisa = "$";
  const DOMitems = document.getElementById("items");
  const DOMcarritoContainer = document.getElementById("chango");
  const DOMcarrito = document.getElementById("carrito");
  const DOMtotal = document.getElementById("total");
  const DOMbotonVaciar = document.getElementById("boton-vaciar");
  const DOMbotonFinalizar = document.getElementById("boton-finalizar");

  // Funciones

  function renderizarProductos() {
    if (DOMitems != null) {
      baseDeDatos.forEach((info) => {
        // Estructura
      const miNodo = document.createElement("div");
      miNodo.classList.add("card", "col-sm-6", "col-md-4", "col-lg-3");
      // Body
      const miNodoCardBody = document.createElement("div");
      miNodoCardBody.classList.add("card-body");
      // Titulo
      const miNodoTitle = document.createElement("h5");
      miNodoTitle.classList.add("card-title");
      miNodoTitle.textContent = info.nombre;
      // Imagen
      const miNodoImagen = document.createElement("img");
      miNodoImagen.classList.add("img-fluid");
      miNodoImagen.setAttribute("src", info.imagen);
      // Precio
      const miNodoPrecio = document.createElement("p");
      miNodoPrecio.classList.add("card-text");
      miNodoPrecio.textContent = `${divisa}${info.precio}`;
      // Boton
      const miNodoBoton = document.createElement("button");
      miNodoBoton.classList.add("btn", "btn-outline", "d-flex");
      miNodoBoton.textContent = "Agregar al carrito";
      miNodoBoton.setAttribute("marcador", info.id);
      miNodoBoton.addEventListener("click", addProductoAlCarrito);
      // Añadimos
      miNodoCardBody.appendChild(miNodoImagen);
      miNodoCardBody.appendChild(miNodoTitle);
      miNodoCardBody.appendChild(miNodoPrecio);
      miNodoCardBody.appendChild(miNodoBoton);
      miNodo.appendChild(miNodoCardBody);
      DOMitems.appendChild(miNodo);
    });
  }
}

  //Añadir producto a carrito

  function addProductoAlCarrito(evento) {
    carrito.push(evento.target.getAttribute("marcador"));
    renderizarCarrito();
    if (DOMcarritoContainer.getAttribute("aria-expanded") === 'false') {
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
        color: "#db679e"
      },
    }).showToast();
  } 
  /**
   * Dibuja todos los productos guardados en el carrito
   */
  function renderizarCarrito() {
    // Vaciamos todo el html 
    DOMcarrito.textContent = "";

    const liNoElements = document.createElement("li");
    liNoElements.setAttribute("id", "noElements");
    if (carrito.length == 0) {
      liNoElements.style.display = 'block'
      liNoElements.classList.add ("text-center", "p-3");
      liNoElements.textContent = 'Aún no tienes productos en tu carrito';
      DOMcarrito.prepend(liNoElements);
    }

    const carritoSinDuplicados = [...new Set(carrito)];
    
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
      // Obtenemos el item que necesitamos de la variable base de datos
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        // ¿Coincide las id? Solo puede existir un caso
        return itemBaseDatos.id === parseInt(item);
      });
      // Cuenta el número de veces que se repite el producto
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {
        // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
        return itemId === item ? (total += 1) : total;
      }, 0);
      // Creamos el nodo del item del carrito
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "text-right", "mx-3");
      
      const label = document.createElement("label");
      label.style.lineHeight = '38px';
      label.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;

      listItem.appendChild(label);

      // Boton de borrar
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn", "btn-outline-danger", "mx-2");
      
      const trashicon = document.createElement("i");
      trashicon.classList.add("bi", "bi-trash3-fill");
      trashicon.dataset.item = item;

      deleteBtn.innerHTML = trashicon;

      deleteBtn.innerHTML = "<i class='bi bi-trash3-fill' data-item='" + item + "'></i>";
      deleteBtn.style.float = "right"; 
      deleteBtn.dataset.item = item;
      deleteBtn.addEventListener("click", borrarItemCarrito);
      // Mezclamos nodos
      listItem.appendChild(deleteBtn);
      DOMcarrito.appendChild(listItem);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
  }

  /**
   * Evento para borrar un elemento del carrito
   */
  function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
      return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
  } 
  /**
   * Calcula el precio total teniendo en cuenta los productos repetidos
   */
  function calcularTotal() {
    // Recorremos el array del carrito
    return carrito
      .reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
          return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
      }, 0)
      .toFixed(2);
  }

  /**
   * Vacia el carrito y vuelve a dibujarlo
   */
  function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
  }

  // Eventos
  DOMbotonVaciar.addEventListener("click", vaciarCarrito);

  
  DOMbotonFinalizar.addEventListener("click", () => {
    Swal.fire(
      '¡Muchas gracias por tu compra!',
      'Pronto recibiras un e-mail con los detalles.',
      'success'
    )
  })

  // Inicio
  renderizarProductos();
  renderizarCarrito();
 

  let nav = document.querySelector("nav");
    window.addEventListener("scroll", function () {
        if (window.pageYOffset > 100) {
            nav.classList.add("bg-light", "shadow");
        } else {
            nav.classList.remove("bg-light", "shadow");
        }
    });
});
