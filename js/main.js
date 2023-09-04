window.threshHold = 10;
//document.getElementById("threshold").value = window.threshHold;
window.relativeBeta = 0;
var timeout = 2000;
/*
var nodeConnect = new NodeSocket();
window.isTakeoff = false;
window.land = true;

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("red", "assets/red.png");
}

function create() {
  var particles = this.add.particles("red");

  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  var centerX = window.innerWidth / 2;
  logo = this.physics.add.image(centerX, window.innerHeight);
  logo.setCollideWorldBounds(true);
  emitter.startFollow(logo);

  setInterval(() => {
    //console.log(document.getElementById("threshold").value);
    if (!Number.isNaN(window.relativeBeta)) {
      document.getElementById("power").innerHTML =
        window.relativeBeta.toFixed(3) * 100;
    }
    if (window.isTakeoff == false) {
      logo.setVelocityY(100);
      return 0;
    } else {
      if (
        window.relativeBeta * 100 >
        document.getElementById("threshold").value
      ) {
        logo.setVelocityY(-100);
        nodeConnect.up();
        // make drone go up if not at max height
      } else if (
        window.relativeBeta * 100 <
        document.getElementById("threshold").value
      ) {
        logo.setVelocityY(100);
        nodeConnect.down();
        // make drone go down if not at min height
      } else {
        //logo.setVelocityY(100);
      }
    }
  }, timeout);
}

*/

function update(time, delta) {
  //console.log(window.relativeBeta);
  /*
  if (window.relativeBeta > window.threshHold) {
    logo.setVelocityY(-100);
    nodeConnect.up();
    // make drone go up if not at max height
  } else {
    logo.setVelocityY(100);
    nodeConnect.down();
    // make drone go down if not at min height
  } */
}

function bindButtons(id, func) {
  document.getElementById(id).onclick = func;
}
//var p = document.getElementById("power").innerHTML = ;
//console.log(p);
//bindButtons("takeoff", nodeConnect.takeOff);
//bindButtons("land", nodeConnect.land);
//bindButtons("up", nodeConnect.up);
//bindButtons("down", nodeConnect.down);
