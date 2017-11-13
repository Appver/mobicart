angular.module('salesInvoiceApp', [])
.controller('salesInvoiceCtrl', ['$scope', '$http', function ($scope,$http) {
    $scope.isAdd = false;
    $scope.isValueLoad = false;
    $scope.productSearch = function (){
        $scope.productNameArray = [];
        $http.get('/skm/productSearch/').then(function(response) {
            var res = response.data;
            for (var i = 0, length = res.length; i < length; i++) {
                for (obj in res[i]) {
                    $scope.productNameArray.push(res[i][obj]);
                }
            }
            }, function(response) {
        });        
    };
    $scope.productDetails = function(){
        var searchFlag = false;
        $scope.productDetail = [];
        $scope.productDis = '';
        $scope.productTax = '';
        $scope.productQTY = '';
        for(var i = 0, length = $scope.productNameArray.length; i < length; i++){
            if($scope.productName == $scope.productNameArray[i]){
                searchFlag = true;
            }
        }
        if(searchFlag){
            searchFlag = false;
            $http.get('/skm/productDetails/'+$scope.productName).then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.productDetail.push(res[i][obj]);
                    }
                }
                if($scope.productDetail.length >0){
                    $scope.isValueLoad = true;
                    $scope.isAdd = true;
                    $scope.productDis = 0;
                    $scope.productTax = 12;
                    $scope.productQTY = 1;
                }
            }, function(response) {
            });   
        }  
    };
}]);