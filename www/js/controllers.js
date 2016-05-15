angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $ionicModal, PlanetsInfo) {

  $scope.Data = {
    selectedView: 'top',
    stereoEffect: false
  };

  $ionicModal.fromTemplateUrl('templates/description.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.descriptionModal = modal;
  });
  $scope.openDescriptionModal = function() {
    $scope.infoToDisplay = PlanetsInfo.set("sun");
    $scope.descriptionModal.show();
  };
  $scope.closeDescriptionModal = function() {
    $scope.descriptionModal.hide();
  };

})
