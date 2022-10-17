//Interacción con el usuario
bienvenida();
function bienvenida() {
  let preguntaPrincipal = true;
  while (preguntaPrincipal) {
    let pregunta = prompt(`¡Bienvenido a Blooming Bouquet! ¿Deseas comprar nuestros ramos de flores?`).toLowerCase();
    if (pregunta == "si") {
      preguntaPrincipal = false;
      mostrarLista();
    } else if (pregunta == "no") {
      preguntaPrincipal = false;
      alert("¡Gracias por visitarnos ♥ !");
    } else {
      alert("Por favor responde con si o no");
    }
  }
}

function mostrarLista() {
  // precio productos
  const precioRamo1 = 500;
  const precioRamo2 = 700;
  const precioRamo3 = 900;
  const precioRamo4 = 1300;

  let listaRamos= true;
  let carrito = 0;
  let cantidadRamos = "";
  while (listaRamos) {
    let lista = parseInt(
      prompt(`¿Que producto desea comprar?
        1. Ramo de Rosas $${precioRamo1}
        2. Ramo de Margaritas $${precioRamo2}
        3. Ramo Otoñal $${precioRamo3}
        4. Ramo Mixto $${precioRamo4}
        0. No deseo comprar otro producto.`)
    );
    switch (lista) {
      case 1:
        alert("Ramo de Rosas agregado al carrito");
        cantidadRamos += `Ramo de Rosas
            `;
        carrito += precioRamo1;
        break;
      case 2:
        alert("Ramo de Margaritas agregado al carrito");
        cantidadRamos += `Ramo de Margaritas
            `;
        carrito += precioRamo2;
        break;
      case 3:
        alert("Ramo otoñal agregado al carrito");
        cantidadRamos += `Ramo otoñal
            `;
        carrito += precioRamo3;
        break;
      case 4:
        alert("Ramo mixto agregado al carrito");
        cantidadRamos += `Ramo mixto
            `;
        carrito += precioRamo4;
        break;
      case 0:
        listaRamos= false;
        if (carrito != 0) {
          alert(`El total de su compra es de $${carrito}, llevando los siguientes ramos:
                     ${cantidadRamos}  Gracias por su visita!`);
        } else {
          alert(`Usted no agregó productos al carrito.`);
        }
        break;
      default:
        alert(
          "Respuesta no válida, porfavor escriba correctamente la opción deseada."
        );
    }
  }
}
