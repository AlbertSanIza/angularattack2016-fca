angular.module('starter.directives', [])

.directive('solarSystem', ['Planets', function(Planets) {
  return {
    'restrict': 'E',
    'templateUrl': 'templates/solarsystem.html',
    'scope': {
      'selectedView': '=',
      'isMobile': '=',
      'stereoEffect': '=',
      'landscapeMode': '=',
      'moveStarFighter': '='
    },
    'link': link
  };
  function link($scope, $element, $attr) {

    var t = 100 * Math.random();
    var tChangeRate = 0.001, tDelta = 0;
    var socket = io('http://45.55.7.57:3000');
    var scene, camera, renderer, element, container, effect, controls, ambientLight, clock;
    var StarFighter, StarFighterPosition = {x: 0, y: 0, z: 0}, StarFighterEngineLight, StarFighterSpeed = 1.5;

    function init() {
      // Detect ifMobile
      window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return !check;
      }
      $scope.isMobile = window.mobilecheck();
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
      if($scope.isMobile == false) {
        StarFighter = new THREE.Mesh();
        StarFighterGhost = new THREE.Mesh();
        Loader_OBJ.load( 'obj/StarFighter/StarFighter.obj', function (object) {
          object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material.map = THREE.ImageUtils.loadTexture('obj/StarFighter/StarFighter.png');
            }
          });
          object.rotation.y = -90 * (Math.PI / 180);
          object.rotation.z = -0 * (Math.PI / 180);
          object.position.set(0, -2, -17);
          object.scale.x = 0.3;
          object.scale.y = 0.3;
          object.scale.z = 0.3;
          StarFighter = object.clone();
          camera.add(StarFighter);
          StarFighterEngineLight = new THREE.PointLight(0x00ccff, 1, 20);
          StarFighterEngineLight.position.set(0, 0, -10);
          camera.add(StarFighterEngineLight);
          StarFighter.visible = false;
        });
      }
      clock = new THREE.Clock();
      animate();
    };

    function animate() {
      /*
      var elapsedSeconds = clock.getElapsedTime();
      requestAnimationFrame(animate);
      update(clock.getDelta());
      render(clock.getDelta());
      */
      setTimeout(function() {
        requestAnimationFrame(animate);
      }, 1000/24);
      update(clock.getDelta());
      render(clock.getDelta());
    };

    function update(dt) {
      resize();
      camera.updateProjectionMatrix();
      controls.update(dt);
    };

    function render(dt) {
      // Magic Zone Start
      t += tChangeRate;
      tDelta += 1;
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
      // Look At
      var cameraDirection = camera.getWorldDirection();
      if($scope.landscapeMode) {
        if($scope.moveStarFighter == true) {
          if(StarFighter.position.z > -20) {
            StarFighter.position.z -= 0.1;
          }
          if(StarFighterSpeed < 4) {
            StarFighterSpeed += 0.01;
          }
          StarFighterPosition.x += cameraDirection.x * StarFighterSpeed;
          StarFighterPosition.y += cameraDirection.y * StarFighterSpeed;
          StarFighterPosition.z += cameraDirection.z * StarFighterSpeed;
          camera.position.set(StarFighterPosition.x, StarFighterPosition.y, StarFighterPosition.z);
        } else {
          if(StarFighter.position.z < -17) {
            StarFighter.position.z += 0.1;
          }
          StarFighterSpeed = 1.5;
        }
      } else {
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
        StarFighterPosition.x = camera.position.x;
        StarFighterPosition.y = camera.position.y;
        StarFighterPosition.z = camera.position.z;
      }
      // Show StarFighter
      if(StarFighter != null && $scope.landscapeMode == true) {
        if(StarFighter.visible == false) {
          StarFighter.visible = true;
        }
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

    $scope.$watch('landscapeMode', function() {
      if(StarFighter) {
        if(!$scope.landscapeMode) {
          StarFighter.visible = false;
        }
      }
    });

    socket.on('theTime', function(msg) {
      t = msg;
    });
    
  };
}])

.directive('solarSelector', function() {
  return {
    'restrict': 'E',
    'templateUrl': 'templates/solarselector.html',
    'scope': {
      'selectedView': '=',
      'landscapeMode': '='
    },
    'link': link
  };
  function link($scope, $element, $attr) {

    $scope.hideTitleView = true;

    $scope.goToView = function(theView) {
      $scope.selectedView = theView;
      if($scope.selectedView == "top") {
      } else {
        $scope.selectedViewName = $scope.selectedView.toUpperCase();
      }
    }
  };
})

.directive('solarSelection', function() {
  return {
    'restrict': 'E',
    'templateUrl': 'templates/solarselection.html',
    'scope': {
      'selectedView': '=',
      'landscapeMode': '='
    },
    'link': link
  };
  function link($scope, $element, $attr) {
    $scope.localSelectedView = "";
    $scope.$watch('selectedView', function() {
      if($scope.selectedView == "top") {
        $scope.localSelectedView = "SOLAR SYSTEM";
      } else {
        $scope.localSelectedView = $scope.selectedView.toUpperCase();
      }
    });
    $scope.openInfo = function() {
      $scope.$parent.openDescriptionModal($scope.selectedView);
    };
  };
})

.directive('solarCarrousel', function() {
  return {
    'restrict': 'E',
    'templateUrl': 'templates/solarcarrousel.html',
    'scope': {
      'selectedView': '=',
      'landscapeMode': '='
    },
    'link': link
  };
  function link($scope, $element, $attr) {
    $scope.viewPre = function() {
      switch ($scope.selectedView) {
        case "sun":
        $scope.selectedView = "top";
        break;
        case "mercury":
        $scope.selectedView = "sun";
        break;
        case "venus":
        $scope.selectedView = "mercury";
        break;
        case "earth":
        $scope.selectedView = "venus";
        break;
        case "mars":
        $scope.selectedView = "earth";
        break;
        case "jupiter":
        $scope.selectedView = "mars";
        break;
        case "saturn":
        $scope.selectedView = "jupiter";
        break;
        case "uranus":
        $scope.selectedView = "saturn";
        break;
        case "neptune":
        $scope.selectedView = "uranus";
        break;
        case "pluto":
        $scope.selectedView = "neptune";
        break;
        case "top":
        $scope.selectedView = "pluto";
        break;
      }
    };
    $scope.viewNex = function() {
      switch ($scope.selectedView) {
        case "sun":
        $scope.selectedView = "mercury";
        break;
        case "mercury":
        $scope.selectedView = "venus";
        break;
        case "venus":
        $scope.selectedView = "earth";
        break;
        case "earth":
        $scope.selectedView = "mars";
        break;
        case "mars":
        $scope.selectedView = "jupiter";
        break;
        case "jupiter":
        $scope.selectedView = "saturn";
        break;
        case "saturn":
        $scope.selectedView = "uranus";
        break;
        case "uranus":
        $scope.selectedView = "neptune";
        break;
        case "neptune":
        $scope.selectedView = "pluto";
        break;
        case "pluto":
        $scope.selectedView = "top";
        break;
        case "top":
        $scope.selectedView = "sun";
        break;
      }
    };
  };
})
