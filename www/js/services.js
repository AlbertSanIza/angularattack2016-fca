angular.module('starter.services', [])

.service('Planets', function () {
  this.baseURL = "img/planets/";

  var manager = new THREE.LoadingManager();
  manager.onProgress = function (item, loaded, total) {
    console.log("Planets - Loading: " + loaded + "/" + total);
    if(loaded == total) {
      console.log("Planets - Load Finished");
    }
  };

  this.Loader = new THREE.TextureLoader(manager);

  SetPlanet = function(r) {
    var Mesh = new THREE.Mesh();
    Mesh.geometry = new THREE.SphereGeometry(r, 32, 32);
    return Mesh;
  };

  SetRing = function(r) {
    var Mesh = new THREE.Mesh();
    Mesh.geometry = new THREE.XRingGeometry(r + 10, r + (r / 2), 50, 6, 0, Math.PI * 2);
    return Mesh;
  };

  SetOrbit = function(Distance) {
    var distance = Math.sqrt(Distance * Distance);
    var Curve = new THREE.EllipseCurve(0, 0, distance, distance, 0, 2 * Math.PI, false, 2);
    var CurvePath = new THREE.Path(Curve.getPoints(60));
    var CurveGeometry = CurvePath.createPointsGeometry(60);
    var CurveMaterial = new THREE.LineBasicMaterial({color: 0x004080});
    var CurveEllipse = new THREE.Line(CurveGeometry, CurveMaterial);
    CurveEllipse.rotation.x = 90 * (Math.PI / 180);
    return CurveEllipse;
  };

  this.Distance = function(PlanetA, PlanetB) {
    deltaX = PlanetB.x - PlanetA.x;
    deltaY = PlanetB.y - PlanetA.y;
    deltaZ = PlanetB.z - PlanetA.z;
    distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    return distance;
  };

  this.Properties = {
    Starfield: {
      Size: 16000
    },
    Sun: {
      Size: 800,
      Distance: 30,
      Speed: {
        Rotation: 0.002,
        Translation: 3
      }
    },
    Mercury: {
      Size: 50,
      Distance: 1200,
      Speed: {
        Rotation: 0.005,
        Translation: 1.607
      }
    },
    Venus: {
      Size: 95,
      Distance: 1450,
      Speed: {
        Rotation: 0.005,
        Translation: 1.174
      }
    },
    Earth: {
      Size: 100,
      Distance: 1850,
      Speed: {
        Rotation: 0.005,
        Translation: 1
      }
    },
    EarthMoon: {
      Size: 30,
      Distance: 200,
      Speed: {
        Rotation: 0.005,
        Translation: 10
      }
    },
    Mars: {
      Size: 60,
      Distance: 2200,
      Speed: {
        Rotation: 0.005,
        Translation: 0.802
      }
    },
    Jupiter: {
      Size: 500,
      Distance: 2850,
      Speed: {
        Rotation: 0.005,
        Translation: 0.434
      }
    },
    Saturn: {
      Size: 400,
      Distance: 4050,
      Speed: {
        Rotation: 0.005,
        Translation: 0.323
      }
    },
    Uranus: {
      Size: 200,
      Distance: 5000,
      Speed: {
        Rotation: 0.005,
        Translation: 0.228
      }
    },
    Neptune: {
      Size: 180,
      Distance: 5550,
      Speed: {
        Rotation: 0.005,
        Translation: 0.182
      }
    },
    Pluto: {
      Size: 90,
      Distance: 5900,
      Speed: {
        Rotation: 0.005,
        Translation: 0.159
      }
    }
  };

  this.Starfield = {
    Sphere: SetPlanet(this.Properties.Starfield.Size)
  };
  this.Sun = {
    Sphere: SetPlanet(this.Properties.Sun.Size)
  };
  this.Mercury = {
    Sphere: SetPlanet(this.Properties.Mercury.Size),
    Orbit: SetOrbit(this.Properties.Mercury.Distance)
  };
  this.Venus = {
    Sphere: SetPlanet(this.Properties.Venus.Size),
    Orbit: SetOrbit(this.Properties.Venus.Distance)
  };
  this.Earth = {
    Sphere: SetPlanet(this.Properties.Earth.Size),
    Orbit: SetOrbit(this.Properties.Earth.Distance)
  };
  this.EarthMoon = {
    Sphere: SetPlanet(this.Properties.EarthMoon.Size),
    Orbit: SetOrbit(this.Properties.EarthMoon.Distance)
  };
  this.Mars = {
    Sphere: SetPlanet(this.Properties.Mars.Size),
    Orbit: SetOrbit(this.Properties.Mars.Distance)
  };
  this.Jupiter = {
    Sphere: SetPlanet(this.Properties.Jupiter.Size),
    Orbit: SetOrbit(this.Properties.Jupiter.Distance)
  };
  this.Saturn = {
    Sphere: SetPlanet(this.Properties.Saturn.Size),
    Orbit: SetOrbit(this.Properties.Saturn.Distance),
    Ring: SetRing(this.Properties.Saturn.Size)
  };
  this.Uranus = {
    Sphere: SetPlanet(this.Properties.Uranus.Size),
    Orbit: SetOrbit(this.Properties.Uranus.Distance),
    Ring: SetRing(this.Properties.Uranus.Size)
  };
  this.Neptune = {
    Sphere: SetPlanet(this.Properties.Neptune.Size),
    Orbit: SetOrbit(this.Properties.Neptune.Distance)
  };
  this.Pluto = {
    Sphere: SetPlanet(this.Properties.Pluto.Size),
    Orbit: SetOrbit(this.Properties.Pluto.Distance)
  };

})

