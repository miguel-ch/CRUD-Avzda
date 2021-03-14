from flask import Blueprint, request, jsonify, Response
from config import RUTA_PRINCIPAL
from conexion import ejecutar
from errores import not_found
import json

#Blueprint
zonas = Blueprint('zonas', __name__)

# Crear
@zonas.route(RUTA_PRINCIPAL + 'zonas', methods=['POST'])
def crear_zona():
    # Recibe los datos
    descripcion = request.json['descripcion']

    if descripcion:
        # Base de datos
        ejecutar("INSERT INTO tbl_zonas ('descripcion') VALUES ('"+descripcion+"')")

        # Respuesta
        response = jsonify({
            'message': 'Se creo la zona con exito'
        })
        response.status_code = 201
        return response
    else:
        return not_found()

# Leer todas las zonas
@zonas.route(RUTA_PRINCIPAL + 'zonas', methods=['GET'])
def get_zonas():

    # Base de datos
    zonas = ejecutar('SELECT * FROM tbl_zonas')
    # Respuesta
    response = json.dumps(zonas)
    return Response(response, mimetype="application/json")

# Leer una zona
@zonas.route(RUTA_PRINCIPAL + 'zonas/<id>', methods=['GET'])
def get_zona(id):

    # Base de datos
    zona = ejecutar('SELECT * FROM tbl_zonas WHERE zona = ' + id)
    # Respuesta
    response = json.dumps(zona)
    return Response(response, mimetype="application/json")

# Actualizar una zona
@zonas.route(RUTA_PRINCIPAL + 'zonas/<id>', methods=['PUT'])
def actualzar_zona(id):
    # Recibe los datos
    descripcion = request.json['descripcion']

    if descripcion:
        # Base de datos
        ejecutar("UPDATE tbl_zonas SET descripcion='"+descripcion+"' WHERE zona="+id)
        # Respuesta
        response = jsonify({
            'message': 'Se actualizo la zona ' + id + ' con exito'
        })
        response.status_code = 200
        return response
    else:
        return not_found()

# Borrar una zona
@zonas.route(RUTA_PRINCIPAL + 'zonas/<id>', methods=['DELETE'])
def borrar_zona(id):
    
    # Base de datos
    ejecutar('DELETE FROM tbl_zonas WHERE zona=' + id)
    #Envia la respuesta
    response = jsonify({
        'message': 'Se elimino la zona ' + id + ' correctamente'
    })
    response.status_code = 200
    return response