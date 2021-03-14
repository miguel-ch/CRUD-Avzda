from flask import Flask
from flask_cors import CORS
from errores import errores
from zonas_rutas import zonas
from articulos_rutas import articulos
from clientes_rutas import clientes
from pedidos_rutas import pedidos

#Configuracion inicial
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

#Errores
app.register_blueprint(errores)
app.register_blueprint(zonas)
app.register_blueprint(articulos)
app.register_blueprint(clientes)
app.register_blueprint(pedidos)

#Rutas
app.register_blueprint(zonas)

if __name__ == "__main__":
    app.run(debug=True, port=80)