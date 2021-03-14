//URL Server
const CLIENTES_URL = API_URL + "clientes"
const ZONAS_URL = API_URL + "zonas"

//Informacion tabla
const tabla_info = document.querySelector("#tabla_info");
const tabla_header = ["Cliente", "Nombre", "Direccion", "Codigo Postal", "Ciudad", "Telefono", "Email", "Descuento", "Zona Ventas", "Acciones"]

//Ventanas
const mod_agregar = $("#agregarModal")
const mod_editar = $("#editarModal")
const mod_borrar = $("#borrarModal")

//Nuevo
const txt_nuevo_nombre = document.querySelector("#modal-crear-nombre")
const txt_nuevo_direccion = document.querySelector("#modal-crear-direccion")
const txt_nuevo_postal = document.querySelector("#modal-crear-postal")
const txt_nuevo_ciudad = document.querySelector("#modal-crear-ciudad")
const txt_nuevo_telefono = document.querySelector("#modal-crear-telefono")
const txt_nuevo_email = document.querySelector("#modal-crear-email")
const txt_nuevo_descuento = document.querySelector("#modal-crear-descuento")
const cmb_nuevo_ventas = document.querySelector("#modal-crear-ventas")

//Edicion
const txt_edicion_nombre = document.querySelector("#modal-edicion-nombre")
const txt_edicion_direccion = document.querySelector("#modal-edicion-direccion")
const txt_edicion_postal = document.querySelector("#modal-edicion-postal")
const txt_edicion_ciudad = document.querySelector("#modal-edicion-ciudad")
const txt_edicion_telefono = document.querySelector("#modal-edicion-telefono")
const txt_edicion_email = document.querySelector("#modal-edicion-email")
const txt_edicion_descuento = document.querySelector("#modal-edicion-descuento")
const cmb_edicion_ventas = document.querySelector("#modal-edicion-ventas")

//Botones
const botonAgregar = document.querySelector("#modal-agregar-btn")
const botonEditar = document.querySelector("#modal-editar-btn")
const botonBorrar = document.querySelector("#modal-borrar-confirmar-btn")

//Cantidad
const lbl_cantidad = document.querySelector("#qty")

//Informacion local
var clientes = []
var zonas = []

