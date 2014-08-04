/* =========================================================================
 *
 * decay.js
 *  This system "decays" entities that have a health component. Each tick
 *  decreases the size and health slightly
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
    var entityIndiciesToRemove = [];

    // iterate over all entities
    for( var i=0, len=entities.length; i < len; i++ ){
        curEntity = entities[i];

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
            if(curEntity.components.health.value < 0.7){
                curEntity.components.health.value -= 0.01;

            } else if(curEntity.components.health.value < 2){
                curEntity.components.health.value -= 0.03;

            } else if(curEntity.components.health.value < 10){
                curEntity.components.health.value -= 0.05;

            } else if(curEntity.components.health.value < 20){
                curEntity.components.health.value -= 0.15;

            } else {
                curEntity.components.health.value -= 1;
            }

            // Check for alive / dead
            // --------------------------
            if(curEntity.components.health.value >= 0){

                // Entity is still ALIVE
                if(curEntity.components.appearance.size){
                    curEntity.components.appearance.size = curEntity.components.health.value;
                }

                // Update appearance based on health
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

            } else {

                //Entity is DEAD
                if(curEntity.components.playerControlled){

                    // Dead! End game if player controlled
                    ECS.game.endGame();
                } else {
                    // otherwise, remove the entity
                    entityIndiciesToRemove.push(ECS.entities.indexOf(curEntity));
                }
            }
        }
    }

    // If we need to remove entities, do it after iterating
    if(entityIndiciesToRemove.length > 0){
        for( i=0; i<entityIndiciesToRemove.length; i++){
            ECS.entities.splice(entityIndiciesToRemove[i], 1);
        }
    }
};
