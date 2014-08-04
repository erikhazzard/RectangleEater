/* =========================================================================
 *
 * decay.js
 *  This system "decays" entities that have a health component. Each tick
 *  decreases the size and health slightly
 *
 *  This is where a lot of the core gameplay experience comes from. Too slow,
 *  the game is too easy. If it decays to fast, the game isn't so fun.
 *
 * ========================================================================= */
// Setup the system
// --------------------------------------
ECS.systems.decay = function systemDecay ( entities ) {
    // Here, we've implemented systems as functions which take in an array of
    // entities. An optimization would be to have some layer which only 
    // feeds in relevant entities to the system, but for demo purposes we'll
    // assume all entities are passed in and iterate over them.
    var curEntity; 

    // iterate over all entities
    for( var entityId in entities ){
        curEntity = entities[entityId];

        // First, check if the entity is dead
        if(curEntity.components.playerControlled){
            if(curEntity.components.health.value < 0){
                // Dead! End game if player controlled
                ECS.game.endGame();
                return false;
            }
        }

        // Only run logic if entity has relevant components
        if( curEntity.components.health ){

            // Decrease health depending on current health
            // --------------------------
            // Here's where we configure how fun the game is
            if(curEntity.components.health.value < 0.7){
                curEntity.components.health.value -= 0.01;

            } else if(curEntity.components.health.value < 2){
                curEntity.components.health.value -= 0.03;

            } else if(curEntity.components.health.value < 10){
                curEntity.components.health.value -= 0.07;

            } else if(curEntity.components.health.value < 20){
                curEntity.components.health.value -= 0.15;
            } else {
                // If the square is huge, it should very quickly decay
                curEntity.components.health.value -= 1;
            }

            // Check for alive / dead
            // --------------------------
            if(curEntity.components.health.value >= 0){

                // Set style based on other components too - player controlled 
                // entity should be style differently based on their health
                // Update appearance based on health
                // NOTE: Even though we set appearance properties here, they
                // don't get rendered here - they get rendered in the render
                // system
                if(curEntity.components.playerControlled){ 
                    if(curEntity.components.health.value > 10){
                        curEntity.components.appearance.colors.r = 50;
                        curEntity.components.appearance.colors.g = 255;
                        curEntity.components.appearance.colors.b = 50;
                    } else {
                        curEntity.components.appearance.colors.r = 255;
                        curEntity.components.appearance.colors.g = 50;
                        curEntity.components.appearance.colors.b = 50;
                    } 
                }

                // Entity is still ALIVE
                if(curEntity.components.appearance.size){
                    curEntity.components.appearance.size = curEntity.components.health.value;
                }

            } else {

                //Entity is DEAD
                if(curEntity.components.playerControlled){

                    // Dead! End game if player controlled
                    ECS.game.endGame();
                } else {
                    // otherwise, remove the entity
                    delete entities[entityId];
                }
            }
        }
    }
};
