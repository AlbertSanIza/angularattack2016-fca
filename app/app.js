angular.module('starter', ['ionic'])

.controller('MainCtrl', function($scope, $ionicSlideBoxDelegate) {
  $scope.slideIndex = 0;
  $scope.slidePrevious = function() {
    $ionicSlideBoxDelegate.previous(300);
  };
  $scope.slideNext = function() {
    $ionicSlideBoxDelegate.next(300);
  };

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.startApp = function() {
    window.location.href = "http://fca.2016.angularattack.io/www/"
  };
})
