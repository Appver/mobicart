var app = angular.module('KaviyaMobiles', ['ngRoute']);

app.run(function($rootScope) {
    $rootScope.isAdmin = false;
    $rootScope.isUser = false;
    $rootScope.currYear = new Date().getFullYear();
    var d = new Date();
    var ampm = '';
    var rhr = ('0' + d.getHours()).slice(-2);
    var min = ('0' + d.getMinutes()).slice(-2);
    if (rhr >= 12) {
        ampm = 'PM';
        rhr = Math.abs(rhr - 12);
    } else {
        ampm = 'AM';
        rhr = rhr;
    }
    $rootScope.currDateTime = ('0' + d.getDate()).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + rhr + ":" + min + " " + ampm;
});

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/view/signin-page.html',
            controller: 'SigninPageCntlr'
        })
        .when('/dashboard', {
            templateUrl: '/view/admin-dashboard.html',
            controller: 'AdminDashboardCntlr'
        })
        .when('/salesinvoice', {
            templateUrl: '/view/sales-invoice.html',
            controller: 'SalesInvoiceCntlr'
        })
        .when('/productbarcode', {
            templateUrl: '/view/product-bar-qr-code.html',
            controller: 'ProductBarCodeCntlr'
        })
        .when('/purchaseinvoice', {
            templateUrl: '/view/purchase-invoice.html',
            controller: 'PurchaseInvoiceCntlr'
        })
        .when('/productsearch', {
            templateUrl: '/view/product-search.html',
            controller: 'ProductSearchCntlr'
        })
        .when('/notifications', {
            templateUrl: '/view/notifications.html',
            controller: 'NotificationsCntlr'
        })
        .when('/transcations', {
            templateUrl: '/view/transcations.html',
            controller: 'TranscationsCntlr'
        })
        .when('/addcustomer', {
            templateUrl: '/view/add-customer.html',
            controller: 'AddCustomerCntlr'
        });
});

