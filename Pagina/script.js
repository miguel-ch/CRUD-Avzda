var tabla = document.getElementById("tablas");
var btnMenu = document.getElementById("menu-btn");
var contPrpal = document.getElementById("contenedor-pr");

btnMenu.addEventListener("click", (e) => {
    e.preventDefault()
    contPrpal.classList.toggle("toggled")
}, false)

document.getElementById("btn_clientes").addEventListener("click", cambiar_a_Clientes, false);
document.getElementById("btn_pedidos").addEventListener("click", cambiar_a_Pedidos, false);
document.getElementById("btn_zonas").addEventListener("click", cambiar_a_Zonas, false);
document.getElementById("btn_articulos").addEventListener("click", cambiar_a_Articulos, false);

function cambiar_a_Clientes() {
    tabla.setAttribute("src", "docs/tabla-clientes.html")
}

function cambiar_a_Pedidos() {
    tabla.setAttribute("src", "docs/tabla-pedidos.html")
}

function cambiar_a_Zonas() {
    tabla.setAttribute("src", "docs/tabla-zonas.html")
}

function cambiar_a_Articulos() {
    tabla.setAttribute("src", "docs/tabla-articulos.html")
}

cambiar_a_Zonas()