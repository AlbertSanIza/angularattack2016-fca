angular.module('starter', ['ionic'])

.controller('MainCtrl', function($scope, $ionicSlideBoxDelegate) {
  $scope.slidePrevious = function() {
    $ionicSlideBoxDelegate.previous(300);
  };
  $scope.slideNext = function() {
    $ionicSlideBoxDelegate.next(300);
  };
})
