
//ESTADOS DEL JUEGO
const ESTADO_INTRO= 0;//pantallas iniciales
const ESTADO_NOTA_INTRO = 1;//pantalla resentación de la nueva nota del nivel
const ESTADO_JUGANDO= 2;//selección de notas
const ESTADO_FEEDBACK= 3;//pantalla de acierto/error
const ESTADO_TERMINADO = 4;//juego terminado

let estado = ESTADO_INTRO;

//PANTALLA INICIAL
let textosIntro = [
  "Bienvenido/a.\n\n" +
  "Este juego te ayuda a asociar notas\n" +
  "musicales con colores.\n\n" +
  "Escucharás una nota y tendrás que\n" +
  "elegir el botón con el color correcto.",

  "Cada nivel añade una nota nueva.\n\n" +
  "Acierta 5 veces en un nivel para\n" +
  "pasar al siguiente.\n\n" +
  "En el último nivel ya no verás el\n" +
  "nombre de la nota en el botón solo verás colores en tu mente (y pantalla)."
];

let paginaIntro = 0;

//Notas y colores
let notas = ["DO", "RE", "MI", "FA", "SOL", "LA", "SI"];
let colores = []; //se rellenará en setup()

//Niveles
let nivel = 0; //0..7
let nivelMaximo = 7;
let aciertosEnNivel = 0;//aciertos acumulados en nivel actual
let aciertosNecesarios = 5;//aciertos necesarios para pasar al siguiente nivel

let indiceNotaActual = 0;//índice de nota objetivo (0..6)
let cantidadOpciones = 1;//nº de botones de nota visibles

let ultimaRespuestaCorrecta = false;
let haSubidoNivel = false;

//Botones
let botonesNotas = new Array(7);
let botonRepetir;
let botonIntro;
let botonReiniciar;

//Sonidos 
let sonidos = new Array(7);

//Preload sonidos
function preload() {
  // Cargar archivos musicales
  for (let i = 0; i < notas.length; i++) {
    let nombreArchivo = `sonidos/${notas[i]}.wav`;
    try {
      sonidos[i] = loadSound(
        nombreArchivo,
        () => {
          console.log("Cargado:", nombreArchivo);
        },
        (err) => {
          console.warn("No se pudo cargar", nombreArchivo);
          sonidos[i] = null;
        }
      );
    } catch (e) {
      console.warn("Error al intentar cargar", nombreArchivo, e);
      sonidos[i] = null;
    }
  }
}

//Función SETUP
function setup() {
  // Crea el canvas y lo pone dentro del DIV
  let lienzo = createCanvas(900, 600);
  lienzo.parent("contenedor-juego");

  textAlign(CENTER, CENTER);

  //Colores de las notas
  let DOcolor= color(255, 75, 75);//rojo
  let REcolor= color(255, 158, 61);//naranja
  let MIcolor= color(255, 217, 61);//amarillo
  let FAcolor= color(75, 203, 91);//verde
  let SOLcolor= color(53, 208, 200);//turquesa
  let LAcolor= color(75, 123, 255);//azul
  let SIcolor= color(165, 91, 255);//violeta

  colores = [DOcolor, REcolor, MIcolor, FAcolor, SOLcolor, LAcolor, SIcolor];

  //botones de nota. La posición se ajusta en dibujarJugando
  //Las posiciones iniciales son provisional. Dependerá del numero de botones en pantalla
  let xInicial = 0;
  let yInicial = 0;
  let anchoInicial = 100;
  let altoInicial = 80;

  //Creación de un botón por cada nota musical
  for (let i = 0; i < 7; i++) {
    botonesNotas[i] = new Boton(
      xInicial,
      yInicial,
      anchoInicial,
      altoInicial,
      notas[i],
      colores[i],
      i
    );
  }

  //Boton repetir nota - posición se ajusta según el estado
  botonRepetir = new Boton(
    width / 2 - 90,
    height / 2 + 40,
    180,
    50,
    "Repetir nota",
    color(200),
    -1
  );

  //Botón siguiente
  botonIntro = new Boton(
    width / 2 - 80,
    height - 120,
    160,
    50,
    "Siguiente",
    color(200),
    -1
  );

  //Botón reiniciar
  botonReiniciar = new Boton(
    width / 2 - 80,
    height - 150,
    160,
    50,
    "Reiniciar",
    color(200),
    -1
  );
}

