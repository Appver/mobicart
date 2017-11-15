angular.module('salesInvoiceApp', [])
.controller('salesInvoiceCtrl', ['$scope', '$http', function ($scope,$http) {
    $scope.isAdd = false;
    $scope.isValueLoad = false;
    $scope.isAddProduct = false;
    $scope.salesProductList = {
        "cusDetails" : [{
            "name" : null,
            "phone" : null,
            "email" : null,
            "street" : null,
            "city" : null,
            "state" : null,
            "postalCode" : null
        }],
        "pBillNo" : null,
        "pList" : [{
            "SNo" : null,
            "pSkuno" : null,
            "pName" : null,
            "pDesc" : null,
            "pQty" : null,
            "pPrice" : null,
            "pDis" : null,
            "pTax" : null,
            "pCTax" : null,
            "pSTax": null
        }],
        "tDisc" : 0,
        "tItems" : 0,
        "subTotal" : 0,
        "Total" : 0,
        "roundOff" : 0,
        "CGST" : 0,
        "SGST" : 0,
        "payType" : null,
        "duePay" : null
    };
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
        $scope.productPrice = '';
        $scope.productSkuno = '';
        $scope.productDesc = '';
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
                    $scope.productDesc = $scope.productDetail[2];
                    $scope.productSkuno = $scope.productDetail[0];
                    $scope.productPrice =  $scope.productDetail[3];
                    $scope.productQTY = 1;
                    $scope.productDis = 0;
                    $scope.productTax = 12;
                }
            }, function(response) {
            });   
        }  
    };
    $scope.changePrice = function(){
        $scope.productPrice = $scope.productPrice * $scope.productQTY;

    };
    $scope.addProductList = function(pSkuno,pName,pDesc,pQty,pPrice,pDis,pTax){
        tax = taxSplitCal(pTax);
        $scope.salesProductList.tItems = $scope.salesProductList.tItems + 1;
        $scope.salesProductList['pList'].push(
        {
                "SNo" : $scope.salesProductList.tItems,
                "pSkuno" : pSkuno,
                "pName" : pName,
                "pDesc" : pDesc,
                "pQty" : pQty,
                "pPrice" : pPrice,
                "pDis" : pDis,
                "pTax" : pTax,
                "pCTax" : gstTax(pPrice,tax),
                "pSTax" : gstTax(pPrice,tax)
        });
        $scope.salesProductList.subTotal = subTotalCal(pPrice);
        $scope.salesProductList.CGST = gstCal(gstTax(pPrice,tax), $scope.salesProductList.CGST);
        $scope.salesProductList.SGST = gstCal(gstTax(pPrice,tax), $scope.salesProductList.SGST);
        $scope.salesProductList.Total = totalCal();
        $scope.isAddProduct = true;
    }

    function subTotalCal(price){
        return ($scope.salesProductList.subTotal + price);
    }

    function gstCal(taxAmnt, gstAmnt){
        return (taxAmnt+gstAmnt);
    }

    function totalCal(){
        return ($scope.salesProductList.subTotal + $scope.salesProductList.tDisc + $scope.salesProductList.roundOff+$scope.salesProductList.CGST+$scope.salesProductList.SGST);
    }

    function taxSplitCal(pTax){
        return tax = pTax/2;
    }

    function gstTax(price,tax){
        return (price*(tax/100));
    }
}]);