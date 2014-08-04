/* =========================================================================
 *
 * game.js
 *  This script contains the game logic acts as a controller for the Entity 
 *  Component System
 *
 * ========================================================================= */
ECS.Game = function Game (){
    // This is our "main" function which controls everything. We setup the 
    // systems to loop over, setup entities, and setup and kick off the game
    // loop.
    var self = this;

    // Create some entities
    // ----------------------------------
    var entities = {}; // object containing { id: entity  }
    var entity;

    // Create a bunch of random entities
    for(var i=0; i < 20; i++){
        entity = new ECS.Entity();
        entity.addComponent( new ECS.Components.Appearance());
        entity.addComponent( new ECS.Components.Position());

        // % chance for decaying rects
        if(Math.random() < 0.8){
            entity.addComponent( new ECS.Components.Health() );
        }

        // NOTE: If we wanted some rects to not have collision, we could set it
        // here. Could provide other gameplay mechanics perhaps?
        entity.addComponent( new ECS.Components.Collision());

        entities[entity.id] = entity;
    }

    // PLAYER entity
    // ----------------------------------
    // Make the last entity the "PC" entity - it must be player controlled,
    // have health and collision components
    entity = new ECS.Entity();
    entity.addComponent( new ECS.Components.Appearance());
    entity.addComponent( new ECS.Components.Position());
    entity.addComponent( new ECS.Components.PlayerControlled() );
    entity.addComponent( new ECS.Components.Health() );
    entity.addComponent( new ECS.Components.Collision() );

    // we can also edit any component, as it's just data
    entity.components.appearance.colors.g = 255;
    entities[entity.id] = entity;


    // store reference to entities
    ECS.entities = entities;

    // Setup systems
    // ----------------------------------
    // Setup the array of systems. The order of the systems is likely critical, 
    // so ensure the systems are iterated in the right order
    var systems = [
        ECS.systems.userInput,
        ECS.systems.collision,
        ECS.systems.decay, 
        ECS.systems.render
    ];
    
    // Game loop
    // ----------------------------------
    function gameLoop (){
        // Simple game loop
        for(var i=0,len=systems.length; i < len; i++){
            // Call the system and pass in entities
            // NOTE: One optimal solution would be to only pass in entities
            // that have the relevant components for the system, instead of 
            // forcing the system to iterate over all entities
            systems[i](ECS.entities);
        }

        // Run through the systems. 
        // continue the loop
        if(self._running !== false){
            requestAnimationFrame(gameLoop);
        }
    }
    // Kick off the game loop
    requestAnimationFrame(gameLoop);

    // Lose condition
    // ----------------------------------
    this._running = true; // is the game going?
    this.endGame = function endGame(){ 
        self._running = false;
        document.getElementById('final-score').innerHTML = ECS.score;
        document.getElementById('game-over').className = '';

        // set a small timeout to make sure we set the background
        setTimeout(function(){
            document.getElementById('game-canvas').className = 'game-over';
        }, 100);
    };


    return this;
};

// Kick off the game
ECS.game = new ECS.Game();
