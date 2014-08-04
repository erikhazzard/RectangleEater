/* =========================================================================
 *
 * Components.js
 *  This contains all components for the tutorial (ideally, components would
 *  each live in their own module)
 *
 *  Components are just data. 
 *
 * ========================================================================= */

// Appearance 
// --------------------------------------
ECS.Components.Appearance = function ComponentAppearance ( params ){
    // Appearance specifies data for color and size
    params = params || {};

    this.colors = params.colors;
    if(!this.colors){
        // generate random color if not passed in (get 6 random hex values)
        this.colors = {
            r: 0,
            g: 100,
            b: 150
        };
    }

    this.size = params.size || (1 + (Math.random() * 30 | 0));

    return this;
};
ECS.Components.Appearance.prototype.name = 'appearance';

// Health
// --------------------------------------
ECS.Components.Health = function ComponentHealth ( value ){
    value = value || 20;
    this.value = value;

    return this;
};
ECS.Components.Health.prototype.name = 'health';

// Position
// --------------------------------------
ECS.Components.Position = function ComponentPosition ( params ){
    params = params || {};

    // Generate random values if not passed in
    // NOTE: For the tutorial we're coupling the random values to the canvas'
    // width / height, but ideally this would be decoupled (the component should
    // not need to know the canvas's dimensions)
    this.x = params.x || 20 + (Math.random() * (ECS.$canvas.width - 20) | 0);
    this.y = params.y || 20 + (Math.random() * (ECS.$canvas.height - 20) | 0);

    return this;
};
ECS.Components.Position.prototype.name = 'position';

// playerControlled 
// --------------------------------------
ECS.Components.PlayerControlled = function ComponentPlayerControlled ( params ){
    this.pc = true;
    return this;
};
ECS.Components.PlayerControlled.prototype.name = 'playerControlled';

// Collision
// --------------------------------------
ECS.Components.Collision = function ComponentCollision ( params ){
    this.collides = true;
    return this;
};
ECS.Components.Collision.prototype.name = 'collision';
