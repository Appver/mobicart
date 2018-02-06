var app = angular.module('KaviyaMobiles', ['ngJsonExportExcel', 'ngTable', 'ngAnimate', 'ngRoute', 'AngularPrint', 'ngCookies', 'toaster']);

app.run(function($rootScope, $location, $cookieStore) {
    $rootScope.isUser = false;
    $rootScope.isAdmin = false;
    $rootScope.user = $cookieStore.get('user');
    $rootScope.userObj = '';
    if ($rootScope.user) {
        $rootScope.userObj = $rootScope.user;
        if ($rootScope.user.uid) {
            $rootScope.isUser = true;
            if ($rootScope.user.rid == 1)
                $rootScope.isAdmin = true;
        }
    } else {
        $location.path('/');
    }

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
    $rootScope.ystrDate = ('0' + (d.getDate() - 1)).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();

    $rootScope.timeToSeconds = function() {
        return Math.round(new Date().getTime() / 1000);
    };

    $rootScope.secondsToTime = function(secs) {
        var date = new Date(0);
        if (secs != 0) {
            date.setUTCSeconds(secs);
        }
        return date.toLocaleString();
    };

    $rootScope.secondsToDate = function(secs) {
        var date = new Date(0);
        if (secs != 0) {
            date.setUTCSeconds(secs);
        }
        return date.toLocaleDateString();
    };

    $rootScope.convertNumberToWords = function(amount) {
        var words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        var atemp = amount.split(".");
        var number = atemp[0].split(",").join("");
        var n_length = number.length;
        var words_string = "";
        if (n_length <= 9) {
            var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
            var received_n_array = new Array();
            for (var i = 0; i < n_length; i++) {
                received_n_array[i] = number.substr(i, 1);
            }
            for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                n_array[i] = received_n_array[j];
            }
            for (var i = 0, j = 1; i < 9; i++, j++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    if (n_array[i] == 1) {
                        n_array[j] = 10 + parseInt(n_array[j]);
                        n_array[i] = 0;
                    }
                }
            }
            value = "";
            for (var i = 0; i < 9; i++) {
                if (i == 0 || i == 2 || i == 4 || i == 7) {
                    value = n_array[i] * 10;
                } else {
                    value = n_array[i];
                }
                if (value != 0) {
                    words_string += words[value] + " ";
                }
                if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Crores ";
                }
                if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Lakhs ";
                }
                if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                    words_string += "Thousand ";
                }
                if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                    words_string += "Hundred and ";
                } else if (i == 6 && value != 0) {
                    words_string += "Hundred ";
                }
            }
            words_string = words_string.split("  ").join(" ");
        }
        return words_string.toUpperCase();
    };
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
        .when('/gstreport', {
            templateUrl: '/view/gst-returns.html',
            controller: 'GSTReturnsCntlr'
        })
        .when('/gstpurchase', {
            templateUrl: '/view/gst-returns-purchase.html',
            controller: 'GSTPurchaseCntlr'
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
        })
        .when('/preference', {
            templateUrl: '/view/preference.html',
            controller: 'PreferenceCntlr'
        })
        .when('/logout', {
            templateUrl: '/view/signin-page.html',
            controller: 'LogoutCntlr'
        });
});

app.directive('bindUnsafeHtml', [function() {
        return {
            template: "<span style='color:orange'>Orange directive text!</span>"
        };
    }])
    // The directive that will be dynamically rendered
    .directive('bindName', [function() {
        return {
            template: "<span style='color:orange'>Hi {{directiveData.name}}!</span>"
        };
    }])
    // The directive that will be dynamically capatize
    .directive('capitalize', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var capitalize = function(inputValue) {
                    if (inputValue == undefined) inputValue = '';
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        // see where the cursor is before the update so that we can set it back
                        var selection = element[0].selectionStart;
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                        // set back the cursor after rendering
                        element[0].selectionStart = selection;
                        element[0].selectionEnd = selection;
                    }
                    return capitalized;
                }
                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]); // capitalize initial value
            }
        };
    });


