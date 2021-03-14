from flask import Blueprint, request, jsonify, Response
from config import RUTA_PRINCIPAL
from conexion import ejecutar
from errores import not_found
import json

#Blueprint
pedidos = Blueprint('pedidos', __name__)

# Crear
@pedidos.route(RUTA_PRINCIPAL + 'pedidos', methods=['POST'])
def crear_pedido():
    
    #Recibe datos
    cod_cliente = request.json['cliente']
    cod_articulo = request.json['articulo']
    unidades = request.json['unidades']
    fecha = request.json['fecha']

    if cod_cliente and cod_articulo and fecha:
        ejecutar("INSERT INTO tbl_pedidos ('cod_cliente', 'cod_articulo', 'unidades', 'fecha') VALUES ('"+str(cod_cliente)+"', '"+str(cod_articulo)+"', '"+str(unidades)+"', '"+str(fecha)+"')")

        response = jsonify({
            'message':'Se creo el pedido correctamente'
        })
        response.status_code = 201
        return response
    else:
        return not_found()

# Leer todo
@pedidos.route(RUTA_PRINCIPAL + 'pedidos', methods=['GET'])
def get_pedidos():

    #Informacion
    ped = ejecutar('SELECT * FROM tbl_pedidos')
    #Respuesta
    return Response(json.dumps(ped), mimetype="content-type/json")

# Leer un solo registro
@pedidos.route(RUTA_PRINCIPAL + 'pedidos/<id>', methods=['GET'])
def get_pedido(id):

    #Informacion
    ped = ejecutar('SELECT * FROM tbl_pedidos WHERE id='+id)
    #Respuesta
    return Response(json.dumps(ped), mimetype="content-type/json")

# Actualizar un registro
@pedidos.route(RUTA_PRINCIPAL + 'pedidos/<id>', methods=['PUT'])
def actualzar_pedido(id):
    
    #Recibe datos
    cod_cliente = request.json['cliente']
    cod_articulo = request.json['articulo']
    unidades = request.json['unidades']
    fecha = request.json['fecha']

    if cod_cliente and cod_articulo and fecha:
        ejecutar("UPDATE tbl_pedidos SET cod_cliente="+str(cod_cliente)+", cod_articulo="+str(cod_articulo)+", unidades='"+str(unidades)+"', fecha='"+str(fecha)+"' WHERE id="+id)

        response = jsonify({
            'message':'Se actualizo el pedido correctamente'
        })
        response.status_code = 200
        return response
    else:
        return not_found()

# Borrar un registro
@pedidos.route(RUTA_PRINCIPAL + 'pedidos/<id>', methods=['DELETE'])
def borrar_pedido(id):
   
    #Informacion
    ejecutar('DELETE FROM tbl_pedidos WHERE id='+id)
    #Respuesta
    response = jsonify({
        'message': 'Se borro el pedido correctamente'
    })
    response.status_code=200
    return response