angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $ionicModal) {

  $scope.Data = {
    stereoEffect: false,
    planetsSpeed: 1
  };

  $ionicModal.fromTemplateUrl('templates/settings.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.settingsModal = modal;
  });
  $scope.openSettingsModal = function() {
    $scope.settingsModal.show();
  };
  $scope.closeSettingsModal = function() {
    $scope.settingsModal.hide();
  };

})