//Draw con switch para reconocer el estado
function draw() {
  
  //Según el estado actual del juego, se dibuja una pantalla u otra
  switch (estado) {
    case ESTADO_INTRO:
      dibujarIntro();  //dibuja textos de bienvenida
      break;
    
    // Pantalla de presentación de la nueva nota del nivel
    case ESTADO_NOTA_INTRO:
      dibujarIntroNota();
      break;
    
     //Pantalla base del juego en la que se seleccionan las notas
      case ESTADO_JUGANDO:
      dibujarJugando();
      break;

    // Pantalla en la que se muestra el feedback tras pulsar botón (correcto / incorrecto)
    case ESTADO_FEEDBACK:
      dibujarFeedback();
      break;
    
     // Pantalla final cuando se completan todos los niveles
    case ESTADO_TERMINADO:
      dibujarTerminado();
      break;
  }
}

//A contibuación funciones para dibujar cada estado/pantalla
//dibujarIntro es para la pantalla de inicio
function dibujarIntro() {
  background(80); // fondo gris

  //Título
  fill(255);
  textSize(26);
  text("Entrenador de oído - Notas y colores", width / 2, 60);

  textSize(20);
  fill(230);
  text(textosIntro[paginaIntro], width / 2, height / 2 - 40);

  if (paginaIntro < textosIntro.length - 1) {
    botonIntro.texto = "Siguiente";
  } else {
    botonIntro.texto = "Listo";
  }
  //Botón
  botonIntro.x = width / 2 - 80; //posición horizontal
  botonIntro.y = height - 120; //posición vertical
  botonIntro.ancho = 160;  //ancho
  botonIntro.alto = 50; //alto
  botonIntro.dibujar(true); //dibujar boton en pantalla
}

//Pantalla que presenta la nota nueva de cada nivel
function dibujarIntroNota() {
  background(colores[indiceNotaActual]); //fondo color nota nueva

  //Panel superior
  noStroke();
  fill(0, 150);
  rect(0, 0, width, 150);

  //Texto
  fill(255);
  textSize(28);
  text("Nivel " + nivel, width / 2, 40);

  textSize(22);
  text("Nueva nota en este nivel:", width / 2, 80);

  textSize(40);
  text(notas[indiceNotaActual], width / 2, 125);

  //botón para escuchar la nota
  botonRepetir.x = width / 2 - 100;
  botonRepetir.y = height / 2 + 10;
  botonRepetir.ancho = 200;
  botonRepetir.alto = 55;
  botonRepetir.texto = "Escuchar nota";
  botonRepetir.dibujar(true);

  //Botón empezar nivel
  botonIntro.texto = "Empezar nivel";
  botonIntro.x = width / 2 - 100;
  botonIntro.y = height / 2 + 90;
  botonIntro.ancho = 200;
  botonIntro.alto = 55;
  botonIntro.dibujar(true);
}

