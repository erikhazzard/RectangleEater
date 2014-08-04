/* =========================================================================
 *
 * collision.js
 *   This system checks to see if a usermovable entity is colliding with any
 *   other entities that have a collision component
 *
 * ========================================================================= */
// Basic collision detection for rectangle intersection (NOTE: again, this would
// live inside the system itself)
function doesIntersect(obj1, obj2) {
    // Takes in two objects with position and size properties
    //  obj1: player controlled position and size
    //  obj2: object to check
    //
    var rect1 = {
        x: obj1.position.x - obj1.size,
        y: obj1.position.y - obj1.size,
        height: obj1.size * 2,
        width: obj1.size * 2
    };
    var rect2 = {
        x: obj2.position.x - obj2.size,
        y: obj2.position.y - obj2.size,
        height: obj2.size * 2,
        width: obj2.size * 2
    };

    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y);
}

// Collision system
// --------------------------------------
ECS.systems.collision = function systemCollision ( entities ) {
    // Here, we've implemented systems as functions which take in an array of
    // entities. An optimization would be to have some layer which only 
    // feeds in relevant entities to the system, but for demo purposes we'll
    // assume all entities are passed in and iterate over them.

    var curEntity; 
    var entityIdsCollidedWith = [];

    // iterate over all entities
    for( var entityId in entities ){
        curEntity = entities[entityId];

        // NOTE: Even though we set the colors here, we don't render them 
        //  (that's the job of the renderer system)
        curEntity.components.appearance.colors.r = 0;

        // Only check for collision on player controllable entities 
        // (playerControlled) and entities with a collision component
        if( curEntity.components.appearance &&
            curEntity.components.playerControlled && 
            curEntity.components.position ){

            // Systems can also modify components...
            // Clear out existing collision appearance property
            curEntity.components.appearance.colors.r = 0;

            // test for intersection of player controlled rects vs. all other
            // collision rects
            for( var entityId2 in entities){ 
                // Don't check player controller entities for collisions 
                // (otherwise, it'd always be true)
                if( !entities[entityId2].components.playerControlled &&
                    entities[entityId2].components.position &&
                    entities[entityId2].components.collision &&
                    entities[entityId2].components.appearance ){

                    if( doesIntersect( 
                        {
                            position: curEntity.components.position,
                            size: curEntity.components.appearance.size
                        },
                        {
                            position: entities[entityId2].components.position, 
                            size: entities[entityId2].components.appearance.size
                        }
                    )){
                        curEntity.components.appearance.colors.r = 255;
                        entities[entityId2].components.appearance.colors.r = 150;

                        // Don't modify the array in place; we're still iterating
                        // over it
                        entityIdsCollidedWith.push(entityId);
                        var negativeDamageCutoff = 12;

                        if(curEntity.components.health){
                            // Increase the entity's health, it ate something
                            curEntity.components.health.value += Math.max(
                                -2,
                                negativeDamageCutoff - entities[entityId2].components.appearance.size
                            );

                            // extra bonus for hitting small entities
                            if(entities[entityId2].components.appearance.size < 1.3){
                                if(curEntity.components.health.value < 30){
                                    // Add some bonus health if it's really small,
                                    // but don't let it get out of control
                                    curEntity.components.health.value += 9;
                                }
                            }
                            if ( entities[entityId2].components.appearance.size > negativeDamageCutoff ){
                                // Flash the canvas. NOTE: This is ok for a tutorial,
                                // but ideally this would not be coupled in the
                                // collision system
                                ECS.$canvas.className='badHit';
                                setTimeout(function(){
                                    ECS.$canvas.className='';
                                }, 100);

                                // substract even more health from the player
                                // but don't let it take away more than 5 dm
                                curEntity.components.health.value -= Math.min(
                                    5,
                                    entities[entityId2].components.appearance.size - negativeDamageCutoff
                                );


                            } else {
                                // Flash the canvas. NOTE: This is ok for a tutorial,
                                // but ideally this would not be coupled in the
                                // collision system
                                ECS.$canvas.className='goodHit';
                                setTimeout(function(){
                                    ECS.$canvas.className='';
                                }, 100);
                            }
                        }

                        // update the score
                        ECS.score++;
                        ECS.$score.innerHTML = ECS.score;

                        delete ECS.entities[entityId2];

                        break;
                    }
                }
            }
        }
    }

    // Add new entities if the player collided with any entities
    // ----------------------------------
    var chanceDecay = 0.8;
    var numNewEntities = 3;

    if(ECS.score > 100){
        chanceDecay = 0.6;
        numNewEntities = 4;
    }

    if(entityIdsCollidedWith.length > 0){
        for(i=0; i<entityIdsCollidedWith.length; i++){
            var newEntity;

            // Don't add more entities if there are already too many
            if(Object.keys(ECS.entities).length < 30){

                for(var k=0; k < numNewEntities; k++){
                    // Add some new collision rects randomly
                    if(Math.random() < 0.8){
                        newEntity = new ECS.Assemblages.CollisionRect();
                        ECS.entities[newEntity.id] = newEntity;

                        // add a % chance that they'll decay
                        if(Math.random() < chanceDecay){
                            newEntity.addComponent( new ECS.Components.Health() );
                        }
                    }
                }

            }
        }
    }
};
