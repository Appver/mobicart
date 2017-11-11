angular.module('salesInvoiceApp', [])
.controller('salesInvoiceCtrl', ['$scope', '$http', function ($scope,$http) {
    $scope.productSearch = function (){
        var productName = $scope.productName;
        $http.get('/skm/productSearch/'+productName).then(function(response) {
            var res = response.data;
            for (var i = 0, length = res.length; i < length; i++) {
                for (obj in res[i]) {
                    console.log(res[i][obj]);
                    $scope.productName = res[i][obj];
                }
            }
            }, function(response) {
        });        
    };
}]);