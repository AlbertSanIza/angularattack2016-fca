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
    
  };
})