app.controller('SigninPageCntlr', function($rootScope, $scope, $route, $routeParams, $location) {
        $scope.$rootScope = $rootScope;
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.lUserName = '';
        $scope.lPassword = '';
        $scope.loginValidate = function() {
            if ($scope.lUserName != null && $scope.lUserName != '' &&
                $scope.lPassword != null && $scope.lPassword != '') {
                if ($scope.lUserName == 'admin' && $scope.lPassword == 'admin') {
                    $rootScope.isAdmin = true;
                    $rootScope.isUser = false;
                    $location.path('/dashboard');
                } else if ($scope.lUserName == 'user' && $scope.lPassword == 'user') {
                    $rootScope.isAdmin = false;
                    $rootScope.isUser = true;
                    $location.path('/addcustomer');
                } else {
                    $rootScope.isAdmin = false;
                    $rootScope.isUser = false;
                    alert("No User Found!!");
                    $location.path('/');
                    $scope.lUserName = '';
                    $scope.lPassword = '';
                }
            } else {
                $rootScope.isAdmin = false;
                $rootScope.isUser = false;
                alert("No User Found!!");
                $location.path('/');
                $scope.lUserName = '';
                $scope.lPassword = '';
            }
        };
    })
    .controller('AdminDashboardCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            // Javascript method's body can be found in assets/js/demos.js
            demo.initDashboardPageCharts();
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });

    })
    .controller('SalesInvoiceCntlr', function($scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
        var bno = Math.floor((Math.random() * 1000) + 1);
        $scope.billNo = 'BNO-' + bno;
        var d = new Date();
        $scope.issueDate = ('0' + d.getDate()).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();
        $scope.custTitle = '';
        $scope.custMessage = '';
        $scope.isSearchCust = false;
        $scope.isAdd = false;
        $scope.isValueLoad = false;
        $scope.isAddProduct = false;
        $scope.customerName = '';
        $scope.isTotDis = false;
        $scope.isDueAmnt = false;
        $scope.salesProductList = {
            "cusDetails": [{
                "name": null,
                "phone": null,
                "email": null,
                "street": null,
                "city": null,
                "state": null,
                "postalCode": null
            }],
            "pBillNo": null,
            "pList": [{
                "SNo": null,
                "pSkuno": null,
                "pName": null,
                "pDesc": null,
                "pQty": null,
                "pPrice": null,
                "pDis": null,
                "pTax": null,
                "pCTax": null,
                "pSTax": null
            }],
            "tDisc": 0,
            "tItems": 0,
            "subTotal": 0,
            "Total": 0,
            "roundOff": 0,
            "CGST": 0,
            "SGST": 0,
            "payType": null,
            "duePay": null
        };


        $scope.productSearch = function() {
            $scope.productNameArray = [];
            $http.get('/skm/productSearch/').then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.productNameArray.push(res[i][obj]);
                    }
                }
            }, function(response) {});
        };

        $scope.isValidCustPhone = function() {
            if ($scope.customerName.length == 10) {
                $scope.isSearchCust = true;
            } else {
                $scope.isSearchCust = false;
            }
        };

        $scope.getCustomerDetails = function() {
            $scope.customerNameArray = [];
            $http.get('/skm/customerDetails/' + $scope.customerName).then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.customerNameArray.push(res[i][obj]);
                    }
                }
                if ($scope.customerNameArray.length == 0 || $scope.customerNameArray == undefined) {
                    $scope.isSearchCust = false;
                    $scope.custId = [];
                    $http.get('/skm/getCustomerId/').then(function(response) {
                        var res = response.data;
                        for (var i = 0, length = res.length; i < length; i++) {
                            for (obj in res[i]) {
                                $scope.custId.push(res[i][obj]);
                            }
                        }
                    }, function(response) {});
                    $("#addCustomer").modal();
                } else {
                    $scope.isSearchCust = true;
                    $scope.cusName = $scope.customerNameArray[1];
                    $scope.cusPhone = $scope.customerNameArray[2];
                    $scope.cusEmail = $scope.customerNameArray[3];
                    $scope.cusAddress = $scope.customerNameArray[4];
                    $scope.cusCity = $scope.customerNameArray[5];
                    $scope.cusState = $scope.customerNameArray[6];
                    $scope.cusPinCode = $scope.customerNameArray[7];
                    $("#getCustomer").modal();
                }
            }, function(response) {});
        };

        $scope.selectCust = function() {
            $scope.customerName = $scope.cusName;
            $("#getCustomer").modal('hide');
            $scope.isSearchCust = false;
        }

        $scope.addCust = function() {
            $("#addCustomer").modal('hide');
            $scope.custTitle = '';
            $scope.custMessage = '';
            var newCustId = 'KMCUS' + (parseInt($scope.custId[0].substring(5, 6)) + 1);
            if (newCustId.length != 0) {
                $scope.custId = [];
            }
            var currentDate = '2017-11-27';
            $http.get('/skm/addNewCustomer/' + newCustId + '/' + $scope.addCustName + '/' + $scope.addCustPhone +
                '/' + $scope.addCustEmail + '/' + $scope.addCustAddress + '/' + $scope.addCustCity +
                '/' + $scope.addCustState + '/' + $scope.addCustPinCode + '/' + currentDate + '/' + $scope.addCustPhone).then(function(response) {
                $scope.customerName = $scope.addCustName;
                if (response.data.affectedRows == 1) {
                    $scope.custTitle = "Added";
                    $scope.custMessage = ", Added Successfully.";
                } else {
                    $scope.custTitle = "Failed";
                    $scope.custMessage = ", Added Failed. Please try again.";
                }
                $("#addCustDBMessage").modal();
            }, function(response) {});
        };

        $scope.productDetails = function() {
            var searchFlag = false;
            $scope.productDetail = [];
            $scope.productDis = '';
            $scope.productTax = '';
            $scope.productQTY = '';
            $scope.productPrice = '';
            $scope.productSkuno = '';
            $scope.productDesc = '';
            for (var i = 0, length = $scope.productNameArray.length; i < length; i++) {
                if ($scope.productName == $scope.productNameArray[i]) {
                    searchFlag = true;
                }
            }
            if (searchFlag) {
                searchFlag = false;
                $http.get('/skm/productDetails/' + $scope.productName).then(function(response) {
                    var res = response.data;
                    for (var i = 0, length = res.length; i < length; i++) {
                        for (obj in res[i]) {
                            $scope.productDetail.push(res[i][obj]);
                        }
                    }
                    if ($scope.productDetail.length > 0) {
                        $scope.isValueLoad = true;
                        $scope.isAdd = true;
                        $scope.productDesc = $scope.productDetail[2];
                        $scope.productSkuno = $scope.productDetail[0];
                        $scope.productPrice = $scope.productDetail[3];
                        $scope.productQTY = 1;
                        $scope.productDis = 0;
                        $scope.productTax = $scope.productDetail[4];
                    }
                }, function(response) {});
            }
        };

        $scope.changePrice = function() {
            $scope.productPrice = $scope.productPrice * $scope.productQTY;

        };

        $scope.addProductList = function(pSkuno, pName, pDesc, pQty, pPrice, pDis, pTax) {
            tax = taxSplitCal(pTax);
            $scope.salesProductList.tItems = $scope.salesProductList.tItems + 1;
            $scope.salesProductList['pList'].push({
                "SNo": $scope.salesProductList.tItems,
                "pSkuno": pSkuno,
                "pName": pName,
                "pDesc": pDesc,
                "pQty": pQty,
                "pPrice": subGST(pPrice, pTax),
                "pDis": pDis,
                "pTax": pTax,
                "pCTax": gstTax(pPrice, tax),
                "pSTax": gstTax(pPrice, tax)
            });
            $scope.salesProductList.subTotal = subTotalCal(subGST(pPrice, pTax));
            $scope.salesProductList.CGST = gstCal(gstTax(pPrice, tax), $scope.salesProductList.CGST);
            $scope.salesProductList.SGST = gstCal(gstTax(pPrice, tax), $scope.salesProductList.SGST);
            $scope.salesProductList.Total = totalCal();
            $scope.isAddProduct = true;
            if ($scope.salesProductList.tItems == 1) {
                if ($scope.salesProductList.pList.length >= 1) {
                    $scope.salesProductList.pList.splice(0, 1);
                }
            }

        };

        function subGST(pPrice, pGST) {
            return (pPrice - (gstTax(pPrice, pGST)));
        }

        function subTotalCal(price) {
            return ($scope.salesProductList.subTotal + price);
        }

        function gstCal(taxAmnt, gstAmnt) {
            return (taxAmnt + gstAmnt);
        }

        function totalCal() {
            return ($scope.salesProductList.subTotal + $scope.salesProductList.tDisc +
                $scope.salesProductList.roundOff + $scope.salesProductList.CGST + $scope.salesProductList.SGST);
        }

        function taxSplitCal(pTax) {
            return tax = pTax / 2;
        }

        function gstTax(price, tax) {
            return Math.round(price * (tax / 100));
        }

        $scope.totDis = function() {
            if ($scope.totDisData) {
                $scope.isTotDis = true;
            } else {
                $scope.isTotDis = false;
            }
        };

        $scope.dueAmnt = function() {
            if ($scope.dueAmntData) {
                $scope.isDueAmnt = true;
            } else {
                $scope.isDueAmnt = false;
            }
        };
    })
    .controller('PurchaseInvoiceCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    })
    .controller('ProductSearchCntlr', function($scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
        $scope.isAddProd = false;
        $scope.isSearchProd = false;
        $scope.getProductDetails = function() {
            $scope.productNameArray = [];
            $http.get('/skm/productDetails/' + $scope.productName).then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.productNameArray.push(res[i][obj]);
                    }
                }
                if ($scope.productNameArray.length == 0 || $scope.productNameArray == undefined) {
                    $scope.isAddProd = true;
                    $scope.isSearchProd = false;
                    $scope.productName = 'Product Not Found';
                } else {
                    $scope.isAddProd = false;
                    $scope.isSearchProd = true;
                    $scope.productName = $scope.productNameArray[2];
                }
            }, function(response) {});
        };

        $scope.addCust = function() {
            $scope.cusName
            $scope.cusPhone
            $scope.cusEmail
            $scope.cusAddress
            $scope.cusCity
            $scope.cusState
            $scope.cusPinCode
            $http.get('/skm/addCustomerDetails/' + $scope.productName).then(function(response) {

            }, function(response) {});
        };

    })
    .controller('NotificationsCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    })
    .controller('TranscationsCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    })
    .controller('ProductBarCodeCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    })
    .controller('AddCustomerCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    });