  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
  apiKey: "AIzaSyDrqpxW184Omneywk7jj2gO5yfLmCOdtgI",
  authDomain: "sitiowebformularios.firebaseapp.com",
  projectId: "sitiowebformularios",
  storageBucket: "sitiowebformularios.firebasestorage.app",
  messagingSenderId: "1092171196018",
  appId: "1:1092171196018:web:f8e4887c2b621b2dcb04eb"
};
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Sección del formulario Factores internos
  document.addEventListener("DOMContentLoaded", ()=> { //El contenido se cargará 
  const form = document.getElementById("formularioweb");// si hay un form con el id "formularioweb"
  if (form) { //Si existe ese form entonces su botón es funcional
      form.addEventListener('submit', EnviarFormulario);
  // Evento para actualizar los resultados en tiempo real
      const TtlInputs = form.querySelectorAll('input[type="number"]'); //Junta todos los inputs
      TtlInputs.forEach(input => { //Y los va colocando en su lugar en tiempo real
      input.addEventListener('input', ActualizarTabla);
      input.addEventListener('change', ActualizarTabla);
    });
  ActualizarTabla(); //Se aplica la función al cargar la página
  }
});

  //Función para actualizar los datos de la página
  function ActualizarTabla(){
    const TtlColumnas = [0,0,0,0,0,0,0,0,0,0];
    let completos = true;
    //Se toma el total de filas dentro de la tabla 
    const TtlFilas = document.querySelectorAll('.tabla tbody tr');

    const inputs = document.querySelectorAll('#formularioweb input[type="number"]');
      inputs.forEach((input, index) => { //Toma el conjunto de inputs, los convierte
        const valor = parseInt(input.value); //a enteros
        const IdxColumnas = index % 10;//Se realizan los calculos para el cálculo de los
        const IdxFilas = Math.floor(index / 10); //indices de columnas y filas
      //Verifica si los valores son correctos y dentro del rango
        if (isNaN(valor) || valor < 1 || valor > 10) {
            completos = false;
        } else {
            TtlColumnas[IdxColumnas] += valor; //y suma el valor
        }
    if (TtlFilas[IdxFilas]) { //y lo agrega al conjunto de celdas para ir cambiandolas
        const PCeldas = TtlFilas[IdxFilas].querySelectorAll('td');//Se toma a todas las celdas
        if (PCeldas[IdxColumnas]) { //de la tabla y se empieza a colocar el valor puesto en el input
        PCeldas[IdxColumnas].textContent = (isNaN(valor) || valor < 1 || valor > 10) ? '' : valor;
        }
      }
    });
    const totalRow = TtlFilas[TtlFilas.length - 1]; //Se toma la longitud del arreglo de las filas
    if (totalRow) { //y se empieza a pasar celda por celda para poder rellenarla con su valor
        const totalCells = totalRow.querySelectorAll('td'); 
        totalCells.forEach((cell, index) => { 
            cell.textContent = TtlColumnas[index]; 
        });
    } return {TtlColumnas, completos}; //retornando las celdas con su valor correspondiente 
};

  //Función de Envío de datos al Firebase
  function EnviarFormulario(e){
    e.preventDefault();
    const {TtlColumnas, completos} = ActualizarTabla(); //Se comprueba que
    if (!completos) { //todos los campos de la tabla hayan sido llenados antes de subir
        alert("Por favor, completa todas las preguntas antes de enviar.");
        return; 
    }
    const DBresultado = {
        timestamp: serverTimestamp(), // Marca de tiempo para cuando se actualicen los resultados
        // Se guardan las columnas
        TotalCol: TtlColumnas, 
    };
    // Se toman y envian los resultados del formulario a la Colección correspondiente
    addDoc(collection(db,"ResFormularios"),DBresultado)
        .then(() => {
            //Mensaje de confirmación de envío
            alert("Resultados enviados, muchas gracias por su tiempo");
            // Se limpia el formulario luego del envío
            document.getElementById('formularioweb').reset(); 
            ActualizarTabla(); // Limpia los totales de la tabla
        })
        .catch((error) => { //Mensaje de error en caso de darse
            console.error("Error al escribir en Base de Datos, comprobar permisos", error);
            alert("Error de guardado de resultados, posiblemente a conexión o permisos");
        });
  }


  