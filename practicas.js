 //Productos ya declarados
 const Producto = [
  { nombre: "Ramo de Rosas", precio: 700 },
  { nombre: "Ramo de Margaritas", precio: 800 },
  { nombre: "Ramo de Fresias", precio: 900 },
  { nombre: "Ramo Mixto", precio: 1200 },
  { nombre: "Ramo Primaveral", precio: 1500 },
];

//Clase constructora de nuevo objetos
class ramo {
  constructor(nombre, precio) {
      this.nombre = nombre
      this.precio = precio
  }
}

//Función para interactuar y agregar nuevos Ramos a producto
function agregarRamo() {
  let nombreRamo = prompt("Ingrese el nombre del nuevo ramo")
  let nuevoPrecio = prompt("Ingrese el precio")

  let ramonuevo = new ramo(nombreRamo, nuevoPrecio,)

  Producto.push(ramonuevo)
  console.log(Producto)
  return null;

}

//Carrito
let carrito = [];

//Función para agregar al carrito
const addCarrito = () => {
  let nombre = prompt("Ingrese un nombre")
  let resultado = Producto.find((n) => n.nombre.toLowerCase() === nombre.toLowerCase());


  if (resultado) {
      carrito.push(resultado);
      console.log(carrito);
  } else {
      alert("El ramo no existe");
  }
};

//Funcion preciofinal
function precioFinal() {
  let totalPrecios = carrito.reduce(((acumulador, carrito) => acumulador + carrito.precio), 0);
  return totalPrecios;
}

//Interacción con el usuario
let proceso = true;
do {
  let intUsuario = prompt("Desea comprar(Si/No) o Agregar un producto a stock(ADD)").toLowerCase()

  while (intUsuario != "si" && intUsuario != "no" && intUsuario != "add") {
      alert("Por favor ingrese una opcion")
      intUsuario = prompt("Desea comprar(Si/No) o Agregar un producto(ADD)")
  }
  //Si el usuario quiere comprar, agrega al carrito y devuelve precio final
  if (intUsuario == "si") {
      let continuar = true;
      do {
          alert("Nuestra lista de productos")
          let todosLosProductos = Producto.map((Producto) => Producto.nombre + " $" + Producto.precio);
          alert(todosLosProductos.join(" - "));
          addCarrito()
          let afirmativo = prompt("Desea continuar?(Si/No)").toUpperCase()
          if (afirmativo == "NO") {
              continuar = false;

          }
      } while (continuar == true)
      alert("El precio final es: $" + precioFinal())
  }

  else if (intUsuario == "add") {
      let continuar = true;

      //Agrega nuevos ramos a productos
      do {
          agregarRamo();
          alert("Ramo agregado")
          let afirmativo = prompt("Desea agregar otro ramo?(Si/No)").toUpperCase();
          if (afirmativo == "NO") {
              continuar = false;

          }
      } while (continuar == true)
      alert("Ramo/s agregados");
      let seguir = prompt("Desea continuar en la pagina?(Si/No)").toUpperCase
      if (seguir == "NO") {
          proceso = false;
      }
  }
  else if (intUsuario == "no") {
      proceso = false;
  }


} while (proceso == true);

alert("Gracias por visitarnos!")