class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'gameScene', active: true });

        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
    }

    preload ()
    {
        this.load.image('sky', 'assets/texture/sky.png');
        this.load.image('ground', 'assets/texture/platform.png');
        this.load.image('star', 'assets/texture/star.png');
        this.load.image('bomb', 'assets/texture/bomb.png');
        //this.load.spritesheet('dude', 'assets/texture/player.png', { frameWidth: 32, frameHeight: 48 });
        this.load.atlas('dude', 'assets/texture/player.png', 'assets/data/player.json');
        this.load.spritesheet('fullscreen', 'assets/texture/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
    }

    create ()
    {
        this.add.image(400, 300, 'sky');

        const platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        const player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames('dude', {prefix: 'p1_walk', start: 1, end: 2, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });

        // idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: [{key: 'dude', frame: 'p1_stand'}],
            frameRate: 10,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames('dude', {prefix: 'p1_walk', start: 1, end: 2, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });
        
        // player jump animation
    this.anims.create({
        key: 'jump',
        frames: [{key: 'dude', frame: 'p1_jump'}],
        frameRate: 10,
    });
    
    // player fall animation
    this.anims.create({
        key: 'fall',
        frames: [{key: 'dude', frame: 'p1_fall'}],
        frameRate: 10,
    });

        this.cursors = this.input.keyboard.createCursorKeys();

        const stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(child =>
        {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(player, stars, this.collectStar, null, this);

        this.player = player;

        const button = this.add.image(800 - 16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();

        button.on('pointerup', function ()
        {

            if (this.scale.isFullscreen)
            {
                button.setFrame(0);

                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1);

                this.scale.startFullscreen();
            }

        }, this);

        this.scoreText.setText('v15');

        const FKey = this.input.keyboard.addKey('F');

        FKey.on('down', function ()
        {

            if (this.scale.isFullscreen)
            {
                button.setFrame(0);
                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1);
                this.scale.startFullscreen();
            }

        }, this);
    }

    update ()
    {
        const cursors = this.cursors;
        const player = this.player;

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
            player.flipX = true; // flip the sprite to the left
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('idle');
            player.flipX = false; // flip the sprite to the right
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.setVelocityY(-330);
            if (player.VelocityY < 0 && !player.body.onFloor()) {
                cosnole.log("jumping");
                player.anims.play('jump', true);
            }
    
            if (player.VelocityY >= 0 && !player.body.onFloor()) {
                console.log("falling");
                player.anims.play('fall', true);
            }
            else {
                console.log("ERROR");
                console.log(player.VelocityY);
            }
        }
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [ GameScene ]
};

const game = new Phaser.Game(config);
 