app.controller('SigninPageCntlr', function($rootScope, $scope, $route, $routeParams, $http, $location, $cookieStore, toaster) {

        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;


        $scope.loginValidate = function() {

            var data = { name: $scope.lUserName, pass: $scope.lPassword };
            $http.post('/skm/login/', data).then(function(response) {
                var output = response.data;
                if (output.length) {
                    var user = output[0];
                    // Put cookie
                    $cookieStore.put('user', user);
                    $rootScope.user = user;
                    $rootScope.userObj = user;
                    if (user.rid == 1) {
                        $rootScope.isAdmin = true;
                        $location.path('/dashboard');
                    } else {
                        $rootScope.isUser = true;
                        $rootScope.isAdmin = false;
                        $location.path('/addcustomer');
                    }
                } else {
                    $rootScope.isAdmin = false;
                    $rootScope.isUser = false;
                    toaster.pop('error', "error", "Invalid crdentials");

                    $location.path('/');
                }
            }, function(response) {});


        };
    })
    .controller('AdminDashboardCntlr', function(NgTableParams, $rootScope, $scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;

        $(document).ready(function() {
            $scope.getGeneratedBillData();
            // Javascript method's body can be found in assets/js/demos.js
            //demo.initDashboardPageCharts();
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });

        $http.get('/skm/adminStockData/').then(function(response) {
            var res = response.data;
            var data = angular.fromJson(res);
            $scope.stockStatusData = data;
            $scope.tableParamsstockData = new NgTableParams({ count: 5 }, { counts: [5, 10, 20, 40], dataset: data });
        }, function(response) {});

        $scope.getGeneratedBillData = function() {
            $scope.deleteBillData = {};
            $http.get('/skm/adminBillData/').then(function(response) {
                var res = response.data;
                var data = angular.fromJson(res);
                for (var i = 0; i < data.length; i++) {
                    data[i].IssuedDate = $rootScope.secondsToTime(data[i].IssuedDate);
                }
                $scope.tableParamsBillData = new NgTableParams({ count: 5 }, { counts: [5, 10, 20, 40], dataset: data });
            }, function(response) {});
        };

        $http.get('/skm/adminCustomerData/').then(function(response) {
            var res = response.data;
            var data = angular.fromJson(res);
            $scope.tableParamsCustomerData = new NgTableParams({ count: 5 }, { counts: [5, 10, 20, 40], dataset: data });
        }, function(response) {});

        $scope.getGeneratedBills = function(getBill) {
            var getBillData = {
                billNo: getBill.BillNo
            }
            $http.post('/skm/getGeneratedBill/', getBillData).then(function(response) {
                var res = response.data;
                $scope.generatedBillData = angular.fromJson(res);
                $scope.totalCashWor = $rootScope.convertNumberToWords($scope.generatedBillData[0].amount);
                $scope.geItemsCount = $scope.generatedBillData.length;
                $http.get('/skm/storeDetails/').then(function(response) {
                    var res = response.data;
                    $scope.shopDetail = res[0];
                }, function(response) {});
                $("#generatedBill").modal();
            }, function(response) {});
        };
        $scope.removeGeneratedBills = function(deleteBill) {
            $("#getConfirmation").modal();
            $scope.deleteBillData = {
                billNo: deleteBill.BillNo
            }

        };
        $scope.deleteBill = function() {
            $("#getConfirmation").modal('hide');
            $http.post('/skm/removeGeneratedBill/', $scope.deleteBillData).then(function(response) {
                var res = response.data;
                if (res == 'DONE') {
                    $scope.getGeneratedBillData();
                } else if (res == 'BILL') {
                    $scope.getGeneratedBillData();
                } else {
                    $scope.getGeneratedBillData();
                }
            }, function(response) {});
        };

        $scope.viewCustomerData = function(viewCustData) {
            $scope.viewCustomerDetails = viewCustData;
            $("#viewCustomerDetails").modal();
        }

        $scope.closeCustomerDetails = function(viewCustData) {
            $("#viewCustomerDetails").modal('hide');
            $scope.viewCustomerDetails = '';
        }
    })
    .controller('SalesInvoiceCntlr', function($rootScope, $scope, $http, $route, $routeParams, $location) {
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
        var d = new Date();
        $scope.issueDate = ('0' + d.getDate()).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();
        $scope.custTitle = '';
        $scope.custMessage = '';
        $scope.isSearchCust = false;
        $scope.isAdd = true;
        $scope.isValueLoad = false;
        $scope.isModel = false;
        $scope.isProduct = false;
        $scope.isProductDetails = false;
        $scope.isAddProduct = false;
        $scope.customerName = '';
        $scope.isTotDis = false;
        $scope.isDueAmnt = false;
        $scope.paymentType = 'CASH';
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
                "custId": null,
                "pSkuno": null,
                "pHSNSAC": null,
                "pName": null,
                "pIMEI": null,
                "pDesc": null,
                "pQty": null,
                "pPrice": null,
                "pDis": null,
                "pTax": null,
                "pCTaxPer": null,
                "pSTaxPer": null,
                "pCTax": null,
                "pSTax": null,
                "pAmount": null,
                "soldPrice": null
            }],
            "tDisc": 0,
            "tItems": 0,
            "subTotal": 0.00,
            "Total": 0.00,
            "roundOff": 0,
            "CGST": 0.00,
            "SGST": 0.00,
            "payType": null,
            "duePay": null
        };
        $scope.isProductAdded = false;
        $scope.isGenerateBill = true;
        $scope.isResetBill = true;
        $scope.isCustomerSelected = false;
        $scope.isSaveBill = false;
        $scope.isPrintBill = false;
        $scope.isBackBill = false;
        $scope.isResetClean = false;

        $scope.isValidCustPhone = function() {
            $scope.isSearchCust = false;
            if ($scope.customerName.length == 10) {
                $scope.isSearchCust = true;
            }
        };
        $scope.shopDetail = {};
        $scope.cusID = '';
        $http.get('/skm/storeDetails/').then(function(response) {
            var res = response.data;
            $scope.shopDetail = res[0];
        }, function(response) {});

        $scope.customerDetails = {};
        $scope.getCustomerDetails = function() {
            $http.get('/skm/customerDetails/' + $scope.customerName).then(function(response) {
                var res = response.data;
                if (res.length == 0) {
                    $scope.isSearchCust = false;
                    $("#addCustomer").modal();
                } else {
                    $scope.isSearchCust = true;
                    $scope.customerDetails = res[0];
                    $("#getCustomer").modal();
                }
            }, function(response) {});
        };

        $scope.selectCust = function() {
            $scope.cusID = $scope.customerDetails.cust_id;
            $scope.customerName = $scope.customerDetails.cust_name;
            $("#getCustomer").modal('hide');
            $scope.isSearchCust = false;
            $scope.isCustomerSelected = true;
        }
        $scope.addCustomer = {};
        $scope.addCust = function() {
            $("#addCustomer").modal('hide');
            $scope.custTitle = '';
            $scope.custMessage = '';
            var currentDate = $rootScope.timeToSeconds();
            $scope.addCustomer.cust_alt_phone = $scope.addCustomer.cust_phone;

            var addCustData = {
                cust_name: $scope.addCustomer.cust_name,
                cust_phone: $scope.addCustomer.cust_phone,
                email: $scope.addCustomer.email,
                cust_address: $scope.addCustomer.cust_address,
                cust_gsttin: $scope.addCustomer.cust_gsttin,
                cust_city: $scope.addCustomer.cust_city,
                cust_state: $scope.addCustomer.cust_state,
                pincode: $scope.addCustomer.pincode,
                created: currentDate,
                cust_alt_phone: $scope.addCustomer.cust_phone
            }

            $http.post('/skm/addNewCustomer/', addCustData).then(function(response) {
                output = response.data;
                var newCustId = output.insertId;
                if (response.data.affectedRows == 1) {
                    $scope.custTitle = "Added";
                    $scope.custMessage = ", Added Successfully.";
                    $scope.cusID = newCustId;
                    $scope.addCustomer.cusID = newCustId;
                    $scope.customerName = $scope.addCustomer.cust_name;
                    $scope.isCustomerSelected = true;
                    $scope.customerDetails = $scope.addCustomer;
                } else {
                    $scope.custTitle = "Failed";
                    $scope.custMessage = ", Added Failed. Please try again.";
                    $scope.isCustomerSelected = false;
                }
                $("#addCustDBMessage").modal();
            }, function(response) {});
        };

        $scope.brandSearch = function() {
            $http.get('/skm/brandSearch/').then(function(response) {
                var res = response.data;
                $scope.brandNameArray = angular.fromJson(res);
            }, function(response) {});
        };

        $scope.modelDetails = function() {
            var brandId = {
                id: $scope.brandId
            }
            $http.post('/skm/amodelSearch/', brandId).then(function(response) {
                var res = response.data;
                $scope.modelDetailArray = angular.fromJson(res);
                if ($scope.modelDetailArray.length >= 1) {
                    $scope.isModel = true;
                    $scope.isProduct = false;
                    $scope.isValueLoad = false;
                    $scope.isProductAdded = false;
                } else {
                    $scope.isModel = false;
                    $scope.isProduct = false;
                    $scope.isValueLoad = false;
                    $scope.isProductAdded = true;
                }
            }, function(response) {});
        };

        $scope.productDetails = function() {
            var modelId = {
                id: $scope.modelId
            }
            $http.post('/skm/productSearch/', modelId).then(function(response) {
                var res = response.data;
                $scope.productArray = angular.fromJson(res);
                if ($scope.productArray.length >= 1) {
                    $scope.isModel = true;
                    $scope.isProduct = true;
                    $scope.isValueLoad = false;
                } else {
                    $scope.isModel = true;
                    $scope.isProduct = false;
                    $scope.isValueLoad = false;
                }
            }, function(response) {});
        };

        $scope.productSearch = function() {
            $scope.productDetail = {};
            var sId = {
                id: $scope.sid
            }
            $http.post('/skm/productDetails/', sId).then(function(response) {
                var res = response.data;
                if (res.length) {
                    $scope.productDetail = res[0];
                    $scope.isModel = true;
                    $scope.isProduct = true;
                    $scope.isValueLoad = true;
                    $scope.isAdd = false;
                } else {
                    $scope.isModel = true;
                    $scope.isProduct = true;
                    $scope.isValueLoad = false;
                    $scope.isAdd = true;
                }
                if ($scope.isProductAdded == true) {
                    $scope.isAdd = true;
                }
            }, function(response) {});

        };

        $scope.addProductList = function(selproduct) {
            var pTax = selproduct.tax_percentage;
            var pPrice = selproduct.price;
            tax = taxSplitCal(pTax);
            $scope.salesProductList.tItems = $scope.salesProductList.tItems + 1;
            $scope.salesProductList['pList'].push({
                "SNo": $scope.salesProductList.tItems,
                "custId": $scope.cusID,
                "pSkuno": selproduct.sku_no,
                "pHSNSAC": '8517',
                "pName": selproduct.brand + ' ' + selproduct.model,
                "pIMEI": selproduct.imei_number,
                "pDesc": '',
                "pQty": '',
                "pPrice": netPrice(pPrice, gstAmt(pPrice, pTax)),
                "pDis": selproduct.discount,
                "pTax": pTax,
                "pCTaxPer": tax,
                "pSTaxPer": tax,
                "pCTax": round(((gstAmt(pPrice, pTax)) / 2), 2),
                "pSTax": round(((gstAmt(pPrice, pTax)) / 2), 2),
                "pAmount": pAmountCal(gstAmt(pPrice, pTax), netPrice(pPrice, gstAmt(pPrice, pTax))),
                "soldPrice": pPrice
            });
            $scope.salesProductList.subTotal = round(subTotalCal(netPrice(pPrice, gstAmt(pPrice, pTax))), 2);
            $scope.salesProductList.CGST = round(gstCal(round(((gstAmt(pPrice, pTax)) / 2), 2), $scope.salesProductList.CGST), 2);
            $scope.salesProductList.SGST = round(gstCal(round(((gstAmt(pPrice, pTax)) / 2), 2), $scope.salesProductList.SGST), 2);
            $scope.salesProductList.Total = round(totalCal(), 0);
            $scope.isAddProduct = true;
            if ($scope.salesProductList.tItems == 1) {
                if ($scope.salesProductList.pList.length >= 1) {
                    $scope.salesProductList.pList.splice(0, 1);
                }
            }
            $scope.itemsCount = $scope.salesProductList.pList.length;
            $scope.totalCash = $scope.salesProductList.Total;
            $scope.totalCashWords = $rootScope.convertNumberToWords($scope.totalCash);
            if ($scope.salesProductList.pList.length >= 1) {
                $scope.isProductAdded = true;
                $scope.modelDetailArray = [];
                $scope.productArray = [];
                $scope.productPrice = '';
                $scope.productDis = '';
                $scope.productTax = '';
                $scope.isAdd = true;
                $scope.isModel = false;
                $scope.isProduct = false;
                $scope.isValueLoad = false;
                $scope.brandId = '';
                var stockAddedData = {
                    skuno: selproduct.sku_no,
                    value: 'N',
                }
                $http.post('/skm/stockUpdate', stockAddedData).then(function(response) {

                }, function(response) {});

                if ($scope.isCustomerSelected) {
                    $scope.isGenerateBill = false;
                    //$scope.isCustomerSelected = false;
                }
            }
        };

        $scope.removeItem = function(removeId) {
            var ritems = $scope.salesProductList.pList;
            var removeProduct = ritems[removeId];
            var itemCTax = removeProduct.pCTax;
            var itemSTax = removeProduct.pSTax;
            var itemPrice = removeProduct.pPrice;
            var sPrice = removeProduct.soldPrice;
            $scope.salesProductList.subTotal = round(($scope.salesProductList.subTotal - itemPrice), 2);
            $scope.salesProductList.CGST = round(($scope.salesProductList.CGST - itemCTax), 2);
            $scope.salesProductList.SGST = round(($scope.salesProductList.SGST - itemSTax), 2);
            $scope.salesProductList.Total = round(($scope.salesProductList.Total - sPrice), 0);
            ritems.splice(removeId, 1);
            $scope.itemsCount = ritems.length;
            $scope.totalCash = $scope.salesProductList.Total;
            $scope.totalCashWords = $rootScope.convertNumberToWords($scope.totalCash);
            $scope.salesProductList.pList = ritems;
            var stockRemovedData = {
                skuno: removeProduct.pSkuno,
                value: 'Y',
            }
            $http.post('/skm/stockUpdate', stockRemovedData).then(function(response) {

            }, function(response) {});
        };

        $scope.billNo = '';

        $scope.generatePreviewBill = function(salesProductList) {
            $scope.isSaveBill = false;
            $scope.isPrintBill = false;
            $scope.isBackBill = false;
            $("#previewBill").modal();
            salesProductList.paymentType = $scope.paymentType;
            salesProductList.custId = $scope.cusID;
            var timeToSecond = $rootScope.timeToSeconds();
            var salesProductListData = {
                item: salesProductList,
                dueAmnt: 0,
                createdDate: timeToSecond,
                modifiedDate: timeToSecond,
                modifiedBy: $rootScope.userObj.uid
            }

            $http.post('/skm/billNo/', salesProductListData).then(function(response) {
                output = response.data;
                $scope.billNo = output.insertId;
            }, function(response) {});
        };

        $scope.salesInvoiceSave = function() {
            if ($scope.billNo != '') {
                $scope.amountDue = 0;
                $scope.dueDate = '';
                $scope.createdDate = '';

                if ($scope.salesProductList.pList.length > 0) {
                    var timeToSecond = $rootScope.timeToSeconds();
                    var salesData = {
                        billNo: $scope.billNo,
                        item: $scope.salesProductList.pList,
                        createdDate: timeToSecond,
                        modifiedDate: timeToSecond,
                        modifiedBy: $rootScope.userObj.uid
                    }
                    $http.post('/skm/salesInvoice/', salesData).then(function(response) {
                        if (response.data == 'DONE') {
                            alert("Bill No : " + $scope.billNo + " Saved Successfully !#!#");
                            $scope.resetSalesInvoice('saveBill');
                        } else {
                            alert("Error in Savin Bill No : " + $scope.billNo + ", Please Try after some time !#!#");
                            $scope.resetSalesInvoice('saveBill');
                        }

                    }, function(response) {});

                }
            } else {
                $scope.billNo = '';
            }
        };

        $scope.salesInvoicePrint = function() {
            if ($scope.billNo != '') {
                $scope.amountDue = 0;
                $scope.dueDate = '';
                $scope.createdDate = '';

                if ($scope.salesProductList.pList.length > 0) {
                    var timeToSecond = $rootScope.timeToSeconds();
                    var salesData = {
                        billNo: $scope.billNo,
                        item: $scope.salesProductList.pList,
                        createdDate: timeToSecond,
                        modifiedDate: timeToSecond,
                        modifiedBy: $rootScope.userObj.uid
                    }
                    $http.post('/skm/salesInvoice/', salesData).then(function(response) {
                        //if (response.data == 'DONE') {
                        $scope.isSaveBill = true;
                        $scope.isPrintBill = true;
                        $scope.isBackBill = true;
                        $scope.isResetClean = true;
                        $scope.isResetBill = true;
                        /*} else {
                            $scope.isSaveBill = true;
                            $scope.isPrintBill = true;
                            $scope.isBackBill = true;
                            $scope.isResetClean = true;
                            $scope.isResetBill = true;
                        }*/

                    }, function(response) {});
                }

            } else {
                $scope.billNo = '';
            }
        };

        $scope.closeBill = function() {
            if ($scope.isResetClean == true) {
                $scope.resetSalesInvoice('printBill');
            } else {
                $scope.isResetClean = false;
            }
        }

        $scope.backToSalesInvoice = function() {
            var salesData = {
                billNo: $scope.billNo
            }
            $http.post('/skm/backToSalesInvoice/', salesData).then(function(response) {
                $scope.isResetBill = false;
            }, function(response) {});
        };

        $scope.resetSalesInvoice = function(action) {
            $scope.isCustomerSelected = false;
            $scope.cusID = '';
            $scope.customerName = '';
            $scope.isProductAdded = false;
            $scope.modelDetailArray = [];
            $scope.productArray = [];
            $scope.productPrice = '';
            $scope.productDis = '';
            $scope.productTax = '';
            $scope.isAdd = true;
            $scope.isModel = false;
            $scope.isProduct = false;
            $scope.isValueLoad = false;
            $scope.brandId = '';
            if (action == 'resetBill') {
                var stockRemovedDataList = {
                    item: $scope.salesProductList.pList
                }
                $http.post('/skm/stockProductUpdate', stockRemovedDataList).then(function(response) {

                }, function(response) {});
            }
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
                    "custId": null,
                    "pSkuno": null,
                    "pHSNSAC": '8517',
                    "pName": null,
                    "pIMEI": null,
                    "pDesc": null,
                    "pQty": null,
                    "pPrice": null,
                    "pDis": null,
                    "pTax": null,
                    "pCTaxPer": null,
                    "pSTaxPer": null,
                    "pCTax": null,
                    "pSTax": null,
                    "pAmount": null,
                    "soldPrice": null
                }],
                "tDisc": 0,
                "tItems": 0,
                "subTotal": 0.00,
                "Total": 0.00,
                "roundOff": 0,
                "CGST": 0.00,
                "SGST": 0.00,
                "payType": null,
                "duePay": null
            };
            $scope.paymentType = 'CASH';
            $scope.isSaveBill = false;
            $scope.isPrintBill = false;
            $scope.isBackBill = false;
            $scope.isResetClean = false;
            $scope.isResetBill = true;
            $scope.isGenerateBill = true;
        };

        function gstAmt(MRP, GSTPer) {
            return round(MRP - (MRP * (100 / (100 + GSTPer))), 2);
        }

        function cGSTAmt(MRP, CGSTPer) {
            return round(MRP - (MRP * (100 / (100 + CGSTPer))), 2);
        }

        function sGSTAmt(MRP, SGSTPer) {
            return round(MRP - (MRP * (100 / (100 + SGSTPer))), 2);
        }

        function netPrice(MRP, GSTAmt) {
            return round((MRP - GSTAmt), 2);
        }

        function round(value, decimals) {
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        }

        function pAmountCal(gstAmt, price) {
            return (gstAmt + price);
        }

        function subTotalCal(price) {
            var ret = $scope.salesProductList.subTotal + price;
            return ret;
        }

        function gstCal(taxAmnt, gstAmnt) {
            var ret = taxAmnt + gstAmnt;
            return ret;
        }

        function totalCal() {
            return ($scope.salesProductList.subTotal + $scope.salesProductList.tDisc +
                $scope.salesProductList.roundOff + $scope.salesProductList.CGST + $scope.salesProductList.SGST);
        }

        function taxSplitCal(pTax) {
            return tax = pTax / 2;
        }

        $scope.getCustomerSearch = function() {
            $http.get('/skm/adminCustomerData/').then(function(response) {
                var res = response.data;
                $scope.customerPhoneArray = angular.fromJson(res);
            }, function(response) {});

        }
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
    .controller('AddCustomerCntlr', function($rootScope, $scope, $http, $route, $routeParams, $location) {
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
        $scope.submit = function() {
            $scope.addEditCustNameArray = [];
            $http.get('/skm/customerDetails/' + $scope.addEditCustPhone).then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.addEditCustNameArray.push(res[i][obj]);
                    }
                }
                if ($scope.addEditCustNameArray.length == 0 || $scope.addEditCustNameArray == undefined) {
                    var currentDate = $rootScope.timeToSeconds();
                    var addEditCustData = {
                        cust_name: $scope.addEditCustName,
                        cust_phone: $scope.addEditCustPhone,
                        email: $scope.addEditCustEmail,
                        cust_address: $scope.addEditCustAddress,
                        cust_gsttin: $scope.addEditCustTin,
                        cust_city: $scope.addEditCustCity,
                        cust_state: $scope.addEditCustState,
                        pincode: $scope.addEditCustPinCode,
                        created: currentDate,
                        cust_alt_phone: $scope.addEditCustPhone
                    }
                    $http.post('/skm/addNewCustomer/', addEditCustData).then(function(response) {
                        $scope.addEditCustomerName = $scope.addEditCustName;
                        if (response.data.affectedRows == 1) {
                            $scope.addEditCustTitle = "Added";
                            $scope.addEditCustMessage = ", Added Successfully.";
                        } else {
                            $scope.addEditCustTitle = "Failed";
                            $scope.addEditCustMessage = ", Added Failed. Please try again.";
                        }
                        $("#addEditCustDBMessage").modal();
                    }, function(response) {});
                } else {
                    var newAddEditCustId = $scope.addEditCustNameArray[0];
                    var currentDate = $rootScope.timeToSeconds();
                    var editCustData = {
                        id: newAddEditCustId,
                        cust_name: $scope.addEditCustName,
                        cust_phone: $scope.addEditCustPhone,
                        email: $scope.addEditCustEmail,
                        cust_address: $scope.addEditCustAddress,
                        cust_gsttin: $scope.addEditCustTin,
                        cust_city: $scope.addEditCustCity,
                        cust_state: $scope.addEditCustState,
                        pincode: $scope.addEditCustPinCode,
                        created: currentDate,
                        cust_alt_phone: $scope.addEditCustPhone
                    }
                    $http.post('/skm/addEditCustomer/', editCustData).then(function(response) {
                        $scope.addEditCustomerName = $scope.addEditCustName;
                        if (response.data.affectedRows == 1) {
                            $scope.addEditCustTitle = "Updated";
                            $scope.addEditCustMessage = ", Updated Successfully.";
                        } else {
                            $scope.addEditCustTitle = "Updation Failed";
                            $scope.addEditCustMessage = ", Updation Failed. Please try again.";
                        }
                        $("#addEditCustDBMessage").modal();
                    }, function(response) {});
                }
            }, function(response) {});
        };
    })
    .controller('PurchaseInvoiceCntlr', function($q, $rootScope, $scope, $http, $route, $routeParams, $location, toaster) {
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
        var taxlist = [];
        var taxes = '';
        var promise = $q.all([]);
        $http.get('/skm/taxGroup/').then(function(response) {
            var res = response.data;
            $scope.taxes = angular.fromJson(res);
        }, function(response) {});
        $http.get('/skm/brand').then(function(response) {
            var res = response.data;
            $scope.mobBrands = angular.fromJson(res);
        }, function(response) {});

        $scope.getMobmodel = function() {
            var brandId = {
                id: $scope.brandId
            }
            $scope.isModel = false;
            $http.post('/skm/modelSearch/', brandId).then(function(response) {
                var res = response.data;
                $scope.mobModels = angular.fromJson(res);
                if ($scope.mobModels.length >= 1) {
                    $scope.isModel = true;
                }
            }, function(response) {});
        };

        $http.get('/skm/rom').then(function(response) {
            var res = response.data;
            $scope.mobRom = angular.fromJson(res);
        }, function(response) {});


        $http.get('/skm/ram').then(function(response) {
            var res = response.data;
            $scope.mobRam = angular.fromJson(res);
        }, function(response) {});

        $http.get('/skm/color').then(function(response) {
            var res = response.data;
            $scope.mobColor = angular.fromJson(res);
        }, function(response) {});

        $scope.addProduct = function() {
            var timeToSecond = $rootScope.timeToSeconds();
            var imeis = $scope.imeiNumber;
            var imei_array = imeis.split(",");
            var pro = {
                item_id: $scope.item,
                details: $scope.description,
                rom_id: $scope.rom_id,
                ram_id: $scope.ram_id,
                color_id: $scope.color_id,
                purchase_price: $scope.pprice,
                selling_price: $scope.sprice,
                price: $scope.sprice,
                tax_group: $scope.tax,
                bar_code: 'NA',
                createdDate: timeToSecond,
                modifiedDate: timeToSecond,
                modifiedBy: $rootScope.userObj.uid
            };
            angular.forEach(imei_array, function(im) {
                promise = promise.then(function() {
                    pro.imei_number = im;
                    return productInsert(pro, im);
                });
            });

            promise.finally(function() {
                console.log('Insert finished!');
            });

            function productInsert(pro, im) {
                $http.post('/skm/productInsert/', pro).then(function(response) {
                    output = response.data;

                    pro.sku_no = output.insertId;
                    pro.product_flag = 'Y';
                    pro.imei_number = im;
                    $http.post('/skm/stockInsert/', pro).then(function(response) {

                        $scope.brand = '';
                        $scope.item = '';
                        $scope.rom_id = '';
                        $scope.ram_id = '';
                        $scope.color_id = '';
                        $scope.imeiNumber = '';
                        $scope.description = '';
                        $scope.pprice = '';
                        $scope.sprice = '';
                        $scope.tax = '';
                        return pro.sku_no;
                    }, function(response) {});
                    return pro.sku_no;
                }, function(response) {});
            }
        }
    })
    .controller('GSTReturnsCntlr', function($rootScope, $scope, $http, $route, $routeParams, $location) {
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

        $http.get('/skm/GSTReturnsBillData/').then(function(response) {
            var res = response.data;
            $scope.gstReturnsBillData = angular.fromJson(res);
            for (var i = 0; i < $scope.gstReturnsBillData.length; i++) {
                $scope.gstReturnsBillData[i].Invoicedate = $rootScope.secondsToDate($scope.gstReturnsBillData[i].Invoicedate);
            }
        }, function(response) {});

        $http.get('/skm/GSTReturnsPurchaseData/').then(function(response) {
            var res = response.data;
            $scope.gstReturnsPurchaseData = angular.fromJson(res);
            for (var i = 0; i < $scope.gstReturnsPurchaseData.length; i++) {
                $scope.gstReturnsPurchaseData[i].invoice_date = $rootScope.secondsToDate($scope.gstReturnsPurchaseData[i].invoice_date);
            }
        }, function(response) {});
    })
    .controller('GSTPurchaseCntlr', function($rootScope, $scope, $http, $route, $routeParams, $location) {
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
            $('.datepicker').datepicker({
                weekStart: 1
            });
        });
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        $scope.gstPurCurrDate = mm + '/' + dd + '/' + yyyy;
        $scope.isResetGSTPur = false;

        $scope.sellerNameSearch = function() {
            $scope.sellerNameArray = [];
            $http.get('/skm/sellerNameSearch/').then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.sellerNameArray.push(res[i][obj]);
                    }
                }
            }, function(response) {});
        };

        $scope.confirmAddGST = function() {
            $("#addConfirmGSTPur").modal();
        };

        $scope.addGSTPurchase = function() {
            var currentDate = $rootScope.timeToSeconds();
            var addGSTPurData = {
                sellerName: $scope.gstPurSellerName,
                invoiceNo: $scope.gstPurInvoiceNo,
                invoiceDate: Math.round(new Date($scope.gstPurInvoiceDate).getTime() / 1000),
                commodityCode: $scope.gstPurCommodityCode,
                purchaseValue: $scope.gstPurPurchaseValue,
                cgstAmnt: $scope.gstPurCgstAmnt,
                sgstAmnt: $scope.gstPurSgstAmnt,
                totalValue: $scope.gstPurTotalValue,
                createdDate: currentDate
            }
            $http.post('/skm/addGSTPurchase/', addGSTPurData).then(function(response) {
                var res = response.data;
                if (res.affectedRows >= 1) {
                    $("#addConfirmGSTPur").modal('hide');
                    $scope.resetGSTPurchase('success')
                } else {
                    $("#addConfirmGSTPur").modal('hide');
                    $scope.resetGSTPurchase('not success')
                }
            }, function(response) {});
        };
        $scope.resetGSTPurchase = function(action) {
            $scope.gstPurSellerName = '';
            $scope.gstPurInvoiceNo = '';
            $scope.gstPurInvoiceDate = '';
            $scope.gstPurCommodityCode = '';
            $scope.gstPurPurchaseValue = '';
            $scope.gstPurCgstAmnt = '';
            $scope.gstPurSgstAmnt = '';
            $scope.gstPurTotalValue = '';
            $scope.sellerNameSearch();
        };
    })
    .controller('PreferenceCntlr', function($scope, $http, $route, $routeParams, $location, toaster) {
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });

        $http.get('/skm/brand/').then(function(response) {
            var res = response.data;
            $scope.brandList = angular.fromJson(res);

        }, function(response) {});

        $http.get('/skm/taxgroup/').then(function(response) {
            var res = response.data;
            $scope.tgroupList = angular.fromJson(res);

        }, function(response) {});

        $http.get('/skm/tax/').then(function(response) {
            var res = response.data;
            $scope.ttaxList = angular.fromJson(res);

        }, function(response) {});

        $scope.colorSearch = function() {
            $scope.colorArray = [];
            $http.get('/skm/colorDetails').then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.colorArray.push(res[i][obj]);
                    }
                }
            }, function(response) {});
        };

        $scope.ramSearch = function() {
            $scope.ramArray = [];
            $http.get('/skm/ramDetails').then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.ramArray.push(res[i][obj]);
                    }
                }
            }, function(response) {});
        };

        $scope.romSearch = function() {
            $scope.romArray = [];
            $http.get('/skm/romDetails').then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.romArray.push(res[i][obj]);
                    }
                }
            }, function(response) {});
        };

        $scope.addColor = function() {
            var colorData = {
                color: $scope.color
            };
            $http.post('/skm/colorInsert/', colorData).then(function(response) {
                if (response.data.affectedRows > 0) {
                    toaster.pop("success", "success", "Color Added Successfully");
                    $scope.colorSearch();
                    $scope.color = '';
                }
            }, function(response) {});
        };

        $scope.addRAM = function() {
            var ramData = {
                ram: $scope.ram
            };
            $http.post('/skm/ramInsert/', ramData).then(function(response) {
                if (response.data.affectedRows > 0) {
                    toaster.pop("success", "success", "RAM Added Successfully");
                    $scope.ramSearch();
                    $scope.ram = '';
                }
            }, function(response) {});

        };

        $scope.addROM = function() {
            var romData = {
                rom: $scope.rom
            };
            $http.post('/skm/romInsert/', romData).then(function(response) {
                if (response.data.affectedRows > 0) {
                    toaster.pop("success", "success", "ROM Added Successfully");
                    $scope.romSearch();
                    $scope.rom = '';
                }
            }, function(response) {});
        };

        $scope.addBrand = function() {
            var data = {
                brand: $scope.brand
            };
            $http.post('/skm/brandInsert/', data).then(function(response) {
                toaster.pop("success", "success", "Brand Added Successfully");
                $scope.brand = '';
                $http.get('/skm/brand/').then(function(response) {
                    var res = response.data;
                    $scope.brandList = angular.fromJson(res);
                }, function(response) {});
            }, function(response) {});
        }

        $scope.addModel = function() {
            var data = {
                bid: $scope.mbrand,
                model: $scope.model
            };
            $http.post('/skm/modelInsert/', data).then(function(response) {
                toaster.pop("success", "success", "Model Added Successfully");
                $scope.mbrand = '';
                $scope.model = '';
            }, function(response) {});
        }

        $scope.addTaxGroup = function() {
            var data = {
                group_name: $scope.taxGroup,
                tax_percentage: $scope.taxPercent
            };
            $http.post('/skm/taxgroupInsert/', data).then(function(response) {
                toaster.pop("success", "success", "Tax Group Added Successfully");
                $scope.taxGroup = '';
                $http.get('/skm/taxgroup/').then(function(response) {
                    var res = response.data;
                    $scope.tgroupList = angular.fromJson(res);

                }, function(response) {});

            }, function(response) {});
        }
        $scope.addTax = function() {
            var data = {
                tax_name: $scope.tax,
                percentage: $scope.percentage
            };
            $http.post('/skm/taxInsert/', data).then(function(response) {
                toaster.pop("success", "success", "Tax Added Successfully");
                $scope.tax = '';
                $scope.percentage = '';
                $http.get('/skm/tax/').then(function(response) {
                    var res = response.data;
                    $scope.ttaxList = angular.fromJson(res);

                }, function(response) {});

            }, function(response) {});
        }

        $scope.addTg = function() {
            var data = {
                group_id: $scope.tgroup,
                tax_id: $scope.ttax
            };
            $http.post('/skm/taxdetailsInsert/', data).then(function(response) {
                toaster.pop("success", "success", "Tax Details Added Successfully");
                $scope.tgroup = '';
                $scope.ttax = '';
            }, function(response) {});
        }
    })
    .controller('LogoutCntlr', function($scope, $route, $routeParams, $location, $cookieStore) {
        $scope.$location = $location;
        $cookieStore.remove('user');
        $location.path('/');
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