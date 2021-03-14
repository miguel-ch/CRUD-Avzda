//URL Server
const PEDIDOS_URL = API_URL + "pedidos"
const CLIENTES_URL = API_URL + "clientes"
const ARTICULOS_URL = API_URL + "articulos"

//Informacion tabla
const tabla_info = document.querySelector("#tabla_info");
const tabla_header = ["Pedido", "Cliente", "Articulo", "Unidades", "Fecha"];

//Ventanas
const mod_agregar = $("#agregarModal")
const mod_editar = $("#editarModal")
const mod_borrar = $("#borrarModal")

//Nuevo
const cmb_nuevo_clientes = document.querySelector("#modal-crear-cliente")
const cmb_nuevo_articulos = document.querySelector("#modal-crear-articulo")
const txt_nuevo_unidades = document.querySelector("#modal-crear-unidades")
const txt_nuevo_fecha = document.querySelector("#modal-crear-fecha")

//Edicion
const cmb_edicion_clientes = document.querySelector("#modal-edicion-cliente")
const cmb_edicion_articulos = document.querySelector("#modal-edicion-articulo")
const txt_edicion_unidades = document.querySelector("#modal-edicion-unidades")
const txt_edicion_fecha = document.querySelector("#modal-edicion-fecha")

//Botones
const botonAgregar = document.querySelector("#modal-agregar-btn")
const botonEditar = document.querySelector("#modal-editar-btn")
const botonBorrar = document.querySelector("#modal-borrar-confirmar-btn")

//Cantidad
const lbl_cantidad = document.querySelector("#qty")

//Informacion local
var pedidos = []
var pedidos_tbl = [
    []
]
var clientes = []
var articulos = []