.service('PlanetsInfo', function () {
  this.Sun = {
    name: "Sun",
    description: " The sun, a huge sphere of mostly ionized gas, supports life on Earth. The connection and interactions between the sun and Earth drive the seasons, ocean currents, weather and climate. It is the center of our solar system.",
    radius:"695,700 km",
    mass: "1.989 × 10^30 kg"
  }
  this.Mercury = {
    name: "Mercury",
    description: "Mercury's eccentric orbit takes the small planet as close as 47 million km (29 million miles) and as far as 70 million km (43 million miles) from the sun. If one could stand on the scorching surface of Mercury when it is at its closest point to the sun, the sun would appear more than three times as large as it does when viewed from Earth.",
    radius: "2,440 km",
    distance: "57.91 million km",
    mass: "3.285 × 10^23 kg",
    length: "58d 15h 30m",
    orbital: "88 days",
    gravity: "3.7 m/s²"
  }
  this.Venus = {
    name: "Venus",
    description: " Venus is the second planet from the Sun, orbiting it every 224.7 Earth days. It has the longest rotation period of any planet in the Solar System and rotates in the opposite direction to most other planets. It has no natural satellite.",
     radius:"6,052 km",
     distance:"108.2 million km",
     mass: "4.867 × 10^24 kg",
     length: "116d 18h 0m",
     gravity: "8.87m/s²",
     orbital:"225 days"
  }
  this.Earth = {
    name: "Earth",
    description:" Earth, our home planet, is the only planet in our solar system known to harbor life - life that is incredibly diverse. All the things we need to survive exist under a thin layer of atmosphere that separates us from the cold, airless void of space ",
     radius:"6,371 km",
     distance:"149.6 million km",
     mass: "5.972 × 10^24 kg",
     length: "24h",
     gravity: "9.80665 m / s2",
     orbital:"365 days"
  }
  this.Mars = {
    name: "Mars",
    description: " Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, after Mercury.",
     radius:": 3,390 km",
     distance:"227.9 million km",
     mass: "6.39 × 10^23 kg ",
     length: "1d 0h 40m",
     gravity: "3.711 m/s²",
     orbital:"687 days"
  }
  this.Jupiter= {
    name: "Jupiter",
    description: " Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a giant planet with a mass one-thousandth that of the Sun, but two and a half times that of all the other planets in the Solar System combined.",
     radius:"69,911 km",
     distance:"778.5 million km",
     mass: "1.898 × 10^27 kg",
     length: "0d 9h 56m",
     gravity: "24.79 m/s²",
     orbital:"12 years"
  }
  this.Saturn= {
    name: "Saturn",
    description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine times that of Earth.",
     radius:"58,232 km",
     distance:"1.429 billion km",
     mass: "5.683 × 10^26 kg",
     length: "0d 10h 42m",
     gravity: "10.44 m/s²",
     orbital:"29 years"
  }
  this.Uranus= {
    name: "Uranus",
    description: "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.",
    radius:"25,362 km",
    distance:"2.877 billion km",
    mass: "8.681 × 10^25 kg ",
    length: "0d 17h 14m",
    gravity: "8.69 m/s²",
    orbital:"84 years"
  }
  this.Neptune= {
    name: "Neptune",
    description: "Neptune is the eighth and farthest known planet from the Sun in the Solar System. It is the fourth-largest planet by diameter and the third-largest by mass. Among the giant planets in the Solar System, Neptune is the most dense.",
    radius:"24,622 km",
    distance:"4.498 billion km",
    mass: "1.024 × 10^26 kg ",
    length: "0d 16h 6m",
    gravity: "11.15 m/s²",
    orbital:"165 years"
  }
  this.Pluto= {
    name: "Pluto",
    description: " Pluto is the most famous dwarf planet. Discovered in 1930, it was long classified as our solar system's ninth planet. Pluto and its busy system of moons orbits the sun in the Kuiper belt, a region of icy debris beyond Neptune.",
    radius:"1,186 km",
    distance:"5.91 billion km",
    mass: "1.30900 × 10^22 kg",
    length: "6 d 9 h  36m",
    gravity: "0.62 m/s²",
    orbital:"248 years"
  }
  this.Top= {
    name: "Solar System",
    description: " Pluto is the most famous dwarf planet. Discovered in 1930, it was long classified as our solar system's ninth planet. Pluto and its busy system of moons orbits the sun in the Kuiper belt, a region of icy debris beyond Neptune."
  }
  this.set = function(theView) {
    console.log(theView);
    var theInfo;
    switch (theView) {
      case "sun":
      theInfo = this.Sun;
      break;
      case "mercury":
      theInfo = this.Mercury;
      break;
      case "venus":
      theInfo = this.Venus;
      break;
      case "earth":
      theInfo = this.Earth;
      break;
      case "mars":
      theInfo = this.Mars;
      break;
      case "jupiter":
      theInfo = this.Jupiter;
      break;
      case "saturn":
      theInfo = this.Saturn;
      break;
      case "uranus":
      theInfo = this.Uranus;
      break;
      case "neptune":
      theInfo = this.Neptune;
      break;
      case "pluto":
      theInfo = this.Pluto;
      break;
      case "top":
      theInfo = this.Top;
      break;
    };
    return theInfo;
  };
})
