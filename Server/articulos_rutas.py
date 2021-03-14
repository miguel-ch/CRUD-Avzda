from flask import Blueprint, request, jsonify, Response
from config import RUTA_PRINCIPAL
from conexion import ejecutar
from errores import not_found
import json

#Blueprint
articulos = Blueprint('articulos', __name__)

#Crear
@articulos.route(RUTA_PRINCIPAL + 'articulos', methods=['POST'])
def crear_articulo():

    #Recibe datos
    nombre = request.json['nombre']
    precio = request.json['pvp']

    if nombre and precio:
        ejecutar('INSERT INTO tbl_articulos (nombre, precio) VALUES ("'+nombre+'", "'+precio+'")')

        response = jsonify({
            'message':'Se creo el articulo correctamente'
        })
        response.status_code = 201
        return response
    else:
        return not_found()

# Leer todo
@articulos.route(RUTA_PRINCIPAL + 'articulos', methods=['GET'])
def get_articulos():

    #Obtiene las informacion
    arti = ejecutar('SELECT * FROM tbl_articulos')
    #Respuesta
    return Response(json.dumps(arti), mimetype='content-type/json')

# Leer un solo registro
@articulos.route(RUTA_PRINCIPAL + 'articulos/<id>', methods=['GET'])
def get_articulo(id):

    #Obtiene las informacion
    arti = ejecutar('SELECT * FROM tbl_articulos WHERE id='+id)
    #Respuesta
    return Response(json.dumps(arti), mimetype='content-type/json')

# Actualizar un registro
@articulos.route(RUTA_PRINCIPAL + 'articulos/<id>', methods=['PUT'])
def actualizar_articulo(id):
    
    #Obtiene la informacion  
    nombre = request.json['nombre']
    precio = request.json['pvp']
    
    #Respuesta
    if nombre and precio:
        ejecutar('UPDATE tbl_articulos SET nombre="'+nombre+'", precio="'+precio+'" WHERE id='+id)
    
        response = jsonify({
            'message': 'Se actualizo el articulo correctamente'
        })
        response.status_code = 200
        return response
    else:
        return not_found()

# Borrar un registro
@articulos.route(RUTA_PRINCIPAL + 'articulos/<id>', methods=['DELETE'])
def borrar_articulo(id):
    
    #Borra
    ejecutar('DELETE FROM tbl_articulos WHERE id=' + id)
    #Envia la respuesta
    response = jsonify({
        'message': 'Se elimino la zona ' + id + ' correctamente'
    })
    response.status_code = 200
    return response