//Modal EDICION
function mostrarEditar(id) {

    //Carga descripcion
    cmb_edicion_clientes.value = pedidos[id][1];
    cmb_edicion_articulos.value = pedidos[id][2];
    txt_edicion_unidades.value = pedidos[id][3]
    txt_edicion_fecha.value = pedidos[id][4]

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
function cargarOpcionesClientes(clientes) {

    cmb_nuevo_clientes.innerHTML = ""
    cmb_edicion_clientes.innerHTML = ""

    for (let i = 0; i < clientes.length; i++) {

        //Crea la opcion
        let opcion = document.createElement("option")
        opcion.innerHTML = clientes[i][1];
        opcion.value = clientes[i][0];
        let op2 = opcion.cloneNode(true) //Clona la opcion ya creada

        //La agrega al select
        cmb_nuevo_clientes.appendChild(opcion);
        cmb_edicion_clientes.appendChild(op2);
    }
}

function cargarOpcionesArticulos(articulos) {

    cmb_nuevo_articulos.innerHTML = ""
    cmb_edicion_articulos.innerHTML = ""

    for (let i = 0; i < articulos.length; i++) {

        //Crea la opcion
        let opcion = document.createElement("option")
        opcion.innerHTML = articulos[i][1];
        opcion.value = articulos[i][0];
        let op2 = opcion.cloneNode(true) //Clona la opcion ya creada

        //La agrega al select
        cmb_nuevo_articulos.appendChild(opcion);
        cmb_edicion_articulos.appendChild(op2);
    }
}

function limpiarCrear() {
    cmb_nuevo_clientes.value = 1
    cmb_nuevo_articulos.value = 1
    txt_nuevo_unidades.value = ""
    txt_nuevo_fecha.value = ""
}

//Carga los nombres en el pedido
function nombresPedidos(clientes, articulos) {

    //Clientes
    for (let i = 0; i < pedidos.length; i++) {
        for (let j = 0; j < clientes.length; j++) {
            if (clientes[j][0] == pedidos[i][1]) {
                pedidos[i][5] = clientes[j][1];
                break;
            }
        }
    }

    //Articulos
    for (let i = 0; i < pedidos.length; i++) {
        for (let j = 0; j < articulos.length; j++) {
            if (articulos[j][0] == pedidos[i][2]) {
                pedidos[i][6] = articulos[j][1];
                pedidos[i][7] = pedidos[i][3]
                pedidos[i][8] = pedidos[i][4]
                break;
            }
        }
    }
}

//Funcion inicial
function iniciarTabla() {

    //Agregar
    botonAgregar.addEventListener("click", (e) => {

        //Informacion para enviar
        let cliente = cmb_nuevo_clientes.value
        let articulo = cmb_nuevo_articulos.value
        let unidades = txt_nuevo_unidades.value
        let fecha = txt_nuevo_fecha.value.trim()

        //Verifica la existencia de la informacion
        if (cliente && articulo && unidades && fecha && unidades > 0) {
            agregarInfo(cliente, articulo, unidades, fecha)
        } else {
            alert("Hay informacion vacia!\nLos campos deben estar llenos.")
        }

        //Evita que se recargue la pagina y cierra la ventana
        e.preventDefault();
        mod_agregar.modal("hide")

        //Limpia el modal
        limpiarCrear()
    }, false)

    //Editar
    botonEditar.addEventListener("click", (e) => {

        //Informacion para enviar
        let bId = mod_editar.attr("c-id")
        let cliente = cmb_edicion_clientes.value
        let articulo = cmb_edicion_articulos.value
        let unidades = txt_edicion_unidades.value
        let fecha = txt_edicion_fecha.value.trim()

        //Verifica la existencia de la informacion
        if (cliente && articulo && unidades && fecha && unidades > 0) {
            editarInfo(bId, cliente, articulo, unidades, fecha)
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

    fetch(CLIENTES_URL, {
            method: 'GET' //Solo obtiene informacion
        })
        .then(response => response.json())
        .then((datos) => {
            clientes = datos ? datos : [] //Carga el array local
            cargarArticulos()
            cargarOpcionesClientes(clientes)
        })
        .catch(error => alert("Error al cargar los clientes!\n" + error))
}

function cargarArticulos() {
    fetch(ARTICULOS_URL, {
            method: 'GET' //Solo obtiene informacion
        })
        .then(response => response.json())
        .then((datos) => {
            articulos = datos ? datos : [] //Carga el array local
            cargarPedidos()
            cargarOpcionesArticulos(articulos)
        })
        .catch(error => alert("Error al cargar los articulos!\n" + error))
}

function cargarPedidos() {

    fetch(PEDIDOS_URL, {
            method: 'GET' //Solo obtiene informacion
        })
        .then(response => response.json())
        .then((datos) => {
            pedidos = datos ? datos : []; //Carga el array local
            lbl_cantidad.innerHTML = pedidos.length;
            nombresPedidos(clientes, articulos)
            cargarTablaCrud(tabla_info, tabla_header, pedidos, mostrarEditar, mostrarBorrar, [1, 2, 3, 4]); //Llena la tabla
        })
        .catch(error => alert("Error al cargar los pedidos!\n" + error))
}

function agregarInfo(cliente, articulo, unidades, fecha) {

    fetch(PEDIDOS_URL, {
            headers: { 'content-type': 'application/json' },
            method: 'POST', //Envia informacion
            body: JSON.stringify({
                    "cliente": cliente,
                    "articulo": articulo,
                    "unidades": unidades,
                    "fecha": fecha,
                }) //Informacion en JSON
        })
        .then(cargarInfo) //Actualiza la tabla despues de agregar
        .catch(error => alert("Hubo un error al crear el articulo.\n" + error))
}

function editarInfo(id, cliente, articulo, unidades, fecha) {

    //Toma el ID real del registro (Base de datos)
    console.log(fecha + " | " + typeof(fecha))
    let pedidoId = pedidos[id][0];

    fetch(PEDIDOS_URL + "/" + pedidoId, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT', //Actualizar informacion (UPDATE)
            body: JSON.stringify({
                    "cliente": cliente,
                    "articulo": articulo,
                    "unidades": unidades,
                    "fecha": fecha,
                }) //Informacion en JSON
        })
        .then(cargarInfo) //Actualiza la tabla
        .catch(error => alert("Hubo un error al editar el pedido!\n" + error))
}

function borrarInfo(id) {

    //Toma el ID real del registro (Base de datos)
    let pedidoId = pedidos[id][0];

    fetch(PEDIDOS_URL + "/" + pedidoId, {
            method: 'DELETE' //Borrar informacion
        })
        .then(cargarInfo) //Actualiza la tabla
        .catch(error => alert("Hubo un error al borrar el pedido!\n" + error))
}

//Inicia el html
iniciarTabla()