function dibujarJugando() {
  
  background(60); //Fondo color neutro - no empleado por las notas

  //Barra superior
  noStroke();
  fill(0, 150);
  rect(0, 0, width, 120);

  //Información del nivel
  fill(255);
  textSize(28);
  text("Nivel " + nivel, width / 2, 35);

  textSize(18);
  text(
    "Aciertos en este nivel: " + aciertosEnNivel + " / " + aciertosNecesarios,
    width / 2,
    75
  );

  textSize(16);
  text(
    "Escucha la nota y pulsa el botón del color correcto.",
    width / 2,
    105
  );

  //Botones notas
  let mostrarNombres = (nivel < 7);//En el último nivel (7) no se muestran los colores, por eso menor a 7

  let anchoBoton = 90;//ancho
  let altoBoton = 80;//altura
  let espacio = 15;//separación botones

  //centrado de botones
  let anchoTotal = cantidadOpciones*anchoBoton+(cantidadOpciones-1)*espacio;
  let inicioX = width / 2 - anchoTotal / 2;
  let y = height - 160;
  //coloca y dibuja cada botón
  //Se recorre solo los botones que deben mostrarse
  //b=al boton actual
  for (let i = 0; i < cantidadOpciones; i++) {
    let b = botonesNotas[i];
    b.x = inicioX + i * (anchoBoton + espacio); //posición horizontal
    b.y = y; //posición vertical
    b.ancho = anchoBoton;
    b.alto = altoBoton;
    b.dibujar(mostrarNombres);
  }

  //Botón repetir con nota encima de los botones
  botonRepetir.x = width / 2 - 100;
  botonRepetir.y = y - 100;
  botonRepetir.ancho = 200;
  botonRepetir.alto = 55;
  botonRepetir.texto = "Repetir nota";
  botonRepetir.dibujar(true);
}

function dibujarFeedback() {

  //Variables para pantalla feedback
  let fondoR, fondoG, fondoB; //Colores RGB
  let mensajeGrande;
  let mensajePeque;

  if (ultimaRespuestaCorrecta) {
    fondoR = 60;  fondoG = 170; fondoB = 80;
    mensajeGrande = "¡Correcto!";
    mensajePeque = "Aciertos en este nivel: " + aciertosEnNivel + " / " + aciertosNecesarios;
  } else {
    fondoR = 190; fondoG = 60;  fondoB = 60;
    mensajeGrande = "¡Ups!";
    mensajePeque = "La nota correcta era: " + notas[indiceNotaActual];
  }

  // Fondo
  background(fondoR, fondoG, fondoB);

  //Texto grande
  fill(255);
  textSize(36);
  text(mensajeGrande, width / 2, height / 2 - 40);

  //Texto pequeño
  textSize(22);
  text(mensajePeque, width / 2, height / 2 + 10);

  // Mensaje si ha subido de nivel
  if (haSubidoNivel) {
    text("¡Has pasado al nivel " + nivel + "!", width / 2, height / 2 + 60);
  }

  // Instrucción para continuar
  textSize(18);
  text("Haz clic para continuar.", width / 2, height - 80);
}

//Pantalla final
function dibujarTerminado() {
  background(30, 30, 60);

  fill(255);
  textSize(32);
  text("¡Enhorabuena!", width / 2, height / 2 - 60);

  textSize(22);
  text("Has completado todos los niveles.", width / 2, height / 2);

  textSize(18);
  text(
    "Puedes volver a empezar si quieres practicar más.",
    width / 2,
    height / 2 + 40
  );

  botonReiniciar.x = width / 2 - 80;
  botonReiniciar.y = height - 150;
  botonReiniciar.ancho = 160;
  botonReiniciar.alto = 50;
  botonReiniciar.dibujar(true);
}

//JUEGO
function iniciarJuego() {
  nivel = 0;
  aciertosEnNivel = 0;
  mostrarIntroNotaDeNivel();
}

// Presentación de la nueva nota del nivel
function mostrarIntroNotaDeNivel() {
  indiceNotaActual = Math.min(nivel, notas.length - 1);
  cantidadOpciones = Math.min(nivel + 1, 7);
  reproducirNotaActual();
  estado = ESTADO_NOTA_INTRO;
}

function nuevaRonda() {
  cantidadOpciones = Math.min(nivel + 1, 7);
  indiceNotaActual = Math.floor(random(cantidadOpciones));
  reproducirNotaActual();
}

//Funcion para cuando el jugador pulsa el botón de la nota
//Se comprueba la nota pulsada, se actualiza el contador de acierto
//se verifica si se pasa al siguiente nivel
function comprobarRespuesta(indiceNotaPulsada) {
  haSubidoNivel = false;
  ultimaRespuestaCorrecta = (indiceNotaPulsada === indiceNotaActual);

  if (ultimaRespuestaCorrecta) {
    aciertosEnNivel++;

    if (aciertosEnNivel >= aciertosNecesarios) {
      if (nivel < nivelMaximo) {
        nivel++;
        aciertosEnNivel = 0;
        haSubidoNivel = true;
      } else {
        estado = ESTADO_TERMINADO;
        return;
      }
    }
  }

  estado = ESTADO_FEEDBACK;
}

