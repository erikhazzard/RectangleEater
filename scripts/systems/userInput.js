/* =========================================================================
 *
 * userInput.js
 *  This script contains the game logic acts as a controller for the Entity 
 *  Component System
 *
 * ========================================================================= */
// NOTE: In a real system, this kind of initialization stuff could happen as
// a method on the system, and the system could expose a .tick function.
// For purposes of a tutorial, we'll just manually setup related system 
// functionality here
//
// start it off screen
var mousePosition = {x:-100, y: -100};

// Setup mouse handling
// --------------------------------------
function getMousePosition(evt) {
    var rect = ECS.$canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

ECS.$canvas.addEventListener('mousemove', function(evt) {
    // update the mouse position when moved
    mousePosition = getMousePosition(evt);
}, false);


// Setup the system
// --------------------------------------
ECS.systems.userInput = function systemUserInput ( entities ) {
    // Here, we've implemented systems as functions which take in an array of
    // entities. An optimization would be to have some layer which only 
    // feeds in relevant entities to the system, but for demo purposes we'll
    // assume all entities are passed in and iterate over them.
    var curEntity; 

    // iterate over all entities
    for( var entityId in entities ){
        curEntity = entities[entityId];

        // Only run logic if entity has relevant components
        if( curEntity.components.playerControlled ){
            // We can change component data based on input, which cause other
            // systems (e.g., rendering) to be affected
            curEntity.components.position.x = mousePosition.x;
            curEntity.components.position.y = mousePosition.y;
        }
    }
};
