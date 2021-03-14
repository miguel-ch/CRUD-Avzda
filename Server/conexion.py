import sqlite3

DATOS = 'db/tienda.db'

def conexion():
    return sqlite3.connect(DATOS)

def ejecutar(query):
    if query:
        con = conexion()
        cursor = con.cursor()
        cursor.execute(query)
        con.commit()

        cont = cursor.fetchall()

        if cont:
            return cont