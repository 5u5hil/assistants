var publisher;
var session;
var subscriber;
angular.module('your_app_name.controllers', ['ionic', 'ngCordova'])
        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            $scope.interface = window.localStorage.setItem('interface_id', '3');
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');
                $rootScope.userimage = window.localStorage.getItem('image');
            } else {
                if ($rootScope.userLogged == 0)
                    $state.go('auth.walkthrough');
            }
        })

// APP
        .controller('AppCtrl', function ($scope, $http, $state, $ionicConfig, $rootScope, $ionicLoading, $timeout, $ionicHistory) {
            $rootScope.imgpath = domain + "/public/frontend/user/";
            $rootScope.attachpath = domain + "/public";
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');
                $rootScope.userimage = window.localStorage.getItem('image');
            } else {
                if ($rootScope.userLogged == 0)
                    $state.go('auth.walkthrough');
            }
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = window.localStorage.getItem('id');
            $scope.CurrentDate = new Date();
            $http({
                method: 'GET',
                url: domain + 'get-sidemenu-lang',
                params: {id: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                if (response.data) {
                    $scope.menutext = response.data.dataMenu;
                    $scope.language = response.data.lang.language;

                } else {
                }
            }, function errorCallback(response) {
                // console.log(response);
            });

            $scope.logout = function () {
                $ionicLoading.show({template: 'Logging out....'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/doctor-logout',
                    params: {docId: window.localStorage.getItem('id')}
                }).then(function successCallback(response) {

                    window.localStorage.clear();
                    $rootScope.userLogged = 0;
                    $rootScope.$digest;
                    $timeout(function () {
                        $ionicLoading.hide();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                        $state.go('auth.walkthrough', {}, {reload: true});
                    }, 30);
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
        })

        //LOGIN
        .controller('LoginCtrl', function ($scope, $http, $state, $templateCache, $q, $rootScope, $ionicLoading, $timeout) {
            window.localStorage.setItem('interface_id', '3');
            $scope.interface = window.localStorage.getItem('interface_id');

            $http({
                method: 'GET',
                url: domain + 'get-login',
                params: {id: window.localStorage.getItem('id'), interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.lang.language);

                if (response.data.lang.language) {
                    $scope.langtext = response.data.data;
                    $scope.language = response.data.lang.language;
                    //$rootScope.apkLanguage = response.data.lang.language;
                    $scope.apkLanguage = window.localStorage.setItem('apkLanguage', response.data.lang.language);
                } else {
                }
            }, function errorCallback(response) {
                // console.log(response);
            });
            $scope.doLogIn = function () {
                $ionicLoading.show({template: 'Loading...'});
                var data = new FormData(jQuery("#loginuser")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + "chk-assi-user",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (angular.isObject(response)) {
                            $scope.loginError = '';
                            $scope.loginError.digest;
                            store(response);
                            $rootScope.userLogged = 1;
                            $rootScope.username = response.fname;
                            $rootScope.userimage = response.image;
                            $ionicLoading.hide();
                            $state.go('app.assistants');
                        } else {
                            $rootScope.userLogged = 0;
                            $scope.loginError = response;
                            $scope.loginError.digest;
                            $ionicLoading.hide();
                            $timeout(function () {
                                $scope.loginError = response;
                                $scope.loginError.digest;
                            })
                        }
                        $rootScope.$digest;
                    },
                    error: function (e) {
                        console.log(e.responseText);
                    }
                });
            };
            $scope.user = {};
            $scope.user.email = "";
            $scope.user.pin = "";
            // We need this for the form validation
            $scope.selected_tab = "";
            $scope.$on('my-tabs-changed', function (event, data) {
                $scope.selected_tab = data.title;
            });
        })

        .controller('ForgotPasswordCtrl', function ($scope, $state, $ionicLoading) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.recoverPassword = function (email, phone) {
                window.localStorage.setItem('email', email);
                console.log("email:  " + email);
                $.ajax({
                    type: 'GET',
                    url: domain + "recovery-password",
                    data: {email: email, phone: phone},
                    cache: false,
                    success: function (response) {
                        console.log("respone passcode" + response.passcode);
                        window.localStorage.setItem('passcode', response.passcode);
                        $state.go('auth.update-password', {}, {reload: true});
                    }
                });
            };
            $scope.updatePassword = function (passcode, password, cpassword) {
                var email = window.localStorage.getItem('email');
                $.ajax({
                    type: 'GET',
                    url: domain + "update-password",
                    data: {passcode: passcode, password: password, cpassword: cpassword, email: email},
                    cache: false,
                    success: function (response) {
                        if (response == 1) {
                            if (parseInt(passcode) == parseInt(window.localStorage.getItem('passcode'))) {
                                alert('Please login with your new password.');
                                $state.go('auth.login', {}, {reload: true});
                            } else {
                                alert('Please enter valid OTP.');
                            }
                        } else if (response == 2) {
                            alert('Password Mismatch.');
                        } else {
                            alert('Oops something went wrong.');
                        }
                    }
                });
            };
            $scope.user = {};
        })

        .controller('EvaluationCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('PatientChatCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('HomepageCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('CreatedbyuCtrl', function ($scope, $http, $stateParams, $ionicModal, $state) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.patientId = $stateParams.id;
            $scope.shared = 0;
            $scope.catIds = [];
            $scope.catId = [];
            $scope.docId = '';
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-patient-record-category',
                params: {userId: $scope.userId, patientId: $stateParams.id, interface: $scope.interface, shared: $scope.shared}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.categories = response.data.categories;
                $scope.doctrs = response.data.doctrs;
                $scope.userRecords = response.data.recordCount;
                $scope.patient = response.data.patient;
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.getIds = function (id) {
                console.log(id);
                if ($scope.catId[id]) {
                    $scope.catIds.push(id);
                } else {
                    var index = $scope.catIds.indexOf(id);
                    $scope.catIds.splice(index, 1);
                }
                console.log($scope.catIds);
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Delete all Records by category
            $scope.delete = function () {
                if ($scope.catIds.length > 0) {
                    var confirm = window.confirm("Do you really want to delete?");
                    if (confirm) {
                        console.log($scope.catIds);
                        $http({
                            method: 'POST',
                            url: domain + 'assistrecords/delete-all',
                            params: {ids: JSON.stringify($scope.catIds), userId: $scope.userid, shared: $scope.shared}
                        }).then(function successCallback(response) {
                            alert("Records deleted successfully!");
                            $state.go('app.createdbyu', {id: $scope.patientId}, {reload: true});
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    }
                } else {
                    alert("Please select records to delete!");
                }
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.catIds.length > 0) {
                    if ($scope.docId != '') {
                        var confirm = window.confirm("Do you really want to share?");
                        if (confirm) {
                            console.log($scope.catIds);
                            $http({
                                method: 'POST',
                                url: domain + 'assistrecords/share-all',
                                params: {ids: JSON.stringify($scope.catIds), userId: $scope.userId, patientId: $scope.patientId, docId: $scope.docId, shared: $scope.shared}
                            }).then(function successCallback(response) {
                                console.log(response);
                                if (response.data == 'Success') {
                                    alert("Records shared successfully!");
                                    $state.go('app.createdbyu', {id: $scope.patientId}, {reload: true});
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });
                        }
                    } else {
                        alert("Please select doctor to share with!");
                    }
                } else {
                    alert("Please select records to share!");
                }
            };
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };
        })

        .controller('RecordsViewCtrl', function ($scope, $http, $state, $stateParams, $rootScope, $cordovaPrinter, $ionicModal, $timeout) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.category = [];
            $scope.catId = $stateParams.id;
            $scope.patientId = $stateParams.patientId;
            $scope.shared = $stateParams.shared;
            $scope.limit = 3;
            $scope.recId = [];
            $scope.recIds = [];
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-records-details',
                params: {id: $stateParams.id, userId: $scope.userId, shared: $scope.shared, patientId: $scope.patientId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.records = response.data.records;
                if ($scope.records.length != 0) {
                    if ($scope.records[0].record_metadata.length == 6) {
                        $scope.limit = 3; //$scope.records[0].record_metadata.length;
                    }
                }
                $scope.category = response.data.category;
                $scope.createdby = response.data.createdby;
                $scope.doctors = response.data.doctors;
                $scope.problems = response.data.problems;
                $scope.cases = response.data.cases;
                $scope.patient = response.data.patient;
                $scope.doctrs = response.data.shareDoctrs;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getRecords = function (cat) {
                console.log(cat);
                $scope.catId = cat;
                //$stateParams.id = cat;
                $http({
                    method: 'GET',
                    url: domain + 'assistrecords/get-records-details',
                    params: {id: $stateParams.id, userId: $scope.userId, shared: $scope.shared, patientId: $scope.patientId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.records = response.data.records;
                    if ($scope.records.length != 0) {
                        if ($scope.records[0].record_metadata.length == 6) {
                            $scope.limit = 3; //$scope.records[0].record_metadata.length;
                        }
                    }
                    $scope.doctrs = response.data.shareDoctrs;
                    //$scope.category = response.data.category;
                    console.log($scope.catId);
                }, function errorCallback(response) {
                    console.log(response);
                });
                $rootScope.$digest;
            };
//            $scope.addRecord = function () {
//                $state.go('app.add-category', {'id': button.id}, {reload: true});
//            };
            //Delete Records by Category
            $scope.getRecIds = function (id) {
                console.log(id);
                if ($scope.recId[id]) {
                    $scope.recIds.push(id);
                } else {
                    var index = $scope.recIds.indexOf(id);
                    $scope.recIds.splice(index, 1);
                }
                console.log($scope.recIds);

            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Delete all Records by category
            $scope.delete = function () {
                if ($scope.recIds.length > 0) {
                    var confirm = window.confirm("Do you really want to delete?");
                    if (confirm) {
                        console.log($scope.recIds);
                        $http({
                            method: 'POST',
                            url: domain + 'assistrecords/delete-by-category',
                            params: {ids: JSON.stringify($scope.recIds), userId: $scope.userId, shared: $scope.shared}
                        }).then(function successCallback(response) {
                            alert("Records deleted successfully!");
                            window.location.reload();
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    }
                } else {
                    alert("Please select records to delete!");
                }
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.recIds.length > 0) {
                    if ($scope.docId != '') {
                        var confirm = window.confirm("Do you really want to share?");
                        if (confirm) {
                            console.log($scope.recIds);
                            $http({
                                method: 'POST',
                                url: domain + 'assistrecords/share-by-category',
                                params: {ids: JSON.stringify($scope.recIds), userId: $scope.userId, docId: $scope.docId, shared: $scope.shared}
                            }).then(function successCallback(response) {
                                console.log(response);
                                if (response.data == 'Success') {
                                    alert("Records shared successfully!");
                                    window.location.reload();
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });

                        }
                    } else {
                        alert("Please select doctor to share with!");
                    }
                } else {
                    alert("Please select records to share!");
                }
            };
            // Delete and share buttons hide show
            $scope.recordDelete = function () {
                jQuery('.selectrecord').css('display', 'block');
                jQuery('.btview').css('display', 'none');
                jQuery('#rec1').css('display', 'none');
                jQuery('#rec3').css('display', 'block');

            };
            $scope.recordShare = function () {
                jQuery('.selectrecord').css('display', 'block');
                jQuery('.btview').css('display', 'none');
                jQuery('#rec1').css('display', 'none');
                jQuery('#rec2').css('display', 'block');

            }
            $scope.CancelAction = function () {
                jQuery('.selectrecord').css('display', 'none');
                jQuery('.btview').css('display', 'block');
                jQuery('#rec1').css('display', 'block');
                jQuery('#rec2').css('display', 'none');
                jQuery('#rec3').css('display', 'none');
            };

            $scope.selectcheckbox = function ($event) {
                console.log($event);
                // if($event==true){
                // jQuery(this).addClass('asd123');
                // }
            };
            //Show share model
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };


            $scope.print = function () {
                //  console.log("fsfdfsfd");
                //  var printerAvail = $cordovaPrinter.isAvailable();
                var print_page = '<img src="http://stage.doctrs.in/public/frontend/uploads/attachments/7V7Lr1456500103323.jpg"  height="600" width="300" />';
                //console.log(print_page);  
                cordova.plugins.printer.print(print_page, 'alpha', function () {
                    alert('printing finished or canceled');
                });
            };
        })

        .controller('RecordDetailsCtrl', function ($scope, $http, $state, $stateParams, $timeout, $ionicModal, $rootScope, $sce) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.recordId = $stateParams.id;
            $scope.catId = $stateParams.catId;
            $scope.userId = get('id');
            $scope.shared = $stateParams.shared;
            $scope.patientId = $stateParams.patientId;
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.isNumber = function (num) {
                return angular.isNumber(num);
            }
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-record-details',
                params: {id: $stateParams.id, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.recordDetails = response.data.recordsDetails;
                $scope.category = response.data.record;
                $scope.problem = response.data.problem;
                $scope.cases = response.data.cases;
                $scope.patient = response.data.patient;
                $scope.doctors = response.data.doctrs;
                $scope.doctrs = response.data.shareDoctrs;
            }, function errorCallback(response) {
                console.log(response);
            });
            //DELETE Modal
            $scope.delete = function (id) {
                console.log($scope.category[0].category);
                $http({
                    method: 'POST',
                    url: domain + 'assistrecords/delete',
                    params: {id: id, shared: $scope.shared}
                }).then(function successCallback(response) {
                    alert("Record deleted successfully!");
                    $timeout(function () {
                        $state.go('app.records-view', {'id': $scope.category[0].category}, {}, {reload: true});
                        //$state.go('app.category-detail');
                    }, 1000);
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.docId != '') {
                    var confirm = window.confirm("Do you really want to share?");
                    if (confirm) {
                        console.log($scope.recordId);
                        $http({
                            method: 'POST',
                            url: domain + 'assistrecords/share',
                            params: {id: $scope.recordId, userId: $scope.userId, docId: $scope.docId, shared: $scope.shared}
                        }).then(function successCallback(response) {
                            console.log(response);
                            if (response.data == 'Success') {
                                alert("Records shared successfully!");
                                window.location.reload();
                            }
                        }, function errorCallback(e) {
                            console.log(e);
                        });

                    }
                } else {
                    alert("Please select doctor to share with!");
                }
            };
            //EDIT Modal
//            $scope.edit = function (id, cat) {
//                $state.go('app.edit-record', {'id': id, 'cat': cat});
//                //window.location.href = "http://192.168.2.169:8100/#/app/edit-record/" + id + "/" + cat;
//            };
            // Load the modal from the given template URL
            $ionicModal.fromTemplateUrl('filesview.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.showm = function (path, name) {
                    console.log(path + '=afd =' + name);
                    $scope.value = $rootScope.attachpath + path + name;
                    $scope.modal.show();
                }

            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };
            $scope.getMeasureDetails = function (id, type) {
                console.log(id + "===" + type);
                if (type == 'measurements') {
                    $state.go('app.view-measure-details', {id: id, type: type}, {reload: true});
                } else {
                    $state.go('app.view-cn-details', {id: id, type: type}, {reload: true});
                }
            };
            $scope.getCnDetails = function (id, type) {
                console.log(id + "===" + type);
                $state.go('app.view-cn-details', {id: id, type: type}, {reload: true});
            };
        })

        .controller('shareModalCtrl', function ($scope, $http, $state, $stateParams, $timeout, $ionicModal, $rootScope, $sce) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            //Show share model
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };
        })

        .controller('SharedwithuCtrl', function ($scope, $http, $state, $stateParams, $timeout, $ionicModal, $rootScope, $sce) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.patientId = $stateParams.id;
            $scope.shared = 1;
            $scope.userId = get('id');
            $scope.catIds = [];
            $scope.catId = [];
            $scope.docId = '';
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-patients-shared-record-category',
                params: {userId: $scope.userId, patientId: $stateParams.id, interface: $scope.interface, shared: $scope.shared}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.categories = response.data.categories;
                $scope.doctrs = response.data.doctrs;
                $scope.userRecords = response.data.recordCount;
                $scope.patient = response.data.patient;
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.getIds = function (id) {
                console.log(id);
                if ($scope.catId[id]) {
                    $scope.catIds.push(id);
                } else {
                    var index = $scope.catIds.indexOf(id);
                    $scope.catIds.splice(index, 1);
                }
                console.log($scope.catIds);
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Delete all Records by category
            $scope.delete = function () {
                if ($scope.catIds.length > 0) {
                    var confirm = window.confirm("Do you really want to delete?");
                    if (confirm) {
                        console.log($scope.catIds);
                        $http({
                            method: 'POST',
                            url: domain + 'assistrecords/delete-all',
                            params: {ids: JSON.stringify($scope.catIds), userId: $scope.userId, shared: $scope.shared}
                        }).then(function successCallback(response) {
                            alert("Records deleted successfully!");
                            $timeout(function () {
                                window.location.reload();
                                //$state.go('app.category-detail');
                            }, 1000);
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    }
                } else {
                    alert("Please select records to delete!");
                }
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.catIds.length > 0) {
                    if ($scope.docId != '') {
                        var confirm = window.confirm("Do you really want to share?");
                        if (confirm) {
                            console.log($scope.catIds);
                            $http({
                                method: 'POST',
                                url: domain + 'assistrecords/share-all',
                                params: {ids: JSON.stringify($scope.catIds), userId: $scope.userId, patientId: $scope.patientId, docId: $scope.docId, shared: $scope.shared}
                            }).then(function successCallback(response) {
                                console.log(response);
                                if (response.data == 'Success') {
                                    alert("Records shared successfully!");
                                    $timeout(function () {
                                        window.location.reload();
                                    }, 1000);
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });
                        }
                    } else {
                        alert("Please select doctor to share with!");
                    }
                } else {
                    alert("Please select records to share!");
                }
            };
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };
        })

        .controller('DoctrslistsCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.specId = $stateParams.id;
            $scope.userId = window.localStorage.getItem('id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            console.log(get('patientId'));
            if (get('patientId') != null) {
                $scope.patientId = get('patientId');
            } else {
                $scope.patientId = '';
            }
            $http({
                method: 'GET',
                url: domain + 'assistants/get-doctrs-list',
                params: {userId: $scope.userId, id: $stateParams.id, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.active = response.data.active;
                $scope.book = response.data.book;
                $scope.past = response.data.past;
                $scope.doctorslang = response.data.doctors;
                $scope.experience = response.data.experience;
                $scope.focus_area = response.data.focus_area;
                $scope.lang = response.data.languages;
                $scope.language = response.data.lang.language;
                $scope.langtext = response.data.data;
                $scope.doctors = response.data.user;
                $scope.spec = response.data.spec;
            }, function errorCallback(e) {
                console.log(e.responseText);
            });

        })

        .controller('AppDoctrslistsCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            console.log(get('patientId'));
            if (get('patientId') != null) {
                $scope.patientId = get('patientId');
            } else {
                $scope.patientId = '';
            }
            $http({
                method: 'GET',
                url: domain + 'assistants/get-app-doctrs-list',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.active = response.data.active;
                $scope.book = response.data.book;
                $scope.past = response.data.past;
                $scope.doctorslang = response.data.doctors;
                $scope.experience = response.data.experience;
                $scope.focus_area = response.data.focus_area;
                $scope.lang = response.data.languages;
                $scope.language = response.data.lang.language;
                $scope.langtext = response.data.data;
                $scope.doctors = response.data.user;
                $scope.spec = response.data.spec;
            }, function errorCallback(e) {
                console.log(e.responseText);
            });

        })

        .controller('PatientListCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading, $timeout, $filter, $state) {
            $scope.userId = get('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.curTime = new Date(); //$filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.gender = '';
            $scope.users = {};
            $http({
                method: 'GET',
                url: domain + 'assistants/get-patient-list',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.allUsers.length);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                $scope.doctrs = response.data.doctrs;
                if (response.data.allUsers.length > 0) {
                    var data = response.data.allUsers;
                    $scope.users = _.reduce(
                            data,
                            function (output, fname) {
                                var lCase = fname.fname.toUpperCase();
                                if (output[lCase[0]]) //if lCase is a key
                                    output[lCase[0]].push(fname); //Add name to its list
                                else
                                    output[lCase[0]] = [fname]; // Else add a key
                                //console.log(output);
                                return output;
                            },
                            {}
                    );
                }
            }, function errorCallback(e) {
                console.log(e);
            });
            $ionicModal.fromTemplateUrl('addp', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            $scope.savePatient = function () {
                // console.log('submit');
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addPatientForm")[0]);
                callAjax("POST", domain + "assistants/save-patient", data, function (response) {
                    jQuery("#addPatientForm")[0].reset();
                    $scope.patientadded = response.patientadded;
                    $scope.language = response.lang.language;
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert($scope.patientadded[$scope.language]);
                    window.location.reload();
                    //$state.go('app.patient-list', {}, {reload: true});
                });
            };
        })

        /* Assistants */
        .controller('AssistantsCtrl', function ($scope, $http, $state, $stateParams, $ionicModal, $rootScope) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            //console.log($scope.apkLanguage);
            $rootScope.dataitem = "";
            $rootScope.dataitem1 = "";
            $rootScope.recCId = "";
            $rootScope.measurement = "";
            $rootScope.measure = "";
            $rootScope.objText = "";
            $rootScope.diaText = "";
            $rootScope.objId = "";
            $rootScope.diaId = "";
            $rootScope.testId = "";
            if (get('id') != null) {
                $rootScope.userLogged = 1;
                window.localStorage.removeItem('patientId');
                window.localStorage.removeItem('drId');
                window.localStorage.removeItem('doctorId');
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.userId = window.localStorage.getItem('id');
                $http({
                    method: 'GET',
                    url: domain + 'get-categoty-lang',
                    params: {id: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    if (response.data.dataCat) {
                        $scope.cattext = response.data.dataCat;
                        $scope.language = response.data.lang.language;
                    } else {
                    }
                    $http({
                        method: 'GET',
                        url: domain + 'assistants/get-chat-unread-cnt',
                        params: {userId: $scope.userId}
                    }).then(function sucessCallback(response) {
                        console.log(response);
                        $scope.unreadCnt = response.data;
                    }, function errorCallback(e) {
                        console.log(e);
                    });
                }, function errorCallback(response) {
                    // console.log(response);
                });
            } else {
                $state.go('auth.walkthrough', {}, {reload: true});
            }
        })

        .controller('ChatListCtrl', function ($scope, $ionicModal, $state, $rootScope, $http) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.userId = window.localStorage.getItem('id');
            $scope.participant = [];
            $scope.msg = [];
            $scope.unreadCnt = [];
            $http({
                method: 'GET',
                url: domain + 'assistants/get-all-chats',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.active = response.data.active;
                $scope.book = response.data.book;
                $scope.past = response.data.past;
                $scope.doctorslang = response.data.doctors;
                $scope.experience = response.data.experience;
                $scope.focus_area = response.data.focus_area;
                //$scope.lang = response.data.languages;
                $scope.language = response.data.lang.language;
                $scope.langtext = response.data.data;
                $scope.doctors = response.data.user;
                $scope.spec = response.data.spec;
                $scope.chatParticipants = response.data.participants;
                $scope.dataservice = response.data.dataservice;
                angular.forEach($scope.chatParticipants, function (value, key) {
                    console.log(value.chat_id);
                    $http({
                        method: 'GET',
                        url: domain + 'assistants/get-chat-msg',
                        params: {partId: value.participant_id, chatId: value.chat_id}
                    }).then(function successCallback(responseData) {
                        console.log(responseData);
                        $scope.participant[key] = responseData.data.user;
                        $scope.msg[key] = responseData.data.msg;
                        $scope.unreadCnt[key] = responseData.data.unreadCnt;
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
            }, function errorCallback(e) {
                console.log(e);
            });
            $ionicModal.fromTemplateUrl('doctorlist', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.tochat = function (drId) {
                console.log(drId);
                $scope.drId = drId;
                $scope.modal.hide();
                $http({
                    method: 'GET',
                    url: domain + 'assistants/start-new-chat',
                    params: {userId: $scope.userId, interface: $scope.interface, doctorId: $scope.drId}
                }).then(function successCallback(response) {
                    console.log(response.data)
                    $state.go('app.drchat', {id: response.data.id}, {reload: true});
                }, function errorCallback(e) {
                    console.log(e);
                });
                //$state.go('app.drchat', {id: drId}, {reload: true});
            };
        })

        .controller('DrChatCtrl', function ($scope, $http, $rootScope, $filter, $stateParams, $timeout) {
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            if (session) {
                session.disconnect();
            }
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = window.localStorage.getItem('id');
            $scope.drId = $stateParams.id;
            $scope.chatId = $stateParams.id;
            window.localStorage.setItem('chatId', $stateParams.id);
            $scope.partId = window.localStorage.getItem('id');
            $scope.msg = '';
            var apiKey = '45121182';
            //console.log($scope.chatId);
            $http({
                method: 'GET',
                url: domain + 'assistants/get-chat-token',
                params: {chatId: $scope.chatId, userId: $scope.partId, interface: $scope.interface}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.user = response.data.user;
                $scope.otherUser = response.data.otherUser;
                $scope.chatMsgs = response.data.chatMsgs;
                console.log($scope.chatMsgs);
                $scope.token = response.data.token;
                $scope.otherToken = response.data.otherToken;
                $scope.sessionId = response.data.chatSession;
                $scope.chat = response.data.chat;
                $scope.language = response.data.lang.language;
                window.localStorage.setItem('Toid', $scope.otherUser.id);
                //$scope.connect("'" + $scope.token + "'");
                $scope.apiKey = apiKey;
                session = OT.initSession($scope.apiKey, $scope.sessionId);
                $scope.session = session;
                var chatWidget = new OTSolution.TextChat.ChatWidget({session: $scope.session, container: '#chat'});
                console.log(chatWidget);
                session.connect($scope.token, function (err) {
                    if (!err) {
                        console.log("Connection success");
                    } else {
                        console.error(err);
                    }
                });

            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.returnjs = function () {
                jQuery(function () {
                    var wh = jQuery('window').height();
                    jQuery('#chat').css('height', wh);
                    //	console.log(wh);
                })
            };
            $scope.returnjs();
            $scope.iframeHeight = $(window).height() - 42;
            $('#chat').css('height', $scope.iframeHeight);
//Previous Chat 
            $scope.appendprevious = function () {
                $(function () {
                    angular.forEach($scope.chatMsgs, function (value, key) {
                        //console.log(value);
                        var msgTime = $filter('date')(new Date(value.tstamp), 'hh:mm a');
                        if (value.sender_id == $scope.partId) {
                            $('#chat .ot-textchat .ot-bubbles').append('<section class="ot-bubble mine" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        } else {
                            $('#chat .ot-textchat .ot-bubbles').append('<section class="ot-bubble" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        }
                    });
                })
            };

            $scope.movebottom = function () {
                jQuery(function () {
                    var dh = $('.ot-bubbles').height();
                    $('.chatscroll').scrollTop(dh);
                    //	console.log(wh);

                })
            };

            $timeout(function () {
                $scope.appendprevious();
                $scope.movebottom();
            }, 1000);
        })

        .controller('newDoctorChatCtrl', function ($scope) {})

        .controller('ConsultationsListCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.dnlink = function ($nurl) {
                $state.go($nurl);
            };
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.imgpath = domain;
            $scope.specializations = [];
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'assistants/get-doctrs-spec',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                $ionicLoading.hide();
                console.log(response.data);
                $scope.specializations = response.data.spec;
                $scope.language = response.data.lang.language;
                $scope.langtext = response.data.langText;
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('DoctorConsultationsCtrl', function ($scope, $http, $stateParams, $filter, $ionicPopup, $timeout, $ionicHistory, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.drId = $stateParams.id;
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-dr-app',
                params: {drId: $scope.drId, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.language = response.data.lang.language;
                $scope.tabmenu = response.data.tabmenu;
                //
                $scope.todays_app = response.data.todays_appointments;
                $scope.todays_usersData = response.data.todays_usersData;
                $scope.todays_products = response.data.todays_products;
                $scope.todays_time = response.data.todays_time;
                $scope.todays_end_time = response.data.todays_end_time;
                $scope.todays_note = response.data.todays_note;
                $scope.todays_medicine = response.data.todays_medicine;
                //past section
                $scope.todays_app_past = response.data.todays_appointments_past;
                $scope.todays_usersData_past = response.data.todays_usersData_past;
                $scope.todays_products_past = response.data.todays_products_past;
                $scope.todays_time_past = response.data.todays_time_past;
                $scope.todays_end_time_past = response.data.todays_end_time_past;
                $scope.todays_note_past = response.data.todays_note_past;
                $scope.todays_medicine_past = response.data.todays_medicine_past;
                // end past section //
                $scope.week_app = response.data.week_appointments;
                $scope.week_usersData = response.data.week_usersData;
                $scope.week_products = response.data.week_products;
                $scope.week_time = response.data.week_time;
                $scope.week_end_time = response.data.week_end_time;
                $scope.week_note = response.data.week_note;
                $scope.week_medicine = response.data.week_medicine;
                //past section 
                $scope.week_app_past = response.data.week_appointments_past;
                $scope.week_usersData_past = response.data.week_usersData_past;
                $scope.week_products_past = response.data.week_products_past;
                $scope.week_time_past = response.data.week_time_past;
                $scope.week_end_time_past = response.data.week_end_time_past;
                $scope.week_medicine_past = response.data.week_note_past;
                $scope.week_note_past = response.data.week_medicine_past;
                //end past section
                $scope.all_app = response.data.all_appointments;
                $scope.all_usersData = response.data.all_usersData;
                $scope.all_products = response.data.all_products;
                $scope.all_time = response.data.all_time;
                $scope.all_end_time = response.data.all_end_time;
                $scope.all_note = response.data.all_note;
                $scope.all_medicine = response.data.all_medicine;
                //past section //
                $scope.all_app_past = response.data.all_appointments_past;
                $scope.all_usersData_past = response.data.all_usersData_past;
                $scope.all_products_past = response.data.all_products_past;
                $scope.all_time_past = response.data.all_time_past;
                $scope.all_end_time_past = response.data.all_end_time_past;
                $scope.all_note_past = response.data.all_note_past;
                $scope.all_medicine_past = response.data.all_medicine_past;
                //end past section//
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.cancelAppointment = function (appId, drId, mode, startTime, pid) {
                $scope.appId = appId;
                $scope.userId = get('id');
                $scope.drId = drId;
                $scope.pid = pid;
                $scope.cancel = '';
                console.log(startTime);
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(curtime);
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff);
                if (timeDiff < 15) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    } else {
                        //ask 4 options
                        /*$http({
                         method: 'GET',
                         url: domain + 'appointment/cancel-app',
                         params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, drId: $scope.drId}
                         }).then(function successCallback(response) {
                         console.log(response.data);
                         if (response.data == 'success') {
                         alert('Your appointment is cancelled successfully.');
                         } else {
                         alert('Sorry your appointment is not cancelled.');
                         }
                         $state.go('app.consultations-list');
                         }, function errorCallback(response) {
                         console.log(response);
                         });*/
                    }
                } else {
                    if (mode == 1) {
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/cancel-app',
                            params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, drId: $scope.drId, pid: $scope.pid}
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            if (response.data == 'success') {
                                alert('Your appointment is cancelled successfully.');
                                $state.go('app.doctor-consultations', {}, {reload: true});
                            } else {
                                alert('Sorry your appointment is not cancelled.');
                            }
                            //$state.go('app.consultations-list', {}, {reload: true});
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    } else if (mode == 3 || mode == 4) {
                        //ask for 2 options
                    }
                }
            };
            $scope.joinVideo = function (mode, start, end, appId, drId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId + "===" + drId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    window.localStorage.setItem("drId", drId);
                    $state.go('app.doctor-join', {'id': appId}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
            //Go to consultation add page
            $scope.addCnote = function (appId, from) {
                //alert(appId);
                store({'appId': appId});
                if (from == 'app')
                    store({'from': 'app.doctor-consultations'});
                else if (from == 'past')
                    store({'from': 'app.consultation-past'});
                $state.go("app.consultations-note", {'appId': appId}, {reload: true});
            };
            //Go to consultation view page
            $scope.viewNote = function (noteId) {
                //alert(noteId);
                store({'noteId': noteId});
                $state.go("app.view-note", {'id': noteId}, {reload: true});
            };
            $scope.viewMedicine = function (consultationId) {
                //alert(noteId);
                // store({'noteId': noteId});
                $state.go("app.view-medicine", {'id': consultationId}, {reload: true});
            };

            //Go to disbursement add page
            $scope.appointMedicine = function (mid, appid, from) {
                $scope.mid = parseInt(mid);
                $scope.appointmentId = appid;
                $scope.interface = window.localStorage.getItem('interface_id');
                if (from == 'cur')
                    store({'from': 'app.doctor-consultations'});
                else if (from == 'past')
                    store({'from': 'app.consultation-past'});
                $state.go('app.disbursement', {'mid': $scope.mid, 'appid': $scope.appointmentId}, {reload: true});
            };
            //Go to disbursement view page
        })

        .controller('DoctorConsultationsActiveCtrl', function ($scope, $http, $stateParams, $filter, $ionicPopup, $ionicModal, $timeout, $ionicHistory, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.drId = '';
            $scope.patientId = '';
            $scope.can = {};
            $scope.drId = $stateParams.id;
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-dr-active-app',
                params: {drId: $scope.drId, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.language = response.data.lang.language;
                $scope.tabmenu = response.data.tabmenu;
                //
                $scope.todays_app = response.data.todays_appointments;
                $scope.todays_usersData = response.data.todays_usersData;
                $scope.todays_products = response.data.todays_products;
                $scope.todays_time = response.data.todays_time;
                $scope.todays_end_time = response.data.todays_end_time;
                $scope.todays_note = response.data.todays_note;
                $scope.todays_medicine = response.data.todays_medicine;
                //past section

                // end past section //
                $scope.week_app = response.data.week_appointments;
                $scope.week_usersData = response.data.week_usersData;
                $scope.week_products = response.data.week_products;
                $scope.week_time = response.data.week_time;
                $scope.week_end_time = response.data.week_end_time;
                $scope.week_note = response.data.week_note;
                $scope.week_medicine = response.data.week_medicine;
                //past section 

                //end past section
                $scope.all_app = response.data.all_appointments;
                $scope.all_usersData = response.data.all_usersData;
                $scope.all_products = response.data.all_products;
                $scope.all_time = response.data.all_time;
                $scope.all_end_time = response.data.all_end_time;
                $scope.all_note = response.data.all_note;
                $scope.all_medicine = response.data.all_medicine;
                //past section //

                $scope.timeLimit = response.data.timelimit.cancellation_time;
                //end past section//
            }, function errorCallback(e) {
                console.log(e);
            });
            $ionicModal.fromTemplateUrl('cancelby', {
                scope: $scope
            }).then(function (modal) {
                $scope.cancelby = modal;
            });
            $scope.closeCancelby = function () {
                $scope.cancelby.hide();
            };

            $scope.cancelAppointment = function (appId, drId, mode, startTime, patientId) {
                console.log(appId + "==" + drId + "==" + mode + "==" + startTime + "==" + patientId);
                $scope.appId = appId;
                $scope.userId = get('id');
                $scope.cancel = '';
                $scope.drId = drId;
                $scope.patientId = patientId;
                console.log(startTime);
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(curtime);
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff + " Time limit==" + $scope.timeLimit);
                if (timeDiff < $scope.timeLimit) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    }
                } else {
                    $scope.cancelby.show()
                }
            };
            $scope.submitCancel = function () {
                $scope.cancelby.hide();
                //alert("Video cancel");
                $http({
                    method: 'GET',
                    url: domain + 'assistapp/cancel-app',
                    params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, cancel: $scope.can.opt, drId: $scope.drId, patientId: $scope.patientId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data == 'success') {
                        alert('Your appointment is cancelled successfully.');
                        window.location.reload();
                    } else {
                        alert('Sorry your appointment is not cancelled.');
                    }
                    //$state.go('app.appointment-list', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
            $scope.joinVideo = function (mode, start, end, appId, drId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId + "===" + drId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    window.localStorage.setItem("drId", drId);
                    $state.go('app.doctor-join', {'id': appId}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
            //Go to consultation add page
            $scope.addCnote = function (appId, from) {
                //alert(appId);
                store({'appId': appId});
                if (from == 'app')
                    store({'from': 'app.doctor-consultations'});
                else if (from == 'past')
                    store({'from': 'app.consultation-past'});
                $state.go("app.consultations-note", {'appId': appId}, {reload: true});
            };
            //Go to consultation view page
            $scope.viewNote = function (noteId) {
                //alert(noteId);
                store({'noteId': noteId});
                $state.go("app.view-note", {'id': noteId}, {reload: true});
            };
            $scope.viewMedicine = function (consultationId) {
                //alert(noteId);
                // store({'noteId': noteId});
                $state.go("app.view-medicine", {'id': consultationId}, {reload: true});
            };

            //Go to disbursement add page
            $scope.appointMedicine = function (mid, appid, from) {
                $scope.mid = parseInt(mid);
                $scope.appointmentId = appid;
                $scope.interface = window.localStorage.getItem('interface_id');
                if (from == 'cur')
                    store({'from': 'app.doctor-consultations'});
                else if (from == 'past')
                    store({'from': 'app.consultation-past'});
                $state.go('app.disbursement', {'mid': $scope.mid, 'appid': $scope.appointmentId}, {reload: true});
            };
            //Go to disbursement view page
        })

        .controller('DoctorConsultationsPastCtrl', function ($scope, $http, $stateParams, $filter, $ionicPopup, $timeout, $ionicHistory, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.drId = $stateParams.id;
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-dr-past-app',
                params: {drId: $scope.drId, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.language = response.data.lang.language;
                $scope.tabmenu = response.data.tabmenu;

                //past section
                $scope.todays_app_past = response.data.todays_appointments_past;
                $scope.todays_usersData_past = response.data.todays_usersData_past;
                $scope.todays_products_past = response.data.todays_products_past;
                $scope.todays_time_past = response.data.todays_time_past;
                $scope.todays_end_time_past = response.data.todays_end_time_past;
                $scope.todays_note_past = response.data.todays_note_past;
                $scope.todays_medicine_past = response.data.todays_medicine_past;
                // end past section //

                //past section 
                $scope.week_app_past = response.data.week_appointments_past;
                $scope.week_usersData_past = response.data.week_usersData_past;
                $scope.week_products_past = response.data.week_products_past;
                $scope.week_time_past = response.data.week_time_past;
                $scope.week_end_time_past = response.data.week_end_time_past;
                $scope.week_medicine_past = response.data.week_note_past;
                $scope.week_note_past = response.data.week_medicine_past;
                //end past section

                //past section //
                $scope.all_app_past = response.data.all_appointments_past;
                $scope.all_usersData_past = response.data.all_usersData_past;
                $scope.all_products_past = response.data.all_products_past;
                $scope.all_time_past = response.data.all_time_past;
                $scope.all_end_time_past = response.data.all_end_time_past;
                $scope.all_note_past = response.data.all_note_past;
                $scope.all_medicine_past = response.data.all_medicine_past;
                //end past section//
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.addCnote = function (appId, from) {
                //alert(appId);
                store({'appId': appId});
                if (from == 'app')
                    store({'from': 'app.doctor-consultations'});
                else if (from == 'past')
                    store({'from': 'app.consultation-past'});
                $state.go("app.consultations-note", {'appId': appId}, {reload: true});
            };
            //Go to consultation view page
            $scope.viewNote = function (noteId) {
                //alert(noteId);
                store({'noteId': noteId});
                $state.go("app.view-note", {'id': noteId}, {reload: true});
            };
            $scope.viewMedicine = function (consultationId) {
                //alert(noteId);
                // store({'noteId': noteId});
                $state.go("app.view-medicine", {'id': consultationId}, {reload: true});
            };

            //Go to disbursement add page
            $scope.appointMedicine = function (mid, appid, from) {
                $scope.mid = parseInt(mid);
                $scope.appointmentId = appid;
                $scope.interface = window.localStorage.getItem('interface_id');
                if (from == 'cur')
                    store({'from': 'app.doctor-consultations'});
                else if (from == 'past')
                    store({'from': 'app.consultation-past'});
                $state.go('app.disbursement', {'mid': $scope.mid, 'appid': $scope.appointmentId}, {reload: true});
            };

            //Go to disbursement view page
        })

        .controller('AssPatientListCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading, $filter, $state, $timeout) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.drId = $stateParams.id;
            $scope.curTime = new Date(); //$filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.gender = '';
            $scope.users = {};
            $http({
                method: 'GET',
                url: domain + 'assistants/get-drs-patients',
                params: {userId: $scope.userId, drId: $scope.drId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.allUsers.length);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                if (response.data.allUsers.length > 0) {
                    var data = response.data.allUsers;
//                    var patient_list = response.data.patient_list;
//                    var add = response.data.add;
//                    var language = response.lang.language;
                    $scope.users = _.reduce(
                            data,
                            function (output, fname) {
                                var lCase = fname.fname.toUpperCase();
                                if (output[lCase[0]]) //if lCase is a key
                                    output[lCase[0]].push(fname); //Add name to its list
                                else
                                    output[lCase[0]] = [fname]; // Else add a key
                                return output;
                            },
                            {}
                    );
                }
            }, function errorCallback(e) {
                console.log(e);
            });

            $ionicModal.fromTemplateUrl('assaddp', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            //Save Patient
            $scope.savePatient = function () {
                console.log('submit');
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addPatientForm")[0]);
                console.log(data);
                callAjax("POST", domain + "assistants/save-patient", data, function (response) {
                    jQuery("#addPatientForm")[0].reset();
                    $scope.patientadded = response.patientadded;
                    $scope.language = response.lang.language;
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert($scope.patientadded[$scope.language]);
                    window.location.reload();
                    //$state.go('app.ass-patient-list', {'id': $scope.drId}, {reload: true});
                });
            };
        })

        .controller('AssPatientCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter, $ionicLoading, $state, $timeout) {
            $scope.vSch = [];
            $scope.schV = [];
            $scope.schdate = [];
            $scope.nextdate = [];
            $scope.cSch = [];
            $scope.schC = [];
            $scope.schCdate = [];
            $scope.nextCdate = [];
            $scope.hSch = [];
            $scope.schH = [];
            $scope.schHdate = [];
            $scope.nextHdate = [];
            $scope.bookingSlot = '';
            $scope.supId = '';
            $scope.patientId = $stateParams.id;
            $scope.drId = $stateParams.drId;
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            window.localStorage.setItem('patientId', $scope.patientId);
            window.localStorage.setItem('drId', $scope.drId);
            console.log($scope.drId + "--" + $scope.patientId);
            $scope.interface = window.localStorage.getItem('interface_id');
            $http({
                method: 'GET',
                url: domain + 'assistants/get-dr-details',
                params: {id: $scope.drId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.doctor = response.data.user;
                $scope.language = response.data.lang.language;
                $scope.videoProd = response.data.video_product;
                $scope.instVideo = response.data.inst_video;
                $scope.videoInc = response.data.video_inclusions;
                $scope.videoSch = response.data.videoSch;
                $scope.chatProd = response.data.chat_product;
                $scope.chatInc = response.data.chat_inclusions;
                $scope.homeProd = response.data.home_product;
                $scope.homeInc = response.data.home_inclusions;
                $scope.homeSch = response.data.homeSch;
                $scope.clinicProd = response.data.clinic_product;
                $scope.clinicInc = response.data.clinic_inclusions;
                $scope.clinicSch = response.data.clinicSch;
                $scope.chatProd = response.data.chat_product;
                $scope.chatInc = response.data.chat_inclusions;
                $scope.packages = response.data.packages;
                $scope.services = response.data.services;
                $scope.instant_video = response.data.instant_video;
                $scope.earliest_slot = response.data.earliest_slot;
                $scope.next_slot = response.data.next_slot;
                $scope.scheduled_video = response.data.scheduled_video;
                $scope.procced = response.data.procced;
                $scope.pleaseselectslot = response.data.pleaseselectslot;
                //console.log($scope.instVideo.length);
                //console.log("prodId " + $scope.instVideo + "popopo");
                //$ionicLoading.hide();
                angular.forEach($scope.videoSch, function (value, key) {
                    var supsassId = value.supersaas_id;
                    //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    //console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.vSch[key] = responseData.data.slots;
                        $scope.schV[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = tomorrow;
                        } else {
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
                angular.forEach($scope.clinicSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.cSch[key] = responseData.data.slots;
                        $scope.schC[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schCdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = tomorrow;
                        } else {
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                angular.forEach($scope.homeSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.hSch[key] = responseData.data.slots;
                        $scope.schH[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schHdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = tomorrow;
                        } else {
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
            });
            $scope.getNextSlots = function (nextDate, supsassId, key, serv) {
                console.log(nextDate + '=======' + supsassId + '=====' + key);
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd') + '+05:30:00';  // HH:mm:ss
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    cache: false,
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    $ionicLoading.hide();
                    if (responseData.data.lastdate == '')
                    {
                        if (serv == 1) {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date();
                            $scope.nextdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 3) {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date();
                            $scope.nextCdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 4) {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date();
                            $scope.nextHdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        }

                    } else {
                        if (serv == 1) {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 3) {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 4) {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.getFirstSlots = function (supsassId, key, serv) {
                //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                }).then(function successCallback(responseData) {
                    $ionicLoading.hide();
                    if (serv == 1) {
                        if (responseData.data.slots == '') {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    } else if (serv == 3) {
                        if (responseData.data.slots == '') {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    } else if (serv == 4) {
                        if (responseData.data.slots == '') {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.bookSlot = function (starttime, endtime, supid) {
                $scope.bookingStart = starttime;
                $scope.bookingEnd = endtime;
                $scope.supId = supid;
            };
            $scope.doit = function () {
                console.log("removeitem");
                window.localStorage.removeItem('startSlot');
                window.localStorage.removeItem('endSlot');
            };
            $scope.doesit = function () {
                console.log("removeitem iv");
                window.localStorage.removeItem('IVstartSlot');
                window.localStorage.removeItem('IVendSlot');
                window.localStorage.removeItem('instantV');
            };
            $scope.checkAvailability = function (uid, prodId) {
                console.log("prodId " + prodId);
                console.log("uid " + uid);
                $scope.interface = window.localStorage.getItem('interface_id');
                $rootScope.$broadcast('loading:hide');
                $ionicLoading.show();
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-doctor-availability',
                    params: {id: uid, interface: $scope.interface}
                }).then(function successCallback(responseData) {

                    console.log(responseData.data);
                    if (responseData) {
                        $scope.check_availability = responseData.data.check_availability
                        $scope.language = responseData.data.lang.language;
                        $scope.confirmation = responseData.data.confirmation
                        $state.go('app.checkavailable', {'data': prodId, 'uid': uid});
                    } else {
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                    }
                });
            };
            $scope.bookAppointment = function (prodId, serv) {
                // $scope.pleaseselectslot = response.data.pleaseselectslot;
                console.log($scope.bookingStart);
                if (window.localStorage.getItem('instantV') == 'instantV') {
                    $scope.startSlot = window.localStorage.getItem('IVstartSlot');
                    $scope.endSlot = window.localStorage.getItem('IVendSlot');
                } else {
                    $scope.startSlot = window.localStorage.getItem('startSlot');
                    $scope.endSlot = window.localStorage.getItem('endSlot');
                }
                if ($scope.bookingStart) {
                    window.localStorage.setItem('supid', $scope.supId);
                    window.localStorage.setItem('startSlot', $scope.bookingStart);
                    window.localStorage.setItem('endSlot', $scope.bookingEnd);
                    window.localStorage.setItem('prodId', prodId);
                    window.localStorage.setItem('mode', serv);
                    $rootScope.supid = $scope.supId;
                    $rootScope.startSlot = $scope.bookingStart;
                    $rootScope.endSlot = $scope.bookingEnd;
                    $rootScope.prodid = prodId;
                    $rootScope.url = 'app.payment';
                    $rootScope.$digest;
                    console.log($scope.patientId + "===" + $scope.drId);
                    if (serv == 1) {
                        if (checkLogin())
                        {
                            $ionicLoading.show({template: 'Loading...'});
                            $state.go('app.payment');
                        } else {
                            $ionicLoading.show({template: 'Loading...'});
                            $state.go('auth.login');
                        }
                    } else if (serv == 3 || serv == 4) {
                        if (checkLogin())
                        {
                            $ionicLoading.show({template: 'Loading...'});
                            $state.go('app.payment');
                        } else {
                            $ionicLoading.show({template: 'Loading...'});
                            $state.go('auth.login');
                        }
                    }
                } else {
                    alert($scope.pleaseselectslot[$scope.language]);
                }
            };
        })

        .controller('CheckavailableCtrl', function ($scope, $rootScope, $ionicLoading, $state, $http, $stateParams, $timeout, $ionicModal, $ionicPopup) {
            $scope.data = $stateParams.data;
            $scope.uid = $stateParams.uid;
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'kookoo/check-doctor-availability',
                params: {id: $scope.uid, interface: $scope.interface}
            }).then(function successCallback(responseData) {
                $scope.check_availability = responseData.data.check_availability
                $scope.instant_video = responseData.data.instant_video
                $scope.language = responseData.data.lang.language;
                $scope.confirmation = responseData.data.confirmation
            });
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.drId = window.localStorage.getItem('drId');
            console.log($scope.drId + "--" + $scope.patientId);
            /* patient confirm */
            $scope.showConfirm = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $scope.confirmation[$scope.language],
                    template: '<p align="center"><strong>Doctor is Available</strong></p><div>The specialist has accepted your request for an instant video call. Do you want to continue?</div>'
                });
                confirmPopup.then(function (res) {
                    if (res != true) {
                        $scope.kookooID = window.localStorage.getItem('kookooid');
                        $scope.prodid = window.localStorage.getItem('prodId');
                        $http({
                            method: 'GET',
                            url: domain + 'kookoo/reject-by-patient',
                            params: {kookooid: $scope.kookooID}
                        }).then(function successCallback(patientresponse) {
                            console.log(patientresponse.data);
                            console.log($scope.drId + "--" + $scope.patientId);
                            window.localStorage.removeItem('kookooid');
                            //$state.go('app.doctrslist', {}, {reload: true});
                            $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                        }, function errorCallback(patientresponse) {
                            //  alert('Oops something went wrong!');
                        });
                    } else {
                        $http({
                            method: 'GET',
                            url: domain + 'kookoo/accept-by-patient',
                            params: {kookooid: $scope.kookooID}
                        }).then(function successCallback(patientresponse) {
                            console.log(patientresponse.data);
                            if (patientresponse.data == '1') {
                                console.log($scope.drId + "--" + $scope.patientId);
                                $state.go('app.payment');
                            }
                        }, function errorCallback(patientresponse) {
                            //  alert('Oops something went wrong!');
                        });
                    }
                });
            };
            /*timer */
            $scope.IsVisible = false;
            $scope.counter = 60;
            var stopped;
            $scope.countdown = function (dataId, uid) {
                window.localStorage.setItem('prodId', $scope.data);
                window.localStorage.setItem('instantV', 'instantV');
                window.localStorage.setItem('mode', 1);
                //alert(dataId);
                $scope.kookooID = window.localStorage.getItem('kookooid');
                var myListener = $rootScope.$on('loading:show', function (event, data) {
                    $ionicLoading.hide();
                });
                $scope.$on('$destroy', myListener);
                var myListenern = $rootScope.$on('loading:hide', function (event, data) {
                    $ionicLoading.hide();
                });
                $scope.$on('$destroy', myListenern);
                $scope.$on('$destroy', function () {
                    $scope.checkavailval = 0;
                    console.log("jhffffhjfhj" + $scope.checkavailval);
                    $timeout.cancel(stopped);
                    window.localStorage.removeItem('kookooid');

                });
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-kookoo-value',
                    params: {kookooId: $scope.kookooID}
                }).then(function successCallback(responsekookoo) {
                    console.log(responsekookoo.data);
                    $scope.checkavailval = responsekookoo.data;
                    if ($scope.checkavailval == 1)
                    {
                        $timeout.cancel(stopped);
                        $scope.showConfirm();
                        // $state.go('app.payment');
                    } else if ($scope.checkavailval == 2)
                    {
                        $timeout.cancel(stopped);
                        window.localStorage.removeItem('kookooid');
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        $state.go('app.doctrslist', {}, {reload: true});
                        //$state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                    }
                }, function errorCallback(responsekookoo) {
                    if (responsekookoo.data == 0)
                    {
                        alert('No doctrs available');
                        $state.go('app.doctrslist', {}, {reload: true});
                        //$state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                    }
                });
                $scope.IsVisible = true;
                stopped = $timeout(function () {
                    // console.log($scope.counter);
                    $scope.counter--;
                    $scope.countdown();
                }, 1000);
                if ($scope.counter == 59) {
                    $scope.kookooID = window.localStorage.getItem('kookooid');
                    var myListener = $rootScope.$on('loading:show', function (event, data) {
                        $ionicLoading.hide();
                    });
                    $scope.$on('$destroy', myListener);
                    var myListenern = $rootScope.$on('loading:hide', function (event, data) {
                        $ionicLoading.hide();
                    });
                    $scope.$on('$destroy', myListenern);
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/check-doctrs-response',
                        params: {uid: $scope.uid, pid: window.localStorage.getItem('id')}
                    }).then(function successCallback(response) {
                        //console.log(response);
                        console.log($scope.patientId + "--@@@@@--" + $scope.drId);

                        if (response.data == '0')
                        {
                            $timeout.cancel(stopped);
                            alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                            $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                            //$state.go('app.doctrslist', {}, {reload: true});
                        } else {
                            window.localStorage.setItem('kookooid', response.data);
                            window.localStorage.setItem('kookooid1', response.data);
                        }

                    }, function errorCallback(response) {
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        $state.go('app.doctrslist', {}, {reload: true});
                    });
                }
                if ($scope.counter == 0) {
                    $scope.IsVisible = false;
                    // $scope.showConfirm();
                    $timeout.cancel(stopped);
                    alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                    $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                }
            };
            $scope.hidediv = function () {
                $scope.IsVisible = false;
                $timeout.cancel(stopped);
                $scope.prodid = window.localStorage.getItem('prodId');
                $scope.kookooID = window.localStorage.getItem('kookooid');
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/cancel-by-patient',
                    params: {kookooid: $scope.kookooID}
                }).then(function successCallback(patientresponse) {
                    //console.log(patientresponse.data);
                    //console.log('Patient Id' + $scope.patientId + 'Doctr Id = ' + $scope.drId);
                    //$timeout.cancel(stopped);
                    if (patientresponse.data) {
                        window.localStorage.removeItem('kookooid');
                        //$state.go('app.doctrslist', {}, {reload: true});
                        $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                    }
                }, function errorCallback(patientresponse) {
                    console.log(e);
                    $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                });
            };
        })

        .controller('PaymentCtrl', function ($scope, $http, $state, $filter, $location, $stateParams, $rootScope, $ionicLoading, $ionicGesture, $timeout, $ionicHistory) {
            $scope.counter1 = 300;
            var stopped1;
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.drId = window.localStorage.getItem('drId');
            $scope.userId = get('id');
            $scope.prodid = window.localStorage.getItem('prodId');
            console.log($scope.patientId + "--" + $scope.drId);
            $scope.paynowcountdown = function () {
                stopped1 = $timeout(function () {
                    console.log($scope.counter1);
                    $scope.counter1--;
                    $scope.paynowcountdown();
                }, 1000);
                if ($scope.counter1 == 0) {
                    //console.log('fadsf af daf');
                    $timeout.cancel(stopped1);
                    $scope.kookooID = window.localStorage.getItem('kookooid1');
                    $scope.prodid = window.localStorage.getItem('prodId');
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/payment-time-expired',
                        params: {kookooid: $scope.kookooID}

                    }).then(function successCallback(responseData) {
                        alert('Sorry, Your payment time expired');
                        window.localStorage.removeItem('kookooid');
                        window.localStorage.removeItem('kookooid1');
                        $timeout(function () {
                            // $state.go('app.consultation-profile', {'id':$scope.product[0].user_id}, {reload: true});
                            $state.go('app.consultations-list', {reload: true});
                        }, 3000);
                    }, function errorCallback(response) {
                        $state.go('app.consultations-list', {reload: true});
                    });
                }
            };
            $timeout(function () {
                $scope.paynowcountdown();
            }, 0);
            $scope.mode = window.localStorage.getItem('mode');
            $scope.supid = window.localStorage.getItem('supid');
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $scope.prodid = window.localStorage.getItem('prodId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'assistants/get-order-details',
                params: {id: $scope.supid, prodId: $scope.prodid, interface: $scope.interface, patientId: $scope.patientId}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                $ionicLoading.show({template: 'Loading...'});
                //$ionicLoading.hide();
                $scope.patient = responseData.data.patient;
                $scope.payment = responseData.data.payment;
                $scope.confirm = responseData.data.confirm;
                $scope.confirm_appointment = responseData.data.confirm_appointment;
                $scope.language = responseData.data.lang.language;
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
                $scope.IVstartSlot = responseData.data.IVstart;
                $scope.IVendSlot = responseData.data.IVend;
                if (window.localStorage.getItem('instantV') == 'instantV') {
                    window.localStorage.setItem('IVstartSlot', $scope.IVstartSlot);
                    window.localStorage.setItem('IVendSlot', $scope.IVendSlot);
                }
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.bookNow = function () {
                $ionicLoading.show({template: 'Loading...'});
                if (window.localStorage.getItem('instantV') == 'instantV') {
                    $scope.startSlot = window.localStorage.getItem('IVstartSlot');
                    $scope.endSlot = window.localStorage.getItem('IVendSlot');
                } else {
                    $scope.startSlot = window.localStorage.getItem('startSlot');
                    $scope.endSlot = window.localStorage.getItem('endSlot');
                }
                $scope.kookooID = window.localStorage.getItem('kookooid');
                $scope.kookooID = window.localStorage.getItem('kookooid1');
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $http({
                    method: 'GET',
                    url: domain + 'assistants/book-appointment',
                    params: {prodId: $scope.prodid, kookooID: $scope.kookooID, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot, patientId: $scope.patientId}
                }).then(function successCallback(response) {
                    //console.log(response.data);
                    $ionicLoading.hide();
                    $timeout.cancel(stopped1);
                    if (response.data == 'success')
                    {
                        $state.go('app.thankyou', {'data': response.data});
                    } else {

                        alert('Appointment is not booked due to some issues!');
                        $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('ThankyouCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.data);
            $scope.id = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'assistants/thankyou-lang',
                params: {id: $scope.id, interface: $scope.interface}
            }).then(function successCallback(response) {
                //console.log(response.data);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.data = $stateParams.data;

            $scope.gotohome = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                if (window.localStorage.getItem('instantV') != null) {
                    window.localStorage.removeItem('kookooid');
                    window.localStorage.removeItem('IVendSlot');
                    window.localStorage.removeItem('IVstartSlot');
                }
                window.localStorage.removeItem('instantV');
                window.localStorage.removeItem('startSlot');
                window.localStorage.removeItem('endSlot');
                window.localStorage.removeItem('kookooid');
                window.localStorage.removeItem('kookooid1');
                window.localStorage.removeItem('prodId');
                window.localStorage.removeItem('patientId');
                window.localStorage.removeItem('drId');
                window.localStorage.removeItem('supid');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $state.go('app.appointment-list', {}, {reload: true});
            }
        })

        .controller('AssInwardCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'inventory/inventory-inward',
                params: {interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.item_name);
                //console.log($filter('date')(new Date(response.data.disbursement.disburse_on), 'Y M d hh:mm a'));
                $scope.inward = response.data.inward;
                $scope.item_name = response.data.item_name;
                $scope.qty_disburse = response.data.qty_disburse;
                $scope.disburse_unit = response.data.disburse_unit;

            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('AssOutgoCtrl', function ($scope, $state, $filter, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.categoryId = $stateParams.categoryId;
            $http({
                method: 'GET',
                url: domain + 'inventory/inventory-outgo',
                params: {interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.disbursement.disburse_on);
                console.log($filter('date')(new Date(response.data.disbursement.disburse_on), 'Y M d hh:mm a'));
                $scope.disbursement = response.data.disbursement;
                $scope.item_name = response.data.item_name;
                $scope.qty_disburse = response.data.qty_disburse;
                $scope.disburse_unit = response.data.disburse_unit;
                $scope.patient_id = response.data.patient_id;
                $scope.doctor_id = response.data.doctor_id;
            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('AppointmentListCtrl', function ($scope, $http, $stateParams, $ionicModal, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-app',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                //end past section
                $scope.all_data = response.data.all_data;
                $scope.all_app = response.data.all_appointments;
                $scope.all_usersData = response.data.all_usersData;
                $scope.all_doctor = response.data.all_doctor;
                $scope.all_products = response.data.all_products;
                $scope.all_time = response.data.all_time;
                $scope.all_end_time = response.data.all_end_time;
                $scope.all_note = response.data.all_note;
                $scope.all_medicine = response.data.all_medicine;

                //past section //
                $scope.all_data_past = response.data.all_data_past;
                $scope.all_app_past = response.data.all_appointments_past;
                $scope.all_doctor_past = response.data.all_doctor_past;
                $scope.all_usersData_past = response.data.all_usersData_past;
                $scope.all_products_past = response.data.all_products_past;
                $scope.all_time_past = response.data.all_time_past;
                $scope.all_end_time_past = response.data.all_end_time_past;
                $scope.all_note_past = response.data.all_note_past;
                $scope.all_medicine_past = response.data.all_medicine_past;
                //end past section//
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.searchFilter = function (obj) {
                var re = new RegExp($scope.searchText, 'i');
                return !$scope.searchText || re.test(obj.name) || re.test(obj.age.toString());
            };
            $scope.cancelAppointment = function (appId, drId, mode, startTime, patientId) {
                console.log(appId + "==" + drId + "==" + mode + "==" + startTime + "==" + patientId);
                $scope.appId = appId;
                $scope.userId = get('id');
                $scope.cancel = '';
                console.log(startTime);
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(curtime);
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff + " Time limit==" + $scope.timeLimit);
                if (timeDiff < $scope.timeLimit) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    }
                } else {
                    if (mode == 1) {
                        alert("Video cancel");
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/dr-cancel-app',
                            params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, cancel: ''}
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            if (response.data == 'success') {
                                alert('Your appointment is cancelled successfully.');
                                $state.go('app.doctor-consultations', {}, {reload: true});
                            } else {
                                alert('Sorry your appointment is not cancelled.');
                            }
                            $state.go('app.consultations-list', {}, {reload: true});
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                }
            };
            $scope.joinVideo = function (mode, start, end, appId, patientId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId + "===Dr " + patientId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    window.localStorage.setItem("patientId", patientId);
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
            //Go to consultation add page
            $scope.addCnote = function (appId, from) {
                console.log(appId);
                store({'appId': appId});
                if (from == 'app')
                    store({'from': 'app.appointment-list'});
                else if (from == 'past')
                    store({'from': 'app.past-appointment-list'});
                $state.go("app.consultations-note", {'appId': appId}, {reload: true});
            };
            //Go to consultation view page
            $scope.viewNote = function (noteId) {
                console.log(noteId);
                store({'noteId': noteId});
                $state.go("app.view-note", {'id': noteId}, {reload: true});
            };
            $scope.appointMedicine = function (mid, appid, from) {
                $scope.mid = parseInt(mid);
                // alert($scope.mid);
                $scope.appointmentId = appid;


                $scope.interface = window.localStorage.getItem('interface_id');
                if (from == 'curapp')
                    store({'from': 'app.appointment-list'});
                else if (from == 'pastapp')
                    store({'from': 'app.past-appointment-list'});
                $state.go('app.disbursement', {'mid': $scope.mid, 'appid': $scope.appointmentId}, {reload: true});

            };
            $scope.viewMedicine = function (consultationId) {
                $scope.consultationId = consultationId;
                console.log(consultationId);
                $http({
                    method: 'GET',
                    url: domain + 'inventory/get-medicine-details',
                    params: {consultationId: $scope.consultationId, userId: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.medicine = response.data.medicine;
                    $state.go('app.view-medicine', {'id': $scope.consultationId}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });


            };
        })

        .controller('AppointmentListActiveCtrl', function ($scope, $http, $stateParams, $ionicModal, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.drId = '';
            $scope.patientId = '';
            $scope.can = {};
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-active-app',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;

                $scope.timeLimit = response.data.timelimit.cancellation_time;
                //end past section
                $scope.all_data = response.data.all_data;
                $scope.all_app = response.data.all_appointments;
                $scope.all_usersData = response.data.all_usersData;
                $scope.all_doctor = response.data.all_doctor;
                $scope.all_products = response.data.all_products;
                $scope.all_time = response.data.all_time;
                $scope.all_end_time = response.data.all_end_time;
                $scope.all_note = response.data.all_note;
                $scope.all_medicine = response.data.all_medicine;

                //end past section//
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.searchFilter = function (obj) {
                var re = new RegExp($scope.searchText, 'i');
                return !$scope.searchText || re.test(obj.name) || re.test(obj.age.toString());
            };

            $ionicModal.fromTemplateUrl('cancelby', {
                scope: $scope
            }).then(function (modal) {
                $scope.cancelby = modal;
            });
            $scope.closeCancelby = function () {
                $scope.cancelby.hide();
            };

            $scope.cancelAppointment = function (appId, drId, mode, startTime, patientId) {
                console.log(appId + "==" + drId + "==" + mode + "==" + startTime + "==" + patientId);
                $scope.appId = appId;
                $scope.userId = get('id');
                $scope.cancel = '';
                $scope.drId = drId;
                $scope.patientId = patientId;
                console.log(startTime);
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(curtime);
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff + " Time limit==" + $scope.timeLimit);
                if (timeDiff < $scope.timeLimit) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    }
                } else {
                    $scope.cancelby.show()
                }
            };
            $scope.submitCancel = function () {
                $scope.cancelby.hide();
                //alert("Video cancel");
                $http({
                    method: 'GET',
                    url: domain + 'assistapp/cancel-app',
                    params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, cancel: $scope.can.opt, drId: $scope.drId, patientId: $scope.patientId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data == 'success') {
                        alert('Your appointment is cancelled successfully.');
                        window.location.reload();
                    } else {
                        alert('Sorry your appointment is not cancelled.');
                    }
                    //$state.go('app.appointment-list', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.joinVideo = function (mode, start, end, appId, patientId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId + "===Dr " + patientId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    window.localStorage.setItem("patientId", patientId);
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
            //Go to consultation add page
            $scope.addCnote = function (appId, from) {
                console.log(appId);
                store({'appId': appId});
                if (from == 'app')
                    store({'from': 'app.appointment-list'});
                else if (from == 'past')
                    store({'from': 'app.past-appointment-list'});
                $state.go("app.consultations-note", {'appId': appId}, {reload: true});
            };
            //Go to consultation view page
            $scope.viewNote = function (noteId) {
                console.log(noteId);
                store({'noteId': noteId});
                $state.go("app.view-note", {'id': noteId}, {reload: true});
            };
            $scope.appointMedicine = function (mid, appid, from) {
                $scope.mid = parseInt(mid);
                // alert($scope.mid);
                $scope.appointmentId = appid;


                $scope.interface = window.localStorage.getItem('interface_id');
                if (from == 'curapp')
                    store({'from': 'app.appointment-list'});
                else if (from == 'pastapp')
                    store({'from': 'app.past-appointment-list'});
                $state.go('app.disbursement', {'mid': $scope.mid, 'appid': $scope.appointmentId}, {reload: true});

            };
            $scope.viewMedicine = function (consultationId) {
                $scope.consultationId = consultationId;
                console.log(consultationId);
                $http({
                    method: 'GET',
                    url: domain + 'inventory/get-medicine-details',
                    params: {consultationId: $scope.consultationId, userId: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.medicine = response.data.medicine;
                    $state.go('app.view-medicine', {'id': $scope.consultationId}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });


            };
        })

        .controller('CancelDctrCtrl', function ($scope, $ionicModal, $filter, $http, $state) {
            $scope.can = {};
            $scope.drId = '';
            $scope.patientId = '';
            $ionicModal.fromTemplateUrl('canceldctr', {
                scope: $scope
            }).then(function (modal) {
                $scope.canceldctr = modal;
            });
            $scope.closeCdctr = function () {
                $scope.canceldctr.hide();
            };
            $scope.closeCdr = function () {
                $scope.canceldctr.hide();
                $scope.canceldr.hide();
            };
            $scope.submitmodal = function () {
                console.log($scope.can.opt);
                if ($scope.can.opt != '') {
                    $http({
                        method: 'GET',
                        url: domain + 'assistapp/cancel-app',
                        params: {appId: $scope.appId, mode: $scope.mode, userId: $scope.userId, cancel: $scope.can.opt, drId: $scope.drId, patientId: $scope.patientId}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        if (response.data == 'success') {
                            alert('Your appointment is cancelled successfully.');
                            window.location.reload();
                        } else {
                            alert('Sorry your appointment is not cancelled.');
                        }
                        //$state.go('app.doctor-consultations', {'id': $scope.drId}, {reload: true});
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
                $scope.canceldctr.hide();
            };
            $ionicModal.fromTemplateUrl('canceldr', {
                scope: $scope
            }).then(function (modal) {
                $scope.canceldr = modal;
            });
            $scope.submitmodal = function () {
                console.log($scope.can.opt);
                if ($scope.can.opt != '') {
                    $http({
                        method: 'GET',
                        url: domain + 'assistapp/cancel-app',
                        params: {appId: $scope.appId, mode: $scope.mode, userId: $scope.userId, cancel: $scope.can.opt, drId: $scope.drId, patientId: $scope.patientId}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        if (response.data == 'success') {
                            alert('Your appointment is cancelled successfully.');
                            window.location.reload();
                        } else {
                            alert('Sorry your appointment is not cancelled.');
                        }
                        //window.location.reload();
                        //$state.go('app.doctor-consultations', {'id': $scope.drId}, {reload: true});
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
                $scope.canceldr.hide();
            };
            $scope.cancelApp = function (appId, drId, mode, startTime, patientId) {
                console.log(appId + "==" + drId + "==" + mode + "==" + startTime + "==" + patientId);
                $scope.appId = appId;
                $scope.mode = mode;
                $scope.userId = get('id');
                $scope.drId = drId;
                $scope.patientId = patientId;
                $scope.cancel = '';
                console.log(startTime);
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(curtime);
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff + " Time limit==" + $scope.timeLimit);
                if (timeDiff < $scope.timeLimit) {
                    $scope.canceldctr.show();
                } else {
                    $scope.canceldr.show();
                }
            };
        })

        .controller('AppointmentListPastCtrl', function ($scope, $http, $stateParams, $ionicModal, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-past-app',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                //end past section
                //past section //
                $scope.all_data_past = response.data.all_data_past;
                $scope.all_app_past = response.data.all_appointments_past;
                $scope.all_doctor_past = response.data.all_doctor_past;
                $scope.all_usersData_past = response.data.all_usersData_past;
                $scope.all_products_past = response.data.all_products_past;
                $scope.all_time_past = response.data.all_time_past;
                $scope.all_end_time_past = response.data.all_end_time_past;
                $scope.all_note_past = response.data.all_note_past;
                $scope.all_medicine_past = response.data.all_medicine_past;
                //end past section//
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.searchFilter = function (obj) {
                var re = new RegExp($scope.searchText, 'i');
                return !$scope.searchText || re.test(obj.name) || re.test(obj.age.toString());
            };

            //Go to consultation add page
            $scope.addCnote = function (appId, from) {
                console.log(appId);
                store({'appId': appId});
                if (from == 'app')
                    store({'from': 'app.appointment-list'});
                else if (from == 'past')
                    store({'from': 'app.past-appointment-list'});
                $state.go("app.consultations-note", {'appId': appId}, {reload: true});
            };
            //Go to consultation view page
            $scope.viewNote = function (noteId) {
                console.log(noteId);
                store({'noteId': noteId});
                $state.go("app.view-note", {'id': noteId}, {reload: true});
            };
            $scope.appointMedicine = function (mid, appid, from) {
                $scope.mid = parseInt(mid);
                // alert($scope.mid);
                $scope.appointmentId = appid;


                $scope.interface = window.localStorage.getItem('interface_id');
                if (from == 'curapp')
                    store({'from': 'app.appointment-list'});
                else if (from == 'pastapp')
                    store({'from': 'app.past-appointment-list'});
                $state.go('app.disbursement', {'mid': $scope.mid, 'appid': $scope.appointmentId}, {reload: true});

            };
            $scope.viewMedicine = function (consultationId) {
                $scope.consultationId = consultationId;
                console.log(consultationId);
                $http({
                    method: 'GET',
                    url: domain + 'inventory/get-medicine-details',
                    params: {consultationId: $scope.consultationId, userId: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.medicine = response.data.medicine;
                    $state.go('app.view-medicine', {'id': $scope.consultationId}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('PatientAppointmentListCtrl', function ($scope, $http, $stateParams, $ionicModal, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.drId = '';
            $scope.patientId = '';
            $scope.can = {};
            $scope.patientId = $stateParams.id;
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-patientall-app',
                params: {patientId: $scope.patientId, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                //end past section
                $scope.all_data = response.data.all_data;
                $scope.all_app = response.data.all_appointments;
                $scope.all_usersData = response.data.all_usersData;
                $scope.all_doctor = response.data.all_doctor;
                $scope.all_products = response.data.all_products;
                $scope.all_time = response.data.all_time;
                $scope.all_end_time = response.data.all_end_time;
                $scope.all_note = response.data.all_note;
                $scope.all_medicine = response.data.all_medicine;
                //past section //
                $scope.all_data_past = response.data.all_data_past;
                $scope.all_app_past = response.data.all_appointments_past;
                $scope.all_doctor_past = response.data.all_doctor_past;
                $scope.all_usersData_past = response.data.all_usersData_past;
                $scope.all_products_past = response.data.all_products_past;
                $scope.all_time_past = response.data.all_time_past;
                $scope.all_end_time_past = response.data.all_end_time_past;
                $scope.all_note_past = response.data.all_note_past;
                $scope.all_medicine_past = response.data.all_medicine_past;
                //end past section//

                $scope.timeLimit = response.data.timelimit.cancellation_time;
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.searchFilter = function (obj) {
                var re = new RegExp($scope.searchText, 'i');
                return !$scope.searchText || re.test(obj.name) || re.test(obj.age.toString());
            };

            $ionicModal.fromTemplateUrl('cancelby', {
                scope: $scope
            }).then(function (modal) {
                $scope.cancelby = modal;
            });
            $scope.closeCancelby = function () {
                $scope.cancelby.hide();
            };

            $scope.cancelAppointment = function (appId, drId, mode, startTime, patientId) {
                console.log(appId + "==" + drId + "==" + mode + "==" + startTime + "==" + patientId);
                $scope.appId = appId;
                $scope.userId = get('id');
                $scope.drId = drId;
                $scope.patientId = patientId;
                $scope.cancel = '';
                console.log(startTime);
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(curtime);
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff + " Time limit==" + $scope.timeLimit);
                if (timeDiff < $scope.timeLimit) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    }
                } else {
                    $scope.cancelby.show()
                }
            };
            $scope.submitCancel = function () {
                $scope.cancelby.hide();
                alert("Video cancel");
                $http({
                    method: 'GET',
                    url: domain + 'assistapp/cancel-app',
                    params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, cancel: $scope.can.opt, drId: $scope.drId, patientId: $scope.patientId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data == 'success') {
                        alert('Your appointment is cancelled successfully.');
                        window.location.reload();
                    } else {
                        alert('Sorry your appointment is not cancelled.');
                    }
                    //$state.go('app.appointment-list', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.joinVideo = function (mode, start, end, appId, patientId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId + "===Dr " + patientId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    window.localStorage.setItem("patientId", patientId);
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
            //Go to consultation add page
            $scope.addCnote = function (appId, from) {
                //alert(appId);
                store({'appId': appId});
                if (from == 'app')
                    store({'from': 'app.patient-app-list'});
                else if (from == 'past')
                    store({'from': 'app.patient-past-app-list'});
                $state.go("app.consultations-note", {'appId': appId}, {reload: true});
            };
            //Go to consultation view page
            $scope.viewNote = function (noteId) {
                //alert(appId);
                store({'noteId': noteId});
                $state.go("app.view-note", {'id': noteId}, {reload: true});
            };


            $scope.viewMedicine = function (consultationId) {
                //alert(noteId);
                // store({'noteId': noteId});
                $state.go("app.view-medicine", {'id': consultationId}, {reload: true});
            };

            $scope.appointMedicine = function (mid, appid, from) {
                $scope.mid = parseInt(mid);
                $scope.appointmentId = appid;
                $scope.interface = window.localStorage.getItem('interface_id');
                if (from == 'patientCurApp')
                    store({'from': 'app.patient-app-list'});
                else if (from == 'patientPastApp')
                    store({'from': 'app.patient-past-app-list'});
                $state.go('app.disbursement', {'mid': $scope.mid, 'appid': $scope.appointmentId}, {reload: true});
            };
        })

        .controller('NewPatientCtrl', function ($scope, $http, $state, $stateParams, $ionicModal, $ionicLoading, $filter, $timeout) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.curTime = new Date(); //$filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.gender = '';
            $http({
                method: 'GET',
                url: domain + 'assistants/get-patient-list',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.allUsers.length);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                $scope.doctrs = response.data.doctrs;
                if (response.data.allUsers.length > 0) {
                    var data = response.data.allUsers;
                    $scope.users = _.reduce(
                            data,
                            function (output, fname) {
                                var lCase = fname.fname.toUpperCase();
                                if (output[lCase[0]]) //if lCase is a key
                                    output[lCase[0]].push(fname); //Add name to its list
                                else
                                    output[lCase[0]] = [fname]; // Else add a key
                                //console.log(output);
                                return output;
                            },
                            {}
                    );
                }
            }, function errorCallback(e) {
                console.log(e);
            });
            $ionicModal.fromTemplateUrl('addnewpatient', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            //Save Patient
            $scope.savePatient = function () {
                console.log('submit');
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addPatientForm")[0]);
                console.log(data);
                callAjax("POST", domain + "assistants/save-patient", data, function (response) {
                    jQuery("#addPatientForm")[0].reset();
                    $scope.patientadded = response.patientadded;
                    $scope.language = response.lang.language;
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert($scope.patientadded[$scope.language]);
                    window.location.reload();
                    //$state.go('app.new-patient', {}, {reload: true});
                });
            };
            $scope.selDoc = function (pid) {
                console.log(pid);
                window.localStorage.setItem("patientId", pid);
                $state.go("app.app-doctrlist", {}, {reload: true});
            };
        })

        .controller('DoctorJoinCtrl', function ($ionicLoading, $scope, $http, $stateParams, $ionicHistory, $state, $window) {
            if (!get('loadedOnce')) {
                store({'loadedOnce': 'true'});
                $window.location.reload(true);
                // don't reload page, but clear localStorage value so it'll get reloaded next time
            } else {
                // set the flag and reload the page
                window.localStorage.removeItem('loadedOnce');
            }
            //$ionicHistory.clearCache();
            $scope.appId = $stateParams.id;
            $scope.userId = get('id');
            $scope.drId = get('drId');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'appointment/join-patient',
                params: {id: $scope.appId, userId: $scope.drId}
            }).then(function sucessCallback(response) {
                //console.log(response.data);
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = '45121182';
                var sessionId = response.data.app[0].appointments.opentok_session_id;

                var token = response.data.oToken;
                if (OT.checkSystemRequirements() == 1) {
                    session = OT.initSession(apiKey, sessionId);
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    alert("Your device is not compatible");
                }

                session.on({
                    streamDestroyed: function (event) {
                        event.preventDefault();
                        jQuery("#subscribersDiv").html("Patient Left the Consultation");
                    },
                    streamCreated: function (event) {

                        subscriber = session.subscribe(event.stream, 'subscribersDiv', {subscribeToAudio: true, insertMode: "replace", width: "100%", height: "100%"});
                    },
                    sessionDisconnected: function (event) {
                        if (event.reason === 'networkDisconnected') {
                            alert('You lost your internet connection.'
                                    + 'Please check your connection and try connecting again.');
                        }
                    }
                });
                session.connect(token, function (error) {
                    if (error) {
                        console.log(error.message);
                    } else {
                        publisher = OT.initPublisher('myPublisherDiv', {width: "30%", height: "30%"});
                        session.publish(publisher);
                        var mic = 1;
                        var mute = 1;
                        jQuery(".muteMic").click(function () {
                            if (mic == 1) {
                                publisher.publishAudio(false);
                                mic = 0;
                            } else {
                                publisher.publishAudio(true);
                                mic = 1;
                            }
                        });
                        jQuery(".muteSub").click(function () {
                            if (mute == 1) {
                                subscriber.subscribeToAudio(false);
                                mute = 0;
                            } else {
                                subscriber.subscribeToAudio(true);
                                mute = 1;
                            }
                        });
                    }
                });
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.exitVideo = function () {
                try {
                    publisher.destroy();
                    subscriber.destroy();
                    session.unsubscribe();
                    session.disconnect();
                    window.localStorage.removeItem('drId');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $state.go('app.appointment-list', {}, {reload: true});
                } catch (err) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    $state.go('app.appointment-list', {}, {reload: true});
                }
            };
        })

        .controller('PatientJoinCtrl', function ($window, $scope, $http, $stateParams, $sce, $filter, $timeout, $state, $ionicHistory, $ionicLoading) {
            if (!get('loadedOnce')) {
                store({'loadedOnce': 'true'});
                $window.location.reload(true);
                // don't reload page, but clear localStorage value so it'll get reloaded next time
                $ionicLoading.hide();
            } else {
                // set the flag and reload the page
                window.localStorage.removeItem('loadedOnce');
                $ionicLoading.hide();
            }
            // $ionicHistory.clearCache();
            $scope.appId = $stateParams.id;
            $scope.mode = $stateParams.mode;
            $scope.userId = get('id');
            $scope.patientId = get('patientId');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            //alert($scope.patientId);
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'appointment/join-doctor',
                params: {id: $scope.appId, userId: $scope.patientId, mode: $scope.mode}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $ionicLoading.hide();
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = '45121182';
                var sessionId = response.data.app[0].appointments.opentok_session_id;
                // console.log('sessionId --- '+sessionId);
                var token = response.data.oToken;
                // console.log('token -- '+token);
                if (OT.checkSystemRequirements() == 1) {
                    session = OT.initSession(apiKey, sessionId);
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    alert("Your device is not compatible");
                }

                session.on({
                    streamDestroyed: function (event) {
                        event.preventDefault();
                        jQuery("#subscribersDiv").html("Doctor Left the Consultation");
                    },
                    streamCreated: function (event) {
                        subscriber = session.subscribe(event.stream, 'subscribersDiv', {width: "100%", height: "100%", subscribeToAudio: true});
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/update-join',
                            params: {id: $scope.appId, userId: $scope.patientId}
                        }).then(function sucessCallback(response) {
                            console.log(response);
                            $ionicLoading.hide();
                        }, function errorCallback(e) {
                            $ionicLoading.hide();
                            console.log(e);
                        });
                    },
                    sessionDisconnected: function (event) {
                        if (event.reason === 'networkDisconnected') {
                            $ionicLoading.hide();
                            alert('You lost your internet connection.'
                                    + 'Please check your connection and try connecting again.');
                        }
                    }
                });
                session.connect(token, function (error) {
                    if (error) {
                        $ionicLoading.hide();
                        alert("Error connecting: ", error.code, error.message);
                    } else {
                        publisher = OT.initPublisher('myPublisherDiv', {width: "30%", height: "30%"});
                        session.publish(publisher);
                        console.log(JSON.stringify(session));
                        //  alert(JSON.stringify(session))
                        var mic = 1;
                        var mute = 1;
                        jQuery(".muteMic").click(function () {
                            if (mic == 1) {
                                publisher.publishAudio(false);
                                mic = 0;
                                $ionicLoading.hide();
                            } else {
                                publisher.publishAudio(true);
                                mic = 1;
                                $ionicLoading.hide();
                            }
                        });
                        jQuery(".muteSub").click(function () {
                            if (mute == 1) {
                                subscriber.subscribeToAudio(false);
                                mute = 0;
                                $ionicLoading.hide();
                            } else {
                                subscriber.subscribeToAudio(true);
                                mute = 1;
                                $ionicLoading.hide();
                            }
                        });
                    }
                });
            }, function errorCallback(e) {
                console.log(e);
                $ionicLoading.hide();
            });
            $scope.exitVideo = function () {
                try {
                    publisher.destroy();
                    subscriber.destroy();
                    session.unsubscribe();
                    session.disconnect();
                    window.localStorage.removeItem('patientId');
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    $state.go('app.appointment-list', {}, {reload: true});
                    //window.location.href = "#/app/category-listing";
                } catch (err) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    $state.go('app.appointment-list', {}, {reload: true});
                }
            };
        })

        .controller('InventoryCtrl', function ($scope, $state, $http, $stateParams, $ionicModal, $rootScope) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.id = window.localStorage.getItem('id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $rootScope.dataitem = "";
            $rootScope.dataitem1 = "";
            $http({
                method: 'GET',
                url: domain + 'inventory/get-inventary-pagelang',
                params: {id: $scope.id, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.inventory = response.data.inventory;
                $scope.language = response.data.lang.language;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.searchMedicine = function (searchkey) {
                $scope.searchkey = searchkey
                //  var data = new FormData(jQuery("#loginuser")[0]);
                $state.go('app.search-medicine', {'key': $scope.searchkey}, {reload: true});
            };
        })

        .controller('SerachInventoryCtrl', function ($scope, $state, $http, $stateParams, $ionicModal, $ionicPopup, $rootScope) {
            $scope.getMedicine = [];
            $scope.searchkey = $stateParams.key;
            $scope.data = {};
            $scope.dataitem1 = [];
            $scope.additem1 = [];
            console.log($scope.searchkey);
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.id = window.localStorage.getItem('id');
            $http({
                method: 'GET',
                url: domain + 'inventory/search-medicine',
                params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.getMedicine = response.data.getMedicine;
                $scope.otherMedicine = response.data.otherMedicine;
                $scope.inventory = response.data.inventory;
                $scope.language = response.data.lang.language;
                //$scope.searchkey  = searchkey
            }, function errorCallback(response) {
                console.log(response);
            });

            $scope.searchMedicine = function (searchkey) {
                $scope.searchkey = searchkey
                //  var data = new FormData(jQuery("#loginuser")[0]);
                $http({
                    method: 'GET',
                    url: domain + 'inventory/search-medicine',
                    params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.getMedicine = response.data.getMedicine;
                    $scope.otherMedicine = response.data.otherMedicine;
                    $scope.inventory = response.data.inventory;
                    $scope.language = response.data.lang.language;
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            $scope.showPopup = function (mid, name, appid) {
                $scope.medicineId = mid;
                $scope.medicineName = name;
                $scope.appid = appid;
                $http({
                    method: 'GET',
                    url: domain + 'inventory/get-item-form',
                    params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey, mid: $scope.medicineId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.itemform = response.data.itemform;
                    $scope.qtylang = response.data.qtylang;
                    $scope.language = response.data.lang.language;
                    $scope.data.quantity = 1;
                    $scope.data.itemform = '';
                    var htmlstring = '<div class="row"><div class="col col-33">\n\
                     <input type="number" ng-model="data.quantity"  value="data.quantity" name="qunatity" min="1" >\n\
                        </div><div class="col col-67">\n\
                        <select class="selectpopup"  name="itemform" ng-model="data.itemform">\n\
                        <option value="" selected>Please Select</option>';
                    angular.forEach($scope.itemform, function (value, key) {
                        htmlstring += '<option ng-model="form_name" ng-init="-1" value="' + value.form_name + '">' + value.form_name + '</option>';
                    });
                    htmlstring += '</select>\n\
                        </div>\n\
                        </div>';
                    // An elaborate, custom popup
                    var myPopup = $ionicPopup.show({
                        template: htmlstring,
                        title: $scope.qtylang.quantity[$scope.language],
                        scope: $scope,
                        buttons: [
                            {text: $scope.qtylang.cancel[$scope.language]},
                            {
                                text: '<b>' + $scope.qtylang.ok[$scope.language] + '</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    if ((!$scope.data.quantity) && (!$scope.data.itemform)) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        if ($scope.data.itemform != "") {
                                            $http({
                                                method: 'GET',
                                                url: domain + 'inventory/check-stock',
                                                params: {mid: $scope.medicineId, itemform: $scope.data.itemform, qty: $scope.data.quantity}
                                            }).then(function successCallback(response) {
                                                console.log("check-stock  " + response.data);
                                                if (response.data == 0) {
                                                    alert('Sorry, Order quantity not in stock');
                                                } else {
                                                    alert(response.data + ' added successfully');
                                                    $scope.dataitem1.push({'id': $scope.medicineId, 'name': $scope.medicineName, 'quantity': $scope.data.quantity, 'itemform': $scope.data.itemform});
                                                    $rootScope.dataitem1 = $scope.dataitem1;
                                                    $state.go('app.disbursement', {'mid': $scope.medicineId, 'appid': $scope.appid}, {reload: true});
                                                }
                                            }, function errorCallback(e) {
                                                console.log(e);
                                            });

                                        } else {
                                            alert('Please select item form');
                                        }
                                    }
                                }
                            }
                        ]
                    });
                    myPopup.then(function (res) {

//                        if (res == '1') {
//                       
//                        }
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.addMedicinePopup = function (mid, name, appid) {
                $scope.medicineId = mid;
                $scope.medicineName = name;
                $scope.appid = appid;
                $http({
                    method: 'GET',
                    url: domain + 'inventory/get-item-form',
                    params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey, mid: $scope.medicineId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.itemform = response.data.itemform;
                    $scope.qtylang = response.data.qtylang;
                    $scope.language = response.data.lang.language;
                    $scope.data.quantity = 1;
                    $scope.data.inwarddate = new Date();
                    $scope.data.itemform = '';
                    var htmlstring = '<div class="row">\n\
                                <div class="col">\n\
                        <input type="date" ng-model="data.inwarddate"  value="data.inwarddate" name="inwarddate"  >\n\
                        </div>\n\
                        </div>\n\
                            <div class="row">\n\
                      <div class="col col-33">\n\
                     <input type="number" ng-model="data.quantity"  value="data.quantity" name="qunatity" min="1" >\n\
                        </div><div class="col col-67">\n\
                        <select class="selectpopup"  name="itemform" ng-model="data.itemform">\n\
                        <option value="" selected>Please Select</option>';
                    angular.forEach($scope.itemform, function (value, key) {
                        htmlstring += '<option ng-model="form_name" ng-init="-1" value="' + value.form_name + '">' + value.form_name + '</option>';
                    });
                    htmlstring += '</select>\n\
                        </div>\n\
                        </div>';
                    // An elaborate, custom popup
                    var myPopup = $ionicPopup.show({
                        template: htmlstring,
                        title: $scope.qtylang.quantity[$scope.language],
                        scope: $scope,
                        buttons: [
                            {text: $scope.qtylang.cancel[$scope.language]},
                            {
                                text: '<b>' + $scope.qtylang.ok[$scope.language] + '</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    if ((!$scope.data.quantity) && (!$scope.data.itemform)) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        if ($scope.data.itemform != "") {
                                            $scope.additem1.push({'id': $scope.medicineId, 'name': $scope.medicineName, 'quantity': $scope.data.quantity, 'itemform': $scope.data.itemform});
                                            $rootScope.additem1 = $scope.additem1;
                                            // $state.go('app.medicine', {'mid': $scope.medicineId, 'appid': $scope.appid}, {reload: true});
                                            $http({
                                                method: 'GET',
                                                url: domain + 'inventory/add-stock',
                                                params: {mid: $scope.medicineId, interface: $scope.interface, itemform: $scope.data.itemform, qty: $scope.data.quantity}
                                            }).then(function successCallback(response) {
                                                console.log("add-stock  " + response.data);
                                                if (response.data == '1') {
                                                    alert('medicine added sucessfully');
                                                    window.location.reload();
                                                }

                                            }, function errorCallback(e) {
                                                console.log(e);
                                            });
                                        } else {
                                            alert('Please select item form');
                                        }
                                    }
                                }
                            }
                        ]
                    });
                    myPopup.then(function (res) {

                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
            }


            $scope.addmultiplemedicine = function () {
                var htmlcontent = '<div class="row"><div class="col col-33">\n\
                     <input type="number" ng-model="mqty"  value="" placeholder="Qty" name="qunatity" min="1" >\n\
                        </div><div class="col col-67">\n\
                        <select class="selectpopup"  name="itemform" ng-model="pqr">\n\
                        <option value="" selected>Crocin</option></div></div> ';
                var myPopup = $ionicPopup.show({
                    template: htmlcontent,
                    title: 'Medicine',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Add</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.mqty) {
                                    //don't allow the user to close unless he enters wifi password
                                    console.log('fad ajfad')
                                    $state.go('app.medicine');
                                    //	e.preventDefault();
                                } else {
                                    $state.go('app.medicine');
                                    return $scope.mqty;

                                }
                            }
                        }
                    ]
                });
                myPopup.then(function (res) {

                    console.log('Tapped!', res);
                });
            }
            /* End of add medicine */
        })

        .controller('AddNewMedicineCtrl', function ($scope, $http, $stateParams, $ionicPopup, $ionicModal, $rootScope, $state, $ionicLoading) {

            $scope.data = {};
            $scope.additem = [];
            $scope.mid = $stateParams.mid;
            $scope.appid = $stateParams.appid;
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.id = window.localStorage.getItem('id');
            $ionicLoading.show({template: 'Loading..'});
            $scope.searchMedicine = function (searchkey) {
                $scope.searchkey = searchkey
                $scope.itemform = '';
                $http({
                    method: 'GET',
                    url: domain + 'inventory/search-medicine',
                    params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey, 'appid': $scope.appId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.getMedicine = response.data.getMedicine;
                    $scope.otherMedicine = response.data.otherMedicine;
                    $scope.inventory = response.data.inventory;
                    $scope.language = response.data.lang.language;

                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.addMedicinePopup = function (mid, name, appid) {
                $scope.medicineId = mid;
                $scope.medicineName = name;
                $scope.appid = appid;
                $http({
                    method: 'GET',
                    url: domain + 'inventory/get-item-form',
                    params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey, mid: $scope.medicineId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.itemform = response.data.itemform;
                    $scope.qtylang = response.data.qtylang;
                    $scope.language = response.data.lang.language;
                    $scope.data.quantity = 1;
                    $scope.data.itemform = '';
                    var htmlstring = '<div class="row"><div class="col col-33">\n\
                     <input type="number" ng-model="data.quantity"  value="data.quantity" name="qunatity" min="1" >\n\
                        </div><div class="col col-67">\n\
                        <select class="selectpopup"  name="itemform" ng-model="data.itemform">\n\
                        <option value="" selected>Please Select</option>';
                    angular.forEach($scope.itemform, function (value, key) {
                        htmlstring += '<option ng-model="form_name" ng-init="-1" value="' + value.form_name + '">' + value.form_name + '</option>';
                    });
                    htmlstring += '</select>\n\
                        </div>\n\
                        </div>';
                    // An elaborate, custom popup
                    var myPopup = $ionicPopup.show({
                        template: htmlstring,
                        title: $scope.qtylang.quantity[$scope.language],
                        scope: $scope,
                        buttons: [
                            {text: $scope.qtylang.cancel[$scope.language]},
                            {
                                text: '<b>' + $scope.qtylang.ok[$scope.language] + '</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    if ((!$scope.data.quantity) && (!$scope.data.itemform)) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        $scope.additem.push({'id': $scope.medicineId, 'name': $scope.medicineName, 'quantity': $scope.data.quantity, 'itemform': $scope.data.itemform});
                                        $rootScope.additem = $scope.additem;
                                        // $state.go('app.medicine', {'mid': $scope.medicineId, 'appid': $scope.appid}, {reload: true});
//                                        $http({
//                                                method: 'GET',
//                                                url: domain + 'inventory/add-stock',
//                                                params: {mid: $scope.medicineId, itemform: $scope.data.itemform, qty: $scope.data.quantity}
//                                            }).then(function successCallback(response) {
//                                                console.log("add-stock  " + response.data);
//                                                if (response.data == 0) {
//                                                    alert('Sorry, Order quantity not in stock');
//                                                } else {
//                                                    alert(response.data + ' added successfully');
//                                                    $scope.additem1.push({'id': $scope.medicineId, 'name': $scope.medicineName, 'quantity': $scope.data.quantity, 'itemform': $scope.data.itemform});
//                                                    $rootScope.additem1 = $scope.additem1;
//                                                    $state.go('app.add-medicine', {'mid': $scope.medicineId, 'appid': $scope.appid}, {reload: true});
//                                                }
//                                            }, function errorCallback(e) {
//                                                console.log(e);
//                                            });
                                    }
                                }
                            }
                        ]
                    });
                    myPopup.then(function (res) {

                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.goToAddMedicine = function (mid, appid) {
                // alert($scope.mid);
                $rootScope.additem = $scope.additem;
                $state.go('app.medicine', {'mid': $scope.mid, 'appid': $scope.appid}, {reload: true});
            };



            $ionicModal.fromTemplateUrl('infomedicine', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.showInformation = function (mid) {
                    $scope.mid = mid;
                    $http({
                        method: 'GET',
                        url: domain + 'inventory/get-medicine-info',
                        params: {mid: $scope.mid, interface: $scope.interface}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        $scope.medicinefor = response.data.medicinefor;
                        $scope.modal.show();
                    }, function errorCallback(response) {
                        console.log(response);
                    });

                }
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };


        })

        .controller('AppDoctrlistCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })



        .controller('DisbursementCtrl', function ($scope, $state, $http, $rootScope, $stateParams, $ionicModal, $ionicLoading) {
            $scope.category_sources = [];
            $scope.appointment = '';
            console.log($rootScope.dataitem);
            $scope.mId = $stateParams.mid;
            $scope.appId = $stateParams.appid;
            //alert($scope.appId);
            $scope.curDate = new Date();
            $scope.curTime = new Date();
            $scope.patientName = [{'name': 'No Patient selected'}];
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.id = window.localStorage.getItem('id');
            if ($scope.appId != '0') {
                $http({
                    method: 'GET',
                    url: domain + 'appointment/appoint-medicine',
                    params: {mid: $scope.mid, id: $scope.id, appointId: $scope.appId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.appointment = response.data.appointment;
                    $scope.doctorId = response.data.appointment.doctor_id;
                    $scope.patientId = response.data.appointment.user_id;
                    //$scope.inventory = response.data.inventory;
                    //$scope.language = response.data.lang.language;
                }, function errorCallback(response) {
                    console.log(response);
                });
            } else {
                $scope.appointment = 0;
                $scope.doctorId = 0;
                $scope.patientId = '';
            }

            $http({
                method: 'GET',
                url: domain + 'inventory/disbursement',
                params: {id: $scope.id, interface: $scope.interface, mid: $scope.mId, 'appid': $scope.appId}
            }).then(function successCallback(response) {
                console.log(response.data);
                // console.log(response.data.userD[0].id);
                $scope.id = window.localStorage.getItem('id');
                $scope.userD = response.data.userD;
                $scope.userP = response.data.userP;
                //$scope.doctorId = response.data.userD.id
                $scope.service = response.data.service;
                $scope.medicine = response.data.medicine;
                $scope.patient_type = response.data.patient_type;
                $scope.itemform = response.data.itemform;
                $scope.disbursement = response.data.disbursement;
                $scope.language = response.data.lang.language;
                if ($scope.userP.length > 0) {
                    var data = $scope.userP;
                    $scope.users = _.reduce(
                            data,
                            function (output, fname) {
                                var lCase = fname.fname.toUpperCase();
                                if (output[lCase[0]]) //if lCase is a key
                                    output[lCase[0]].push(fname); //Add name to its list
                                else
                                    output[lCase[0]] = [fname]; // Else add a key
                                //console.log(output);
                                return output;
                            },
                            {}
                    );
                }
                //$scope.searchkey  = searchkey
            }, function errorCallback(response) {
                console.log(response);
            });
            //Patient Modal 
            $scope.selPatient = function (pid, name) {
                console.log(pid + "Name = " + name);
                $scope.patientId = pid;
                window.localStorage.setItem('patientId', pid);
                //$scope.getPatientId(pid);
                $scope.patientName = [{'name': name}];
                console.log($scope.patientName);
                $scope.modal.hide();
            };

            $scope.doDisbursement = function (appid) {
                // alert(appid);
                $scope.from = get('from');
                var data = new FormData(jQuery("#disbursementform")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + 'inventory/disbursement-outgo',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        console.log(response);
                        if ($scope.from == 'app.appointment-list') {
                            if (response == '1') {
                                window.localStorage.removeItem('from');
                                alert('Medicines added.');
                                $state.go('app.appointment-list', {}, {reload: true});
                            } else if (response == '0') {
                                alert('Please add medicines');
                            } else {
                                alert('Something went wrong!');
                                $state.go('app.appointment-list', {}, {reload: true});
                            }
                        } else if ($scope.from == 'app.past-appointment-list') {
                            if (response == '1') {
                                window.localStorage.removeItem('from');
                                alert('Medicines added.');
                                $state.go('app.past-appointment-list', {}, {reload: true});
                            } else if (response == '0') {
                                alert('Please add medicines');
                            } else {
                                alert('Something went wrong!');
                                $state.go('app.past-appointment-list', {}, {reload: true});
                            }
                        } else if ($scope.from == 'app.patient-app-list') {
                            if (response == '1') {
                                window.localStorage.removeItem('from');
                                alert('Medicines added.');
                                $state.go('app.patient-app-list', {'id': $scope.patientId}, {reload: true});
                            } else if (response == '0') {
                                alert('Please add medicines');
                            } else {
                                alert('Something went wrong!');
                                $state.go('app.patient-app-list', {'id': $scope.patientId}, {reload: true});
                            }
                        } else if ($scope.from == 'app.patient-past-app-list') {
                            alert("dasdasd");
                            if (response == '1') {
                                window.localStorage.removeItem('from');
                                alert('Medicines added.');
                                $state.go('app.patient-app-list', {'id': $scope.patientId}, {reload: true});
                            } else if (response == '0') {
                                alert('Please add medicines');
                            } else {
                                alert('Something went wrong!');
                                $state.go('app.patient-app-list', {'id': $scope.patientId}, {reload: true});
                            }

                        } else if ($scope.from == 'app.doctor-consultations') {
                            if (response == '1') {
                                window.localStorage.removeItem('from');
                                alert('Medicines added.');
                                $state.go('app.doctor-consultations', {'id': $scope.doctorId}, {reload: true});
                            } else if (response == '0') {
                                alert('Please add medicines');
                            } else {
                                alert('Something went wrong!');
                                $state.go('app.doctor-consultations', {'id': $scope.doctorId}, {reload: true});
                            }
                        } else if ($scope.from == 'app.consultation-past') {
                            if (response == '1') {
                                window.localStorage.removeItem('from');
                                alert('Medicines added.');
                                $state.go('app.consultation-past', {'id': $scope.doctorId}, {reload: true});
                            } else if (response == '0') {
                                alert('Please add medicines');
                            } else {
                                alert('Something went wrong!');
                                $state.go('app.consultation-past', {'id': $scope.doctorId}, {reload: true});
                            }
                        } else {
                            if (response == '1') {
                                alert('Medicines added.');
                                $state.go('app.inventory');
                            } else if (response == '0') {
                                alert('Please add medicines');
                            } else {
                                alert('Something went wrong!');
                                $state.go('app.inventory');
                            }
                        }

//                        if (appid == 0) {
//                            if (response == '1') {
//                                $state.go('app.inventory');
//                            } else if (response == '0') {
//                                alert('Please add medicines');
//                            } else {
//                                alert('Something went wrong!');
//                                $state.go('app.inventory');
//                            }
//                        } else {
//                            if (response == '1') {
//                                $state.go('app.appointment-list', {}, {reload: true});
//                            } else if (response == '0') {
//                                alert('Please add medicines');
//                            } else {
//                                alert('Something went wrong!')
//                                $state.go('app.appointment-list', {}, {reload: true});
//                            }
//
//                        }

                        $rootScope.$digest;
                    },
                    error: function (e) {
                        console.log(e.responseText);
                    }
                });
            };

            $scope.removeItem = function (itemId) {
                // alert(itemId);
                alert('Product removed.');
                $rootScope.dataitem.splice(itemId, 1);
            };
            $ionicModal.fromTemplateUrl('selectpatienta', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AddMedicineCtrl', function ($scope, $rootScope, $state) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.id = window.localStorage.getItem('id');
            $scope.date = new Date();
            $scope.doInward = function () {
                // alert(appid);
                $scope.from = get('from');
                var data = new FormData(jQuery("#inward")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + 'inventory/disbursement-inward',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        console.log(response);
                        if (response == '1') {
                            alert('medicine added sucessfully');
                            $state.go('app.inventory', {reload: true});

                        } else {
                            alert('Oops, Something went wrong');
                        }
                        // $rootScope.$digest;
                    },
                    error: function (e) {
                        console.log(e.responseText);
                    }
                });
            };
            $scope.removeItem = function (itemId) {
                alert('Product removed.');
                $rootScope.additem.splice(itemId, 1);
                if (itemId == '0') {
                    window.location.reload();
                }
            };
        })

        .controller('MedicineDetailsCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.mId = $stateParams.mid;
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.id = window.localStorage.getItem('id');
            $http({
                method: 'GET',
                url: domain + 'inventory/medicine-details',
                params: {id: $scope.id, interface: $scope.interface, mid: $scope.mId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.medicineforprob = response.data.medicineforprob;
            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('MedicineHistoryCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('MedicineOutgoCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('AddDisbursementCtrl', function ($scope, $ionicLoading, $state, $rootScope, $http, $stateParams, $ionicPopup, $ionicModal) {
            $scope.medicineId = '';
            $scope.medicineName = '';
            $scope.mid = $stateParams.mid;
            $scope.appid = $stateParams.appid;
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'inventory/get-inventary-pagelang',
                params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey, 'appid': $scope.appId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.inventory = response.data.inventory;
                $scope.language = response.data.lang.language;
                //$scope.searchkey  = searchkey

            }, function errorCallback(response) {
                console.log(response);
            });
            // sssconsole.log($scope.mid);
            $scope.data = {};
            $scope.dataitem = [];
            $ionicLoading.show({template: 'Loading..'});
            $scope.searchMedicine = function (searchkey) {
                $scope.searchkey = searchkey
                $scope.itemform = '';
                $http({
                    method: 'GET',
                    url: domain + 'inventory/search-medicine',
                    params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey, 'appid': $scope.appId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.getMedicine = response.data.getMedicine;
                    $scope.otherMedicine = response.data.otherMedicine;
                    $scope.inventory = response.data.inventory;
                    $scope.language = response.data.lang.language;
                    //$scope.searchkey  = searchkey
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

            $scope.showPopup = function (mid, name, appid) {
                $scope.medicineId = mid;
                $scope.medicineName = name;
                $http({
                    method: 'GET',
                    url: domain + 'inventory/get-item-form',
                    params: {id: $scope.id, interface: $scope.interface, key: $scope.searchkey, mid: $scope.medicineId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.itemform = response.data.itemform;
                    $scope.qtylang = response.data.qtylang;
                    $scope.language = response.data.lang.language;
                    $scope.data.quantity = 1;
                    $scope.data.itemform = "";
                    var htmlstring = '<div class="row"><div class="col col-33">\n\
                     <input type="number" ng-model="data.quantity"  value="data.quantity" name="qunatity" min="1" >\n\
                        </div><div class="col col-67">\n\
                        <select class="selectpopup"  name="itemform" ng-model="data.itemform" ng-init="-1" required="required" >\n\
                        <option value="" selected>Please Select</option>';
                    angular.forEach($scope.itemform, function (value, key) {
                        htmlstring += '<option  value="' + value.form_name + '">' + value.form_name + '</option>';
                    });
                    htmlstring += '</select>\n\
                        </div>\n\
                        </div>';
                    // An elaborate, custom popup
                    var myPopup = $ionicPopup.show({
                        template: htmlstring,
                        title: $scope.qtylang.quantity[$scope.language],
                        scope: $scope,
                        buttons: [
                            {text: $scope.qtylang.cancel[$scope.language], },
                            {
                                text: '<b>' + $scope.qtylang.ok[$scope.language] + '</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    if ((!$scope.data.quantity) && (!$scope.data.itemform)) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        //alert($scope.data.itemform);
                                        if ($scope.data.itemform != "") {
                                            $http({
                                                method: 'GET',
                                                url: domain + 'inventory/check-stock',
                                                params: {mid: $scope.medicineId, itemform: $scope.data.itemform, qty: $scope.data.quantity}
                                            }).then(function successCallback(response) {
                                                console.log("check-stock" + response.data);
                                                if (response.data == 0) {
                                                    alert('Sorry, Order quantity not in stock');
                                                } else {
                                                    alert(response.data + ' added successfully');
                                                    $scope.dataitem.push({'id': $scope.medicineId, 'name': $scope.medicineName, 'quantity': $scope.data.quantity, 'itemform': $scope.data.itemform});
                                                    return 1;
                                                }
                                            }, function errorCallback(e) {
                                                console.log(e);
                                            });

                                        } else {
                                            alert('Please select item form');
                                        }
                                    }
                                }
                            }
                        ]
                    });
                    myPopup.then(function (res) {
                        console.log('data', res);
                        console.log('dat-----' + $scope.dataitem)
                        if (res == '1') {
                        }
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
                $scope.gotodisbursement = function (mid, appid) {
                    // alert($scope.mid);
                    $rootScope.dataitem = $scope.dataitem;
                    $state.go('app.disbursement', {'mid': $scope.mid, 'appid': $scope.appid}, {reload: true});
                };
            };
            $ionicModal.fromTemplateUrl('infomedicine', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.showInformation = function (mid) {
                    $scope.mid = mid;
                    $http({
                        method: 'GET',
                        url: domain + 'inventory/get-medicine-info',
                        params: {mid: $scope.mid, interface: $scope.interface}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        $scope.medicinefor = response.data.medicinefor;
                        $scope.modal.show();
                    }, function errorCallback(response) {
                        console.log(response);
                    });

                }
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('ContentLibraryListCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('ContentLibraryCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
            $ionicModal.fromTemplateUrl('create-library', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('ContentLibraryDetailsCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('PatientAddCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
            $ionicModal.fromTemplateUrl('patient-add', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            })

            $scope.submitmodal = function () {
                $scope.modal.hide();
            }

        })

        .controller('PatientCtrl', function ($scope, $http, $stateParams, $ionicModal, $state, $timeout) {
            $scope.patientId = $stateParams.id;
            $scope.userId = get('id');
            console.log($scope.patientId);
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.interface = window.localStorage.getItem('interface_id');
            $http({
                method: 'GET',
                url: domain + 'assistants/get-patient-details',
                params: {userId: $scope.userId, patientId: $scope.patientId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.dob = response.data.dob;
                $scope.recordsCreatedCnt = response.data.recordsCreatedCnt;
                $scope.recordsSharedCnt = response.data.recordsSharedCnt;
                $scope.activeAppCnt = response.data.activeAppCnt;
                $scope.pastAppCnt = response.data.pastAppCnt;
                $scope.patientDetails = response.data.patientDetails;
                $scope.language = response.data.lang.language;
                $scope.background = response.data.background;
                $scope.chat = response.data.chat;
                $scope.add = response.data.add;
                $scope.consultations = response.data.consultations;
                $scope.records = response.data.records;
                $scope.action = response.data.action;
                $scope.cancel = response.data.cancel;
                $scope.video = response.data.video;
            }, function errorCallback(e) {
                console.log(e);
            });

            $ionicModal.fromTemplateUrl('patient-add', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            })

            $scope.submitmodal = function () {
                $scope.modal.hide();
            }

            $scope.selDoc = function () {
                console.log($scope.patientId);
                window.localStorage.setItem("patientId", $scope.patientId);
                $scope.modal.hide();
                $state.go("app.app-doctrlist", {}, {reload: true});
            };
        })

        .controller('MyCtrl', function ($scope, $ionicTabsDelegate) {
            $scope.selectTabWithIndex = function (index) {
                $ionicTabsDelegate.select(index);
            };
        })

        .controller('PatientConsultCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('NewarticleCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('LibraryFeedCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('SnowmedtCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('snomed', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AddtreatmenttCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('add-treatmentplan', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('LoincCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('loinc', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AddrelationCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('addrelation', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AddknownCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('AddknownCtrl', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('treaTmentpCtrl', function ($scope, $http, $ionicModal, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-treatment-plan',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.tplan = response.data.tplan;
                $scope.language = response.data.lang.language;
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            $scope.modalclose = function (ulink) {
                $state.go(ulink);
                $scope.modal.hide();
            };
        })

        .controller('CloseModalCtrl', function ($scope, $ionicModal, $state) {
            $scope.modalclose = function (ulink) {
                $state.go(ulink);
                $scope.modal.hide();
            };
        })

        .controller('knowConditionCtrl', function ($scope, $ionicModal, $state) {
            $ionicModal.fromTemplateUrl('knowcondition', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('CancelDoctrscheCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('snomed', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('ConsultationsNoteCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $compile, $ionicModal, $ionicHistory, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            var imgCnt = 0;
            console.log("Measure = " + $rootScope.measurement + "Obj = " + $rootScope.objId + "Dia = " + $rootScope.diaId);
            if ($rootScope.diaId) {
                //$ionicModal.hide();
            }
            $scope.appId = $stateParams.appId;
            $scope.patientName = [{'name': 'No Patient selected'}];
            window.localStorage.setItem('appId', $scope.appId);
            $scope.mode = '';
            $scope.catId = '';
            $scope.recId = $rootScope.recCId;
            $scope.userId = window.localStorage.getItem('id');
            $scope.caseId = '';
            $scope.images = [];
            $scope.image = [];
            $scope.tempImgs = [];
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.prescription = 'Yes';
            $scope.curTime = new Date();
            if ($scope.appId != 0) {
                console.log('get appointment details' + $scope.appId);
                $http({
                    method: "GET",
                    url: domain + "assistrecords/get-app-details",
                    params: {appId: $scope.appId, userId: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    // leena this two line commented by me. bcox was getting error--- bhavana
                    $scope.patientId = response.data.patient.id;

                    $scope.doctorId = response.data.doctr.id

                    $scope.app = response.data.app;
                    $scope.fhistory = response.data.fhistory;
                    $scope.language = response.data.lang.language;
                    if (response.data.app.mode == 1) {
                        $scope.mode = 'Video';
                    } else if (response.data.app.mode == 2) {
                        $scope.mode = 'Chat';
                    } else if (response.data.app.mode = 3) {
                        $scope.mode = 'Clinic'
                    } else if (response.data.app.mode == 4) {
                        $scope.mode = 'Home';
                    }
                    console.log($scope.mode);
                    $scope.pType = 'Outpatient';
                    $scope.conDate = $filter('date')(new Date(response.data.app.scheduled_start_time), 'dd-MM-yyyy');
                    $scope.curTimeo = $filter('date')(new Date(response.data.app.scheduled_start_time), 'hh:mm a');
                    window.localStorage.setItem('patientId', $scope.patientId);
                    window.localStorage.setItem('doctorId', $scope.doctorId);
                    console.log($scope.conDate);
                    $http({
                        method: 'GET',
                        url: domain + 'assistrecords/get-fields',
                        params: {patient: $scope.patientId, userId: $scope.userId, doctr_Id: $scope.doctorId, catId: $scope.catId, interface: $scope.interface, recId: $scope.recId}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        $scope.record = response.data.record;
                        $scope.fields = response.data.fields;
                        $scope.problems = response.data.problems;
                        $scope.doctrs = response.data.doctrs;
                        $scope.patients = response.data.patients;
                        $scope.cases = response.data.cases;
                        $scope.preRec = response.data.recordData;
                        $scope.preRecData = response.data.recordDetails;
                        angular.forEach($scope.preRecData, function (val, key) {
                            if (val.fields.field == 'case-id') {
                                $scope.casetype = '0';
                                $scope.caseId = val.value;
                            }
                            if (val.attachments.length > 0) {
                                jQuery('#coninprec').removeClass('hide');
                            }
                            if (val.fields.field == 'Includes Prescription') {
                                $scope.prescription = val.value;
                                if (val.value == 'Yes') {
                                    jQuery('#convalid').removeClass('hide');
                                }
                            }
                        });
                        $scope.cnote = response.data.cnote;
                        $scope.language = response.data.lang.language;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }, function errorCallback(e) {
                    console.log(e);
                });
            } else {
                store({'from': 'app.assistants'});
                console.log('----' + get('patientId') + '---');
                if (get('patientId') == 0) {
                    $scope.patientId = '';
                    $scope.doctorId = '';
                    $scope.patientName = [{'name': 'No Patient selected'}];
                    window.localStorage.setItem('patientId', '0');
                    window.localStorage.setItem('doctorId', $scope.doctorId);
                } else {
                    $scope.patientId = get('patientId');
                    $scope.doctorId = get('doctorId');
                }
                $http({
                    method: 'GET',
                    url: domain + 'assistrecords/get-fields',
                    params: {patient: $scope.patientId, userId: $scope.userId, doctr_Id: $scope.doctorId, catId: $scope.catId, interface: $scope.interface, recId: $scope.recId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.record = response.data.record;
                    $scope.fields = response.data.fields;
                    $scope.problems = response.data.problems;
                    $scope.doctrs = response.data.doctrs;
                    $scope.patients = response.data.patients;
                    $scope.preRec = response.data.recordData;
                    $scope.preRecData = response.data.recordDetails;
                    if ($scope.preRecData.length > 0) {
                        angular.forEach($scope.preRecData, function (val, key) {
                            console.log(val.value);
                            if (val.fields.field == 'Case Id') {
                                $scope.casetype = '0';
                                $scope.caseId = val.value;
                            }
                            if (val.fields.field == 'Attachments') {
                                console.log("Attach length " + val.attachments.length);
                                if (val.attachments.length > 0) {
                                    jQuery('#coninprec').removeClass('hide');
                                }
                            }
                            if (val.fields.field == 'Includes Prescription') {
                                $scope.prescription = val.value;
                                if (val.value == 'Yes') {
                                    jQuery('#convalid').removeClass('hide');
                                }
                            }
                            if (val.fields.field == 'Valid till') {
                                $scope.validTill = $filter('date')(new Date(val.value), 'dd-MM-yyyy');
                            }
                            if (val.fields.field == 'Consultation Date') {
                                $scope.conDate = $filter('date')(new Date(val.value), 'MM-dd-yyyy');
                            }
                            if (val.fields.field == 'Consultation Time') {
                                $scope.curTimeo = $filter('date')(new Date(val.value), 'hh:mm a');
                            }
                            if (val.fields.field == 'Patient Type') {
                                $scope.pType = val.value;
                            }
                            if (val.fields.field == 'Mode') {
                                $scope.mode = val.value;
                            }
                        });
                    } else {
                        $scope.conDate = new Date();
                        $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
                    }
                    console.log("Con date " + $scope.conDate);
                    console.log("Con Time " + $scope.curTimeo);
                    $scope.cases = response.data.cases;
                    $scope.cnote = response.data.cnote;
                    $scope.language = response.data.lang.language;
                    angular.forEach($scope.patients, function (value, key) {
                        if (value.id == $scope.patientId) {
                            $scope.patientName = [{'name': value.fname}];
                        }
                    });
                    if ($scope.patients.length > 0) {
                        var data = $scope.patients;
                        $scope.users = _.reduce(
                                data,
                                function (output, fname) {
                                    var lCase = fname.fname.toUpperCase();
                                    if (output[lCase[0]]) //if lCase is a key
                                        output[lCase[0]].push(fname); //Add name to its list
                                    else
                                        output[lCase[0]] = [fname]; // Else add a key
                                    //console.log(output);
                                    return output;
                                },
                                {}
                        );
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
            $scope.selPatient = function (pid, name) {
                console.log(pid + "Name = " + name);
                $scope.patientId = pid;
                window.localStorage.setItem('patientId', pid);
                $scope.getPatientId(pid);
                $scope.patientName = [{'name': name}];
                console.log($scope.patientName);
                $scope.modal.hide();
            };
            $scope.gotopage = function (glink) {
                $state.go(glink);
            };
            $scope.getPatientId = function (pid) {
                console.log(pid);
                $scope.patientId = pid;
                $rootScope.patientId = pid;
                window.localStorage.setItem('patientId', pid);
                if ($scope.doctorId) {
                    if ($scope.patientId != 0) {
                        console.log('call cases');
                        $http({
                            method: 'GET',
                            url: domain + 'assistrecords/get-cases',
                            params: {patient: $scope.patientId, doctrId: $scope.doctorId}
                        }).then(function successCallback(response) {
                            console.log(response);
                            $scope.cases = response.data;
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                }
            };
            $scope.getDrId = function (did) {
                console.log(did);
                $scope.doctorId = did;
                $rootScope.doctorId = did;
                window.localStorage.setItem('doctorId', did);
                if ($scope.doctorId) {
                    if ($scope.patientId != 0) {
                        console.log('call cases');
                        $http({
                            method: 'GET',
                            url: domain + 'assistrecords/get-cases',
                            params: {patientId: $scope.patientId, doctrId: $scope.doctorId}
                        }).then(function successCallback(response) {
                            console.log(response);
                            $scope.cases = response.data;
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                }
            };
            $scope.check = function (pid, did) {
                console.log("Patient = " + pid + " dr Id = " + did);
                if (pid == '' && did == '' || (pid == null && did == null)) {
                    alert("Please select doctor and patient.");
                } else if (pid == '' || pid == null) {
                    alert("Please select patient.");
                } else if (did == '' || did == null) {
                    alert("Please select doctor.");
                } else {
                    if ($scope.tempImgs.length > 0) {
                        angular.forEach($scope.tempImgs, function (value, key) {
                            $scope.picData = getImgUrl(value);
                            var imgName = value.substr(value.lastIndexOf('/') + 1);
                            $scope.ftLoad = true;
                            var imup = $scope.uploadPicture();
                            alert("Image upload var " + imup);
                            $scope.image.push(imgName);
                            console.log($scope.image);
                        });
                        jQuery('#camfilee').val($scope.image);
                        console.log($scope.images);
                        var data = new FormData(jQuery("#addRecordForm")[0]);
                        callAjax("POST", domain + "assistrecords/save-consultation", data, function (response) {
                            console.log(response);
                            $ionicLoading.hide();
                            if (angular.isObject(response.records)) {
                                $scope.image = [];
                                $scope.recId = response.records.id;
                                $rootScope.recCId = $scope.recId;
                                $state.go('app.notetype');
                            } else if (response.err != '') {
                                alert('Please fill mandatory fields');
                            }
                        });
                    } else {
                        var data = new FormData(jQuery("#addRecordForm")[0]);
                        callAjax("POST", domain + "assistrecords/save-consultation", data, function (response) {
                            console.log(response);
                            $ionicLoading.hide();
                            if (angular.isObject(response.records)) {
                                $scope.recId = response.records.id;
                                $rootScope.recCId = $scope.recId;
                                $state.go('app.notetype');
                            } else if (response.err != '') {
                                alert('Please fill mandatory fields');
                            }
                        });
                    }
                }
            };
            //Save FormData
            $scope.submit = function () {
                $ionicLoading.show({template: 'Adding...'});
                $scope.from = get('from');
                console.log("TempImgs Save= " + $scope.tempImgs);
                if ($scope.tempImgs.length > 0) {
                    angular.forEach($scope.tempImgs, function (value, key) {
                        $scope.picData = $scope.image[key]; //getImgUrl(value);
                        console.log($scope.picData);
                        var imgName = value.substr(value.lastIndexOf('/') + 1);
                        console.log("From for " + imgName);
                        $scope.ftLoad = true;
                        $scope.uploadPicture();
                        $scope.image.push(imgName);
                        console.log($scope.image);
                    });
                    jQuery('#camfilee').val($scope.image);
                    console.log($scope.images);
                    var data = new FormData(jQuery("#addRecordForm")[0]);
                    callAjax("POST", domain + "assistrecords/save-consultation", data, function (response) {
                        console.log(response);
                        $ionicLoading.hide();
                        if (angular.isObject(response.records)) {
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            $scope.image = [];
                            alert("Consultation Note added successfully!");
                            if ($scope.from == 'app.appointment-list')
                                $state.go('app.appointment-list', {}, {reload: true});
                            else if ($scope.from == 'app.past-appointment-list')
                                $state.go('app.past-appointment-list', {}, {reload: true});
                            else if ($scope.from == 'app.patient-app-list')
                                $state.go('app.patient-app-list', {'id': $scope.patientId}, {reload: true});
                            else if ($scope.from == 'app.patient-past-app-list')
                                $state.go('app.patient-app-list', {'id': $scope.patientId}, {reload: true});
                            else if ($scope.from == 'app.doctor-consultations')
                                $state.go('app.doctor-consultations', {'id': $scope.doctorId}, {reload: true});
                            else if ($scope.from == 'app.consultation-past')
                                $state.go('app.consultation-past', {'id': $scope.doctorId}, {reload: true});
                            else
                                $state.go('app.assistants', {}, {reload: true});
                        } else if (response.err != '') {
                            alert('Please fill mandatory fields');
                        }
                    });
                } else {
                    var data = new FormData(jQuery("#addRecordForm")[0]);
                    callAjax("POST", domain + "assistrecords/save-consultation", data, function (response) {
                        console.log(response);
                        $ionicLoading.hide();
                        if (angular.isObject(response.records)) {
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            alert("Consultation Note added successfully!");
                            if ($scope.from == 'app.appointment-list')
                                $state.go('app.appointment-list', {}, {reload: true});
                            else if ($scope.from == 'app.past-appointment-list')
                                $state.go('app.past-appointment-list', {}, {reload: true});
                            else if ($scope.from == 'app.patient-app-list')
                                $state.go('app.patient-app-list', {'id': $scope.patientId}, {reload: true});
                            else if ($scope.from == 'app.patient-past-app-list')
                                $state.go('app.patient-app-list', {'id': $scope.patientId}, {reload: true});
                            else if ($scope.from == 'app.doctor-consultations')
                                $state.go('app.doctor-consultations', {'id': $scope.doctorId}, {reload: true});
                            else if ($scope.from == 'app.consultation-past')
                                $state.go('app.consultation-past', {'id': $scope.doctorId}, {reload: true});
                            else
                                $state.go('app.assistants', {}, {reload: true});
                        } else if (response.err != '') {
                            alert('Please fill mandatory fields');
                        }
                    });
                }

                function getImgUrl(imageName) {
                    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                    var trueOrigin = cordova.file.dataDirectory + name;
                    return trueOrigin;
                }
            };
            $scope.getCase = function (type) {
                console.log(type);
                if (type == 1) {
                    jQuery(".fields #precase").addClass('hide');
                    jQuery(".fields #newcase").removeClass('hide');
                } else if (type == 0) {
                    jQuery(".fields #precase").removeClass('hide');
                    jQuery(".fields #newcase").addClass('hide');
                }
            };
            //Take images with camera
            $scope.takePict = function (name) {
                //console.log(name);
                var camimg_holder = $("#camera-status");
                //camimg_holder.empty();
                // 2
                var options = {
                    destinationType: Camera.DestinationType.FILE_URI, // FILE_URI
                    sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                };
                // 3
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    //alert(imageData);
                    var imageData = imageData;
                    onImageSuccess(imageData);
                    function onImageSuccess(imageData) {
                        var imageName = imageData.substr(imageData.lastIndexOf('/') + 1);
                        console.log(imageName);
                        //entry.nativeURL;
                        $scope.images.push(imageData);
                        $scope.tempImgs.push(imageName);
                        //Display fields
                        console.log("Image URL" + $scope.images);
                        console.log($scope.tempImgs.length);
                        if ($scope.tempImgs.length == 0) {
                            console.log($("#image-holder").html());
                            if (($("#image-holder").html()) == '') {
                                jQuery('#convalid').addClass('hide');
                                jQuery('#coninprec').addClass('hide');
                            } else {
                                jQuery('#convalid').removeClass('hide');
                                jQuery('#coninprec').removeClass('hide');
                            }
                        } else {
                            jQuery('#convalid').removeClass('hide');
                            jQuery('#coninprec').removeClass('hide');
                        }
                        $scope.picData = getImgUrl(imageName);
                        //alert($scope.picData);
                        $scope.ftLoad = true;
                        imgCnt++;
                        var btnhtml = $compile('<div class="remcam-' + imgCnt + '"><button class="removeattach remove" ng-click="removeCamFile(\'' + imgCnt + '\')">X</button></div>')($scope);
                        camimg_holder.append(btnhtml);
                        $('<div class="remcam-' + imgCnt + '"><span class="upattach"><i class="ion-paperclip"></i></span></div>').appendTo(camimg_holder);
                        //createFileEntry(fileURI);
                    }
//                    function createFileEntry(fileURI) {
//                        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
//                    }$scope.images                    
//                    // 5
//                    function copyFile(fileEntry) {
//                        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
//                        var newName = makeid() + name;
//                        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
//                            fileEntry.copyTo(
//                                    fileSystem2,
//                                    newName,
//                                    onCopySuccess,
//                                    fail
//                                    );
//                        },
//                                fail);
//                    }
                    // 6
//                    function onCopySuccess(entry) {
//                        var imageName = entry.nativeURL;
//                        $scope.$apply(function () {
//                            $scope.tempImgs.push(imageName);
//                        });
//                        //Display fields
//                        console.log($scope.tempImgs.length);
//                        if ($scope.tempImgs.length == 0) {
//                            console.log($("#image-holder").html());
//                            if (($("#image-holder").html()) == '') {
//                                jQuery('#convalid').addClass('hide');
//                                jQuery('#coninprec').addClass('hide');
//                            } else {
//                                jQuery('#convalid').removeClass('hide');
//                                jQuery('#coninprec').removeClass('hide');
//                            }
//                        } else {
//                            jQuery('#convalid').removeClass('hide');
//                            jQuery('#coninprec').removeClass('hide');
//                        }
//                        $scope.picData = getImgUrl(imageName);
//                        alert($scope.picData);
//                        $scope.ftLoad = true;
//                        imgCnt++;
//                        var btnhtml = $compile('<div class="remcam-' + imgCnt + '"><button class="button button-positive remove" ng-click="removeCamFile(\'' + imgCnt + '\')">X</button></div>')($scope);
//                        camimg_holder.append(btnhtml);
//                        $('<div class="remcam-' + imgCnt + '"><span class="upattach"><i class="ion-paperclip"></i></span></div>').appendTo(camimg_holder);
//                    }
                    function fail(error) {
                        console.log("fail: " + error.code);
                    }
                    function makeid() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 5; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    }
                    function getImgUrl(imageName) {
                        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                        var trueOrigin = cordova.file.dataDirectory + name;
                        return trueOrigin;
                    }
                }, function (err) {
                    console.log(err);
                });
            };
            $scope.uploadPicture = function () {
                //$ionicLoading.show({template: 'Uploading..'});
                var fileURL = $scope.picData;
                var name = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;
                var params = {};
//                params.value1 = "someparams";
//                params.value2 = "otherparams";
//                options.params = params;
                var uploadSuccess = function (response) {
                    alert('Success  ====== ');
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);
                    //$scope.image.push(name);
                    //$ionicLoading.hide();
                }
                var ft = new FileTransfer();
                ft.upload(fileURL, encodeURI(domain + 'assistrecords/upload-attachment'), uploadSuccess, function (error) {
                    console.log("Error = " + error.code);
                    //$ionicLoading.show({template: 'Error in connecting...'});
                    //$ionicLoading.hide();
                }, options);
            };
            $scope.setFile = function (element) {
                $scope.currentFile = element.files[0];
                console.log('length = ' + element.files.length);
                var image_holder = $("#image-holder");
                image_holder.empty();
                if (element.files.length > 0) {
                    console.log($("#camera-status").html());
                    jQuery('#convalid').removeClass('hide');
                    jQuery('#coninprec').removeClass('hide');
                    //jQuery('#valid-till').attr('required', true);
                    image_holder.append('<button class="button button-positive remove" onclick="removeFile()">Remove Files</button><br/>');
                } else {
                    if (($("#camera-status").html()) != '') {
                        jQuery('#convalid').removeClass('hide');
                        jQuery('#coninprec').removeClass('hide');
                    } else {
                        jQuery('#convalid').addClass('hide');
                        jQuery('#coninprec').addClass('hide');
                    }
                    //jQuery('#valid-till').attr('required', false);
                }
                if (typeof (FileReader) != "undefined") {
                    //loop for each file selected for uploaded.
                    for (var i = 0; i < element.files.length; i++) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
//                            $("<img />", {
//                                "src": e.target.result,
//                                "class": "thumb-image"
//                            }).appendTo(image_holder);
                            //$scope.images.push(e.target.result);
                            $('<span class="upattach"><i class="ion-paperclip"></i></span>').appendTo(image_holder);
                        }
                        image_holder.show();
                        reader.readAsDataURL(element.files[0]);
                    }
                }
            };
            $scope.removeCamFile = function (img) {
                var arrInd = (img - 1);
                var index = $scope.tempImgs.indexOf(arrInd);
                $scope.tempImgs.splice(index, 1);
                console.log('camera file removed');
                console.log($scope.tempImgs.length);
                jQuery('.remcam-' + img).remove();
                if ($scope.tempImgs.length == 0) {
                    if (($("#image-holder").html()) == '') {
                        jQuery('#convalid').addClass('hide');
                        jQuery('#coninprec').addClass('hide');
                    } else {
                        jQuery('#convalid').removeClass('hide');
                        jQuery('#coninprec').removeClass('hide');
                    }
                } else {
                    jQuery('#convalid').removeClass('hide');
                    jQuery('#coninprec').removeClass('hide');
                }
            };
            $scope.getPrescription = function (pre) {
                console.log('pre ' + pre);
                if (pre === ' No') {
                    console.log("no");
                    jQuery('#convalid').addClass('hide');
                } else if (pre === 'Yes') {
                    console.log("yes");
                    jQuery('#convalid').removeClass('hide');
                }
            };

            $ionicModal.fromTemplateUrl('selectpatient', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('NotetypeCtrl', function ($scope, $http, $ionicModal, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-notetype',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.notetype = response.data.notetype;
                $scope.language = response.data.lang.language;
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.modalclose = function (ulink) {
                $state.go(ulink);
            };
        })

        .controller('selectPatientCtrl', function ($scope, $ionicModal) { })

        .controller('FamilyHistoryCtrl', function ($scope, $http, $state, $ionicModal, $ionicLoading) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.catId = 'Family History';
            $scope.conId = [];
            $scope.conIds = [];
            $scope.selConditions = [];
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-family-history',
                params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId, interface: $scope.interface}
            }).then(function successCallback(response) {
                $scope.record = response.data.record;
                $scope.recorddata = response.data.recorddata;
                $scope.knConditions = response.data.recConditions;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patients;
                $scope.cases = response.data.cases;
                $scope.abt = response.data.abt;
                $scope.conditions = response.data.conditions;
                $scope.selCondition = response.data.knConditions;
                $scope.familyhistory = response.data.familyhistory;
                if ($scope.selCondition.length > 0) {
                    angular.forEach($scope.selCondition, function (val, key) {
                        $scope.conIds.push(val.id);
                        $scope.selConditions.push({'condition': val.condition});
                    });
                }
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getCondition = function (id, con) {
                console.log(id + "==" + con);
                var con = con.toString();
                if ($scope.conId[id]) {
                    $scope.conIds.push(id);
                    $scope.selConditions.push({'condition': con});
                } else {
                    var index = $scope.conIds.indexOf(id);
                    $scope.conIds.splice(index, 1);
                    for (var i = $scope.selConditions.length - 1; i >= 0; i--) {
                        if ($scope.selConditions[i].condition == con) {
                            $scope.selConditions.splice(i, 1);
                        }
                    }
                }

                jQuery("#selcon").val($scope.conIds);
                console.log($scope.selConditions);
            };
            $scope.saveFamilyHistory = function () {
                //alert('dsfsdf');
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addFamilyForm")[0]);
                // alert(data);
                console.log(data);
                callAjax("POST", domain + "assistrecords/save-family-history", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (angular.isObject(response.records)) {
                        alert("Family History saved successfully!");
                        jQuery("#addFamilyForm")[0].reset();
                        // $state.go('app.notetype',{reload: true});
                        $scope.modal.hide();
                        $state.go('app.family-history', {}, {reload: true});
                        //window.location.reload();
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {reload: true});
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };
            $ionicModal.fromTemplateUrl('addrelation', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };

        })

        .controller('PatientHistoryCtrl', function ($scope, $http, $stateParams, $state, $rootScope, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.catId = 'Patient History';
            $scope.conId = [];
            $scope.conIds = [];
            $scope.selConditions = [];
            $scope.gender = '';
            $scope.gen = [];
            //$stateParams.drId
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm a');
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-about-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.abt);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patients;
                $scope.cases = response.data.cases;
                $scope.abt = response.data.abt;
                $scope.pateinthistory = response.data.pateinthistory;
                $scope.language = response.data.lang.language;
                console.log(response.data.patients[0].dob);
                if (response.data.dob) {
                    $scope.dob = new Date(response.data.dob);
                } else if (response.data.patients[0].dob != '0000-00-00') {
                    $scope.dob = new Date(response.data.patients[0].dob);
                } else {
                    $scope.dob = new Date();
                }
                //$scope.dob = $filter('date')(response.data.dob, 'MM dd yyyy');
                if ($scope.abt.length > 0) {
                    angular.forEach($scope.abt, function (val, key) {
                        console.log(val.fields.field + "==" + val.value);
                        var field = val.fields.field;
                        if (field.toString() == 'Gender') {
                            console.log(field);
                            $scope.gender = val.value;
                            console.log(val.value);
                            if (val.value == 1) {
                                $scope.gen['Male'] = 'on';
                                $scope.gender = 'Male';
                            } else if (val.value == 2) {
                                $scope.gen['Female'] = 'on';
                                $scope.gender = 'Female';
                            }
                        }
                    });
                } else {
                    if (response.data.patients[0].gender == 1) {
                        console.log('male patient');
                        $scope.gen['Male'] = 'on';
                        $scope.gender = 'Male';
                    } else if (response.data.patients[0].gender == 2) {
                        console.log('male patient');
                        $scope.gen['Female'] = 'on';
                        $scope.gender = 'Female';
                    }
                }
                console.log($scope.gender);
                $scope.selCondition = response.data.knConditions;
                if ($scope.selCondition.length > 0) {
                    angular.forEach($scope.selCondition, function (val, key) {
                        $scope.conIds.push(val.id);
                        $scope.selConditions.push({'condition': val.condition});
                    });
                }
                $scope.conditions = response.data.conditions;
                console.log($scope.conIds);
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.gotopage = function (glink) {
                $state.go(glink);
            };
            $scope.getCondition = function (id, con) {
                console.log(id + "==" + con);
                var con = con.toString();
                if ($scope.conId[id]) {
                    $scope.conIds.push(id);
                    $scope.selConditions.push({'condition': con});
                } else {
                    var index = $scope.conIds.indexOf(id);
                    $scope.conIds.splice(index, 1);
                    for (var i = $scope.selConditions.length - 1; i >= 0; i--) {
                        if ($scope.selConditions[i].condition == con) {
                            $scope.selConditions.splice(i, 1);
                        }
                    }
                }
                jQuery("#selcon").val($scope.conIds);
                console.log($scope.selConditions);
            };
            $scope.getCheck = function (gen) {
                console.log(gen);
            };
            $scope.getPreCon = function (conId) {
                if ($scope.conIds.indexOf(conId) != -1)
                    return 1;
                else
                    return 0;
//                for (var i = $scope.selConditions.length - 1; i >= 0; i--) {
//                    if($scope.conIds.indexOf(conId)!= -1)
//                        return 1;
//                    else return 0;
//                }
            };
            //Save Patient History
            $scope.savePatientHistory = function () {
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addPatientForm")[0]);
                callAjax("POST", domain + "assistrecords/save-patient-history", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (angular.isObject(response.records)) {
                        alert("Patient History saved successfully!");
                        $state.go('app.notetype');
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {reload: true});
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };
        })

        .controller('MeasurementCtrl', function ($scope, $http, $stateParams, $state, $rootScope, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            console.log($stateParams.mid);
            $scope.mid = $stateParams.mid;
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.catId = 'Measurements';
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-measure-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctor: $scope.doctorId, catId: $scope.catId, interface: $scope.interface, mid: $stateParams.mid}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.records = response.data.record;
                $scope.fields = response.data.fields;
                $scope.editRec = response.data.editRec;
                $scope.abt = response.data.abt;
                $scope.measurement = response.data.measurement;
                $scope.language = response.data.lang.language;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.saveMeasurements = function () {
                //$ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addMeasureForm")[0]);
                callAjax("POST", domain + "assistrecords/save-measurements", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (response.err == '') {
                        alert("Measurements saved successfully!");
                        $rootScope.measure = 'yes';
                        $rootScope.measurement = response.records;
                        $state.go('app.notetype');
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {reload: true});
                    } else if (response.err != '') {
                        alert('Please fill mandatory fields');
                    }
                });
            };
        })

        .controller('ObservationCtrl', function ($scope, $http, $stateParams, $state, $rootScope, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            $scope.objId = $stateParams.objid;
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.objText = [];
            $scope.selConditions = [];
            $scope.observation = '';
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-observations-lang',
                params: {userId: $scope.userId, interface: $scope.interface, objId: $stateParams.objid}
            }).then(function successCallback(response) {
                if (response.data.recdata != '') {
                    $scope.objText = response.data.recdata.metadata_values;
                    $rootScope.objText = $scope.objText;
                }
                $scope.observations = response.data.observations;
                $scope.language = response.data.lang.language;
            }, function errorCallback(e) {
                console.log(e);
            });
            $ionicModal.fromTemplateUrl('addeval', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.showM = function () {
                    $scope.observation = '';
                    $scope.modal.show();
                };
            });
            $scope.submitmodal = function (observation) {
                alert(observation);
                $scope.objText.push({'value': observation});
                $rootScope.objText = $scope.objText;
                $scope.observation = '';
                $scope.modal.hide();
            };

            $scope.saveObj = function () {
                console.log($scope.objText);
                $http({
                    method: 'GET',
                    url: domain + 'assistrecords/save-observations',
                    params: {patient: $scope.patientId, userId: $scope.userId, objType: 'Text', doctor: $scope.doctorId, catId: $scope.catId, objText: JSON.stringify($scope.objText), objId: $stateParams.objid}
                }).then(function successCallback(response) {
                    if (angular.isObject(response.data.records)) {
                        $rootScope.objId = response.data.records.id;
                        alert("Observations added succesesfully!");
                        $state.go('app.notetype');
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {reload: true});
                    }
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
        })

        .controller('PlaintestCtrl', function ($scope, $ionicModal, $rootScope) {
            $ionicModal.fromTemplateUrl('editVal', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.showEM = function (ind) {
                    console.log("khkh" + ind);
                    $scope.ind = ind;
                    $scope.observation = $rootScope.objText[ind].value;
                    $scope.modal.show();
                };
            });
            $scope.submitmodal = function (observation) {
                $rootScope.objText[$scope.ind].value = observation;
                console.log($rootScope.objText);
                $scope.modal.hide();
            };
        })

        .controller('TestResultCtrl', function ($scope, $http, $stateParams, $state, $rootScope, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            $scope.testid = $stateParams.testid;
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('id');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.objText = [];
            $scope.observation = {};
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-testresult-lang',
                params: {userId: $scope.userId, interface: $scope.interface, objId: $stateParams.testid}
            }).then(function successCallback(response) {
                if (response.data.recdata != '') {
                    $scope.objText = response.data.recdata.metadata_values;
                    $rootScope.objText = $scope.objText;
                }
                $scope.observations = response.data.observations;
                $scope.language = response.data.lang.language;
            }, function errorCallback(e) {
                console.log(e);
            });
            $ionicModal.fromTemplateUrl('addeval', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.showM = function () {
                    $scope.observation = {value: ''};
                    $scope.modal.show();
                };
            });
            $scope.submitmodal = function (observation) {
                alert(observation);
                $scope.objText.push({'value': observation});
                $rootScope.objText = $scope.objText;
                $scope.observation = {value: ''};
                $scope.modal.hide();
            };
            $scope.saveTestresult = function () {
                console.log($scope.objText);
                $http({
                    method: 'GET',
                    url: domain + 'assistrecords/save-testresults',
                    params: {patient: $scope.patientId, userId: $scope.userId, objType: 'Text', doctor: $scope.doctorId, catId: $scope.catId, objText: JSON.stringify($scope.objText), objId: $stateParams.testid}
                }).then(function successCallback(response) {
                    if (angular.isObject(response.data.records)) {
                        $rootScope.testId = response.data.records.id;
                        alert("Test Results added succesesfully!");
                        $state.go('app.notetype');
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {reload: true});
                    }
                }, function errorCallback(e) {
                    console.log(e);
                });
            };

        })

        .controller('PlaintestResultCtrl', function ($scope, $ionicModal, $rootScope) {
            $ionicModal.fromTemplateUrl('editVal', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.showEM = function (ind) {
                    console.log("khkh" + ind);
                    $scope.ind = ind;
                    $scope.observation = $rootScope.objText[ind].value;
                    $scope.modal.show();
                };
            });
            $scope.submitmodal = function (observation) {
                $rootScope.objText[$scope.ind].value = observation;
                console.log($rootScope.objText);
                $scope.modal.hide();
            };
        })

        .controller('DiagnosisTextCtrl', function ($scope, $ionicModal, $rootScope, $http, $state, $stateParams) {
            $scope.diaId = $stateParams.diaid;
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId');
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.diaText = {};
            $scope.diaText.value = '';
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-diagnosis-lang',
                params: {userId: $scope.userId, interface: $scope.interface, diaId: $scope.diaId}
            }).then(function successCallback(response) {
                if (response.data.recdata != '') {
                    $scope.diaText.value = response.data.recdata.value;
                }
                $scope.diagnosis = response.data.diagnosis;
                $scope.language = response.data.lang.language;
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.saveDiagnosis = function (data) {
                $http({
                    method: 'GET',
                    url: domain + 'assistrecords/save-diagnosis',
                    params: {patient: $scope.patientId, userId: $scope.userId, diaType: 'Text', doctor: $scope.doctorId, catId: $scope.catId, diaText: $scope.diaText.value, diaId: $scope.diaId}
                }).then(function successCallback(response) {
                    if (angular.isObject(response.data.records)) {
                        console.log(response.data.records.id);
                        $rootScope.diaId = response.data.records.id;
                        alert("Diagnosis added succesesfully!");
                        //$scope.modal.hide();
                        $state.go('app.notetype');
                        //$state.go('app.consultations-note', {'appId': $scope.appId}, {reload: true});
                    }
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
//            $ionicModal.fromTemplateUrl('addeval', {
//                scope: $scope
//            }).then(function (modal) {
//                $scope.modal = modal;
//            });
//            $scope.submitmodal = function (data) {
//                console.log(data.diagnosis);
//                //$scope.modal.hide();
//            };
        })

        .controller('DietplanCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter) {
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.catId = 'Diet Plan';
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.doctorId = window.localStorage.getItem('doctorId'); //$stateParams.drId
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm a');
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-about-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patients;
                $scope.cases = response.data.cases;
            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('DietplanListCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $ionicModal.fromTemplateUrl('add-diet', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };

        })
        //View Note 
        .controller('ViewConsultationsNoteCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $sce, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            $scope.noteId = $stateParams.id;
            $scope.userId = window.localStorage.getItem('id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $scope.record = {};
            $scope.recordDetails = {};
            $scope.problems = {};
            $scope.doctrs = {};
            $scope.patients = {};
            $scope.cases = {};
            $scope.isAttachment = '';
            $scope.measurements = {value: 'no'};
            $scope.obj = {value: 'no'};
            $scope.testResult = {value: 'no'};
            $scope.diagnosis = {value: 'no'};
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-note-details',
                params: {noteId: $scope.noteId, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.recordDetails = response.data.recordsDetails;
                $scope.problems = response.data.problem;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patient;
                $scope.cases = response.data.caseData;
                $scope.otherRecords = response.data.otherRecords;
                angular.forEach($scope.otherRecords, function (val, key) {
                    if (val.category == '12' || val.category == '13' || val.category == '16') {
                        $scope.measurements = {value: 'yes'};
                    } else if (val.category == '27') {
                        $scope.obj = {value: 'yes'};
                    } else if (val.category == '29') {
                        $scope.testResult = {value: 'yes'};
                    } else if (val.category == '') {
                        $scope.diagnosis = {value: 'yes'};
                    }
                });
                angular.forEach($scope.recordDetails, function (val, key) {
                    if (val.fields.field == 'Attachments') {
                        $scope.isAttachment = val.attachments.length;
                    }
                });
                console.log($scope.recordDetails);
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.path = "";
            $scope.name = "";
            $ionicModal.fromTemplateUrl('filesview.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.showm = function (path, name) {
                    $scope.path = path;
                    $scope.name = name;
                    console.log(path + '=afd =' + name);
                    $scope.value = $rootScope.attachpath + path + name;
                    $scope.modal.show();
                }

            }, {
                // Use our scope for the scope of the modal to keep it simple  ViewPatientHistoryCtrl
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };

            $scope.print = function () {
                //  console.log("fsfdfsfd");
                //  var printerAvail = $cordovaPrinter.isAvailable();

                var print_page = '<img src="' + $rootScope.attachpath + $scope.path + $scope.name + '"  height="auto" maxwidth="100%" />';

                cordova.plugins.printer.print(print_page, 'Print', function () {
                    alert('printing finished or canceled');
                });
            };
            $scope.getMeasureDetails = function (id, type) {
                console.log(id + "===" + type);
                if (type == 'measurements') {
                    $state.go('app.view-measure-details', {id: id, type: type}, {reload: true});
                } else {
                    $state.go('app.view-cn-details', {id: id, type: type}, {reload: true});
                }
            };
            $scope.getCnDetails = function (id, type) {
                console.log(id + "===" + type);
                $state.go('app.view-cn-details', {id: id, type: type}, {reload: true});
            };

        })

        .controller('MeasureDetailsCtrl', function ($scope, $http, $state, $sce, $rootScope, $stateParams) {
            $scope.cnId = $stateParams.id;
            $scope.type = $stateParams.type;
            $scope.userId = get('id');
            $scope.doctrId = get('id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            console.log($scope.cnId + '==' + $scope.type);
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-measure-details',
                params: {noteId: $scope.cnId, userId: $scope.userId, interface: $scope.interface, type: $scope.type}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.records = response.data.records;
                $scope.recordDetails = response.data.recordsDetails;
                $scope.problems = response.data.problem;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patient;
                $scope.cases = response.data.caseData;
                angular.forEach($scope.recordDetails, function (val, key) {
                    if (val.fields.field == 'Attachments') {
                        $scope.isAttachment = val.attachments.length;
                    }
                });
                console.log($scope.recordDetails);
            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('OtherDetailsCtrl', function ($scope, $http, $state, $sce, $rootScope, $stateParams) {
            $scope.cnId = $stateParams.id;
            $scope.type = $stateParams.type;
            $scope.userId = get('id');
            $scope.doctrId = get('id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            console.log($scope.cnId + '==' + $scope.type);
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-cn-details',
                params: {noteId: $scope.cnId, userId: $scope.userId, interface: $scope.interface, type: $scope.type}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.records;
                $scope.recordDetails = response.data.recordsDetails;
                $scope.problems = response.data.problem;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patient;
                $scope.cases = response.data.caseData;
                angular.forEach($scope.recordDetails, function (val, key) {
                    if (val.fields.field == 'Attachments') {
                        $scope.isAttachment = val.attachments.length;
                    }
                });
                console.log($scope.recordDetails);
            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('ViewMedicineCtrl', function ($scope, $http, $stateParams, $rootScope, $state) {
            $scope.consultationId = $stateParams.id;
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');

            $http({
                method: 'GET',
                url: domain + 'inventory/get-medicine-details',
                params: {consultationId: $scope.consultationId, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.medicine = response.data.medicine;

            }, function errorCallback(response) {
                console.log(response);
            });


        })

        .controller('ViewPatientHistoryCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $sce, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
//            $scope.noteId = $stateParams.id;
//            $scope.userId = window.localStorage.getItem('id');
//            $scope.record = {};
//            $scope.recordDetails = {};
//            $scope.problems = {};
//            $scope.doctrs = {};
//            $scope.patients = {};
//            $scope.cases = {};
//            $http({
//                method: 'GET',
//                url: domain + 'assistrecords/get-patient-history-details',
//                params: {noteId: $scope.noteId, userId: $scope.userId, interface: $scope.interface}
//            }).then(function successCallback(response) {
//                console.log(response.data);
//                $scope.record = response.data.record;
//                $scope.recordDetails = response.data.recordsDetails;
//                $scope.problems = response.data.problem;
//                $scope.doctrs = response.data.doctrs;
//                $scope.patients = response.data.patient;
//                $scope.cases = response.data.caseData;
//                console.log($scope.recordDetails);
//            }, function errorCallback(response) {
//                console.log(response);
//            });

            $scope.patientId = $stateParams.id; //window.localStorage.getItem('patientId');
            $scope.appId = window.localStorage.getItem('appId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.catId = 'Patient History';
            $scope.conId = [];
            $scope.conIds = [];
            $scope.selConditions = [];
            $scope.gend = '';
            $scope.gender = '';
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId'); //$stateParams.drId
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm a');
            $scope.apkLanguage = window.localStorage.getItem('apkLanguage');
            $http({
                method: 'GET',
                url: domain + 'assistrecords/get-about-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patients;
                $scope.cases = response.data.cases;
                $scope.abt = response.data.abt;
                $scope.pateinthistory = response.data.pateinthistory;
                $scope.language = response.data.lang.language;
                //$scope.dob = $filter('date')(response.data.dob, 'MM dd yyyy');
                if ($scope.abt.length > 0) {
                    angular.forEach($scope.abt, function (val, key) {
                        console.log(val.fields.field + "==" + val.value);
                        var field = val.fields.field;
                        if (field.toString() == 'Gender') {
                            console.log(field);
                            $scope.gender = val.value;
                            console.log(val.value);
                            if (val.value == 1) {
                                $scope.gender = 'Male';
                            } else if (val.value == 2) {
                                $scope.gender = 'Female';
                            } else
                                $scope.gender = 'Na';
                        }
                    });
                } else {
                    if (response.data.patients[0].gender == 1) {
                        $scope.gender = 'Male';
                    } else if (response.data.patients[0].gender == 2) {
                        $scope.gender = 'Female';
                    } else
                        $scope.gender = 'Na';
                }
                console.log($scope.gender);
                $scope.selCondition = response.data.knConditions;
                if ($scope.selCondition.length > 0) {
                    angular.forEach($scope.selCondition, function (val, key) {
                        $scope.conIds.push(val.id);
                        $scope.selConditions.push({'condition': val.condition});
                    });
                }
                $scope.conditions = response.data.conditions;
                console.log($scope.conIds);
            }, function errorCallback(response) {
                console.log(response);
            });
            $ionicModal.fromTemplateUrl('filesview.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.showm = function (path, name) {
                    console.log(path + '=afd =' + name);
                    $scope.value = $rootScope.attachpath + path + name;
                    $scope.modal.show();
                }

            }, {
                // Use our scope for the scope of the modal to keep it simple  
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
        })

        .controller('FilterCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('DiagnosisCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('TreatmentPlanCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('TreatmentPlanListCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        ;
