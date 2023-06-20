// Crear el lienzo
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1260;
canvas.height = 820;

document.body.appendChild(canvas);
var vidas_impress = document.getElementById("lifes");
var score_impress = document.getElementById("score");



// Variables del juego
var avion = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  width: 90,
  height: 90,
  color: "red",
  src: "img/player.png",
  velocidad: 20,
};

var misiles = [];
var enemigos = [];
var exploxiones = [];
var vidas = 3;
var score = 0;

function dibujarFondo(){
  var img = new Image();
  img.src = "img/ocean.jpg";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  console.log(avion.x, avion.y);
}


// Función para dibujar el avioncito
function dibujarAvion() {
  ctx.fillStyle = avion.color;
  ctx.fillStyle = avion;
  imgAv = new Image();
  imgAv.src = avion.src;
  ctx.drawImage(imgAv, avion.x, avion.y, avion.width, avion.height);
  
}

// Función para dibujar los misiles
function dibujarMisiles() {
  for (var i = 0; i < misiles.length; i++) {
    var misil = misiles[i];
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(misil.x, misil.y, misil.width, misil.height);
  }
}

// Función para dibujar los enemigos
function dibujarEnemigos() {
  for (var i = 0; i < enemigos.length; i++) {
    var enemigo = enemigos[i];
    ctx.fillStyle = "#00FF00";
    enemigo.img.src = 'img/enemy.png';
    ctx.drawImage(enemigo.img, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
  }
}

// Función para mover el avioncito
function moverAvion() {
  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 37) {
      // Mover hacia la izquierda (tecla de flecha izquierda)
      if(avion.x <= 0){
        avion.x = avion.x;
      }else{
        avion.x -= avion.velocidad;
      }
      

    } else if (event.keyCode === 39) {
      // Mover hacia la derecha (tecla de flecha derecha)
      

      if(avion.x >= canvas.width - 90){
        avion.x = avion.x;
      }else{
        avion.x += avion.velocidad;
      }

    } else if (event.keyCode === 32) {
      // Disparar misil (barra espaciadora)
      var misil = {
        x: avion.x + avion.width / 2 - 2.5,
        y: avion.y,
        width: 5,
        height: 10,
        velocidad: 20
      };
      misiles.push(misil);
    }
  });
}

// Función para mover los misiles
function moverMisiles() {
  for (var i = 0; i < misiles.length; i++) {
    var misil = misiles[i];
    misil.y -= misil.velocidad;
    if (misil.y < 0) {
      misiles.splice(i, 1);
      i--;
    }
  }
}

// Función para mover los enemigos
function moverEnemigos() {
  for (var i = 0; i < enemigos.length; i++) {
    var enemigo = enemigos[i];
    enemigo.y += enemigo.velocidad;
    if (enemigo.y > canvas.height) {
      enemigos.splice(i, 1);
      i--;
    }
  }
}

function cargarSonido() {
  var sonido = document.getElementById("nya");
  sonido.play();
};

function explode() {

  for (var i = 0; i < exploxiones.length; i++) {
    var explosion = exploxiones[i];
    ctx.fillStyle = "#00FF00";
    explosion.img.src = 'img/explode.png';
    ctx.drawImage(explosion.img, explosion.x, explosion.y, explosion.width, explosion.height);
  }

}

function hidExplote(j){
  // alert(j)
  let hide = setInterval(() => {
    for (var j = 0; j < exploxiones.length; j++) {
      exploxiones.splice(j, 1);
      clearInterval(hide);
    }
  }, 800);
  
}

// Función para detectar colisiones entre misiles y enemigos
function detectarColisiones() {
  for (var i = 0; i < misiles.length; i++) {
    var misil = misiles[i];
    for (var j = 0; j < enemigos.length; j++) {
      var enemigo = enemigos[j];
      if (
        misil.x < enemigo.x + enemigo.width &&
        misil.x + misil.width > enemigo.x &&
        misil.y < enemigo.y + enemigo.height &&
        misil.y + misil.height > enemigo.y
      ) {
        // Colisión detectada, eliminar el misil y el enemigo
        score = score + 200;

        // console.log(enemigo)

        var explode = {
          x: enemigo.x,
          y: enemigo.y,
          width: 100,
          height: 120,
          velocidad: Math.random() * 2 + 1,
          img: new Image()
        };
        exploxiones.push(explode);

        hidExplote(j);

        misiles.splice(i, 1);
        enemigos.splice(j, 1);

        


        scoreImpress();
        // cargarSonido();
        i--;
        break;
      }
    }
  }
}

function detectarColisionesAv() {
  for (var j = 0; j < enemigos.length; j++) {
    var enemigo = enemigos[j];
    if (
      avion.x < enemigo.x + enemigo.width - 20 &&
      avion.x + avion.width - 20 > enemigo.x &&
      avion.y < enemigo.y + enemigo.height - 10 &&
      avion.y + avion.height > enemigo.y
    ) {

      enemigos.splice(j, 1);
      vidas -= 1;

      actualizarVidas();

      actualizar();
      i--;
      break;

    }
  }
}

function actualizarVidas() {

  function lol() {
    var coras = [];
    for (var i = 0; i < vidas; i++) {

      coras += "🧡";

    }
    if (coras.length === 0) {
      vidas_impress.textContent = "0";
    } else {
      vidas_impress.textContent = coras;
    }

  }

  if (vidas === 0) {
    lol();

    Swal.fire(
      'UPS',
      'GAME OVER!',
      'warning'
    )
    requestAnimationFrame(false);

  } else {

    lol();

  }

}

function scoreImpress() {
  if(score > 10000){
    alert("Ganaste el juego :>");
    clearTimeout(setGame);
  }
  score_impress.textContent = score;
}


// Función para actualizar el juego en cada fotograma
function actualizar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dibujarFondo();
  dibujarAvion();
  dibujarMisiles();
  dibujarEnemigos();
  explode();

  moverMisiles();
  moverEnemigos();

  detectarColisiones();
  detectarColisionesAv();

  scoreImpress();
  var fps = 300;

  actualizarVidas();
  var setGame = setTimeout(() => {
    requestAnimationFrame(actualizar);
  }, 1000 / fps);

}

explode(60, 70);



// Función para generar enemigos de forma aleatoria
function generarEnemigos() {
  var enemigo = {
    x: Math.random() * (canvas.width - 160) + 15,
    y: 0,
    width: 100,
    height: 120,
    velocidad: Math.random() * 2 + 1,
    img: new Image()
  };
  enemigos.push(enemigo);
  setTimeout(generarEnemigos, Math.random() * 500);
}

function play() {
  moverAvion();
  generarEnemigos();
  actualizar();
}

// Iniciar el juego
play();
