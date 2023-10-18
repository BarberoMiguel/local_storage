//Guardar en Local Storage los datos de contacto enviados de cada usuario
//La estructura de datos de usuarios consistirá en un array de objetos [{..},{..},{..}...{..}] almacenado en Local Storage
//Mostrar los datos de los contactos guardados en el DOM
//Usa JSON.parse() y JSON.stringify() para guardar muchos datos usando la misma clave

//objeto vacío que represente al usuario
let nuevoUsuario = {
    nombre: "",
    email: "",
    mensaje: "",
    url:""
}

const firebaseConfig = {
    apiKey: "AIzaSyCEqJ_0d7NVIDOlEatnR7V1Nuoz7PL3J4s",
    authDomain: "fir-storage-244aa.firebaseapp.com",
    projectId: "fir-storage-244aa",
    storageBucket: "fir-storage-244aa.appspot.com",
    messagingSenderId: "692819421711",
    appId: "1:692819421711:web:2a536ff1ee6104531d517a"
  };

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi BBDD //inicia Firestore
 
let sectionUsuarios = document.getElementById("usuarios");
let article = document.createElement("article");
article.id = "articleUsuarios";
sectionUsuarios.appendChild(article);

//muestra los usuarios actuales

const readAll = () => {
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        article.innerHTML = "";
        querySnapshot.forEach((doc) => {
          pintarUsuario(doc.data().nombre, doc.data().email, doc.data().mensaje, doc.data().url, doc.id)
        });
  
      })
      .catch(() => console.log('Error reading documents'));
  };
  
  readAll()


//función de pintado
function pintarUsuario(nombre, email, mensaje, url, id) {
    let articleTemp = "";
            articleTemp += `<article class="usuario">
                                <p><b>Nombre:</b> ${nombre}</p>
                                <p><b>Email:</b> ${email}</p>
                                <p><b>Mensaje:</b> ${mensaje}</p>
                                <p id="wrap"><b>Imagen URL:</b> ${url}</p>
                                <p><b>Id:</b> ${id}</p>
                            </article>`;
        article.innerHTML += articleTemp;
}
// guardar usuario;
const crearUsuario = (nuevoUsuario) => {
    db.collection("users")
      .add(nuevoUsuario)
      .then((docRef) => {
        readAll();
      })
      .catch((error) => console.error("Error adding document: ", error));
  };

//validación de formulario
let formulario = document.getElementById("nuevoUsuario");
formulario.addEventListener("submit", function(event) {
    event.preventDefault();
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
        nuevoUsuario.url = imagen;

        crearUsuario(nuevoUsuario);
        event.target.nombre.value = "";
        event.target.correo.value = "",
        event.target.mensaje.value = "";
        event.target.imagen.value = "";
    }
});

const borrarUsuarios = () => {
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection('users').doc(doc.id).delete();
        });
      }).then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: "todos los usuarios eliminados",
          });
        readAll()})
      .catch(() => console.log('Error borrando documentos'));
      
};

//manejar botón borrar
let borrar = document.getElementById("borrar");
borrar.addEventListener("click", function() {
    borrarUsuarios();
});

async function borrarUsuarioPorNombre(nombre) {
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().nombre == nombre) {
                db.collection('users').doc(doc.id).delete();
            }
          });
      }).then(data => {
        Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: "todos los usuarios con ese nombre eliminados",
      });
      readAll()})
      .catch(() => console.log('Error borrando usuarios'));
};


//manejar botón borrar usuario 
let borrarUsuario = document.getElementById("borrarUsuario");
borrarUsuario.addEventListener("submit", function(event) {
    event.preventDefault();
    borrarUsuarioPorNombre(event.target.usuario.value);
});


