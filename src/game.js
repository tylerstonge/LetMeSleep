define(['lib/three.min', 'controller', 'map'], function(three, controller, map) {
	
    var UNIT = 200,
        SENSITIVITY = 0.085;
    
	var scene, 
        camera, 
        renderer,
        clock,
        materials = [];
    
    var materialsLength,
        materialsIndex;

	function init() {
        clock = new THREE.Clock();
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
		camera.position.z = UNIT*.2;
        
        controller.init(camera, scene);
        
        materialsLength = 3;
        materialsIndex = 0;
        materials[1] = THREE.ImageUtils.loadTexture('src/res/wall.jpeg', undefined, materialsLoaded, function() { console.log("Error loading wall.jpeg"); });
        materials[2] = THREE.ImageUtils.loadTexture('src/res/dirt.png', undefined, materialsLoaded, function() { console.log("Error loading dirt.png"); });
        materials[3] = THREE.ImageUtils.loadTexture('src/res/static.jpeg', undefined, materialsLoaded, function() { console.log("Error loading static.jpeg"); });

        var light = new THREE.AmbientLight(0xcccccc);
		scene.add(light);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
        
        window.addEventListener('resize', onWindowResize, false);
		document.body.appendChild(renderer.domElement);
	}
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

	function animate() {
		requestAnimationFrame(animate);
        
        var delta = clock.getDelta();
        controller.update(delta);
        
		renderer.render(scene, camera);
	}
    
    function materialsLoaded() {
        materialsIndex++;
        if(materialsIndex == materialsLength) {
            map.render(scene, UNIT, materials);
        }
    }

	return {
		init: init,
		animate: animate
	}
});
