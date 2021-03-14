//Direccion sv
const API_URL = "http://127.0.0.1:80/api/v1/"
const HEAD_CHECKBOX = '<span class="custom-checkbox"> <input type="checkbox" id="selectAll"> <label for="selectAll"></label> </span>';

//Carga el contenido de una tabla
function cargarTablaCrud(tabla, header, contenido, funcionEditar = null, funcionBorrar = null, skip = []) {

    tabla.innerHTML = ""; //Limpia la tabla

    //----Header
    let headerTabla = document.createElement("thead");
    let headerRow = document.createElement("tr");

    //Nombres columnas
    for (let i = 0; i < header.length; i++) {
        let tmp = document.createElement("th");
        tmp.innerHTML = header[i];
        headerRow.appendChild(tmp)
    }
    headerTabla.appendChild(headerRow)

    //-------Cuerpo de la tabla
    let cuerpo = document.createElement("tbody")

    //Filas
    for (let i = 0; i < contenido.length; i++) {

        let tmpRow = document.createElement("tr");

        //Checkbox

        //Contenido fila
        if (contenido[i]) {
            for (let j = 0; j < contenido[i].length; j++) {
                if (!skip.includes(j)) {
                    let tmp = document.createElement("td");
                    tmp.innerHTML = contenido[i][j];
                    tmpRow.appendChild(tmp);
                }
            }
        }

        //Botones
        let rowBotones = document.createElement("td")
        rowBotones.appendChild(crearBtnEditar(i, funcionEditar));
        rowBotones.appendChild(crearBtnBorrar(i, funcionBorrar));

        tmpRow.appendChild(rowBotones)

        cuerpo.appendChild(tmpRow)
    }
    //----Agrega header y cuerpo a la tabla
    tabla.appendChild(headerTabla)
    tabla.appendChild(cuerpo)
}

function crearBotonTabla(texto, btnCode) {

    //Atributos boton
    let boton = document.createElement("a");
    boton.setAttribute("data-toggle", "modal");

    //Contenido boton
    boton.innerHTML = '<i class="material-icons" data-toggle="tooltip" title="' + texto + '">' + btnCode + '</i>'
    return boton;
}

function crearBtnBorrar(id, funcion = null) {
    let btn = crearBotonTabla("Borrar", "&#xE872;");
    btn.setAttribute("class", "delete")
    if (funcion) {
        btn.addEventListener("click", () => {
            funcion(id);
        }, false)
    } else {
        btn.setAttribute("reg-id", id);
    }
    return btn;
}

function crearBtnEditar(id, funcion = null) {
    let btn = crearBotonTabla("Editar", "&#xE254;");
    btn.setAttribute("class", "edit")
    if (funcion) {
        btn.addEventListener("click", () => {
            funcion(id);
        }, false)
    } else {
        btn.setAttribute("reg-id", id);
    }
    return btn;
}