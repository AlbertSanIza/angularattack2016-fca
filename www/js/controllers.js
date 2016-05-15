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

  function readDeviceOrientation() {
    if (Math.abs(window.orientation) === 90) {
      // Landscape - true
      $scope.Data.landscapeMode = true;
      $scope.$apply();
    } else {
      // Portrait - false
      $scope.Data.landscapeMode = false;
      $scope.Data.moveStarFighter = false;
      $scope.$apply();
    }
  }
  window.addEventListener('orientationchange', readDeviceOrientation, false);
})
