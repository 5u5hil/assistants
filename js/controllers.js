var publisher;
var session;
var subscriber;
angular.module('your_app_name.controllers', [])

        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');
                $rootScope.userimage = window.localStorage.getItem('image');
            }
            // else {
            // if ($rootScope.userLogged == 0)
            // $state.go('auth.login');
            // }
        })

// APP
        .controller('AppCtrl', function ($scope, $http, $state, $ionicConfig, $rootScope, $ionicLoading, $timeout, $ionicHistory) {
            $rootScope.imgpath = domain + "/public/frontend/user/";
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');
                $rootScope.userimage = window.localStorage.getItem('image');
            }
            // else {
            // if ($rootScope.userLogged == 0)
            // $state.go('auth.login');
            // }
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
        .controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope, $ionicLoading, $timeout) {
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

        .controller('CreatedbyuCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('DoctrslistsCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.userId = window.localStorage.getItem('id');
            $http({
                method: 'GET',
                url: domain + 'assistants/get-doctrs-list',
                params: {userId: $scope.userId}
            }).then(function successCallback(response) {
                $scope.doctors = response.data.user;
            }, function errorCallback(e) {
                console.log(e.responseText);
            });

        })
        /* Assistants */
        .controller('AssistantsCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        }) 

		.controller('PatientListCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
		 $ionicModal.fromTemplateUrl('addp', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AssPatientListCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.userId = window.localStorage.getItem('id');
            $http({
                method: 'GET',
                url: domain + 'doctorsapp/get-all-patients',
                params: {userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data.length);
                if (response.data.users.length > 0) {
                    var data = response.data;
                    $scope.users = _.reduce(
                            data,
                            function (output, fname) {
                                var lCase = fname.fname.toUpperCase();
                                if (output[lCase[0]]) //if lCase is a key
                                    output[lCase[0]].push(fname); //Add name to its list
                                else
                                    output[lCase[0]] = [fname]; // Else add a key
                                console.log(output);
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
        })

        .controller('AssPatientCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })


         .controller('AssInwardCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

          .controller('AssOutgoCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })
		
		.controller('AssPaymentCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })
		
		.controller('AppointmentListCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })
		
		.controller('NewPatientCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
			$ionicModal.fromTemplateUrl('addnewpatient', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
			
        })
		

        .controller('InventoryCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })
		
        .controller('AppDoctrlistCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })
		
	
		
		
		
        .controller('DisbursementCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('SearchMedicineCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })


        .controller('MedicineDetailsCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })
        .controller('MedicineHistoryCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('MedicineOutgoCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('AddDisbursementCtrl', function ($scope, $http, $stateParams, $ionicPopup, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;

            $scope.showPopup = function () {
                $scope.data = {};
                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    template: '<div class="row"><div class="col col-33"><input type="number" ng-model="data.wifi"></div><div class="col col-67"><select class="selectpopup"><option>Bottle</option></select></div></div>',
                    title: 'Quantity',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Ok</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.wifi) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    return $scope.data.wifi;
                                }
                            }
                        }
                    ]
                });

                myPopup.then(function (res) {
                    console.log('Tapped!', res);
                });
            };

            $ionicModal.fromTemplateUrl('infomedicine', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })
        .controller('SharedwithuCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
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

        .controller('PatientRecordCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('PatientCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.patientId = $stateParams.id;
            console.log($scope.patientId);
        })

        .controller('MyCtrl', function ($scope, $ionicTabsDelegate) {
            $scope.selectTabWithIndex = function (index) {
                $ionicTabsDelegate.select(index);
            }
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

        .controller('PlaintestCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('addeval', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
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

        .controller('IcdCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('icd', {
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

        .controller('noteType', function ($scope, $ionicModal, $state) {
            $ionicModal.fromTemplateUrl('notetype', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            $scope.modalclose = function (ulink) {
                $state.go(ulink);
                $scope.modal.hide();
            }
        })

        .controller('treaTmentpCtrl', function ($scope, $ionicModal, $state) {
            $ionicModal.fromTemplateUrl('treatmentp', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            $scope.modalclose = function (ulink) {
                $state.go(ulink);
                $scope.modal.hide();
            }
        })

        .controller('CloseModalCtrl', function ($scope, $ionicModal, $state) {
            $scope.modalclose = function (ulink) {
                $state.go(ulink);
                $scope.modal.hide();
            }
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

        .controller('DoctorConsultationsCtrl', function ($scope, $http, $stateParams, $filter, $ionicPopup, $timeout, $ionicHistory, $filter, $state) {
            $scope.drId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'appointment/get-patient-details',
                params: {id: $scope.drId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.todays_app = response.data.todays_appointments;
                $scope.todays_usersData = response.data.todays_usersData;
                $scope.todays_products = response.data.todays_products;
                $scope.todays_time = response.data.todays_time;
                $scope.todays_end_time = response.data.todays_end_time;
                //past section
                $scope.todays_app_past = response.data.todays_appointments_past;
                $scope.todays_usersData_past = response.data.todays_usersData_past;
                $scope.todays_products_past = response.data.todays_products_past;
                $scope.todays_time_past = response.data.todays_time_past;
                $scope.todays_end_time_past = response.data.todays_end_time_past;
                // end past section //
                $scope.week_app = response.data.week_appointments;
                $scope.week_usersData = response.data.week_usersData;
                $scope.week_products = response.data.week_products;
                $scope.week_time = response.data.week_time;
                $scope.week_end_time = response.data.week_end_time;
                //past section 
                $scope.week_app_past = response.data.week_appointments_past;
                $scope.week_usersData_past = response.data.week_usersData_past;
                $scope.week_products_past = response.data.week_products_past;
                $scope.week_time_past = response.data.week_time_past;
                $scope.week_end_time_past = response.data.week_end_time_past;
                //end past section
                $scope.all_app = response.data.all_appointments;
                $scope.all_usersData = response.data.all_usersData;
                $scope.all_products = response.data.all_products;
                $scope.all_time = response.data.all_time;
                $scope.all_end_time = response.data.all_end_time;
                //past section //
                $scope.all_app_past = response.data.all_appointments_past;
                $scope.all_usersData_past = response.data.all_usersData_past;
                $scope.all_products_past = response.data.all_products_past;
                $scope.all_time_past = response.data.all_time_past;
                $scope.all_end_time_past = response.data.all_end_time_past;
                //end past section//
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.cancelAppointment = function (appId, drId, mode, startTime) {
                $scope.appId = appId;
                $scope.userId = get('id');
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
                         url: domain + 'appointment/dr-cancel-app',
                         params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId}
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
                            url: domain + 'appointment/dr-cancel-app',
                            params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId}
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
                    } else if (mode == 3 || mode == 4) {
                        //ask for 2 options
                    }
                }
            };
            $scope.joinVideo = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.doctor-join', {'id': appId, 'mode': mode}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
        })

        .controller('ConsultationsNoteCtrl', function ($scope, $http, $stateParams, $rootScope, $state, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            $scope.patientId = '282';
            $scope.doctorId = window.localStorage.getItem('id');
            $rootScope.patientId = '282';
            $rootScope.doctorId = window.localStorage.getItem('id');
            $scope.catId = '';
            $scope.userId = window.localStorage.getItem('id');
            window.localStorage.setItem('patientId', '282');
            window.localStorage.setItem('doctorId', $scope.doctorId);
            $scope.images = [];
            $scope.image = [];
            $scope.tempImgs = [];
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, catId: $scope.catId}
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
            $scope.gotopage = function (glink) {
                $state.go(glink);
            };
            $scope.getPatientId = function (pid) {
                console.log(pid);
                $scope.patientId = pid;
                $rootScope.patientId = pid;
                window.localStorage.setItem('patientId', pid);
            };
            $scope.getDrId = function (did) {
                console.log(did);
                $scope.doctorId = did;
                $rootScope.doctorId = did;
                window.localStorage.setItem('doctorId', did);
            };
            //Save FormData
            $scope.submit = function () {
                $ionicLoading.show({template: 'Adding...'});
                //alert($scope.tempImgs.length);
                if ($scope.tempImgs.length > 0) {
                    angular.forEach($scope.tempImgs, function (value, key) {
                        $scope.picData = getImgUrl(value);
                        var imgName = value.substr(value.lastIndexOf('/') + 1);
                        $scope.ftLoad = true;
                        $scope.uploadPicture();
                        $scope.image.push(imgName);
                        console.log($scope.image);
                    });
                    jQuery('#camfilee').val($scope.image);
                    console.log($scope.images);
                    var data = new FormData(jQuery("#addRecordForm")[0]);
                    callAjax("POST", domain + "doctrsrecords/save-consultation", data, function (response) {
                        console.log(response);
                        $ionicLoading.hide();
                        if (angular.isObject(response.records)) {
                            $scope.image = [];
                            alert("Consultation Note added successfully!");
//                            $timeout(function () {
//                                $state.go('app.records-view', {'id': $scope.categoryId}, {}, {reload: true});
//                            }, 1000);
                        } else if (response.err != '') {
                            alert('Please fill mandatory fields');
                        }
                    });
                } else {
                    var data = new FormData(jQuery("#addRecordForm")[0]);
                    callAjax("POST", domain + "doctrsrecords/save-consultation", data, function (response) {
                        console.log(response);
                        $ionicLoading.hide();
                        if (angular.isObject(response.records)) {
                            alert("Consultation Note added successfully!");
//                            $timeout(function () {
//                                $state.go('app.records-view', {'id': $scope.categoryId}, {}, {reload: true});
//                            }, 1000);
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
                    jQuery("#precase").addClass('hide');
                    jQuery("#newcase").removeClass('hide');
                } else if (type == 0) {
                    jQuery("#precase").removeClass('hide');
                    jQuery("#newcase").addClass('hide');
                }
            };
            //Take images with camera
            $scope.takePict = function (name) {
                //console.log(name);
                var camimg_holder = $("#camera-status");
                camimg_holder.empty();
                // 2
                var options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                };
                // 3
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    //alert(imageData);
                    onImageSuccess(imageData);
                    function onImageSuccess(fileURI) {
                        createFileEntry(fileURI);
                    }
                    function createFileEntry(fileURI) {
                        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                    }
                    // 5
                    function copyFile(fileEntry) {
                        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                        var newName = makeid() + name;
                        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                            fileEntry.copyTo(
                                    fileSystem2,
                                    newName,
                                    onCopySuccess,
                                    fail
                                    );
                        },
                                fail);
                    }
                    // 6
                    function onCopySuccess(entry) {
                        var imageName = entry.nativeURL;
                        $scope.$apply(function () {
                            $scope.tempImgs.push(imageName);
                        });
                        $scope.picData = getImgUrl(imageName);
                        //alert($scope.picData);
                        $scope.ftLoad = true;
                        camimg_holder.append('<button class="button button-positive remove" onclick="removeCamFile()">Remove Files</button><br/>');
                        $('<span class="upattach"><i class="ion-paperclip"></i></span>').appendTo(camimg_holder);
                    }
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
                ft.upload(fileURL, encodeURI(domain + 'doctrsrecords/upload-attachment'), uploadSuccess, function (error) {
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
                    jQuery('#convalid').removeClass('hide');
                    jQuery('#coninprec').removeClass('hide');
                    //jQuery('#valid-till').attr('required', true);
                    image_holder.append('<button class="button button-positive remove" onclick="removeFile()">Remove Files</button><br/>');
                } else {
                    jQuery('#convalid').addClass('hide');
                    jQuery('#coninprec').addClass('hide');
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
                            $('<span class="upattach"><i class="ion-paperclip"></i></span>').appendTo(image_holder);
                        }
                        image_holder.show();
                        reader.readAsDataURL(element.files[0]);
                    }
                }
            };
        })

        .controller('PatientHistoryCtrl', function ($scope, $http, $stateParams, $state, $rootScope, $ionicModal, $timeout, $filter, $cordovaCamera, $ionicLoading) {
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.catId = 'Patient History';
            $scope.conId = [];
            $scope.conIds = [];
            $scope.selConditions = [];
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId'); //$stateParams.drId
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-about-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patients;
                $scope.cases = response.data.cases;
                $scope.abt = response.data.abt;
                $scope.dob = new Date(response.data.dob);
                //$scope.dob = $filter('date')(response.data.dob, 'MM dd yyyy');
                if ($scope.abt.length > 0) {
                    angular.forEach($scope.abt, function (val, key) {
                        console.log(val.fields.field + "==" + val.value);
                        var field = val.fields.field;
                        if (field.toString() == 'Gender') {
                            console.log(field);
                            $scope.gender = val.value;
                        }
                    });
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
                var data = new FormData(jQuery("#addRecordForm")[0]);
                callAjax("POST", domain + "doctrsrecords/save-patient-history", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    if (angular.isObject(response.records)) {
                        alert("Patient History saved successfully!");
//                            $timeout(function () {
//                                $state.go('app.records-view', {'id': $scope.categoryId}, {}, {reload: true});
//                            }, 1000);
                    } else if (response.err != '') {
                        //alert('Please fill mandatory fields');
                    }
                });
            };
        })

        .controller('DietplanCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter) {
            $scope.patientId = window.localStorage.getItem('patientId');
            $scope.catId = 'Diet Plan';
            $scope.userId = window.localStorage.getItem('id');
            $scope.doctorId = window.localStorage.getItem('doctorId'); //$stateParams.drId
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'hh:mm');
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-about-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, doctorId: $scope.doctorId, catId: $scope.catId}
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
