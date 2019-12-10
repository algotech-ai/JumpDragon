(function (window) {
    // Constants for controling horizontal movement
    var MoveAcceleration = 13000.0;
    var MaxMoveSpeed = 1750.0;
    var GroundDragFactor = 0.48;
    var AirDragFactor = 0.58;

    // Constants for controlling vertical movement
    var MaxJumpTime = 0.35;
    var JumpLaunchVelocity = -5000.0;
    var GravityAcceleration = 1800.0;
    var MaxFallSpeed = 550.0;
    var JumpControlPower = 0.14;

    var globalTargetFPS = 17;
    var StaticTile = new Tile(null, Enum.TileCollision.Passable, 0, 0);
    function Player(imgPlayer, level, position) {
        this.initialize(imgPlayer, level, position);
    }
    Player.prototype = new createjs.Sprite();

    // public properties:
    Player.prototype.bounds = 0;
    Player.prototype.hit = 0;
    Player.prototype.IsAlive = true;
    Player.prototype.HasReachedExit = false;

    // constructor:
    Player.prototype.BitmapAnimation_initialize = Player.prototype.initialize; //unique to avoid overiding base class

    var quaterFrameSize;

   
    Player.prototype.initialize = function (imgPlayer, level, position) {
        var width;
        var left;
        var height;
        var top;
        var frameWidth;
        var frameHeight;

        var localSpriteSheet = new createjs.SpriteSheet({
            images: [imgPlayer], //image to use
            frames: { width: 64, height: 64, regX: 32, regY: 64 },
            animations: {
                "walk": [0, 9, "walk", 4],
                "die": [10, 21, false, 4],
                "jump": [22, 32, false],
                "celebrate": [33, 43, false, 4],
                "idle": [44, 44]
            }
        });

        createjs.SpriteSheetUtils.addFlippedFrames(localSpriteSheet, true, false, false);

        this.BitmapAnimation_initialize(localSpriteSheet);
        this.level = level;
        this.position = position;
        this.velocity = new createjs.Point(0, 0);
        this.previousBottom = 0.0;

        this.elapsed = 0;

        this.isJumping = false;
        this.wasJumping = false;
        this.jumpTime = 0.0;

        frameWidth = this.spriteSheet.getFrame(0).rect.width;
        frameHeight = this.spriteSheet.getFrame(0).rect.height;

        // Calculate bounds within texture size. 
        width = parseInt(frameWidth * 0.4);
        left = parseInt((frameWidth - width) / 2);
        height = parseInt(frameWidth * 0.8);
        top = parseInt(frameHeight - height);
        this.localBounds = new XNARectangle(left, top, width, height);

        // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
        // of animated monster if you disabled the shadow.
        // if (enableShadows)
        //     this.shadow = new Shadow("#000", 3, 2, 2);

        this.name = "Hero";

        // 1 = right & -1 = left & 0 = idle
        this.direction = 0;

        // starting directly at the first frame of the walk_right sequence
        this.currentFrame = 66;

        this.Reset(position);
    }
    Player.prototype.Reset = function (position) {
        this.x = position.x;
        this.y = position.y;
        this.velocity = new createjs.Point(0, 0);
        this.IsAlive = true;
        this.level.IsHeroDied = false;
        this.gotoAndPlay("idle");
    };
    Player.prototype.tick = function () {
        this.elapsed = globalTargetFPS / 1000;
        if (this.IsAlive&&!this.HasReachedExit) {
            this.ApplyPhysics();
            switch(this.sportState){
                case "idle":break;
                case "run":
                    if ((this.x + this.direction > quaterFrameSize) && (this.x + (this.direction * 2) < this.x_end - quaterFrameSize + 1)) {
                        this.x += this.vX * this.direction;
                        this.y += this.vY * this.direction;
                    }
                break;
                case "die":
                    this.IsAlive = false;
                break;
            }
        }
        else{

        }
    }
    Player.prototype.ApplyPhysics = function(){
        var previousPosition = new createjs.Point(this.x, this.y);
        this.velocity.x += this.direction * MoveAcceleration * this.elapsed;
        this.velocity.y = Math.clamp(this.velocity.y + GravityAcceleration * this.elapsed, -MaxFallSpeed, MaxFallSpeed);
        this.velocity.y = this.DoJump(this.velocity.y);

        if(this.IsOnGround){
            this.velocity.x *= GroundDragFactor;
        }
        else{
            this.velocity.x *= AirDragFactor;
        }
        this.velocity.x = Math.clamp(this.velocity.x, -MaxMoveSpeed, MaxMoveSpeed);
        this.x += this.velocity.x * this.elapsed;
        this.y += this.velocity.y * this.elapsed;
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        this.HandleCollisions();
        if(this.x === previousPosition.x){
            this.velocity.x = 0;
        }
        if(this.y === previousPosition.y){
            this.velocity.y = 0;
        }
    }

    Player.prototype.DoJump = function(velocitY){
        if(this.isJumping){
            if((!this.wasJumping && this.IsOnGround) || this.jumpTime > 0.0){
                this.jumpTime += this.elapsed;
                if(this.direction == 1){
                    this.gotoAndPlay("jump_h");
                }
                else{
                    this.gotoAndPlay("jump");
                }
            }
            if(0.0 < this.jumpTime && this.jumpTime <= MaxJumpTime){
                velocityY = JumpLaunchVelocity * 
                (1.0 - Math.pow(this.jumpTime))
            }
        }
    };
    Player.prototype.BoundingRectangle = function () {
        var left = parseInt(Math.round(this.x - 32) + this.localBounds.x);
        var top = parseInt(Math.round(this.y - 64) + this.localBounds.y);

        return new XNARectangle(left, top, this.localBounds.width, this.localBounds.height);
    };
    Player.prototype.HandleCollisions = function () {
        var bounds = this.BoundingRectangle();
        var leftTile = Math.floor(bounds.Left() / StaticTile.Width);
        var rightTile = Math.ceil((bounds.Right() / StaticTile.Width)) - 1;
        var topTile = Math.floor(bounds.Top() / StaticTile.Height);
        var bottomTile = Math.ceil((bounds.Bottom() / StaticTile.Height)) - 1;

        // Reset flag to search for ground collision.
        this.IsOnGround = false;

        // For each potentially colliding tile,
        for (var y = topTile; y <= bottomTile; ++y) {
            for (var x = leftTile; x <= rightTile; ++x) {
                // If this tile is collidable,
                var collision = this.level.GetCollision(x, y);
                if (collision !== Enum.TileCollision.Passable) {
                    // Determine collision depth (with direction) and magnitude.
                    var tileBounds = this.level.GetBounds(x, y);
                    var depth = bounds.GetIntersectionDepth(tileBounds);
                    if (depth.x !== 0 && depth.y !== 0) {
                        var absDepthX = Math.abs(depth.x);
                        var absDepthY = Math.abs(depth.y);

                        // Resolve the collision along the shallow axis.
                        if (absDepthY < absDepthX || collision == Enum.TileCollision.Platform) {
                            // If we crossed the top of a tile, we are on the ground.
                            if (this.previousBottom <= tileBounds.Top()) {
                                this.IsOnGround = true;
                            }

                            // Ignore platforms, unless we are on the ground.
                            if (collision == Enum.TileCollision.Impassable || this.IsOnGround) {
                                // Resolve the collision along the Y axis.
                                this.y = this.y + depth.y;

                                // Perform further collisions with the new bounds.
                                bounds = this.BoundingRectangle();
                            }
                        }
                        else if (collision == Enum.TileCollision.Impassable) // Ignore platforms.
                        {
                            // Resolve the collision along the X axis.
                            this.x = this.x + depth.x;

                            // Perform further collisions with the new bounds.
                            bounds = this.BoundingRectangle();
                        }
                    }
                }
            }
        }

        // Save the new bounds bottom.
        this.previousBottom = bounds.Bottom();
    };
    window.Player = Player;
} (window));
