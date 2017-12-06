var app = angular.module('KaviyaMobiles', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/view/signin-page.html',
    controller: 'SigninController'
  })
   .when('/dashboard', {
    templateUrl: '/view/admin-dashboard.html',
    controller: 'DashboardController'
  });
});

app.controller('SigninController', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
})

.controller('DashboardController', function($scope, $routeParams) {

});