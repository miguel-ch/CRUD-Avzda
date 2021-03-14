from flask import Flask, jsonify, Blueprint

errores = Blueprint('errores', __name__)

@errores.errorhandler(404)
def not_found(error=None):
    response = jsonify({
        'message': 'Resource not found',
        'status': 404
    })
    response.status_code = 404
    return response