from flask import Flask, render_template, request, redirect, url_for
from flaskext.mysql import MySQL

app = Flask(_name_)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'agenda'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_PORT'] = 3306
mysql.init_app(app)

conn = mysql.connect()
cursor =conn.cursor()

@app.route('/')
def principal():
    cursor.execute("SELECT * from usuarios")
    data = cursor.fetchall()
    return render_template('principal.html', usuarios = data )

@app.route('/contactos')
def ver_contactos():
    cursor.execute("SELECT usu_nombre, con_nombre, con_apellido, con_direccion, con_telefono, con_email " +
                    "FROM usuarios as usu " + 
                    "INNER JOIN contactos as con on (usu.usu_id = con.usu_id) ")
    data = cursor.fetchall()
    return render_template('contactos.html', contactos = data )

@app.route('/usuarios')
def ver_usuarios():
    cursor.execute("SELECT * from usuarios")
    data = cursor.fetchall()
    return render_template('usuarios.html', usuarios = data )

@app.route('/citas')
def ver_citas():
    cursor.execute("SELECT usu_nombre, con_nombre, con_apellido, con_telefono, cit_lugar, cit_fecha, cit_hora, cit_descripcion " +
                    "FROM usuarios as usu " + 
                    "LEFT JOIN contactos as con on (usu.usu_id = con.usu_id) " +
                    "LEFT JOIN citas as cit on (con.con_id = cit.con_id)")
    data = cursor.fetchall()
    return render_template('citas.html', citas = data )

@app.route('/todos')
def ver_todos():
    cursor.execute("SELECT usu_nombre, con_nombre, con_apellido, con_telefono, cit_lugar, cit_fecha " +
                    "FROM usuarios as usu " + 
                    "LEFT JOIN contactos as con on (usu.usu_id = con.usu_id) " +
                    "LEFT JOIN citas as cit on (con.con_id = cit.con_id)")
    data = cursor.fetchall()
    return render_template('todos.html', citas = data )

@app.route('/eliminar_usuario', methods=['GET'])
def eliminar_usuario():
    if request.method == 'GET':
        id = request.args["id"]
        cursor.execute("DELETE from usuarios where usu_id = " + id)
        conn.commit()
        return redirect(url_for('ver_usuarios'))
        

@app.route("/agregar_usuario", methods = ['GET', 'POST'])
def agregar_usuario():
    if request.method == 'POST':
        nombre = request.form["nombre"]
        clave = request.form["clave"]
        cursor.execute("""INSERT INTO `usuarios`(`usu_nombre`, `usu_clave`) VALUES (%s, sha1(%s));""", (nombre, clave)) 
        conn.commit()
        return redirect(url_for('ver_usuarios'))
    else:
        return render_template('agregar_usuario.html')
        
@app.route('/actualizar_usuario', methods=['GET', 'POST'])
def actualizar_usuario():
    if request.method == 'POST':
        id = request.form["id"]
        nombre = request.form["nombre"]
        clave = request.form["clave"]
        cursor.execute("""UPDATE `usuarios` SET `usu_nombre`=%s,`usu_clave`=sha1(%s) WHERE `usu_id`= %s""", (nombre, clave, id)) 
        conn.commit()
        return redirect(url_for('ver_usuarios'))
    else:
        id = request.args["id"]
        cursor.execute("SELECT usu_id, usu_nombre from usuarios where usu_id = " + id)
        usuario = cursor.fetchone()
        return render_template('editar_usuario.html', usuario=usuario)

@app.route("/agregar_cita", methods = ['GET', 'POST'])
def agregar_citas():
    if request.method == 'POST':
        lugar = request.form["lugar"]
        fecha = request.form["fecha "]
        hora = request.form["hora"]
        descripcion = request.form["descripcion"]
        cursor.execute("""INSERT INTO `citas`(`cit-lugar`, `cit_fecha`,`cit-hora`, `cit_descripcion`) VALUES (%s,%s ,%s , %s);""", (lugar, fecha,hora,descripcion)) 
        conn.commit()
        return redirect(url_for('ver_citas'))
    else:
        return render_template('agregar_citas.html')

@app.route('/actualizar_cita', methods=['GET', 'POST'])
def actualizar_citas():
    if request.method == 'POST':
        id = request.form["id"]
        idcon = request.form["con_id"]
        lugar = request.form["cit_lugar"]
        fecha = request.form["cit_fecha"]
        hora = request.form["cit_hora"]
        descripcion = request.form["descripcion"]
        cursor.execute("""UPDATE `citas` SET `con_id`=%s,`cit_lugar`=%s,`cit_fecha`=%s,`cit_hora`=%s,`cit_descripcion`=%s WHERE `cit_id`= %s""", (idcon,lugar,fecha,hora,descripcion,id)) 
        conn.commit()
        return redirect(url_for('ver_citas'))
    else:
        id = request.args["id"]
        cursor.execute("SELECT cit_id, cit_lugar,cit_fecha, cit_hora,cit_descripcion from citas where cit_id = " + id)
        citas = cursor.fetchone()
        return render_template('editar_citas.html', citas=citas)

@app.route('/eliminar_citas', methods=['GET'])
def eliminar_citas():
    if request.method == 'GET':
        id = request.args["id"]
        cursor.execute("DELETE from citas where cit_id = " + id)
        conn.commit()
        return redirect(url_for('ver_citas'))

@app.route("/agregar_contactos", methods = ['GET', 'POST'])
def agregar_contactos():
    if request.method == 'POST':

        nombre = request.form["nombre"]
        apellido = request.form["apellido "]
        direccion = request.form["direccion"]
        telefono = request.form["telefono"]
        email = request.form["email"]
        cursor.execute("""INSERT INTO `contactos`(`con_nombre`, `con_apellido`,`con_direccion`, `con_telefono`, `con_email`) VALUES (%s,%s ,%s,%s,%s);""", (nombre, apellido,direccion,telefono,email)) 
        conn.commit()
        return redirect(url_for('ver_contactos'))
    else:
        return render_template('agregar_contactos.html')

@app.route('/actualizar_contactos', methods=['GET', 'POST'])
def actualizar_contactos():
    if request.method == 'POST':
        id = request.form["id"]
        nombre = request.form["nombre"]
        apellido = request.form["apellido "]
        direccion = request.form["direccion"]
        telefono = request.form["telefono"]
        email = request.form["email"]
        cursor.execute("""UPDATE `contactos` SET `con_nombre`=%s,`con_apellido`=%s,`con_direccion`=%s,`con_telefono`=%s,`con_email`=%s  WHERE `con_id`= %s""", (nombre, apellido,direccion,telefono,email, id)) 
        conn.commit()
        return redirect(url_for('ver_contactos'))
    else:
        id = request.args["id"]
        cursor.execute("SELECT con_nombre, con_apellido,con_direccion, con_telefono, con_email from contactos where con_id = " + id)
        contactos = cursor.fetchone()
        return render_template('editar_contactos.html', contactos=contactos)

@app.route('/eliminar_contactos', methods=['GET'])
def eliminar_contactos():
    if request.method == 'GET':
        id = request.args["id"]
        cursor.execute("DELETE from contactos where con_id = " + id)
        conn.commit()
        return redirect(url_for('ver_contactos'))
                
                
if _name_ == '_main_':
    app.run(debug=True)