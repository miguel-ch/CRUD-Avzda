//URL Server
const ZONAS_URL = API_URL + "zonas"

//Informacion tabla
const tabla_info = document.querySelector("#tabla_zonas");
const tabla_header = ["Zona", "Descripcion", "Acciones"]

//Ventanas
const mod_agregar = $("#agregarModal")
const mod_editar = $("#editarModal")
const mod_borrar = $("#borrarModal")

//Campos de texto
const txt_desc_nuevo = document.querySelector("#modal-crear-desc")
const txt_desc_edicion = document.querySelector("#modal-editar-desc")

//Botones
const botonAgregar = document.querySelector("#modal-agregar-btn")
const botonEditar = document.querySelector("#modal-editar-btn")
const botonBorrar = document.querySelector("#modal-borrar-confirmar-btn")

//Cantidad
const lbl_cantidad = document.querySelector("#qty")

//Array Zonas
var zonas = []

//Modal EDICION
function mostrarEditar(id) {

    //Carga descripcion
    txt_desc_edicion.value = zonas[id][1];

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

//Limpiar Modal
function limpiarCrear() {
    txt_desc_nuevo.value = ""
}

//Funcion inicial
function iniciarTabla() {

    //Agregar
    botonAgregar.addEventListener("click", (e) => {

        //Informacion para enviar
        let desc = txt_desc_nuevo.value.trim()

        //Verifica la existencia de la informacion
        if (desc) {
            agregarInfo(desc)
        } else {
            alert("Hay informacion vacia!\nLos campos deben estar llenos.")
        }

        //Evita que se recargue la pagina y cierra la ventana
        e.preventDefault();
        mod_agregar.modal("hide")

        //Limpiar
        limpiarCrear()
    }, false)

    //Editar
    botonEditar.addEventListener("click", (e) => {

        //Informacion para enviar
        let desc = txt_desc_edicion.value.trim()
        let bId = mod_editar.attr("c-id")

        //Verifica la existencia de la informacion
        if (bId && desc) {
            editarInfo(bId, desc)
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

    fetch(ZONAS_URL, {
            method: 'GET' //Solo obtiene informacion
        })
        .then(response => response.json())
        .then((datos) => {
            zonas = datos ? datos : [] //Carga el array local
            lbl_cantidad.innerHTML = zonas.length;
            cargarTablaCrud(tabla_info, tabla_header, zonas, mostrarEditar, mostrarBorrar) //Llena la tabla
        })
        .catch(error => alert("Error al cargar las zonas!\n" + error))
}

function agregarInfo(descripcion) {

    fetch(ZONAS_URL, {
            headers: { 'content-type': 'application/json' },
            method: 'POST', //Envia informacion
            body: JSON.stringify({ "descripcion": descripcion }) //Informacion en JSON
        })
        .then(cargarInfo) //Actualiza la tabla despues de agregar
        .catch(error => alert("Hubo un error al crear la zona.\n" + error))
}

function editarInfo(id, descripcion) {

    //Toma el ID real del registro (Base de datos)
    let zonaId = zonas[id][0];

    fetch(ZONAS_URL + "/" + zonaId, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT', //Actualizar informacion (UPDATE)
            body: JSON.stringify({ "descripcion": descripcion }) //Informacion en JSON
        })
        .then(cargarInfo) //Actualiza la tabla
        .catch(error => alert("Hubo un error al editar la zona!\n" + error))
}

function borrarInfo(id) {

    //Toma el ID real del registro (Base de datos)
    let zonaId = zonas[id][0];

    fetch(ZONAS_URL + "/" + zonaId, {
            method: 'DELETE' //Borrar informacion
        })
        .then(cargarInfo) //Actualiza la tabla
        .catch(error => alert("Hubo un error al borrar la zona!\n" + error))
}

//Inicia el html
iniciarTabla()