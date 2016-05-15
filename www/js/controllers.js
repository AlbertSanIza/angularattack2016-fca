angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $ionicModal, PlanetsInfo) {

  $scope.Data = {
    selectedView: 'top',
    isMobile: false,
    stereoEffect: false,
    landscapeMode: false,
    moveStarFighter: false
  };

  $ionicModal.fromTemplateUrl('templates/description.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.descriptionModal = modal;
  });
  $scope.openDescriptionModal = function(theView) {
    $scope.infoToDisplay = PlanetsInfo.set(theView);
    $scope.descriptionModal.show();
  };
  $scope.closeDescriptionModal = function() {
    $scope.descriptionModal.hide();
  };

  $scope.Move = function() {
    $scope.Data.moveStarFighter = !$scope.Data.moveStarFighter;
  };

  $scope.cardboardMode = function() {
    $scope.Data.stereoEffect = !$scope.Data.stereoEffect;
  };

  function readDeviceOrientationInitial() {
    if (Math.abs(window.orientation) === 90) {
      $scope.Data.landscapeMode = true;
      $scope.Data.isMobile = false;
    } else {
      $scope.Data.landscapeMode = false;
      $scope.Data.moveStarFighter = false;
      $scope.Data.stereoEffect = false;
    }
  };
  readDeviceOrientationInitial();
  function readDeviceOrientation() {
    if (Math.abs(window.orientation) === 90) {
      // Landscape - true
      $scope.$apply(function () {
        $scope.Data.landscapeMode = true;
      });
    } else {
      // Portrait - false
      $scope.$apply(function () {
        $scope.Data.landscapeMode = false;
        $scope.Data.moveStarFighter = false;
        $scope.Data.stereoEffect = false;
      });
    }
  }
  window.addEventListener('orientationchange', readDeviceOrientation, false);
})
