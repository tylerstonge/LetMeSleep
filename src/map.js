define(['lib/three.min', 'level'], function(three, level) {
    
    function render(scene, unit, materials) {
        for(var i = 0; i < level.level01.length; i++) {
            renderY(level.level01[i], scene, unit, materials, (i - 1) * unit);      
        }
    }
    
    function renderY(level, scene, unit, materials, altitude) {
        var width = level[0].length,
            height = level.length;
        
        var geometry = new THREE.BoxGeometry(unit, unit, unit);
        
        for(var y = 0; y < height; y++) {
            for(var x = 0; x < width; x++) {
                if(level[y][x] > 0) {
                    material = new THREE.MeshLambertMaterial({ map: materials[level[y][x]] });
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = (width/2 - x) * unit;
                    mesh.position.y = altitude;
                    mesh.position.z = (y - height/2 ) * unit;
                    scene.add(mesh);       
                }
            }
        }
    }
    
    return {
        render: render,
    }
});