//Interacción ratón
//Se comprueba en la que pantalla en la que se encuentra y decidir qué hacer con el click
function mousePressed() {
  switch (estado) {
    //Si no quedan páginas de inicio, pasa a iniciar el juego
    case ESTADO_INTRO: 
      if (botonIntro.ratonEncima()) {
        if (paginaIntro < textosIntro.length - 1) {
          paginaIntro++;
        } else {
          iniciarJuego();
        }
      }
      break;

    //Si boton repetir, suena la nota nuevamente. Si empezar cambia de estado y nueva ronda
    case ESTADO_NOTA_INTRO: 
      if (botonRepetir.ratonEncima()) {
        reproducirNotaActual();
      } else if (botonIntro.ratonEncima()) {
        estado = ESTADO_JUGANDO;
        nuevaRonda();
      }
      break;
    //Si se pulsa en repetir, reproduce la nota y sale de la función
    case ESTADO_JUGANDO:
      if (botonRepetir.ratonEncima()) {
        reproducirNotaActual();
        return;
      }

      //Se recorren los botones
      for (let i = 0; i < cantidadOpciones; i++) {
        if (botonesNotas[i].ratonEncima()) {
          const indiceClicado = botonesNotas[i].indiceNota;

          // Reproducir la nota del botón que se ha pulsado
          reproducirNota(indiceClicado);

          //Comprobar si es correcta o no
          comprobarRespuesta(indiceClicado);
          break;
        }
      }
      break;

    //Cualquier click pasa al siguiente nivel
    case ESTADO_FEEDBACK:
      if (haSubidoNivel) {
        haSubidoNivel = false;
        mostrarIntroNotaDeNivel();
      } else {
        estado = ESTADO_JUGANDO;
        nuevaRonda();
      }
      break;

    case ESTADO_TERMINADO:
      if (botonReiniciar.ratonEncima()) {
        iniciarJuego();
      }
      break;
  }
}

//BOTON

class Boton {
  constructor(x, y, ancho, alto, texto, colorFondo, indiceNota) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.texto = texto;
    this.colorFondo = colorFondo;
    this.indiceNota = indiceNota; // -1 si no hay nota asociada
  }

  //funcion para detectar si el raton está encima del botón
  dibujar(mostrarTexto) {
    let ratonEncima = this.ratonEncima(); //se verifica si el ratón está encima. True o false
    let c = this.colorFondo; //color de fondo

    if (ratonEncima) {
      c = lerpColor(this.colorFondo, color(255), 0.15); //se aclara un poco el color al pasar el ratón
    }

    //Borde negro
    stroke(0);
    if (ratonEncima) {
      strokeWeight(3); //borde más grueso
    } else {
      strokeWeight(2);//borde normal
    }
    
    fill(c);
    rect(this.x, this.y, this.ancho, this.alto, 15); //rectángulo

    if (mostrarTexto && this.texto) {
      fill(255);
      textSize(18);
      textAlign(CENTER, CENTER);
      text(this.texto, this.x + this.ancho / 2, this.y + this.alto / 2);
    }
  }

  //Devuelve si raton está encima: true o false
  ratonEncima() {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.ancho &&
      mouseY >= this.y &&
      mouseY <= this.y + this.alto
    );
  }
}

//SONIDO
//Reproducirla nota actual (la nota objetivo de la ronda)
function reproducirNotaActual() {
  reproducirNota(indiceNotaActual);
}

//Reproducir una nota concreta por índice
function reproducirNota(indiceNota) {
  let s = sonidos[indiceNota];
  if (s && s.isLoaded()) {
    if (s.isPlaying()) {
      s.stop();
    }
    s.play();
  } else {
    console.log("Sonido no cargado para", notas[indiceNota]);
  }
}
