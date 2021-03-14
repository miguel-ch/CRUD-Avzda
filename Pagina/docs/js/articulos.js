//URL Server
const ARTICULOS_URL = API_URL + "articulos"

//Informacion tabla
const tabla_info = document.querySelector("#tabla_info");
const tabla_header = ["Articulo", "Descripcion", "Precio de venta", "Acciones"]

//Ventanas
const mod_agregar = $("#agregarModal")
const mod_editar = $("#editarModal")
const mod_borrar = $("#borrarModal")

//Campos de texto
const txt_desc_nuevo = document.querySelector("#modal-crear-desc")
const txt_desc_edicion = document.querySelector("#modal-editar-desc")

const txt_precio_nuevo = document.querySelector("#modal-crear-precio")
const txt_precio_edicion = document.querySelector("#modal-editar-precio")

//Botones
const botonAgregar = document.querySelector("#modal-agregar-btn")
const botonEditar = document.querySelector("#modal-editar-btn")
const botonBorrar = document.querySelector("#modal-borrar-confirmar-btn")

//Cantidad
const lbl_cantidad = document.querySelector("#qty")

//Informacion local
var articulos = []

//Modal EDICION
function mostrarEditar(id) {

    //Carga descripcion
    txt_desc_edicion.value = articulos[id][1];
    txt_precio_edicion.value = articulos[id][2];

    //Muestra la ventanta
    mod_editar.attr("c-id", id)
    mod_editar.modal("show");
}

//Modal BORRAR
function mostrarBorrar(id) {

    //Muestra la ventanta
    mod_borrar.attr("c-id", id)
    mod_borrar.modal("show");
}

//Limpiar
function limpiarCrear() {
    txt_desc_nuevo = ""
    txt_precio_nuevo = ""
}

//Funcion inicial
function iniciarTabla() {

    //Agregar
    botonAgregar.addEventListener("click", (e) => {

        //Informacion para enviar
        let desc = txt_desc_nuevo.value.trim()
        let pvp = txt_precio_nuevo.value.trim();

        //Verifica la existencia de la informacion
        if (desc && pvp && pvp >= 0) {
            agregarInfo(desc, pvp)
        } else {
            alert("Hay informacion vacia!\nLos campos deben estar llenos.")
        }

        //Evita que se recargue la pagina y cierra la ventana
        e.preventDefault();
        mod_agregar.modal("hide")
    }, false)

    //Editar
    botonEditar.addEventListener("click", (e) => {

        //Informacion para enviar
        let bId = mod_editar.attr("c-id")
        let desc = txt_desc_edicion.value.trim()
        let pvp = txt_precio_edicion.value.trim();

        //Verifica la existencia de la informacion
        if (bId && desc && pvp && pvp >= 0) {
            editarInfo(bId, desc, pvp)
        } else {
            alert("Hay informacion vacia!\nLos campos deben estar llenos.")
        }

        //Evita que se recargue la pagina y cierra la ventana
        e.preventDefault()
        mod_editar.attr("c-id", "")
        mod_editar.modal("hide")
    }, false);

    //Borrar
    botonBorrar.addEventListener("click", (e) => {

        //Informacion para enviar
        let bId = mod_borrar.attr("c-id")

        //Verifica la existencia de la informacion
        if (bId) {
            borrarInfo(bId);
        } else {
            alert("No se puede borrar la informacion (Error de ID)")
        }

        //Evita que se recargue la pagina y cierra la ventana
        e.preventDefault()
        mod_borrar.attr("c-id", "")
        mod_borrar.modal("hide")
    }, false)

    //Cargar los datos en la tabla
    cargarInfo();
}

//Peticiones servidor
function cargarInfo() {

    fetch(ARTICULOS_URL, {
            method: 'GET' //Solo obtiene informacion
        })
        .then(response => response.json())
        .then((datos) => {
            articulos = datos ? datos : []; //Carga el array local
            lbl_cantidad.innerHTML = articulos.length;
            cargarTablaCrud(tabla_info, tabla_header, articulos, mostrarEditar, mostrarBorrar); //Llena la tabla
        })
        .catch(error => alert("Error al cargar los articulos!\n" + error))
}

function agregarInfo(descripcion, pvp) {

    fetch(ARTICULOS_URL, {
            headers: { 'content-type': 'application/json' },
            method: 'POST', //Envia informacion
            body: JSON.stringify({
                    "nombre": descripcion,
                    "pvp": pvp
                }) //Informacion en JSON
        })
        .then(cargarInfo) //Actualiza la tabla despues de agregar
        .catch(error => alert("Hubo un error al crear el articulo.\n" + error))
}

function editarInfo(id, descripcion, pvp) {

    //Toma el ID real del registro (Base de datos)
    let articuloId = articulos[id][0];

    fetch(ARTICULOS_URL + "/" + articuloId, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT', //Actualizar informacion (UPDATE)
            body: JSON.stringify({
                    "nombre": descripcion,
                    "pvp": pvp
                }) //Informacion en JSON
        })
        .then(cargarInfo) //Actualiza la tabla
        .catch(error => alert("Hubo un error al editar el articulo!\n" + error))
}

function borrarInfo(id) {

    //Toma el ID real del registro (Base de datos)
    let articuloId = articulos[id][0];

    fetch(ARTICULOS_URL + "/" + articuloId, {
            method: 'DELETE' //Borrar informacion
        })
        .then(cargarInfo) //Actualiza la tabla
        .catch(error => alert("Hubo un error al borrar el articulo!\n" + error))
}

//Inicia el html
iniciarTabla()