angular.module('starter.directives', [])

.directive('solarSystem', function() {
  return {
    'restrict': 'E',
    'template': '<h1>solarSystem</h1>',
    'scope': {
      'stereoEffect': '=',
      'landscapeMode': '=',
      'moveStarFighter': '=',
      'planetsSpeed': '='
    },
    'link': link
  };
  function link($scope, $element, $attr) {

    var scene, camera, renderer, element, container, effect, controls, ambientLight, clock;


    function init() {
      // Main Scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 2000);
      scene.add(camera);
      renderer = new THREE.WebGLRenderer({antialias: true});
      element = renderer.domElement;
      container = $element[0];
      container.appendChild(element);
      effect = new THREE.StereoEffect(renderer);
      // Controls
      controls = new THREE.OrbitControls(camera, element);
      controls.target.set(camera.position.x + 0.15, camera.position.y, camera.position.z);
      controls.noPan = true;
      controls.noZoom = true;
      controls.noZoom = true;
      function setOrientationControls(e) {
        if (!e.alpha) {
          return;
        }
        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();
        element.addEventListener('click', fullscreen, false);
        window.removeEventListener('deviceorientation', setOrientationControls, true);
      };
      window.addEventListener('deviceorientation', setOrientationControls, true);
      // Lighting
      ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);
      // Loaders
      var manager = new THREE.LoadingManager();
      manager.onProgress = function(item, loaded, total){
        console.log("StarFighter - Loading: " + loaded + "/" + total);
        if(loaded == total) {
          console.log("StarFighter - Load Finished");
        }
      };
      var Loader_OBJ = new THREE.OBJLoader(manager);

    };

    function animate() {
      var elapsedSeconds = clock.getElapsedTime();
      requestAnimationFrame(animate);
      update(clock.getDelta());
      render(clock.getDelta());
    };

    function update(dt) {
      resize();
      camera.updateProjectionMatrix();
      controls.update(dt);
    };

    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    };

    function resize() {
      var width = container.offsetWidth;
      var height = container.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if($scope.stereoEffect == true) {
        effect.setSize(width, height);
      } else {
        renderer.setSize(width, height);
      }
    };

    init();

  };
})
