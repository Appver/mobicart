angular.module('productSearchApp', [])
.controller('productSearchCtrl', ['$scope', '$http', function ($scope,$http) {
    $scope.isAddProd = false;
    $scope.isSearchProd = false;

    $scope.isValidProductName = function (){
        if($scope.productName.length >= 1){
            $scope.isSearchProd = true;
            $scope.isAddProd = false;
        } else {
            $scope.isSearchProd = false;
            $scope.isAddProd = false;
        }
        
    };

    $scope.getProductDetails = function(){
        $scope.productNameArray = [];
        $http.get('/skm/productDetails/'+$scope.productName).then(function(response) {
            var res = response.data;
            for (var i = 0, length = res.length; i < length; i++) {
                for (obj in res[i]) {
                    $scope.productNameArray.push(res[i][obj]);
                }
            } 
            if($scope.productNameArray.length == 0 || $scope.productNameArray == undefined){
                $scope.isAddProd = true;
                $scope.isSearchProd = false;
                $scope.productName = 'Product Not Found';
            }else {
                $scope.isAddProd = false;
                $scope.isSearchProd = true;
                $scope.productName = $scope.productNameArray[2];
            }
        }, function(response) {
        }); 
    };

    $scope.addCust = function(){
        $scope.cusName
        $scope.cusPhone
        $scope.cusEmail
        $scope.cusAddress
        $scope.cusCity
        $scope.cusState
        $scope.cusPinCode
        $http.get('/skm/addCustomerDetails/'+$scope.productName).then(function(response) {
        
        }, function(response) {
        });       
    };

}]);