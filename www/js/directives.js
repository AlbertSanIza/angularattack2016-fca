angular.module('starter.directives', [])

.directive('solarSystem', ['Planets', function(Planets) {
  return {
    'restrict': 'E',
    'templateUrl': 'templates/solarsystem.html',
    'scope': {
      'selectedView': '=',
      'stereoEffect': '='
    },
    'link': link
  };
  function link($scope, $element, $attr) {

    var scene, camera, renderer, element, container, effect, controls, ambientLight, clock;

    function init() {
      // Main Scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, Planets.Properties.Starfield.Size + 100);
      camera.position.set(0, 2000, 0);
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
      // Textures
      Planets.Loader.load(Planets.baseURL + 'galaxy_starfield.png', function(texture) {
        Planets.Starfield.Sphere.material = new THREE.MeshPhongMaterial({map: texture, side: THREE.BackSide});
        scene.add(Planets.Starfield.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'sunmap.jpg', function(texture) {
        Planets.Sun.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Sun.Sphere);
        var Sunlight = new THREE.PointLight(0x999900, 1, 16500);
        Planets.Sun.Sphere.add(Sunlight);
      });
      Planets.Loader.load(Planets.baseURL + 'mercurymap.jpg', function(texture) {
        Planets.Mercury.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Mercury.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'venusmap.jpg', function(texture) {
        Planets.Venus.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Venus.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'earthmap1k.jpg', function(texture) {
        Planets.Earth.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Earth.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'moonmap1k.jpg', function(texture) {
        Planets.EarthMoon.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.EarthMoon.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'marsmap1k.jpg', function(texture) {
        Planets.Mars.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Mars.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'jupitermap.jpg', function(texture) {
        Planets.Jupiter.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Jupiter.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'saturnmap.jpg', function(texture) {
        Planets.Saturn.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Saturn.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'saturn-rings.png', function(texture) {
        Planets.Saturn.Ring.material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.6});
        Planets.Saturn.Ring.rotation.x = -45 * (Math.PI / 180);
        scene.add(Planets.Saturn.Ring);
      });
      Planets.Loader.load(Planets.baseURL + 'uranusmap.jpg', function(texture) {
        Planets.Uranus.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Uranus.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'saturn-rings.png', function(texture) {
        Planets.Uranus.Ring.material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.6});
        Planets.Uranus.Ring.rotation.x = -80 * (Math.PI / 180);
        scene.add(Planets.Uranus.Ring);
      });
      Planets.Loader.load(Planets.baseURL + 'neptunemap.jpg', function(texture) {
        Planets.Neptune.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Neptune.Sphere);
      });
      Planets.Loader.load(Planets.baseURL + 'plutomap1k.jpg', function(texture) {
        Planets.Pluto.Sphere.material = new THREE.MeshPhongMaterial({map: texture});
        scene.add(Planets.Pluto.Sphere);
      });
      scene.add(Planets.Mercury.Orbit, Planets.Venus.Orbit, Planets.Earth.Orbit, Planets.EarthMoon.Orbit, Planets.Mars.Orbit, Planets.Jupiter.Orbit, Planets.Saturn.Orbit, Planets.Uranus.Orbit, Planets.Neptune.Orbit, Planets.Pluto.Orbit);
      clock = new THREE.Clock();
      animate();
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

    var t = 100 * Math.random();
    var updater = true;

    function render(dt) {
      // Magic Zone Start
      t += 0.001;
      // Planets Rotation
      Planets.Sun.Sphere.rotation.y += Planets.Properties.Sun.Speed.Rotation;
      Planets.Mercury.Sphere.rotation.y += Planets.Properties.Mercury.Speed.Rotation;
      Planets.Venus.Sphere.rotation.y -= Planets.Properties.Venus.Speed.Rotation;
      Planets.Earth.Sphere.rotation.y += Planets.Properties.Earth.Speed.Rotation;
      Planets.EarthMoon.Sphere.rotation.y += Planets.Properties.EarthMoon.Speed.Rotation;
      Planets.Mars.Sphere.rotation.y += Planets.Properties.Mars.Speed.Rotation;
      Planets.Jupiter.Sphere.rotation.y += Planets.Properties.Jupiter.Speed.Rotation;
      Planets.Saturn.Sphere.rotation.y += Planets.Properties.Saturn.Speed.Rotation;
      Planets.Uranus.Sphere.rotation.y -= Planets.Properties.Uranus.Speed.Rotation;
      Planets.Neptune.Sphere.rotation.y += Planets.Properties.Neptune.Speed.Rotation;
      Planets.Pluto.Sphere.rotation.y -= Planets.Properties.Pluto.Speed.Rotation;
      // Planets Translation
      var planetsSpeed = 1;
      Planets.Sun.Sphere.position.x = Planets.Properties.Sun.Distance * Math.cos(t * Planets.Properties.Sun.Speed.Translation * planetsSpeed);
      Planets.Sun.Sphere.position.z = Planets.Properties.Sun.Distance * Math.sin(t * Planets.Properties.Sun.Speed.Translation * planetsSpeed);
      Planets.Mercury.Sphere.position.x = Planets.Properties.Mercury.Distance * Math.cos(t * Planets.Properties.Mercury.Speed.Translation * planetsSpeed);
      Planets.Mercury.Sphere.position.z = Planets.Properties.Mercury.Distance * Math.sin(t * Planets.Properties.Mercury.Speed.Translation * planetsSpeed);
      Planets.Venus.Sphere.position.x = Planets.Properties.Venus.Distance * Math.cos(t * Planets.Properties.Venus.Speed.Translation * planetsSpeed);
      Planets.Venus.Sphere.position.z = Planets.Properties.Venus.Distance * Math.sin(t * Planets.Properties.Venus.Speed.Translation * planetsSpeed);
      Planets.Earth.Sphere.position.x = Planets.Properties.Earth.Distance * Math.cos(t * Planets.Properties.Earth.Speed.Translation * planetsSpeed);
      Planets.Earth.Sphere.position.z = Planets.Properties.Earth.Distance * Math.sin(t * Planets.Properties.Earth.Speed.Translation * planetsSpeed);
      Planets.EarthMoon.Orbit.position.x = Planets.Earth.Sphere.position.x;
      Planets.EarthMoon.Orbit.position.z = Planets.Earth.Sphere.position.z;
      Planets.EarthMoon.Sphere.position.x = Planets.EarthMoon.Orbit.position.x + (Planets.Properties.EarthMoon.Distance * Math.cos(t * Planets.Properties.EarthMoon.Speed.Translation * planetsSpeed));
      Planets.EarthMoon.Sphere.position.z = Planets.EarthMoon.Orbit.position.z + (Planets.Properties.EarthMoon.Distance * Math.sin(t * Planets.Properties.EarthMoon.Speed.Translation * planetsSpeed));
      Planets.Mars.Sphere.position.x = Planets.Properties.Mars.Distance * Math.cos(t * Planets.Properties.Mars.Speed.Translation * planetsSpeed);
      Planets.Mars.Sphere.position.z = Planets.Properties.Mars.Distance * Math.sin(t * Planets.Properties.Mars.Speed.Translation * planetsSpeed);
      Planets.Jupiter.Sphere.position.x = Planets.Properties.Jupiter.Distance * Math.cos(t * Planets.Properties.Jupiter.Speed.Translation * planetsSpeed);
      Planets.Jupiter.Sphere.position.z = Planets.Properties.Jupiter.Distance * Math.sin(t * Planets.Properties.Jupiter.Speed.Translation * planetsSpeed);
      Planets.Saturn.Sphere.position.x = Planets.Properties.Saturn.Distance * Math.cos(t * Planets.Properties.Saturn.Speed.Translation * planetsSpeed);
      Planets.Saturn.Sphere.position.z = Planets.Properties.Saturn.Distance * Math.sin(t * Planets.Properties.Saturn.Speed.Translation * planetsSpeed);
      Planets.Saturn.Ring.position.x = Planets.Saturn.Sphere.position.x;
      Planets.Saturn.Ring.position.z = Planets.Saturn.Sphere.position.z;
      Planets.Uranus.Sphere.position.x = Planets.Properties.Uranus.Distance * Math.cos(t * Planets.Properties.Uranus.Speed.Translation * planetsSpeed);
      Planets.Uranus.Sphere.position.z = Planets.Properties.Uranus.Distance * Math.sin(t * Planets.Properties.Uranus.Speed.Translation * planetsSpeed);
      Planets.Uranus.Ring.position.x = Planets.Uranus.Sphere.position.x;
      Planets.Uranus.Ring.position.z = Planets.Uranus.Sphere.position.z;
      Planets.Neptune.Sphere.position.x = Planets.Properties.Neptune.Distance * Math.cos(t * Planets.Properties.Neptune.Speed.Translation * planetsSpeed);
      Planets.Neptune.Sphere.position.z = Planets.Properties.Neptune.Distance * Math.sin(t * Planets.Properties.Neptune.Speed.Translation * planetsSpeed);
      Planets.Pluto.Sphere.position.x = Planets.Properties.Pluto.Distance * Math.cos(t * Planets.Properties.Pluto.Speed.Translation * planetsSpeed);
      Planets.Pluto.Sphere.position.z = Planets.Properties.Pluto.Distance * Math.sin(t * Planets.Properties.Pluto.Speed.Translation * planetsSpeed);
      // Camera Movement
      // var cameraDirection = camera.getWorldDirection();
      // Look At
      switch ($scope.selectedView) {
        case "top":
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.position.set(0, 5800, 0);
        break;
        case "sun":
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.position.set(Planets.Sun.Sphere.position.x - 1000, 500, Planets.Sun.Sphere.position.z - 1000);
        break;
        case "mercury":
        camera.lookAt(new THREE.Vector3(Planets.Mercury.Sphere.position.x, Planets.Mercury.Sphere.position.y, Planets.Mercury.Sphere.position.z));
        camera.position.set(Planets.Mercury.Sphere.position.x - 100, 110, Planets.Mercury.Sphere.position.z - 100);
        break;
        case "venus":
        camera.lookAt(new THREE.Vector3(Planets.Venus.Sphere.position.x, Planets.Venus.Sphere.position.y, Planets.Venus.Sphere.position.z));
        camera.position.set(Planets.Venus.Sphere.position.x - 200, 120, Planets.Venus.Sphere.position.z - 200);
        break;
        case "earth":
        camera.lookAt(new THREE.Vector3(Planets.Earth.Sphere.position.x, Planets.Earth.Sphere.position.y, Planets.Earth.Sphere.position.z));
        camera.position.set(Planets.Earth.Sphere.position.x - 240, 130, Planets.Earth.Sphere.position.z - 240);
        break;
        case "mars":
        camera.lookAt(new THREE.Vector3(Planets.Mars.Sphere.position.x, Planets.Mars.Sphere.position.y, Planets.Mars.Sphere.position.z));
        camera.position.set(Planets.Mars.Sphere.position.x - 150, 100, Planets.Mars.Sphere.position.z - 150);
        break;
        case "jupiter":
        camera.lookAt(new THREE.Vector3(Planets.Jupiter.Sphere.position.x, Planets.Jupiter.Sphere.position.y, Planets.Jupiter.Sphere.position.z));
        camera.position.set(Planets.Jupiter.Sphere.position.x - 850, 800, Planets.Jupiter.Sphere.position.z - 800);
        break;
        case "saturn":
        camera.lookAt(new THREE.Vector3(Planets.Saturn.Sphere.position.x, Planets.Saturn.Sphere.position.y, Planets.Saturn.Sphere.position.z));
        camera.position.set(Planets.Saturn.Sphere.position.x - 850, 800, Planets.Saturn.Sphere.position.z - 800);
        break;
        case "uranus":
        camera.lookAt(new THREE.Vector3(Planets.Uranus.Sphere.position.x, Planets.Uranus.Sphere.position.y, Planets.Uranus.Sphere.position.z));
        camera.position.set(Planets.Uranus.Sphere.position.x - 500, 100, Planets.Uranus.Sphere.position.z - 500);
        break;
        case "neptune":
        camera.lookAt(new THREE.Vector3(Planets.Neptune.Sphere.position.x, Planets.Neptune.Sphere.position.y, Planets.Neptune.Sphere.position.z));
        camera.position.set(Planets.Neptune.Sphere.position.x - 500, 100, Planets.Neptune.Sphere.position.z - 500);
        break;
        case "pluto":
        camera.lookAt(new THREE.Vector3(Planets.Pluto.Sphere.position.x, Planets.Pluto.Sphere.position.y, Planets.Pluto.Sphere.position.z));
        camera.position.set(Planets.Pluto.Sphere.position.x - 240, 100, Planets.Pluto.Sphere.position.z - 240);
        break;
      }
      // Planet / SpaceFighter Colition
      if(Planets.Distance(camera.position, Planets.Sun.Sphere.position) < Planets.Properties.Sun.Size) {
      } else if(Planets.Distance(camera.position, Planets.Mercury.Sphere.position) < Planets.Properties.Mercury.Size) {
      } else if(Planets.Distance(camera.position, Planets.Venus.Sphere.position) < Planets.Properties.Venus.Size) {
      } else if(Planets.Distance(camera.position, Planets.Earth.Sphere.position) < Planets.Properties.Earth.Size) {
      } else if(Planets.Distance(camera.position, Planets.EarthMoon.Sphere.position) < Planets.Properties.EarthMoon.Size) {
      } else if(Planets.Distance(camera.position, Planets.Mars.Sphere.position) < Planets.Properties.Mars.Size) {
      } else if(Planets.Distance(camera.position, Planets.Jupiter.Sphere.position) < Planets.Properties.Jupiter.Size) {
      } else if(Planets.Distance(camera.position, Planets.Saturn.Sphere.position) < Planets.Properties.Saturn.Size) {
      } else if(Planets.Distance(camera.position, Planets.Uranus.Sphere.position) < Planets.Properties.Uranus.Size) {
      } else if(Planets.Distance(camera.position, Planets.Neptune.Sphere.position) < Planets.Properties.Neptune.Size) {
      } else if(Planets.Distance(camera.position, Planets.Pluto.Sphere.position) < Planets.Properties.Pluto.Size) {
      }
      // Magic Zone End
      if($scope.stereoEffect == true) {
        effect.render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }
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
}])

.directive('solarSelector', function() {
  return {
    'restrict': 'E',
    'templateUrl': 'templates/solarselector.html',
    'scope': {
      'selectedView': '='
    },
    'link': link
  };
  function link($scope, $element, $attr) {

    $scope.hideTitleView = true;

    $scope.goToView = function(theView) {
      $scope.selectedView = theView;
      if($scope.selectedView == "top") {
        $scope.hideTitleView = true;
      } else {
        $scope.selectedViewName = $scope.selectedView.toUpperCase();
        $scope.hideTitleView = false;
      }
    }
  };
})

.directive('solarSelection', function() {
  return {
    'restrict': 'E',
    'templateUrl': 'templates/solarselection.html',
    'link': link
  };
  function link($scope, $element, $attr) {
    
  };
})
