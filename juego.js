var balas;
var tiempoEntreBalas = 400;
var tiempo = 0;
var malos;
var puntos;
var txtPuntos;
var vidas;
var txtVidas;
var fondoJuego;

var Juego = {
	preload: function () {
		juego.load.image('nave', 'img/ship.png');
		juego.load.image('laser', 'img/laser.png');
		juego.load.image('malo', 'img/enemy.png');
		juego.load.image('bg', 'img/bg.png');
		juego.load.audio('shooting', 'sounds/SHOOT011.mp3');
		juego.load.audio('explosion', 'sounds/explosion.wav');
		juego.load.audio('gameOver', 'sounds/ThisGameIsOver.wav');
		juego.load.audio('fondo', 'sounds/fondo1.mp3');
		juego.load.audio('life', 'sounds/KSHMR_Game_FX_03_Alert_F.wav');
	},

	create: function () {
		fondoJuego = juego.add.tileSprite(0, 0, 400, 540, 'bg');

		juego.physics.startSystem(Phaser.Physics.ARCADE);

		fondo = juego.add.audio('fondo');

		fondo.play('', 0, 0.5, true);

		nave = juego.add.sprite(juego.width / 2, 485, 'nave');
		nave.anchor.setTo(0.5);
		juego.physics.arcade.enable(nave, true);

		balas = juego.add.group();
		balas.enableBody = true;
		balas.setBodyType = Phaser.Physics.ARCADE;
		balas.createMultiple(50, 'laser');

		balas.setAll('checkWorldBounds', true);
		balas.setAll('outOfBoundsKill', true);

		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE;
		malos.createMultiple(50, 'malo');

		malos.setAll('checkWorldBounds', true);
		malos.setAll('outOfBoundsKill', true);

		timer = juego.time.events.loop(2000, this.crearEnemigo, this);

		//definir el puntaje 
		puntos = 0;
		juego.add.text(20, 20, "Puntos: ", { font: "14px Arial", fill: "#fff" });
		txtPuntos = juego.add.text(80, 20, "0", { font: "14px Arial", fill: "#fff" });

		//definir el contador de vidas
		vidas = 3;
		juego.add.text(310, 20, "Vidas: ", { font: "14px Arial", fill: "#fff" });
		txtVidas = juego.add.text(360, 20, "3", { font: "14px Arial", fill: "#fff" });

		//Nombre
		juego.add.text(300, 475, "Omar RVM", { font: "14px Arial", fill: "#fff" });
		juego.add.text(300, 490, "1632247 ", { font: "14px Arial", fill: "#fff" });


		//llamar el sonido
		shooting = this.sound.add('shooting');
		explosion = this.sound.add('explosion');
		gameOver = this.sound.add('gameOver');
		life = this.sound.add('life');
	},

	update: function () {

		//animar fondo
		fondoJuego.tilePosition.y += 1;

		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

		if (juego.input.activePointer.isDown) {
			this.disparar();
			shooting.play();
		}

		//agregar colision
		juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

		//agregar contador de vidas
		malos.forEachAlive(function (m) {
			if (m.position.y > 520 && m.position.y < 521) {
				vidas -= 1;
				txtVidas.text = vidas;
				life.play();
			}

		});

		if (vidas == 0) {
			juego.state.start('terminado');
			fondo.stop();
			gameOver.play();
			swal({
				title: "Game Over!",
				text: "Se acabaron sus vidas!",
				type: "warning",
				buttons: true,
				dangerMode: true,
				confirmButtonText: "Jugar"
			}).then(function () {
				location.reload();
			});
		}

	},

	disparar: function () {
		if (juego.time.now > tiempo && balas.countDead() > 0) {
			tiempo = juego.time.now + tiempoEntreBalas;
			var bala = balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x, nave.y);
			bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
			juego.physics.arcade.moveToPointer(bala, 200);
		}
	},

	crearEnemigo: function () {
		var ene = malos.getFirstDead();
		var num = Math.floor(Math.random() * 10 + 1);
		ene.reset(num * 38, 0);
		ene.anchor.setTo(0.5);
		ene.body.velocity.y = 100;
		ene.checkWorldBounds = true;
		ene.outOfBoundsKill = true;
	},

	colision: function (b, m) {
		b.kill();
		m.kill();
		explosion.play();
		puntos++;
		txtPuntos.text = puntos;
	}

};