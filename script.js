//Guardar en Local Storage los datos de contacto enviados de cada usuario
//La estructura de datos de usuarios consistirá en un array de objetos [{..},{..},{..}...{..}] almacenado en Local Storage
//Mostrar los datos de los contactos guardados en el DOM
//Usa JSON.parse() y JSON.stringify() para guardar muchos datos usando la misma clave

//objeto vacío que represente al usuario
let nuevoUsuario = {
    nombre: "",
    email: "",
    mensaje: "",
    imagen:""
}
let sectionUsuarios = document.getElementById("usuarios");
let article = document.createElement("article");
article.id = "articleUsuarios";
sectionUsuarios.appendChild(article);

let formulario = document.getElementById("nuevoUsuario");
let usuarios = localStorage.getItem("usuarios");
usuarios = JSON.parse(usuarios);
if (usuarios == null) usuarios = [];
pintarUsuarios(usuarios);

//función de pintado
function pintarUsuarios(usuarios) {
    let articleTemp = "";
        for (let i = 0; i < usuarios.length; i++) {
            articleTemp += `<article class="usuario">
                                <h2>Usuario ${i+1}:</h2>
                                <p><b>Nombre:</b> ${usuarios[i].nombre}</p>
                                <p><b>Email:</b> ${usuarios[i].email}</p>
                                <p><b>Mensaje:</b> ${usuarios[i].mensaje}</p>
                                <p id="wrap"><b>Imagen URL:</b> ${usuarios[i].imagen}</p>
                            </article>`;
        }
        article.innerHTML = articleTemp;
}

//validación de formulario
formulario.addEventListener("submit", function(event) {
    let alerta = "";
    let nombre = event.target.nombre.value;
    let email = event.target.correo.value;
    let mensaje = event.target.mensaje.value;
    let imagen = event.target.imagen.value;
    
    if (nombre.length < 1 || nombre.length > 30 ) {
        alerta += "Introduce nombre entre 1 y 30 caracteres.\n";
    }
    if((!email.endsWith(".com") && !email.endsWith(".es")) || !email.includes("@")){
        alerta+= "Error validación " + email +".\n"; 
    }
    if (mensaje.length == 0) {
        alerta += "Háblanos de ti primero.\n";
    }
    if (!imagen.startsWith("https://")) {
        alerta += "Introduce una url válida.\n";
    }

    usuarios = localStorage.getItem("usuarios");
    usuarios = JSON.parse(usuarios);
    if (usuarios == null) usuarios = [];

    if(alerta.length != 0){
        event.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Vaya...',
            text: alerta,
          }); //imprime mensaje final de error
    } else {
        nuevoUsuario.nombre = nombre;
        nuevoUsuario.email = email;
        nuevoUsuario.mensaje = mensaje;
        nuevoUsuario.imagen = imagen;
        usuarios.push(nuevoUsuario); //añade un nuevo usuario al localStorage 
        
        //pintar usuarios
        pintarUsuarios(usuarios);

        //guarda la variable en local storage
        usuarios = JSON.stringify(usuarios);
        localStorage.setItem("usuarios", usuarios);

    }
});

//manejar botón borrar
let borrar = document.getElementById("borrar");
borrar.addEventListener("click", function() {
    let borrado = [];
    borrado = JSON.stringify(borrado);
    localStorage.setItem("usuarios", borrado);
    let articleTemp = "";
    document.getElementById("articleUsuarios").innerHTML = articleTemp;
});

//manejar botón borrar usuario 
let borrarUsuario = document.getElementById("borrarUsuario");
borrarUsuario.addEventListener("submit", function(event) {
    event.preventDefault();

    usuarios = localStorage.getItem("usuarios");
    usuarios = JSON.parse(usuarios);
    if (usuarios == null) usuarios = [];

    let user = event.target.usuario.value;
    let boolean = false;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre == user) {
            boolean = true;
            usuarios.splice(i, 1);
            i = -1;
        }  
    }
    pintarUsuarios(usuarios);
    if (!boolean) {
        Swal.fire({
            icon: 'error',
            title: 'Vaya...',
            text: 'No hay ningún usuario con ese nombre',
          });
    }

    //guarda la variable en local storage
    usuarios = JSON.stringify(usuarios);
    localStorage.setItem("usuarios", usuarios);
});


