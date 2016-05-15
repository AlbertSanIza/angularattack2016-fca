angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $ionicModal, PlanetsInfo) {

  $scope.Data = {
    selectedView: 'top',
    isMobile: false,
    stereoEffect: false
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

  function readDeviceOrientation() {
    if (Math.abs(window.orientation) === 90) {
    } else {
    }
  }
  window.addEventListener('orientationchange', readDeviceOrientation, false);
})