//Modal EDICION
function mostrarEditar(id) {

    //Carga descripcion
    txt_edicion_nombre.value = clientes[id][1];
    txt_edicion_direccion.value = clientes[id][2];
    txt_edicion_postal.value = clientes[id][3]
    txt_edicion_ciudad.value = clientes[id][4]
    txt_edicion_telefono.value = clientes[id][5]
    txt_edicion_email.value = clientes[id][6]
    txt_edicion_descuento.value = clientes[id][7]
    cmb_edicion_ventas.value = clientes[id][8]

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

//Llena los <select>
function cargarOpciones(zonas) {

    cmb_nuevo_ventas.innerHTML = ""
    cmb_edicion_ventas.innerHTML = ""

    for (let i = 0; i < zonas.length; i++) {

        //Crea la opcion
        let opcion = document.createElement("option")
        opcion.innerHTML = zonas[i][1];
        opcion.value = zonas[i][0];
        let op2 = opcion.cloneNode(true) //Clona la opcion ya creada

        //La agrega al select
        cmb_nuevo_ventas.appendChild(opcion);
        cmb_edicion_ventas.appendChild(op2);
    }
}

//Limpia el modal de creacion
function limpiarCrear() {

    txt_nuevo_nombre.value = "";
    txt_nuevo_direccion.value = "";
    txt_nuevo_postal.value = "";
    txt_nuevo_ciudad.value = "";
    txt_nuevo_telefono.value = "";
    txt_nuevo_email.value = "";
    txt_nuevo_descuento = "";
    cmb_nuevo_ventas.value = 1;
}

function nombresZona(zonas) {
    for (let i = 0; i < clientes.length; i++) {
        for (let j = 0; j < zonas.length; j++) {
            if (zonas[j][0] == clientes[i][8]) { clientes[i][9] = zonas[j][1]; break; }
        }
    }
}

//Funcion inicial
function iniciarTabla() {

    //Agregar
    botonAgregar.addEventListener("click", (e) => {

        //Informacion para enviar
        let nombre = txt_nuevo_nombre.value.trim()
        let direccion = txt_nuevo_direccion.value.trim()
        let postal = txt_nuevo_postal.value.trim()
        let ciudad = txt_nuevo_ciudad.value.trim()
        let telefono = txt_nuevo_telefono.value.trim()
        let email = txt_nuevo_email.value.trim()
        let descuento = txt_nuevo_descuento.value.trim()
        let ventas = cmb_nuevo_ventas.value;

        //Verifica la existencia de la informacion
        if (nombre && direccion && postal && ciudad && telefono && email && descuento && ventas && descuento >= 0) {
            agregarInfo(nombre, direccion, postal, ciudad, telefono, email, descuento, ventas)
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
        let bId = mod_editar.attr("c-id")
        let nombre = txt_edicion_nombre.value.trim()
        let direccion = txt_edicion_direccion.value.trim()
        let postal = txt_edicion_postal.value.trim()
        let ciudad = txt_edicion_ciudad.value.trim()
        let telefono = txt_edicion_telefono.value.trim()
        let email = txt_edicion_email.value.trim()
        let descuento = txt_edicion_descuento.value.trim()
        let ventas = cmb_edicion_ventas.value;

        //Verifica la existencia de la informacion
        if (nombre && direccion && postal && ciudad && telefono && email && descuento && ventas && descuento >= 0) {
            editarInfo(bId, nombre, direccion, postal, ciudad, telefono, email, descuento, ventas)
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
            cargarClientes()
            cargarOpciones(zonas)
        })
        .catch(error => alert("Error al cargar las zonas!\n" + error))
}

function cargarClientes() {

    fetch(CLIENTES_URL, {
            method: 'GET' //Solo obtiene informacion
        })
        .then(response => response.json())
        .then((datos) => {
            clientes = datos ? datos : []; //Carga el array local
            lbl_cantidad.innerHTML = clientes.length;
            nombresZona(zonas)
            cargarTablaCrud(tabla_info, tabla_header, clientes, mostrarEditar, mostrarBorrar, [8]); //Llena la tabla
        })
        .catch(error => alert("Error al cargar los clientes!\n" + error))
}

function agregarInfo(nombre, direccion, postal, ciudad, telefono, email, descuento, ventas) {

    fetch(CLIENTES_URL, {
            headers: { 'content-type': 'application/json' },
            method: 'POST', //Envia informacion
            body: JSON.stringify({
                    "nombre": nombre,
                    "direccion": direccion,
                    "cod_postal": postal,
                    "ciudad": ciudad,
                    "telefono": telefono,
                    "email": email,
                    "descuento": descuento,
                    "zonaventas": ventas
                }) //Informacion en JSON
        })
        .then(cargarInfo) //Actualiza la tabla despues de agregar
        .catch(error => alert("Hubo un error al crear el articulo.\n" + error))
}

function editarInfo(id, nombre, direccion, postal, ciudad, telefono, email, descuento, ventas) {

    //Toma el ID real del registro (Base de datos)
    let clienteId = clientes[id][0];

    fetch(CLIENTES_URL + "/" + clienteId, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT', //Actualizar informacion (UPDATE)
            body: JSON.stringify({
                    "nombre": nombre,
                    "direccion": direccion,
                    "cod_postal": postal,
                    "ciudad": ciudad,
                    "telefono": telefono,
                    "email": email,
                    "descuento": descuento,
                    "zonaventas": ventas
                }) //Informacion en JSON
        })
        .then(cargarInfo) //Actualiza la tabla
        .catch(error => alert("Hubo un error al editar el cliente!\n" + error))
}

function borrarInfo(id) {

    //Toma el ID real del registro (Base de datos)
    let clienteId = clientes[id][0];

    fetch(CLIENTES_URL + "/" + clienteId, {
            method: 'DELETE' //Borrar informacion
        })
        .then(cargarInfo) //Actualiza la tabla
        .catch(error => alert("Hubo un error al borrar el cliente!\n" + error))
}

//Inicia el html
iniciarTabla()