import {game, Sprite} from "./sgc/sgc.js";
game.setBackground("SkyEdited.jpg");                        //(works!)

/* From Henry's perspective,
he is looking up into the blue sky
where the duck is flying.
Henry wants to shoot the duck
before it purposefully poops on him. */

class PlayerShooter extends Sprite {
    constructor() {
        super();
        this.name = "Henry the Hunter";
        this.setImage("GunEdited.jpg");                              //(On Screen, moves slightly, in correct spot starting)
        this.height = 48;                                           //stays in boundaries, cannot shoot though
        this.width = 48;
        this.x = this.width;
        this.y = game.displayHeight - this.height;
        this.speedWhenWalking = 100;
        this.bulletShootTime = 0;
    }
    handleLeftArrowKey() {                              //works
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }
    handleRightArrowKey() {                             //works
        this.speed = this.speedWhenWalking;
        this.angle = 0;
    }
    handleGameLoop() {
        // Keep Henry in the display area               (works perfectly)
        this.x = Math.max(5, this.x);
        this.x = Math.min(game.displayWidth - this.width, this.x);
        this.speed = 0;
    }
    handleSpacebar() {
        let now = game.getTime();
        if (now - this.bulletShotTime >= 2) {
            // reset the timer
            this.bulletShotTime = now;
            // and fire a bullet
            let bullet = new Bullet();                      //fix bullet.x and bullet.y?
            bullet.x = this.x; // this sets the position of the bullet object equal to
            bullet.y = this.y - this.height; // the position of any object created from the PlayerShooter class
            bullet.name = "A bullet fired by Henry";
            bullet.setImage("BulletEdited.jpg");
            bullet.angle = 90;
        }
    }
    handleBoundaryContract() {
        // Delete bullet when it leaves display area
        game.removeSprite(this);
    }
}

let henry = new PlayerShooter();

class Duck extends Sprite {
    constructor() {
        super();
        this.name = "The Flying Duck"; // Create set image???? (how to have it going left and right without defineAnimation)
        this.height = 48;
        this.width = 48;
        // this.defineAnimation(to the left and right)?
        this.width = 48;
        this.height = 48;
        this.x = game.displayWidth - 2 * this.width;   // Check this.x and this.y
        this.y = this.height;
        this.angle = 0;
        this.speed = 150;
        //this.playAnimation("");
    }
    handleGameLoop() {                              //Check first 2 if statements (seems right)
        if (this.angle === 0) {
            this.setImage("FlyingDuckRight.gif");
        }
        if (this.angle === 180) {
            this.setImage("FlyingDuckLeft.gif");
        }
        if (this.x <= 0) {
            this.x = 0;
            this.angle = 0;
            //this.playAnimation("right");
        }
        if (this.x >= game.displayWidth - this.width) {
            this.x = game.displayWidth - this.width;
            this.angle = 180;
        }
        if (Math.random() < 0.01) {
            let poop = new duckPoop();                          //Hits Henry directly :)
            // Create a poop object 48 pixels to the bottom of this object
            poop.x = this.x - this.height;
            poop.y = this.y;
            // Make it go downwards, give it a name and an image
            poop.angle = 270;
            poop.name = "Some poop dropped by the flying duck";
            poop.setImage("DuckPoop.png");
            // Play the left animation: this.playAnimation("down");
        }
    }   //Seems like duck is going back and forth if handleAnimationEnd is in comments (or deleted), still can't see FlyingDuckLeft.gif
}
    


let duck = new Duck();

class Bullet extends Sprite {
    constructor() {
        super();
        this.name = "A bullet fired from the gun";
        this.speed = 200;
        this.height = 48;
        this.width = 10;
    }
    handleCollision(otherSprite) {
        // Compare images so Henry's bullets don't destroy each other.
        if (this.getImage() != otherSprite.getImage()) {
            // Adjust mostly blank bullet image to horizontal center.
            let horizontalOffset = Math.abs(this.x - otherSprite.x);
            if (horizontalOffset < this.height * 4.8) {
            game.removeSprite(this);
            new Fireball(otherSprite);
            }
        }
        return false;
    }
}

class duckPoop extends Sprite {
    constructor() {
        super();
        this.name = "Some poop dropped from the flying duck";
        this.speed = 200;
        this.height = 48;
        this.width = 10;
    }
    handleCollision(otherSprite) {
        // Compare images so the duck's poop doesn't destroy each other.
        if (this.getImage() != otherSprite.getImage()) {
            // Adjust mostly blank duckPoop image to horizontal center.
            let horizontalOffset = Math.abs(this.x - otherSprite.x);
            if (horizontalOffset < this.width * 4.8) {
            game.removeSprite(this);
            new Fireball(otherSprite);
            }
        }
        return false;
    }
}

class Fireball extends Sprite {                     //Done
    constructor(deadSprite) {
        super ();
        this.x = deadSprite.x;
        this.y = deadSprite.y;
        this.setImage("fireballSheet.png");
        this.name = "A ball of fire";
        game.removeSprite(deadSprite);
        this.defineAnimation("explode", 0, 15);
        this.playAnimation("explode");
    }
    handleAnimationEnd() {
        game.removeSprite(this);
        if (!game.isActiveSprite(duck)) {
            game.end("Congratulations!\n\nHenry has killed the flying"          //works!
            + "\nduck in the sky!");
        }
        if (!game.isActiveSprite(henry)) {
            game.end("Henry is defeated by the flying"                          //Cant tell if it works, cannot shoot bullets
            + "\nduck in the sky!"
            + "\n\nBetter luck next time."
            + "\n\n(Better take a shower now.)");
        }
    }
}

/* Ideas for shooter project

hunting ducks
ducks release poop
congrats, hit duck
better luck next time, poop falls on gun/you (take a shower)
shooting duck, flying across screen
*/

/*          Citations:

            Duck (not edited)
left and right animations:
"Ducks: Animated Images & Gifs" animatedimages.org, 2018.
    <http://www.animatedimages.org/cat-ducks-481.htm>*

            Sky (Edited on Paint; Horizontal = 800, Vertical = 600)
"Blue Sky Cafe in Fletcher."  Bubba's Grill Inc., 2018.
    <https://www.iloveblueskycafe.com/>*

            Gun (edited on Paint 3D; cropped (w48,h48), (tried) take out background)
Singh, Gaurav. "What happens to the bullet if a gun is fired vertically upward
    from Earth's surface? Does it escape the Earth's gravitational field?" 
    Quora, 29 Oct 2014. <https://www.quora.com/What-happens-to-the-bullet-if-a-
    gun-is-fired-vertically-upward-from-Earths-surface-Does-it-escape-the-
    Earths-gravitational-field>*

            Bullet (edited on Paint 3D; face up, take out background, cropped (w10,h48))
Eric. “Bullet Transparent Background.” PNG Mart, 2018. <www.pngmart.com/image/110282>*

I myself created the following images on Sept. 14, 2018:
    DuckPoop.png (from GIMP 2.10.6)
    
*All images were accessed on Sept. 14, 2018.

*/