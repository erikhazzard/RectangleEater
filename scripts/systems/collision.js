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
    var entityIndiciesCollidedWith = [];

    // iterate over all entities
    for( var i=0, len=entities.length; i < len; i++ ){
        curEntity = entities[i];
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
            for( var j=0; j < len; j++){
                // Don't check player controller entities for collisions 
                // (otherwise, it'd always be true)
                if( !entities[j].components.playerControlled &&
                    entities[j].components.position &&
                    entities[j].components.collision &&
                    entities[j].components.appearance ){

                    if( doesIntersect( 
                        {
                            position: curEntity.components.position,
                            size: curEntity.components.appearance.size
                        },
                        {
                            position: entities[j].components.position, 
                            size: entities[j].components.appearance.size
                        }
                    )){
                        curEntity.components.appearance.colors.r = 255;
                        entities[j].components.appearance.colors.r = 150;

                        // Don't modify the array in place; we're still iterating
                        // over it
                        entityIndiciesCollidedWith.push(j);

                        if(curEntity.components.health){
                            // Increase the entity's health, it ate something
                            curEntity.components.health.value += Math.max(
                                -2,
                                12 - entities[j].components.appearance.size
                            );

                            // extra bonus for hitting small entities
                            if(entities[j].components.appearance.size < 1.5){
                                // don't let it get out of control
                                if(curEntity.components.health.value < 30){
                                    curEntity.components.health.value += 5;
                                }
                            }

                        }

                        // update the score
                        ECS.$score.innerHTML = +(ECS.$score.innerHTML) + 1;

                        break;
                    }
                }
            }
        }
    }

    // Now that all entities have been checked, do something if collision 
    // happened

    if(entityIndiciesCollidedWith.length > 0){
        for(i=0; i<entityIndiciesCollidedWith.length; i++){
            // Systems can also update the available entities,
            // which affects other systems (once an entity is 
            // removed in this case, it won't be rendered)
            //
            // remove the entity
            ECS.entities.splice(entityIndiciesCollidedWith[i], 1);
        }
    }

    if(entityIndiciesCollidedWith.length > 0){
        for(i=0; i<entityIndiciesCollidedWith.length; i++){
            var newEntity;

            // Don't add more entities if there are already too many
            if(ECS.entities.length < 30){

                for(var k=0; k < 3; k++){
                    // Add some new collision rects randomly
                    if(Math.random() < 0.8){
                        newEntity = new ECS.Assemblages.CollisionRect();
                        ECS.entities.push(newEntity);

                        // add a 60% chance that they'll decay
                        if(Math.random() < 0.8){
                            newEntity.addComponent( new ECS.Components.Health() );
                        }
                    }
                }

            }
        }
    }
};
