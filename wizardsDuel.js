import {game, Sprite} from "./sgc/sgc.js";
game.setBackground("floor.png");

class PlayerWizard extends Sprite {
    constructor() {
        super();
        this.name = "Marcus the Wizard";
        this.setImage("marcusSheet.png");
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("right", 3, 5);
        this.height = 48;
        this.width = 48;
        this.x = this.width;
        this.y = this.height;
        this.speedWhenWalking = 100;
        this.spellCastTime = 0;
    }
    handleDownArrowKey() {
        this.playAnimation("down");
        this.speed = this.speedWhenWalking;
        this.angle = 270;
    }
    handleUpArrowKey() {
        this.playAnimation("up");
        this.speed = this.speedWhenWalking;
        this.angle = 90;
    }
    handleGameLoop() {
        // Keep Marcus in the display area
        this.y = Math.max(5, this.y);
        this.y = Math.min(game.displayHeight - this.height, this.y);
        this.speed = 0;
    }
    handleSpacebar() {
        let now = game.getTime(); //get the number of seconds since game start
        if (now - this.spellCastTime >= 2) {
            // reset the timer
            this.spellCastTime = now;
            // and cast a spell
            let spell = new Spell();
            spell.x = this.x + this.width; // this sets the position of the spell object equal to
            spell.y = this.y; // the position of any object created from the PlayerWizard class
            spell.name = "A spell cast by Marcus";
            spell.setImage("marcusSpellSheet.png");
            spell.angle = 0;
            this.playAnimation("right");
        }
    }
    handleBoundaryContract() {
        // Delete spell when it leaves display area
        game.removeSprite(this);
    }
}

let marcus = new PlayerWizard();

class Spell extends Sprite {
    constructor() {
        super();
        this.speed = 200;
        this.height = 48;
        this.width = 48;
        this.defineAnimation("magic", 0, 7);
        this.playAnimation("magic", true);
    }
    handleCollision(otherSprite) {
        // Compare images so Stranger's spells don't destroy each other.
        if (this.getImage() != otherSprite.getImage()) {
            // Adjust mostly blank spell image to vertical center.
            let verticalOffset = Math.abs(this.y - otherSprite.y);
            if (verticalOffset < this.height / 2) {
            game.removeSprite(this);
            new Fireball(otherSprite);
            }
        }
        return false;
    }
}

class NonplayerWizard extends Sprite {
    constructor() {
        super();
        this.name = "The mysterious stranger";
        this.setImage("strangerSheet.png");
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("left", 9, 11);
        this.width = 48;
        this.height = 48;
        this.x = game.displayWidth - 2 * this.width;
        this.y = this.height;
        this.angle = 270;
        this.speed = 150;
        this.playAnimation("down");
    }
    handleGameLoop() {
        if (this.y <= 0) {
            // Upward motion has reached top, so turn down
            this.y = 0;
            this.angle = 270;
            this.playAnimation("down");
        }
        if (this.y >= game.displayHeight - this.height) {
            // Downward motion has reached bottom, so turn up
            this.y = game.displayHeight - this.height;
            this.angle = 90;
            this.playAnimation("up");
        }
        if (Math.random() < 0.01) {
            let spell = new Spell();
            // Create a spell object 48 pixels to the left of this object
            spell.x = this.x - this.width;
            spell.y = this.y;
            // Make it go left, give it a name and an image
            spell.angle = 180;
            spell.name = "A spell cast by the mysterious stranger";
            spell.setImage("strangerSpellSheet.png");
            // Play the left animation
            this.playAnimation("left");
        }
    }
    handleAnimationEnd() {
        if (this.angle === 90) {
            this.playAnimation("up");
        }
        if (this.angle === 270) {
            this.playAnimation("down");
        }
    }
}

let stranger = new NonplayerWizard();

class Fireball extends Sprite {
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
        if (!game.isActiveSprite(stranger)) {
            game.end("Congratulations!\n\nMarcus has defeated the mysterious"
            + "\nstranger in the dark cloak!");
        }
        if (!game.isActiveSprite(marcus)) {
            game.end("Marcus is defeated by the mysterious"
            + "\nstranger in the dark cloak!"
            + "\n\nBetter luck next time.");
        }
    }
}

/* Ideas for shooter project
evil moving tree with falling fruit or leaves,
catching it in a basket,
point game 
vertical

same as above except
horizontal
spraying killer leaves at you (like in pokemon)
congrats game
shooting tree with ? (spells, weapons, etc.)

hunting birds or ducks (facing gun?)
birds release poop
congrats, hit bird
better luck next time, poop falls on gun/you (take a shower)
if facing gun, you riding in vehicle trying to shoot bird?

soccer, shoot in goal
goalie guarding (bounce back if hits goalie)
congrats, made a goal
better luck next time, gets in your goal
(vertical) or horizontal?
certain time limit?
name: 
    The Goals of the Goalie
    
virus coming after dolphin
*/
