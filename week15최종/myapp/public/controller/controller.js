var Genie = angular.module('Genie', []); //index.ejs���� ng-app="Genie"�� �����ϱ�
Genie.controller('helloants', ['$http','$scope', function($http,$scope){ //ng-controller="helloants"�� �����ϱ�

 var refresh = function() { 
  $http.get("/image").success(function(response){ // server.js�� ����
   $scope.imageList = response;
  });
 }

 refresh(); // ng-controller �� ���۵ɶ� �Լ� ����
}]);
