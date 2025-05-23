// Game variables
let scene, camera, renderer, controls;
let water, fishEntities = [];
let isGameActive = false;
let score = 0;
let fishCaught = 0;
let currentLure = 'Basic';
let lures = ['Basic', 'Spinner', 'Jig', 'Crankbait'];
let currentLureIndex = 0;
let lureProjectiles = [];
let clock = new THREE.Clock();

// Movement controls
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
const speed = 10.0;

// Fish types with properties
const fishTypes = [
    { name: 'Bass', points: 50, speed: 0.8, model: 'bass', size: 1.0, color: 0x267F00 },
    { name: 'Pike', points: 75, speed: 1.2, model: 'pike', size: 1.2, color: 0x3A7D44 },
    { name: 'Trout', points: 40, speed: 1.5, model: 'trout', size: 0.9, color: 0x8C5E58 },
    { name: 'Walleye', points: 60, speed: 0.9, model: 'walleye', size: 1.1, color: 0xC9AE5D }
];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Event listeners
    document.getElementById('start-button').addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', castLure);
    window.addEventListener('resize', onWindowResize);
    
    console.log('Event listeners registered');
});

// Initialize the game
function init() {
    try {
        console.log('Game init started');
        
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.6, 0); // Eye level
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.getElementById('game-container').appendChild(renderer.domElement);
        
        // Create controls
        controls = new THREE.PointerLockControls(camera, document.body);
        
        // Set up pointer lock control events
        controls.addEventListener('lock', () => {
            console.log('Controls locked');
        });
        
        controls.addEventListener('unlock', () => {
            console.log('Controls unlocked');
            if (isGameActive) {
                document.getElementById('game-menu').style.display = 'flex';
                isGameActive = false;
            }
        });
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Create water
        createWater();
        
        // Create terrain/environment
        createEnvironment();
        
        // Create crosshair
        createCrosshair();
        
        console.log('Game init completed');
        
        // Start animation loop
        animate();
    } catch (error) {
        console.error('Error during initialization:', error);
        alert('Error initializing game: ' + error.message);
    }
}

// Create water surface
function createWater() {
    const waterGeometry = new THREE.PlaneGeometry(200, 200);
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x0055AA,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -2;
    scene.add(water);
}

// Create environment elements
function createEnvironment() {
    // Skybox
    const skyboxGeometry = new THREE.BoxGeometry(500, 500, 500);
    const skyboxMaterials = [
        new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0xAFEEEE, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0x20B2AA, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide })
    ];
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
    scene.add(skybox);
    
    // Shore/Land
    const landGeometry = new THREE.CircleGeometry(200, 64);
    const landMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const land = new THREE.Mesh(landGeometry, landMaterial);
    land.rotation.x = -Math.PI / 2;
    land.position.y = -2.01;
    scene.add(land);
    
    // Trees and rocks (simplified)
    for (let i = 0; i < 30; i++) {
        const radius = 50 + Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Tree (simple cone and cylinder)
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 0.5, z);
        scene.add(trunk);
        
        const leavesGeometry = new THREE.ConeGeometry(3, 7, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(x, 5, z);
        scene.add(leaves);
    }
}

// Create crosshair
function createCrosshair() {
    const crosshairElement = document.createElement('img');
    crosshairElement.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIGZpbGw9IndoaXRlIi8+PGxpbmUgeDE9IjEyIiB5MT0iNCIgeDI9IjEyIiB5Mj0iOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMiIgeTI9IjIwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iNCIgeTE9IjEyIiB4Mj0iOCIgeTI9IjEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMTYiIHkxPSIxMiIgeDI9IjIwIiB5Mj0iMTIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==';
    crosshairElement.classList.add('crosshair');
    document.getElementById('game-container').appendChild(crosshairElement);
}

// Start the game
function startGame() {
    console.log('Starting game');
    document.getElementById('game-menu').style.display = 'none';
    document.getElementById('loading-screen').style.display = 'flex';
    
    // Simulate loading
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        document.getElementById('progress-bar-fill').style.width = progress + '%';
        
        if (progress >= 100) {
            progress = 100;
            document.getElementById('progress-bar-fill').style.width = '100%';
            clearInterval(loadingInterval);
            
            console.log('Loading complete, starting game in 500ms');
            
            // Start actual game
            setTimeout(() => {
                console.log('Hiding loading screen');
                document.getElementById('loading-screen').style.display = 'none';
                
                console.log('Requesting pointer lock');
                try {
                    controls.lock();
                } catch (e) {
                    console.error('Error locking controls:', e);
                    alert('Error starting game: ' + e.message);
                }
                
                console.log('Setting game as active');
                isGameActive = true;
                
                console.log('Spawning fish');
                spawnFish();
            }, 500);
        }
    }, 200);
}

// Handle key press events
function handleKeyDown(event) {
    if (!isGameActive) return;
    
    // Change lure with number keys 1-4
    if (event.key >= '1' && event.key <= '4') {
        currentLureIndex = parseInt(event.key) - 1;
        currentLure = lures[currentLureIndex];
        document.getElementById('current-lure').textContent = currentLure;
    }
    
    // WASD movement
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            moveForward = true;
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveBackward = true;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            moveLeft = true;
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveRight = true;
            break;
    }
}

// Handle key up events
function handleKeyUp(event) {
    if (!isGameActive) return;
    
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            moveForward = false;
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveBackward = false;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            moveLeft = false;
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveRight = false;
            break;
    }
}

