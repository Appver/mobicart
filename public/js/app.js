var app = angular.module('KaviyaMobiles', ['angular-barcode', 'ngJsonExportExcel', 'ngTable', 'ngAnimate', 'ngRoute', 'AngularPrint', 'ngCookies', 'toaster', '720kb.datepicker']);
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
app.run(function($log, $http, $rootScope, $location, $cookieStore) {
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
            if ($rootScope.user.rid == 3)
                $rootScope.isSuperAdmin = true;
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

    $rootScope.appLogger = function(loggerLevel, loggerMessage) {
        loggerMessage = $rootScope.currDateTime + " " + loggerMessage;
        if (loggerLevel == "LOG") {
            $log.log(loggerMessage);
        } else if (loggerLevel == "INFO") {
            $log.info(loggerMessage);
        } else if (loggerLevel == "DEBUG") {
            $log.debug(loggerMessage);
        } else if (loggerLevel == "WARN") {
            $log.warn(loggerMessage);
        } else if (loggerLevel == "ERROR") {
            $log.error(loggerMessage);
        }
        var loggerMessageData = {
            loggerData: loggerMessage
        }
        $http.post('/skm/appLog/', loggerMessageData).then(function(response) {
            console.log(response.data)
        }, function(response) {});
    };
});

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/view/signin-page.html',
            controller: 'SigninPageCntlr'
        })
        .when('/superadmindashboard', {
            templateUrl: '/view/super-admin-dashboard.html',
            controller: 'SuperAdminDashboardCntlr'
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
        }).when('/editgstpurchase', {
            templateUrl: '/view/gst-purchase-edit.html',
            controller: 'EditGSTPurchaseCntlr'
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
        .when('/offers', {
            templateUrl: '/view/offer-page.html',
            controller: 'OffersCntlr'
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
                        $rootScope.isUser = false;
                        $rootScope.isAdmin = true;
                        $rootScope.isSuperAdmin = false;
                        $location.path('/dashboard');
                    } else if (user.rid == 3) {
                        $rootScope.isSuperAdmin = true;
                        $rootScope.isAdmin = false;
                        $rootScope.isUser = false;
                        $location.path('/superadmindashboard');
                    } else {
                        $rootScope.isUser = true;
                        $rootScope.isAdmin = false;
                        $rootScope.isSuperAdmin = false;
                        $location.path('/addcustomer');
                    }
                } else {
                    $rootScope.isAdmin = false;
                    $rootScope.isUser = false;
                    $rootScope.isSuperAdmin = false;
                    toaster.pop('error', "error", "Invalid crdentials");

                    $location.path('/');
                }
            }, function(response) {});


        };
    })
    .controller('SuperAdminDashboardCntlr', function(NgTableParams, $rootScope, $scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;

        $(document).ready(function() {
            $scope.initDashboardPageCharts();
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
        $scope.isPurBal = false;

        $http.get('/skm/adminStockData/').then(function(response) {
            var res = response.data;
            var data = angular.fromJson(res);
            for (var i = 0; i < data.length; i++) {
                data[i].Pworth = data[i].Purchase * data[i].Count;
                data[i].Sworth = data[i].MRP * data[i].Count;
            }
            $scope.stockStatusData = data;
            $scope.tableParamsstockData = new NgTableParams({ count: 5 }, { counts: [5, 10, 20, 40], dataset: data });
        }, function(response) {});

        $http.get('/skm/revenueForMonth/').then(function(response) {
            var data = angular.fromJson(response.data);
            for (var i = 0; i < data.length; i++) {
                $scope.totrevmon = data[i].Total;
            }
        }, function(response) {});

        $http.get('/skm/PurchaseCreditForMonth/').then(function(response) {
            var data = angular.fromJson(response.data);
            for (var i = 0; i < data.length; i++) {
                $scope.totpurbalmon = data[i].TotalPurchase;
            }
        }, function(response) {});

        $http.get('/skm/SalesForMonth/').then(function(response) {
            var data = angular.fromJson(response.data);
            for (var i = 0; i < data.length; i++) {
                $scope.totsales = data[i].Total;
            }
        }, function(response) {});

        $http.get('/skm/CustForMonth/').then(function(response) {
            var data = angular.fromJson(response.data);
            for (var i = 0; i < data.length; i++) {
                $scope.totcust = data[i].count;
            }
        }, function(response) {});

        $http.get('/skm/dailyProfit/').then(function(response) {
            var data = angular.fromJson(response.data);
            for (var i = 0; i < data.length; i++) {
                $scope.totdailyprofit = data[i].Profit;
            }
        }, function(response) {});

        $scope.initDashboardPageCharts = function() {
            $http.get('/skm/dailySales/').then(function(response) {
                var data = angular.fromJson(response.data);
                var newLabels = new Array();
                var newSeries = new Array();
                $scope.lastDailyVal = 50;
                for (var i = 0; i < data.length; i++) {
                    newLabels.push(data[i].labels);
                    newSeries.push(data[i].series);
                    for (var j = 1; j < i; j++) {
                        if (data[j].series > data[i].series) {
                            $scope.lastDailyVal = data[j].series
                        }
                    }
                }
                $scope.dataDailySalesChartData = {
                    labels: newLabels,
                    series: [newSeries]
                };
                /* ----------==========     Daily Sales Chart initialization    ==========---------- */
                dataDailySalesChart = $scope.dataDailySalesChartData;
                optionsDailySalesChart = {
                    lineSmooth: Chartist.Interpolation.cardinal({
                        tension: 0
                    }),
                    low: 0,
                    high: $scope.lastDailyVal + 70000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                    chartPadding: {
                        top: 0,
                        right: 25,
                        bottom: 0,
                        left: 25
                    },
                }
                var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
                md.startAnimationForLineChart(dailySalesChart);
            }, function(response) {});

            $http.get('/skm/monthlySales/').then(function(response) {
                var data = angular.fromJson(response.data);
                var newLabels = new Array();
                var newSeries = new Array();
                $scope.lastMonthlyVal = 50;
                for (var i = 0; i < data.length; i++) {
                    newLabels.push(data[i].labels);
                    newSeries.push(data[i].series);
                    for (var j = 1; j < i; j++) {
                        if (data[j].series > data[i].series) {
                            $scope.lastMonthlyVal = data[j].series
                        }
                    }
                }
                $scope.dataEmailsSubscriptionChartData = {
                    labels: newLabels,
                    series: [newSeries]
                };
                /* ----------==========     Monthly  Sales Chart initialization    ==========---------- */
                dataEmailsSubscriptionChart = $scope.dataEmailsSubscriptionChartData;
                var optionsEmailsSubscriptionChart = {
                    axisX: {
                        showGrid: false
                    },
                    low: 0,
                    high: $scope.lastMonthlyVal + 1000000,
                    chartPadding: {
                        top: 0,
                        right: 25,
                        bottom: 0,
                        left: 25
                    }
                };
                var responsiveOptions = [
                    ['screen and (max-width: 640px)', {
                        seriesBarDistance: 5,
                        axisX: {
                            labelInterpolationFnc: function(value) {
                                return value[0];
                            }
                        }
                    }]
                ];
                var emailsSubscriptionChart = Chartist.Bar('#emailsSubscriptionChart', dataEmailsSubscriptionChart, optionsEmailsSubscriptionChart, responsiveOptions);
                //start animation for the Emails Subscription Chart
                md.startAnimationForBarChart(emailsSubscriptionChart);
            }, function(response) {});

            $http.get('/skm/mostProductSales/').then(function(response) {
                var data = angular.fromJson(response.data);
                var newLabels = new Array();
                var newSeries = new Array();
                $scope.lastProdVal = 5;
                for (var i = 0; i < data.length; i++) {
                    newLabels.push(data[i].labels);
                    newSeries.push(data[i].series);
                    for (var j = 1; j < i; j++) {
                        if (data[j].series > data[i].series) {
                            $scope.lastProdVal = data[j].series
                        }
                    }
                }
                $scope.datamostProductSalesChartData = {
                    labels: newLabels,
                    series: [newSeries]
                };
                /* ----------==========     Most Product Sales Chart initialization    ==========---------- */
                datamostProductSalesChart = $scope.datamostProductSalesChartData;
                var optionsMostProductSalesChart = {
                    axisX: {
                        showGrid: false
                    },
                    low: 0,
                    high: $scope.lastProdVal + 5,
                    chartPadding: {
                        top: 5,
                        right: 5,
                        bottom: 0,
                        left: 5
                    }
                };
                var responsiveOptions = [
                    ['screen and (max-width: 640px)', {
                        seriesBarDistance: 5,
                        axisX: {
                            labelInterpolationFnc: function(value) {
                                return value[0];
                            }
                        }
                    }]
                ];
                var mostProductSalesChart = Chartist.Bar('#mostProductSalesChart', datamostProductSalesChart, optionsMostProductSalesChart, responsiveOptions);
                //start animation for the Emails Subscription Chart
                md.startAnimationForBarChart(mostProductSalesChart);
            }, function(response) {});
        }
    })
    .controller('AdminDashboardCntlr', function(NgTableParams, $rootScope, $scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;


        $(document).ready(function() {
            $scope.fisYearBill = '2018';
            $scope.fisYearBillWhole = '2018';
            $scope.getGeneratedBillData();
            $scope.getGeneratedBillWhData();
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }

        });

        $scope.fisYearBillVal = function() {
            alert("You have Choosen FY : " + $scope.fisYearBill)
            $scope.getGeneratedBillData();
        }

        $scope.fisYearBillWholeVal = function() {
            alert("You have Choosen FY  : " + $scope.fisYearBillWhole)
            $scope.getGeneratedBillWhData();
        }

        $http.get('/skm/adminStockData/').then(function(response) {
            var res = response.data;
            var data = angular.fromJson(res);
            $scope.stockStatusData = data;
            $scope.tableParamsstockData = new NgTableParams({ count: 5 }, { counts: [5, 10, 20, 40], dataset: data });
        }, function(response) {});

        $scope.getGeneratedBillData = function() {
            $scope.deleteBillData = {};
            var billD = {
                fisYear: $scope.fisYearBill
            }
            $http.post('/skm/adminBillData/', billD).then(function(response) {
                var res = response.data;
                var data = angular.fromJson(res);
                for (var i = 0; i < data.length; i++) {
                    data[i].IssuedDate = $rootScope.secondsToTime(data[i].IssuedDate);
                }
                $scope.tableParamsBillData = new NgTableParams({ count: 5 }, { counts: [5, 10, 20, 40], dataset: data });
            }, function(response) {});
        };

        $scope.getGeneratedBills = function(getBill) {
            console.log("getGeneratedBills");
            $scope.getBill = getBill;
            console.log($scope.getBill);
            if (getBill.BillType == 'DIS' || getBill.BillType == 'DIS-D') {
                console.log("If : " + getBill.BillType);
                $("#getDisConfirmBill").modal();
            } else {
                console.log("Else : " + getBill.BillType);
                var getBillData = {
                    billNo: getBill.BillNo,
                    fisYear: $scope.fisYearBill
                }
                $http.post('/skm/getGeneratedBill/', getBillData).then(function(response) {
                    var res = response.data;
                    $scope.generatedBillData = angular.fromJson(res);
                    for (var i = 0; i < $scope.generatedBillData.length; i++) {
                        $scope.generatedBillData[i].isPColor = ($scope.generatedBillData[i].isPColor == 'true') ? true : false;
                    }
                    $scope.totalCashWor = $rootScope.convertNumberToWords($scope.generatedBillData[0].amount);
                    $scope.geItemsCount = $scope.generatedBillData.length;
                    $http.get('/skm/storeDetails/').then(function(response) {
                        var res = response.data;
                        $scope.shopDetail = res[0];
                    }, function(response) {});
                    $("#generatedBill").modal();
                }, function(response) {});
            }

        };

        $scope.generateNonDisBill = function() {
            console.log("generateNonDisBill");
            var getNonDisBill = $scope.getBill;
            getNonDisBill.BillType = 'B'
            $scope.getGeneratedBills(getNonDisBill);
            $scope.getBill.BillType = 'DIS';
            console.log(getNonDisBill);
            console.log("End generateNonDisBill");
            console.log($scope.getBill);
        }
        $scope.generateDisBill = function() {
            var getDisBill = $scope.getBill;
            var getDisBillData = {
                billNo: getDisBill.BillNo,
                fisYear: $scope.fisYearBill
            }
            console.log(getDisBillData)
            console.log(getDisBill)
            $http.post('/skm/getGeneratedDisBill/', getDisBillData).then(function(response) {
                var res = response.data;
                $scope.generatedBillData = angular.fromJson(res);
                for (var i = 0; i < $scope.generatedBillData.length; i++) {
                    $scope.generatedBillData[i].isPColor = ($scope.generatedBillData[i].isPColor == 'true') ? true : false;
                }
                $scope.totalCashWor = $rootScope.convertNumberToWords($scope.generatedBillData[0].amount);
                $scope.geItemsCount = $scope.generatedBillData.length;
                $http.get('/skm/storeDetails/').then(function(response) {
                    var res = response.data;
                    $scope.shopDetail = res[0];
                }, function(response) {});
                $("#generatedBill").modal();
            }, function(response) {});
        }

        $scope.removeGeneratedBills = function(deleteBill) {
            $("#getConfirmation").modal();
            if (deleteBill.BillType == 'B') {
                deleteBill.BillType = 'D'
            } else if (deleteBill.BillType == 'DIS') {
                deleteBill.BillType = 'DIS-D'
            } else {
                deleteBill.BillType = 'D'
            }
            $scope.deleteBillData = {
                billNo: deleteBill.BillNo,
                billType: deleteBill.BillType,
                fisYear: $scope.fisYearBill
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

        $scope.getGeneratedBillWhData = function() {
            $scope.deleteBillWholeData = {};
            var billWD = {
                fisYearW: $scope.fisYearBillWhole
            }
            $http.post('/skm/adminBillWholeData/', billWD).then(function(response) {
                var res = response.data;
                var data = angular.fromJson(res);
                for (var i = 0; i < data.length; i++) {
                    data[i].IssuedDate = $rootScope.secondsToTime(data[i].IssuedDate);
                }
                $scope.tableParamsBillWholeData = new NgTableParams({ count: 5 }, { counts: [5, 10, 20, 40], dataset: data });
            }, function(response) {});
        };

        $scope.getGeneratedBillsWhole = function(getBillWh) {
            console.log("getGeneratedBillsWhole");
            $scope.getBillWh = getBillWh;
            console.log($scope.getBillWh);
            if (getBillWh.BillType == 'DIS' || getBillWh.BillType == 'DIS-D') {
                console.log("If : " + getBillWh.BillType);
                $("#getDisConfirmBill").modal();
            } else {
                console.log("Else : " + getBillWh.BillType);
                var getBillWhData = {
                    billNo: getBillWh.BillNo,
                    fisYearW: $scope.fisYearBillWhole
                }
                $http.post('/skm/getGeneratedBillWhole/', getBillWhData).then(function(response) {
                    var res = response.data;
                    $scope.generatedBillData = angular.fromJson(res);
                    for (var i = 0; i < $scope.generatedBillData.length; i++) {
                        $scope.generatedBillData[i].isPColor = ($scope.generatedBillData[i].isPColor == 'true') ? true : false;
                    }
                    $scope.totalCashWor = $rootScope.convertNumberToWords($scope.generatedBillData[0].amount);
                    $scope.geItemsCount = $scope.generatedBillData.length;
                    $http.get('/skm/storeDetails/').then(function(response) {
                        var res = response.data;
                        $scope.shopDetail = res[0];
                    }, function(response) {});
                    $("#generatedBill").modal();
                }, function(response) {});
            }

        };

        $scope.generateNonDisBillWhole = function() {
            console.log("generateNonDisBillWhole");
            var getNonDisBillWh = $scope.getBillWh;
            getNonDisBillWh.BillType = 'B'
            $scope.getGeneratedBillsWhole(getNonDisBillWh);
            $scope.getBillWh.BillType = 'DIS';
            console.log(getNonDisBillWh);
            console.log("End generateNonDisBillWhole");
            console.log($scope.getBillWh);
        }
        $scope.generateDisBillWhole = function() {
            var getDisBillWh = $scope.getBillWh;
            var getDisBillWhData = {
                billNo: getDisBillWh.BillNo,
                fisYearW: $scope.fisYearBillWhole
            }
            console.log(getDisBillWhData)
            console.log(getDisBillWh)
            $http.post('/skm/getGeneratedDisBillWhole/', getDisBillWhData).then(function(response) {
                var res = response.data;
                $scope.generatedBillData = angular.fromJson(res);
                for (var i = 0; i < $scope.generatedBillData.length; i++) {
                    $scope.generatedBillData[i].isPColor = ($scope.generatedBillData[i].isPColor == 'true') ? true : false;
                }
                $scope.totalCashWor = $rootScope.convertNumberToWords($scope.generatedBillData[0].amount);
                $scope.geItemsCount = $scope.generatedBillData.length;
                $http.get('/skm/storeDetails/').then(function(response) {
                    var res = response.data;
                    $scope.shopDetail = res[0];
                }, function(response) {});
                $("#generatedBill").modal();
            }, function(response) {});
        }

        $scope.removeGeneratedBillsWhole = function(deleteBillWh) {
            $("#getConfirmation").modal();
            if (deleteBillWh.BillType == 'B') {
                deleteBillWh.BillType = 'D'
            } else if (deleteBillWh.BillType == 'DIS') {
                deleteBillWh.BillType = 'DIS-D'
            } else {
                deleteBillWh.BillType = 'D'
            }
            $scope.deleteBillWholeData = {
                billNo: deleteBillWh.BillNo,
                billType: deleteBillWh.BillType,
                fisYearW: $scope.fisYearBillWhole
            }
        };

        $scope.deleteBillWhole = function() {
            $("#getConfirmation").modal('hide');
            $http.post('/skm/removeGeneratedBillWhole/', $scope.deleteBillWholeData).then(function(response) {
                var res = response.data;
                if (res == 'DONE') {
                    $scope.getGeneratedBillWhData();
                } else if (res == 'BILL') {
                    $scope.getGeneratedBillWhData();
                } else {
                    $scope.getGeneratedBillWhData();
                }
            }, function(response) {});
        };

        $http.get('/skm/adminCustomerData/').then(function(response) {
            var res = response.data;
            var data = angular.fromJson(res);
            $scope.tableParamsCustomerData = new NgTableParams({ count: 5 }, { counts: [5, 10, 20, 40], dataset: data });
        }, function(response) {});

        $scope.viewCustomerData = function(viewCustData) {
            $scope.viewCustomerDetails = viewCustData;
            $("#viewCustomerDetails").modal();
        }

        $scope.closeCustomerDetails = function(viewCustData) {
            $("#viewCustomerDetails").modal('hide');
            $scope.viewCustomerDetails = '';
        }
    })
    .controller('SalesInvoiceCntlr', function($log, $rootScope, $scope, $http, $route, $routeParams, $location) {
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
                "pColor": null,
                "isPColor": false,
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
                "soldPrice": null,
                "disPrice": null,
                "disCTax": null,
                "disSTax": null,
                "disAmount": null,
                "disSoldPrice": null
            }],
            "tDisc": 0,
            "tItems": 0,
            "payType": null,
            "duePay": null,
            "roundOff": 0,
            "subTotal": 0.00,
            "CGST": 0.00,
            "SGST": 0.00,
            "Total": 0.00,
            "disSubTotal": 0.00,
            "disCGST": 0.00,
            "disSGST": 0.00,
            "disTotal": 0.00,
            "billType": 'B'
        };
        $scope.isProductAdded = false;
        $scope.isGenerateBill = true;
        $scope.isResetBill = true;
        $scope.isCustomerSelected = true;
        $scope.isSaveBill = false;
        $scope.isPrintBill = false;
        $scope.isBackBill = false;
        $scope.isResetClean = false;
        $scope.ispurchaseType = false;

        $scope.isValidCustPhone = function() {
            $scope.isSearchCust = false;
            if ($scope.customerName.length == 10) {
                $scope.isSearchCust = true;
                $scope.getCustomerDetails();
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
                console.log("Cust res : " + res)
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
            $scope.isCustomerSelected = false;
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
                    $scope.isCustomerSelected = false;
                    $scope.customerDetails = $scope.addCustomer;
                } else {
                    $scope.custTitle = "Failed";
                    $scope.custMessage = ", Added Failed. Please try again.";
                    $scope.isCustomerSelected = true;
                }
                $("#addCustDBMessage").modal();
            }, function(response) {});
        };

        $scope.brandSearch = function() {
            $rootScope.appLogger("INFO", "brandSearch purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
            var brandData = {
                purchase_type: $scope.purchaseType,
                stock_type: $scope.stockType
            }
            $http.post('/skm/brandSearch/', brandData).then(function(response) {
                var res = response.data;
                $scope.brandNameArray = angular.fromJson(res);
            }, function(response) {});
        };

        $scope.modelDetails = function() {
            var brandId = {
                id: $scope.brandId,
                purchase_type: $scope.purchaseType,
                stock_type: $scope.stockType
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
            $rootScope.appLogger("INFO", "productDetails purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
            var modelId = {
                id: $scope.modelId,
                purchase_type: $scope.purchaseType,
                stock_type: $scope.stockType
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
                id: $scope.sid,
                purchase_type: $scope.purchaseType,
                stock_type: $scope.stockType
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
            $scope.ispurchaseType = true;
            var pTax = selproduct.tax_percentage;
            var pPrice = selproduct.price;
            var disPrice = selproduct.price - selproduct.discount;
            tax = taxSplitCal(pTax);
            $scope.salesProductList.tItems = $scope.salesProductList.tItems + 1;
            $scope.salesProductList['pList'].push({
                "SNo": $scope.salesProductList.tItems,
                "custId": $scope.cusID,
                "pSkuno": selproduct.sku_no,
                "pHSNSAC": '8517',
                "pName": selproduct.brand + ' ' + selproduct.model,
                "pIMEI": selproduct.imei_number,
                "pColor": selproduct.color,
                "isPColor": (selproduct.color != 'OTHER') ? true : false,
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
                "soldPrice": pPrice,
                "disPrice": netPrice(disPrice, gstAmt(disPrice, pTax)),
                "disCTax": round(((gstAmt(disPrice, pTax)) / 2), 2),
                "disSTax": round(((gstAmt(disPrice, pTax)) / 2), 2),
                "disAmount": pAmountCal(gstAmt(disPrice, pTax), netPrice(disPrice, gstAmt(disPrice, pTax))),
                "disSoldPrice": disPrice
            });
            $scope.salesProductList.subTotal = round(subTotalCal(netPrice(pPrice, gstAmt(pPrice, pTax))), 2);
            $scope.salesProductList.CGST = round(gstCal(round(((gstAmt(pPrice, pTax)) / 2), 2), $scope.salesProductList.CGST), 2);
            $scope.salesProductList.SGST = round(gstCal(round(((gstAmt(pPrice, pTax)) / 2), 2), $scope.salesProductList.SGST), 2);
            $scope.salesProductList.Total = round(totalCal(), 0);

            $scope.salesProductList.disSubTotal = round(disSubTotalCal(netPrice(disPrice, gstAmt(disPrice, pTax))), 2);
            $scope.salesProductList.disCGST = round(gstCal(round(((gstAmt(disPrice, pTax)) / 2), 2), $scope.salesProductList.disCGST), 2);
            $scope.salesProductList.disSGST = round(gstCal(round(((gstAmt(disPrice, pTax)) / 2), 2), $scope.salesProductList.disSGST), 2);
            $scope.salesProductList.disTotal = round(disTotalCal(), 0);

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
                $scope.sid = '';
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
                if (!$scope.isCustomerSelected) {
                    $scope.isGenerateBill = false;
                }
                for (var i = 0; i < $scope.salesProductList.pList.length; i++) {
                    if ($scope.salesProductList.pList[i].pDis > 0) {
                        $scope.salesProductList.billType = 'DIS';
                        break;
                    }
                }
                console.log($scope.salesProductList)
            }
        };

        $scope.removeItem = function(removeId) {
            var ritems = $scope.salesProductList.pList;
            var removeProduct = ritems[removeId];
            var itemCTax = removeProduct.pCTax;
            var itemSTax = removeProduct.pSTax;
            var itemPrice = removeProduct.pPrice;
            var sPrice = removeProduct.soldPrice;

            var itemDisPrice = removeProduct.disPrice;
            var disPrice = removeProduct.disSoldPrice

            $scope.salesProductList.subTotal = round(($scope.salesProductList.subTotal - itemPrice), 2);
            $scope.salesProductList.CGST = round(($scope.salesProductList.CGST - itemCTax), 2);
            $scope.salesProductList.SGST = round(($scope.salesProductList.SGST - itemSTax), 2);
            $scope.salesProductList.Total = round(($scope.salesProductList.Total - sPrice), 0);

            $scope.salesProductList.disSubTotal = round(($scope.salesProductList.disSubTotal - itemDisPrice), 2);
            $scope.salesProductList.disCGST = round(($scope.salesProductList.disCGST - itemCTax), 2);
            $scope.salesProductList.disSGST = round(($scope.salesProductList.disSGST - itemSTax), 2);
            $scope.salesProductList.disTotal = round(($scope.salesProductList.disTotal - disPrice), 0);

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

            if ($scope.salesProductList.pList.length == 0) {
                $scope.ispurchaseType = false;
            }
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
            console.log("salesProductList : ")
            console.log(salesProductList);
            var salesProductListData = {
                item: salesProductList,
                dueAmnt: 0,
                createdDate: timeToSecond,
                modifiedDate: timeToSecond,
                modifiedBy: $rootScope.userObj.uid
            }
            $rootScope.appLogger("INFO", "generatePreviewBill $scope.billNo : " + $scope.billNo + " $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
            if ($scope.billNo == '') {
                $rootScope.appLogger("INFO", "BEFORE generatePreviewBill $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                if ($scope.purchaseType == 'PURCHASE') {
                    $rootScope.appLogger("INFO", "IF generatePreviewBill $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                    $http.post('/skm/billNo/', salesProductListData).then(function(response) {
                        output = response.data;
                        $scope.billNo = output.insertId;
                    }, function(response) {});
                } else {
                    $rootScope.appLogger("INFO", "ELSE generatePreviewBill $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                    $http.post('/skm/billNoWholeSale/', salesProductListData).then(function(response) {
                        output = response.data;
                        $scope.billNo = output.insertId;
                    }, function(response) {});
                }
            } else if ($scope.billNo == 'C') {
                $rootScope.appLogger("INFO", "BEFORE generatePreviewBill $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                if ($scope.purchaseType == 'PURCHASE') {
                    $rootScope.appLogger("INFO", "IF generatePreviewBill $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                    $http.post('/skm/updateBillType/', salesData).then(function(response) {
                        $scope.isResetBill = false;
                    }, function(response) {});
                } else {
                    $rootScope.appLogger("INFO", "ELSE generatePreviewBill $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                    $http.post('/skm/updateBillTypeWholeSale/', salesData).then(function(response) {
                        $scope.isResetBill = false;
                    }, function(response) {});
                }

            }
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
                    $rootScope.appLogger("INFO", "BEFORE salesInvoiceSave $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                    if ($scope.purchaseType == 'PURCHASE') {
                        $rootScope.appLogger("INFO", "IF salesInvoiceSave $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                        $http.post('/skm/salesInvoice/', salesData).then(function(response) {
                            if (response.data == 'DONE') {
                                alert("Bill No : " + $scope.billNo + " Saved Successfully !#!#");
                                $scope.resetSalesInvoice('saveBill');
                            } else {
                                alert("Error in Savin Bill No : " + $scope.billNo + ", Please Try after some time !#!#");
                                $scope.resetSalesInvoice('saveBill');
                            }
                        }, function(response) {});
                    } else {
                        $rootScope.appLogger("INFO", "ELSE salesInvoiceSave $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                        $http.post('/skm/salesInvoiceWholeSale/', salesData).then(function(response) {
                            if (response.data == 'DONE') {
                                alert("Bill No : " + $scope.billNo + " Saved Successfully !#!#");
                                $scope.resetSalesInvoice('saveBill');
                            } else {
                                alert("Error in Savin Bill No : " + $scope.billNo + ", Please Try after some time !#!#");
                                $scope.resetSalesInvoice('saveBill');
                            }
                        }, function(response) {});
                    }
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
                    $rootScope.appLogger("INFO", "BEFORE salesInvoicePrint $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                    if ($scope.purchaseType == 'PURCHASE') {
                        $rootScope.appLogger("INFO", "IF salesInvoicePrint $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
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
                    } else {
                        $rootScope.appLogger("INFO", "ELSE salesInvoicePrint $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                        $http.post('/skm/salesInvoiceWholeSale/', salesData).then(function(response) {
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
            $rootScope.appLogger("INFO", "BEFORE backToSalesInvoice salesInvoicePrint $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
            if ($scope.purchaseType == 'PURCHASE') {
                $rootScope.appLogger("INFO", "IF backToSalesInvoice salesInvoicePrint $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                $http.post('/skm/backToSalesInvoice/', salesData).then(function(response) {
                    $scope.isResetBill = false;
                }, function(response) {});
            } else {
                $rootScope.appLogger("INFO", "ELSE backToSalesInvoice salesInvoicePrint $scope.purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
                $http.post('/skm/backToSalesInvoiceWholeSale/', salesData).then(function(response) {
                    $scope.isResetBill = false;
                }, function(response) {});
            }
        };

        $scope.resetSalesInvoice = function(action) {
            $scope.isCustomerSelected = true;
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
            $scope.ispurchaseType = false;
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
                    "pColor": null,
                    "isPColor": false,
                    "pQty": null,
                    "pPrice": null,
                    "pDis": null,
                    "pTax": null,
                    "pCTaxPer": null,
                    "pSTaxPer": null,
                    "pCTax": null,
                    "pSTax": null,
                    "pAmount": null,
                    "soldPrice": null,
                    "disPrice": null,
                    "disCTax": null,
                    "disSTax": null,
                    "disAmount": null,
                    "disSoldPrice": null
                }],
                "tDisc": 0,
                "tItems": 0,
                "payType": null,
                "duePay": null,
                "roundOff": 0,
                "subTotal": 0.00,
                "CGST": 0.00,
                "SGST": 0.00,
                "Total": 0.00,
                "disSubTotal": 0.00,
                "disCGST": 0.00,
                "disSGST": 0.00,
                "disTotal": 0.00,
                "billType": 'B'
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

        function disSubTotalCal(price) {
            var ret = $scope.salesProductList.disSubTotal + price;
            return ret;
        }

        function gstCal(taxAmnt, gstAmnt) {
            var ret = taxAmnt + gstAmnt;
            return ret;
        }

        function totalCal() {
            return ($scope.salesProductList.subTotal + $scope.salesProductList.roundOff + $scope.salesProductList.CGST + $scope.salesProductList.SGST);
        }

        function disTotalCal() {
            return ($scope.salesProductList.disSubTotal + $scope.salesProductList.roundOff + $scope.salesProductList.disCGST + $scope.salesProductList.disSGST);
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
    .controller('ProductBarCodeCntlr', function($scope, $http, $route, $routeParams, $location) {
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

        $scope.barcodePrint = function() {

        }

        var barcodestartDate = '';
        var barcodeendDate = '';

        $scope.$watch('barcodestartdate', function(value) {
            $scope.isFilter = false;
            $scope.isValidStart = false;
            try {
                barcodestartDate = new Date(value).toString();
            } catch (e) {}

            if (!barcodestartDate) {
                $scope.error = "This is not a valid date";
            } else {
                $scope.error = false;
            }
        });

        $scope.$watch('barcodeenddate', function(value) {
            $scope.isFilter = false;
            $scope.isValidSdate = false;
            try {
                barcodeendDate = new Date(value).toString();
            } catch (e) {}

            if (!barcodeendDate) {
                $scope.error = "This is not a valid date";
            } else {
                $scope.error = false;
                $scope.isValidDate = false;
            }
        });
        $scope.barcodeCurrentPage = 0;
        $scope.barcodePageSize = 40;
        $scope.barcodeImei = [];
        $scope.barcodeNumberOfPages = function() {
            return Math.ceil($scope.barcodeImei.length / $scope.barcodePageSize);
        }

        $scope.filterBarcode = function() {
            $scope.barcodeSpinner = true;
            if (barcodestartDate && barcodeendDate) {
                var startTime = Math.round(new Date(barcodestartDate).getTime() / 1000);
                var endTime = Math.round(new Date(barcodeendDate).getTime() / 1000);
                if (startTime > endTime) {
                    $scope.isError = true;
                    $scope.error = "Start Date is greater than End Date";
                } else {
                    $scope.isFilter = true;
                    $scope.error = false;
                }
            }
            var barcodeFilterData = {
                sdate: startTime,
                edate: endTime
            };
            console.log(barcodeFilterData);
            $http.post('/skm/barcodeIMEI/', barcodeFilterData).then(function(response) {
                var res = response.data;
                $scope.barcodeImei = angular.fromJson(res);
                $("#generateBarCode").modal();
                console.log("$scope.barcodeImei");
                console.log($scope.barcodeImei);
                $scope.isGenerated = true;
            }, function(response) {

            }).finally(function() {
                // called no matter success or failure
                $scope.barcodeSpinner = false;
            });
        }

        $scope.$watch('bc', function() {
            for (var key in $scope.bc) {
                if ($scope.bc.hasOwnProperty(key)) {
                    switch (typeof $scope.bc[key]) {
                        case 'number':
                            if ($scope.bc[key] === null) {
                                delete $scope.bc[key];
                            }
                            break;
                        case 'string':
                            if ($scope.bc[key].length === 0) {
                                delete $scope.bc[key];
                            }
                            break;
                        case 'boolean':
                            break;
                    }
                }
            }
        }, true);

        $scope.bc = {
            format: 'CODE39',
            lineColor: '#000000',
            width: 0.25,
            height: 20,
            displayValue: true,
            fontOptions: '',
            font: 'monospace',
            textAlign: 'center',
            textPosition: 'bottom',
            textMargin: 3,
            fontSize: 10,
            background: '#ffffff',
            margin: 8,
            marginTop: 8,
            marginBottom: 8,
            marginLeft: 8,
            marginRight: 8,
            valid: function(valid) {}
        }
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
            $scope.spinner = true;
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
            }, function(response) {

            }).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });
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
        $scope.isValidIMEI = true;
        $scope.retProductIMEI = [];
        $scope.upProductIMEI = [];
        $scope.stockType = 'MOBILE';
        $scope.retStockType = 'MOBILE';
        $scope.upStockType = 'MOBILE';
        $scope.stockTypeCode = 'IMEI';
        $scope.retStockTypeCode = 'IMEI';
        $scope.upStockTypeCode = 'IMEI';
        var taxlist = [];
        var taxes = '';
        var promise = $q.all([]);

        $scope.isstockType = function() {
            if ($scope.stockType == 'MOBILE') {
                $scope.stockTypeCode = 'IMEI';

            } else if ($scope.stockType == 'ACCESS') {
                $scope.stockTypeCode = 'SERIAL';
            }
            if ($scope.retStockType == 'MOBILE') {
                $scope.retStockTypeCode = 'IMEI';
            } else if ($scope.retStockType == 'ACCESS') {
                $scope.retStockTypeCode = 'SERIAL';
            }
            if ($scope.upStockType == 'MOBILE') {
                $scope.upStockTypeCode = 'IMEI';
            } else if ($scope.upStockType == 'ACCESS') {
                $scope.upStockTypeCode = 'SERIAL';
            }
        }

        $http.get('/skm/taxGroup/').then(function(response) {
            var res = response.data;
            $scope.taxes = angular.fromJson(res);
        }, function(response) {});
        $http.get('/skm/brand/').then(function(response) {
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

        $scope.validateInputs = function() {
            if ($scope.stockTypeCode == 'IMEI') {
                $scope.validateIMEI();
            }
            /*else {
                           $scope.validateSERIAL();
                       }*/
        }

        $scope.validateSERIAL = function() {}

        $scope.validateIMEI = function() {
            var imeis = $scope.imeiNumber;
            console.log("validateIMEI imeis : " + imeis);
            if ($scope.imeiNumber.length >= 15) {
                var imei_array = imeis.split(",");
                console.log("validateIMEI imei_array len: " + imei_array.length);
                angular.forEach(imei_array, function(im) {
                    promise = promise.then(function() {
                        return validateImei(im);
                    });
                });

                promise.finally(function() {
                    console.log('Insert finished!');
                });

                function validateImei(im) {
                    console.log(" validateImei(im) im.length : " + im.length)
                    if ((null != im || im != '' || im != undefined) &&
                        (im.length != 0) &&
                        (im.length == 15)) {
                        console.log(" Inside validateImei(im) im.length : " + im.length)
                        var valIMEI = {
                            imei: im
                        }
                        console.log("valIMEI: " + valIMEI.imei);
                        $http.post('/skm/validateIMEI/', valIMEI).then(function(response) {
                            output = response.data;
                            console.log(output)
                            if (output.length >= 1) {
                                $scope.isValidIMEI = true;
                                alert(" IMEI No " + im + " already present, Please try with different IMEI No");
                                var index = imei_array.indexOf(im);
                                if (index > -1) {
                                    imei_array.splice(index, 1);
                                }
                                console.log("imeis : " + imeis + " imei_array : " + imei_array);
                                $scope.imeiNumber = imei_array;
                            } else {
                                console.log("else imeis : " + imeis + " imei_array : " + imei_array);
                                $scope.isValidIMEI = false;
                            }
                        }, function(response) {});
                    }
                }
            }
        };

        $scope.addProduct = function() {
            $scope.spinner = true;
            console.log("purchaseType : " + $scope.purchaseType)
            var timeToSecond = $rootScope.timeToSeconds();
            var imeis = $scope.imeiNumber;
            var imei_array = imeis.split(",");
            console.log("addProduct : imei_array : " + imei_array + "purchaseType : " + $scope.purchaseType + " stockType : " + $scope.stockType);
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
                modifiedBy: $rootScope.userObj.uid,
                purchase_type: $scope.purchaseType,
                stock_type: $scope.stockType
            };
            angular.forEach(imei_array, function(im) {
                promise = promise.then(function() {
                    pro.imei_number = im;
                    return productInsert(pro, im);
                });
            });

            promise.finally(function() {
                $scope.spinner = false;
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
                        $scope.purchaseType = '';
                        $scope.stockType = 'MOBILE';
                        $scope.stockTypeCode = 'IMEI';
                        return pro.sku_no;
                    }, function(response) {});
                    return pro.sku_no;
                }, function(response) {});
            }
        }

        $scope.retBrandSearch = function() {
            $rootScope.appLogger("INFO", "retBrandSearch retPurchaseType : " + $scope.retPurchaseType + " retStockType : " + $scope.retStockType);
            var brandData = {
                purchase_type: $scope.retPurchaseType,
                stock_type: $scope.retStockType
            }
            $http.post('/skm/brandSearch/', brandData).then(function(response) {
                var res = response.data;
                $scope.retMobBrands = angular.fromJson(res);
            }, function(response) {});
        };

        $scope.retModelDetails = function() {
            var retBrandId = {
                id: $scope.retBrandId,
                purchase_type: $scope.retPurchaseType,
                stock_type: $scope.retStockType
            }
            $http.post('/skm/amodelSearch/', retBrandId).then(function(response) {
                var res = response.data;
                $scope.retMobModels = angular.fromJson(res);
            }, function(response) {});
        };

        $scope.retProductDetails = function() {
            $rootScope.appLogger("INFO", "retProductDetails retPurchaseType : " + $scope.retPurchaseType + " retStockType : " + $scope.retStockType);
            var retModelId = {
                id: $scope.retModelId,
                purchase_type: $scope.retPurchaseType,
                stock_type: $scope.retStockType
            }
            $http.post('/skm/productSearch/', retModelId).then(function(response) {
                var res = response.data;
                $scope.retProductIMEIS = angular.fromJson(res);
            }, function(response) {});
        };

        $scope.retCheckItem = function(imei) {
            for (var i = 0; i < $scope.retProductIMEIS.length; i++) {
                if (imei == $scope.retProductIMEIS[i].imei_number) {
                    $scope.retProductIMEI.push(imei);
                }
            }
        };

        $scope.returnProduct = function() {
            $scope.spinner = true;
            $rootScope.appLogger("INFO", "returnProduct $scope.retProductIMEI : " + $scope.retProductIMEI);
            var retIMEIS = {
                product_imeis: $scope.retProductIMEI,
                purchase_type: $scope.retPurchaseType
            }
            $http.post('/skm/retProduct/', retIMEIS).then(function(response) {
                    console.log(response.data);
                    $scope.retPurchaseType = '';
                    $scope.retMobBrands = ''
                    $scope.retMobModels = '';
                    $scope.retProductIMEIS = '';
                    $scope.retProductIMEI = [];
                    $scope.retStockType = 'MOBILE';
                    $scope.retStockTypeCode = 'IMEI';
                },
                function(response) {

                }).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });
        };

        $scope.upBrandSearch = function() {
            $rootScope.appLogger("INFO", "upBrandSearch upPurchaseType : " + $scope.upPurchaseType + " upStockType : " + $scope.upStockType);
            var upBrandData = {
                purchase_type: $scope.upPurchaseType,
                stock_type: $scope.upStockType
            }
            $http.post('/skm/brandSearch/', upBrandData).then(function(response) {
                var res = response.data;
                $scope.upMobBrands = angular.fromJson(res);
            }, function(response) {});
        };

        $scope.upModelDetails = function() {
            var upBrandId = {
                id: $scope.upBrandId,
                purchase_type: $scope.upPurchaseType,
                stock_type: $scope.upStockType
            }
            $http.post('/skm/amodelSearch/', upBrandId).then(function(response) {
                var res = response.data;
                $scope.upMobModels = angular.fromJson(res);
            }, function(response) {});
        };

        $scope.upProductDetails = function() {
            $rootScope.appLogger("INFO", "upProductDetails upPurchaseType : " + $scope.upPurchaseType + " upStockType : " + $scope.upStockType);
            var upModelId = {
                id: $scope.upModelId,
                purchase_type: $scope.upPurchaseType,
                stock_type: $scope.upStockType
            }
            $http.post('/skm/productSearch/', upModelId).then(function(response) {
                var res = response.data;
                $scope.upProductIMEIS = angular.fromJson(res);
            }, function(response) {});
        };

        $scope.upCheckItem = function(imei) {
            for (var i = 0; i < $scope.upProductIMEIS.length; i++) {
                if (imei == $scope.upProductIMEIS[i].imei_number) {
                    $scope.upProductIMEI.push(imei);
                }
            }
        };

        $scope.updateProduct = function() {
            $scope.updatespinner = true;
            $rootScope.appLogger("INFO", "updateProduct $scope.upProductIMEI : " + $scope.upProductIMEI);
            var upIMEIS = {
                product_imeis: $scope.upProductIMEI,
                purchase_type: $scope.upPurchaseType,
                upPPrice: $scope.upPPrice
            }
            $http.post('/skm/upProduct/', upIMEIS).then(function(response) {
                    console.log(response.data);
                    $scope.upPPrice = '';
                    $scope.upPurchaseType = '';
                    $scope.upMobBrands = ''
                    $scope.upMobModels = '';
                    $scope.upProductIMEIS = '';
                    $scope.upProductIMEI = [];
                    $scope.upStockType = 'MOBILE';
                    $scope.upStockTypeCode = 'IMEI';
                },
                function(response) {

                }).finally(function() {
                // called no matter success or failure
                $scope.updatespinner = false;
            });
        };


        $scope.SelectedFileForUpload = null;

        $scope.UploadFile = function(files) {
            $scope.$apply(function() { //I have used $scope.$apply because I will call this function from File input type control which is not supported 2 way binding
                $scope.Message = "";
                $scope.SelectedFileForUpload = files[0];
            })
        }

        //Parse Excel Data 
        $scope.ParseExcelDataAndSave = function() {
            var file = $scope.SelectedFileForUpload;
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data = e.target.result;
                    //XLSX from js-xlsx library , which I will add in page view page
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var sheetName = workbook.SheetNames[0];
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    console.log("excelData")
                    console.log(excelData)
                    if (excelData.length > 0) {
                        console.log("Indie excelData")
                        console.log(excelData)
                            //Save data 
                            //$scope.SaveData(excelData);
                    } else {
                        $scope.Message = "No data found";
                    }
                }
                reader.onerror = function(ex) {
                    console.log(ex);
                }

                reader.readAsBinaryString(file);
            }
        }


    })
    .controller('GSTReturnsCntlr', function($rootScope, $scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $scope.isFilter = false;
        $scope.isShow = false;
        $scope.isError = false;
        var today = new Date();
        var dd = today.getDate() + 1;
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        $scope.maxDate = mm + '/' + dd + '/' + yyyy;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });

        $scope.fisYearVal = function() {
            if ($scope.fisYear > 0) {
                $scope.isShow = true;
            } else {
                $scope.isShow = false;
            }
        }

        var startDate = '';
        var endDate = '';

        $scope.$watch('startdate', function(value) {
            $scope.isFilter = false;
            $scope.isValidStart = false;
            try {
                startDate = new Date(value).toString();
            } catch (e) {}

            if (!startDate) {
                $scope.error = "This is not a valid date";
            } else {
                $scope.error = false;
            }
        });

        $scope.$watch('enddate', function(value) {
            $scope.isFilter = false;
            $scope.isValidSdate = false;
            try {
                endDate = new Date(value).toString();
            } catch (e) {}

            if (!endDate) {
                $scope.error = "This is not a valid date";
            } else {
                $scope.error = false;
                $scope.isValidDate = false;
            }
        });


        $scope.filterGst = function() {
            $scope.spinner = true;
            if (startDate && endDate) {
                var startTime = Math.round(new Date(startDate).getTime() / 1000);
                var endTime = Math.round(new Date(endDate).getTime() / 1000);
                if (startTime > endTime) {
                    $scope.isError = true;
                    $scope.error = "Start Date is greater than End Date";
                } else {
                    $scope.isFilter = true;
                    $scope.error = false;
                }
            }

            var FilterData = {
                sdate: startTime,
                edate: endTime,
                fisYear: $scope.fisYear
            };
            console.log(FilterData);
            $http.post('/skm/GSTReturnsBillData/', FilterData).then(function(response) {
                var res = response.data;
                $scope.gstReturnsBillData = angular.fromJson(res);
                for (var i = 0; i < $scope.gstReturnsBillData.length; i++) {
                    $scope.gstReturnsBillData[i].Invoicedate = $rootScope.secondsToDate($scope.gstReturnsBillData[i].Invoicedate);
                }
            }, function(response) {

            }).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });

            $http.post('/skm/GSTReturnsPurchaseData/', FilterData).then(function(response) {
                var res = response.data;
                $scope.gstReturnsPurchaseData = angular.fromJson(res);
                for (var i = 0; i < $scope.gstReturnsPurchaseData.length; i++) {
                    $scope.gstReturnsPurchaseData[i].invoice_date = $rootScope.secondsToDate($scope.gstReturnsPurchaseData[i].invoice_date);
                }
            }, function(response) {

            }).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });
        }
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
        });
        var today = new Date();
        var dd = today.getDate();
        var dn = today.getDate() + 1;
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        $scope.gstPurCurrDate = mm + '/' + dd + '/' + yyyy;
        $scope.isResetGSTPur = false;
        $scope.maxDate = mm + '/' + dn + '/' + yyyy;

        var gstInvoiceDate = '';
        $scope.$watch('gstPurInvoiceDate', function(value) {
            try {
                gstInvoiceDate = new Date(value).toString();
            } catch (e) {}

            if (!gstInvoiceDate) {
                $scope.error = "This is not a valid date";
            } else {
                $scope.error = false;
            }
        });

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
            $scope.spinner = true;
            var currentDate = $rootScope.timeToSeconds();
            var invoiceTime = Math.round(new Date(gstInvoiceDate).getTime() / 1000);
            var addGSTPurData = {
                sellerName: $scope.gstPurSellerName,
                invoiceNo: $scope.gstPurInvoiceNo,
                invoiceDate: invoiceTime,
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
            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });
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
    .controller('EditGSTPurchaseCntlr', function($rootScope, $scope, $http, $route, $routeParams, $location) {
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
        var edittoday = new Date();
        var dd = edittoday.getDate();
        var dn = edittoday.getDate();
        var mm = edittoday.getMonth() + 1;
        var yyyy = edittoday.getFullYear();
        $scope.editgstPurCurrDate = mm + '/' + dd + '/' + yyyy;
        $scope.isResetGSTPur = false;
        $scope.editmaxDate = mm + '/' + dn + '/' + yyyy;

        var editgstInvoiceDate = '';

        $scope.getSellarDetails = function() {
            $http.get('/skm/sellarDetails/' + $scope.sellarName).then(function(response) {
                var res = response.data;
                console.log("sellar res : " + res)

            }, function(response) {});
        };

        $scope.submit = function() {
            $scope.spinner = true;
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
            }, function(response) {

            }).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });
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

        function shopDetails() {
            $http.get('/skm/storeDetails/').then(function(response) {
                var res = response.data;
                $scope.shop = angular.fromJson(res[0]);
            }, function(response) {});
        }
        shopDetails();
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

        $scope.saveShop = function() {
            $scope.spinner = true;
            var shopData = {
                name: $scope.shop.name,
                mobile: $scope.shop.mobile,
                phone: $scope.shop.phone,
                gstin: $scope.shop.gstin,
                email: $scope.shop.email,
                address: $scope.shop.address,
                city: $scope.shop.city,
                state: $scope.shop.state,
                pincode: $scope.shop.pincode
            };
            $http.post('/skm/shopInsert/', shopData).then(function(response) {
                if (response.data.affectedRows > 0) {
                    toaster.pop("success", "success", "Shop Details Added Successfully");
                    shopDetails();
                }
            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });
        };

        $scope.addColor = function() {
            $scope.tspinner = true;
            var colorData = {
                color: $scope.color
            };
            $http.post('/skm/colorInsert/', colorData).then(function(response) {
                if (response.data.affectedRows > 0) {
                    toaster.pop("success", "success", "Color Added Successfully");
                    $scope.colorSearch();
                    $scope.color = '';
                }
            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.tspinner = false;
            });
        };

        $scope.addRAM = function() {
            $scope.tspinner = true;
            var ramData = {
                ram: $scope.ram
            };
            $http.post('/skm/ramInsert/', ramData).then(function(response) {
                if (response.data.affectedRows > 0) {
                    toaster.pop("success", "success", "RAM Added Successfully");
                    $scope.ramSearch();
                    $scope.ram = '';
                }
            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.tspinner = false;
            });

        };

        $scope.addROM = function() {
            $scope.tspinner = true;
            var romData = {
                rom: $scope.rom
            };
            $http.post('/skm/romInsert/', romData).then(function(response) {
                if (response.data.affectedRows > 0) {
                    toaster.pop("success", "success", "ROM Added Successfully");
                    $scope.romSearch();
                    $scope.rom = '';
                }
            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.tspinner = false;
            });
        };

        $scope.addBrand = function() {
            $scope.spinner = true;
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
            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });
        }

        $scope.addModel = function() {
            $scope.spinner = true;
            var data = {
                bid: $scope.mbrand,
                model: $scope.model
            };
            $http.post('/skm/modelInsert/', data).then(function(response) {
                toaster.pop("success", "success", "Model Added Successfully");
                $scope.mbrand = '';
                $scope.model = '';
            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.spinner = false;
            });
        }

        $scope.addTaxGroup = function() {
            $scope.tspinner = true;
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

            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.tspinner = false;
            });
        }
        $scope.addTax = function() {
            $scope.tspinner = true;
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

            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.tspinner = false;
            });
        }

        $scope.addTg = function() {
            $scope.tspinner = true;
            var data = {
                group_id: $scope.tgroup,
                tax_id: $scope.ttax
            };
            $http.post('/skm/taxdetailsInsert/', data).then(function(response) {
                toaster.pop("success", "success", "Tax Details Added Successfully");
                $scope.tgroup = '';
                $scope.ttax = '';
            }, function(response) {}).finally(function() {
                // called no matter success or failure
                $scope.tspinner = false;
            });
        }
    })
    .controller('OffersCntlr', function($scope, $http, $route, $routeParams, $location, toaster) {
        $scope.$location = $location;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
        $scope.isofferLink = false;
        $scope.spinner = false;
        $scope.isofferLinkVal = function() {
            if (null != $scope.offerLink) {
                $scope.isofferLink = true;
            }
        }
        $scope.submit = function() {
            console.log("submit");
            $scope.spinner = true;
            if (null != $scope.offerLink && null != $scope.subject) {
                $scope.isofferLink = true;
                var sendOffersData = {
                    offerLink: $scope.offerLink,
                    subject: $scope.subject,
                    senderMail: $scope.senderMail
                };
                $http.post('/skm/sendOffers/', sendOffersData).then(function(response) {
                    console.log(response.data)
                    if (response.data == 'SEND') {
                        $scope.offerLink = '';
                        $scope.senderMail = '';
                        $scope.subject = '';
                        $scope.isofferLink = false;
                    }
                }, function(response) {

                }).finally(function() {
                    // called no matter success or failure
                    $scope.spinner = false;
                });
            }
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