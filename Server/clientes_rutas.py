from flask import Blueprint, request, jsonify, Response
from config import RUTA_PRINCIPAL
from conexion import ejecutar
from errores import not_found
import json

#Blueprint
clientes = Blueprint('clientes', __name__)

# Crear
@clientes.route(RUTA_PRINCIPAL + 'clientes', methods=['POST'])
def crear_cliente():
    
    #Informacion recibida
    nombre = request.json['nombre']
    direccion = request.json['direccion']
    cod_postal = request.json['cod_postal']
    ciudad = request.json['ciudad']
    telefono = request.json['telefono']
    email = request.json['email']
    descuento = request.json['descuento']
    zonaventas = request.json['zonaventas']

    #Guardar
    if nombre and direccion and cod_postal and ciudad and telefono and email and descuento and zonaventas:
        ejecutar("INSERT INTO tbl_clientes ('nombre','direccion','codpostal','ciudad','telefono','email','descuento','zonaventas') VALUES ('"+nombre+"','"+direccion+"',"+str(cod_postal)+",'"+ciudad+"','"+telefono+"','"+email+"',"+str(descuento)+","+str(zonaventas)+");")

        response = jsonify({
            'message': 'Se creo el cliente correctamente'
        })
        response.status_code = 201
        return response
    else:
        return not_found()

# Leer todo
@clientes.route(RUTA_PRINCIPAL + 'clientes', methods=['GET'])
def get_clientes():
    
    #Obtiene las informacion
    clientes = ejecutar('SELECT * FROM tbl_clientes')
    #Respuesta
    return Response(json.dumps(clientes), mimetype='content-type/json')

# Leer un solo registro
@clientes.route(RUTA_PRINCIPAL + 'clientes/<id>', methods=['GET'])
def get_cliente(id):
    
    #Obtiene las informacion
    cliente = ejecutar('SELECT * FROM tbl_clientes WHERE id='+id)
    #Respuesta
    return Response(json.dumps(cliente), mimetype='content-type/json')

# Actualizar un registro
@clientes.route(RUTA_PRINCIPAL + 'clientes/<id>', methods=['PUT'])
def actualzar_cliente(id):

    #Informacion recibida
    nombre = request.json['nombre']
    direccion = request.json['direccion']
    cod_postal = request.json['cod_postal']
    ciudad = request.json['ciudad']
    telefono = request.json['telefono']
    email = request.json['email']
    descuento = request.json['descuento']
    zonaventas = request.json['zonaventas']

    #Guardar
    if nombre and direccion and cod_postal and ciudad and telefono and email and descuento and zonaventas:
        ejecutar("UPDATE tbl_clientes SET nombre='"+nombre+"', direccion='"+direccion+"', codpostal="+str(cod_postal)+", ciudad='"+ciudad+"', telefono='"+telefono+"', email='"+email+"', descuento="+str(descuento)+", zonaventas="+str(zonaventas)+" WHERE id=" + id)

        response = jsonify({
            'message': 'Se actualizo el cliente correctamente'
        })
        response.status_code = 200
        return response
    else:
        return not_found()

# Borrar un registro
@clientes.route(RUTA_PRINCIPAL + 'clientes/<id>', methods=['DELETE'])
def borrar_cliente(id):
    
    #Borra
    ejecutar('DELETE FROM tbl_clientes WHERE id=' + id)
    #Envia la respuesta
    response = jsonify({
        'message': 'Se elimino el cliente ' + id + ' correctamente'
    })
    response.status_code = 200
    return response