// Cast lure (shoot)
function castLure(event) {
    if (!isGameActive || !controls.isLocked) return;
    
    // Create lure projectile
    const lureGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const lureMaterial = new THREE.MeshBasicMaterial({ 
        color: getLureColor(currentLure) 
    });
    const lure = new THREE.Mesh(lureGeometry, lureMaterial);
    
    // Set lure position and direction
    lure.position.copy(camera.position);
    
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    lure.userData = {
        velocity: direction.multiplyScalar(2),
        type: currentLure,
        timeCreated: Date.now()
    };
    
    scene.add(lure);
    lureProjectiles.push(lure);
    
    // Play cast sound
    playSound('cast');
}

// Get color based on lure type
function getLureColor(lureType) {
    switch(lureType) {
        case 'Spinner': return 0xC0C0C0;
        case 'Jig': return 0xFFD700;
        case 'Crankbait': return 0xFF6347;
        default: return 0xFFFFFF;
    }
}

// Spawn fish at random intervals
function spawnFish() {
    // Spawn initial batch
    for (let i = 0; i < 5; i++) {
        createFish();
    }
    
    // Continue spawning
    setInterval(() => {
        if (isGameActive && fishEntities.length < 15) {
            createFish();
        }
    }, 2000);
}

// Create a fish entity
function createFish() {
    const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    
    // Create simple fish shape
    const fishGeometry = new THREE.ConeGeometry(fishType.size * 0.5, fishType.size * 2, 8);
    const fishMaterial = new THREE.MeshStandardMaterial({ color: fishType.color });
    const fish = new THREE.Mesh(fishGeometry, fishMaterial);
    
    // Position fish at random location in water
    const radius = 10 + Math.random() * 40;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    fish.position.set(x, -1, z);
    
    // Rotate fish to face a random direction
    fish.rotation.y = Math.random() * Math.PI * 2;
    
    // Add fish data
    fish.userData = {
        type: fishType.name,
        points: fishType.points,
        speed: fishType.speed,
        direction: new THREE.Vector3(
            Math.random() - 0.5,
            0,
            Math.random() - 0.5
        ).normalize(),
        changeDirectionTime: Date.now() + 2000 + Math.random() * 3000
    };
    
    scene.add(fish);
    fishEntities.push(fish);
}

// Play sound effects (mock)
function playSound(type) {
    // In a real game, we would implement actual sound here
    console.log(`Playing sound: ${type}`);
}

// Handle fish catch
function catchFish(fish, lure) {
    // Remove fish and lure from scene
    scene.remove(fish);
    scene.remove(lure);
    
    // Update score
    score += fish.userData.points;
    fishCaught++;
    
    // Update UI
    document.getElementById('score-value').textContent = score;
    document.getElementById('fish-caught').textContent = fishCaught;
    
    // Remove from arrays
    fishEntities = fishEntities.filter(f => f !== fish);
    lureProjectiles = lureProjectiles.filter(l => l !== lure);
    
    // Play catch sound
    playSound('catch');
}

// Resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    if (isGameActive) {
        // Handle WASD movement
        velocity.x = 0;
        velocity.z = 0;
        
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        
        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;
        
        // Apply movement to controls (camera)
        controls.moveRight(-velocity.x);
        controls.moveForward(-velocity.z);
        
        // Ensure player stays within bounds
        const playerPos = camera.position.clone();
        const distanceFromCenter = Math.sqrt(
            playerPos.x * playerPos.x + 
            playerPos.z * playerPos.z
        );
        
        if (distanceFromCenter > 90) {
            // Move player back toward center
            const toCenter = new THREE.Vector3(-playerPos.x, 0, -playerPos.z).normalize();
            camera.position.x += toCenter.x * 0.5;
            camera.position.z += toCenter.z * 0.5;
        }
        
        // Update lure projectiles
        for (let i = lureProjectiles.length - 1; i >= 0; i--) {
            const lure = lureProjectiles[i];
            lure.position.add(lure.userData.velocity.clone().multiplyScalar(delta));
            
            // Remove lures that have been active too long
            if (Date.now() - lure.userData.timeCreated > 5000) {
                scene.remove(lure);
                lureProjectiles.splice(i, 1);
                continue;
            }
            
            // Check for lure hitting water
            if (lure.position.y < -1.5) {
                lure.position.y = -1.5;
                lure.userData.velocity.y *= -0.5;
                lure.userData.velocity.x *= 0.9;
                lure.userData.velocity.z *= 0.9;
            }
        }
        
        // Update fish
        for (let i = fishEntities.length - 1; i >= 0; i--) {
            const fish = fishEntities[i];
            
            // Move fish
            const moveVector = fish.userData.direction.clone().multiplyScalar(fish.userData.speed * delta);
            fish.position.add(moveVector);
            
            // Make fish face movement direction
            fish.lookAt(fish.position.clone().add(fish.userData.direction));
            
            // Check if fish should change direction
            if (Date.now() > fish.userData.changeDirectionTime) {
                fish.userData.direction = new THREE.Vector3(
                    Math.random() - 0.5,
                    0,
                    Math.random() - 0.5
                ).normalize();
                fish.userData.changeDirectionTime = Date.now() + 2000 + Math.random() * 3000;
            }
            
            // Keep fish within bounds
            const distanceFromCenter = Math.sqrt(
                fish.position.x * fish.position.x + 
                fish.position.z * fish.position.z
            );
            
            if (distanceFromCenter > 50) {
                // Turn fish back toward center
                const toCenter = new THREE.Vector3(-fish.position.x, 0, -fish.position.z).normalize();
                fish.userData.direction.lerp(toCenter, 0.2);
            }
            
            // Check for fish catching lure
            for (let j = lureProjectiles.length - 1; j >= 0; j--) {
                const lure = lureProjectiles[j];
                if (fish.position.distanceTo(lure.position) < 2) {
                    catchFish(fish, lure);
                    break;
                }
            }
        }
    }
    
    // Render scene
    renderer.render(scene, camera);
}