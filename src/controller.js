define(['lib/three.min', 'lib/PointerLockControls', 'lib/THREEx.FullScreen'], function(three, plc, threex) {
    var MOVESPEED = 450.00;
    var controls,
        controlsEnabled,
        moveForward = false,
        moveBackward = false,
        moveLeft = false,
        moveRight = false,
        canJump = true,
        velocity;
    
    function init(camera, scene) {
        if('pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document) {
            var element = document.body;
            var pointerlockchange = function(event) {
                if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                        controlsEnabled = true;
                        controls.enabled = true;
                } else {
                    controls.enabled = false;
                }
            }
            
            var pointerlockerror = function(event) {
                console.log("Error obtaining controls.");
            }
            
            // Hook pointer lock state change events
            document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'pointerlockerror', pointerlockerror, false );
            document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
            document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
            
            document.addEventListener( 'click', function ( event ) {
                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                if ( /Firefox/i.test( navigator.userAgent ) ) {
                    var fullscreenchange = function ( event ) {
                        if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                            document.removeEventListener( 'fullscreenchange', fullscreenchange );
                            document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                            element.requestPointerLock();
                        }
                    }
                    document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                    document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
                    element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                    element.requestFullscreen();

                } else {
                    element.requestPointerLock();
                }
            }, false );
        }
        
        var onMouseDown = function(event) {
            if (THREEx.FullScreen.available() && !THREEx.FullScreen.activated()) {
                THREEx.FullScreen.request();
            }
        };
        document.addEventListener('mousedown', onMouseDown, false);

        var onKeyDown = function(event) {
            switch(event.keyCode) {
                case 38:
                case 87:
                    moveForward = true;
                    break;
                case 37:
                case 65:
                    moveLeft = true;
                    break;
                case 40:
                case 83:
                    moveBackward = true;
                    break;
                case 39:
                case 68:
                    moveRight = true;
                    break;
                case 32:
                    if(canJump)
                        velocity.y += 350;
                    canJump = false;
                    break;

            }
        };
        document.addEventListener('keydown', onKeyDown, false);

        var onKeyUp = function(event) {
            switch(event.keyCode) {
                case 38:
                case 87:
                    moveForward = false;
                    break;
                case 37:
                case 65:
                    moveLeft = false;
                    break;
                case 40:
                case 83:
                    moveBackward = false;
                    break;
                case 39:
                case 68:
                    moveRight = false;
                    break;
            }
        }
        document.addEventListener('keyup', onKeyUp, false);
        
        velocity = new THREE.Vector3(0, 0, 0);
        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());       
    };
    
    function update(delta) {
           if(controlsEnabled) {
                velocity.y -= 9.8 * 100.00 * delta;
                
                if(moveForward)
                    velocity.z = -(MOVESPEED) * 10.00 * delta;
                if(moveBackward)
                    velocity.z = MOVESPEED * 10.00 *  delta;
                if(!moveForward && !moveBackward)
                    velocity.z = 0;
               
                if(moveLeft)
                    velocity.x = -(MOVESPEED) * 10.00 *  delta;
                if(moveRight)
                    velocity.x = (MOVESPEED) * 10.00 * delta;
                if(!moveLeft && !moveRight)
                    velocity.x = 0;
               
                controls.getObject().translateX(velocity.x * delta);
                controls.getObject().translateY(velocity.y * delta);
                controls.getObject().translateZ(velocity.z * delta);
               
                if(controls.getObject().position.y < 10) {
                    velocity.y = 0;
                    controls.getObject().position.y = 10;
                    canJump = true;
                }
           }
    }
    
    return {
        init: init,
        update: update
    }
    
});