var publisher;
var session;
var subscriber;
angular.module('your_app_name.controllers', [])

        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
              $scope.interface = window.localStorage.setItem('interface_id', '3');
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
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.userId = window.localStorage.getItem('id');
            $http({
                    method: 'GET',
                    url: domain + 'get-sidemenu-lang',
                    params: {id:$scope.userId,interface:$scope.interface}
                }).then(function successCallback(response) {
                    
                   
                    if (response.data) {
                        
                        $scope.menutext = response.data.dataMenu;
                        $scope.language = response.data.lang.language;
                    
                    } else {
                      
                    }
                }, function errorCallback(response) {
                   // console.log(response);
                });
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');
                $rootScope.userimage = window.localStorage.getItem('image');
             } else {
                if ($rootScope.userLogged == 0)
                    $state.go('auth.walkthrough');
             }
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
        .controller('LoginCtrl', function ($scope,$http, $state, $templateCache, $q, $rootScope, $ionicLoading, $timeout) {
            window.localStorage.setItem('interface_id', '3');
            $scope.interface = window.localStorage.getItem('interface_id');
            
             $http({
                    method: 'GET',
                    url: domain + 'get-login',
                    params: {id:window.localStorage.getItem('id'),interface:$scope.interface}
                }).then(function successCallback(response) {
                    
                   console.log(response.data.lang.language);
                  
                    if (response.data.data) {    
                      
                          $scope.langtext = response.data.data;
                          $scope.language = response.data.lang.language;
                        
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
                params: {userId: $scope.userId,interface:$scope.interface}
            }).then(function successCallback(response) {
                $scope.active = response.data.active;
                $scope.book = response.data.book;
                $scope.past = response.data.past;
                $scope.doctorslang = response.data.doctors;
                $scope.experience = response.data.experience;
                $scope.focus_area = response.data.focus_area;
                $scope.lang = response.data.languages;
                $scope.language = response.data.lang.language;
                $scope.doctors = response.data.user;
            }, function errorCallback(e) {
                console.log(e.responseText);
            });

        })

        .controller('PatientListCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading) {
            $scope.userId = window.localStorage.getItem('id');
           $scope.interface = window.localStorage.getItem('interface_id');
            $scope.users = {};
            $http({
                method: 'GET',
                url: domain + 'assistants/get-patient-list',
                params: {userId: $scope.userId,interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.allUsers.length);
                $scope.doctrs = response.data.doctrs;
                $scope.patient_list = response.data.patient_list;
                 $scope.add = response.data.add;
                 $scope.add_patient = response.data.add_patient;
                 $scope.submit = response.data.submit;
                 $scope.language = response.data.lang.language; 
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
                console.log('submit');
                $ionicLoading.show({template: 'Adding...'});
                var data = new FormData(jQuery("#addPatientForm")[0]);
                callAjax("POST", domain + "assistants/save-patient", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert("Patient added successfully!");
                    window.location.reload();
                });
            };
        })
        /* Assistants */
        .controller('AssistantsCtrl', function ($scope, $http, $state, $stateParams, $ionicModal,$rootScope) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
                if(get('id') != null) {
             $rootScope.userLogged = 1;
                 $scope.interface = window.localStorage.getItem('interface_id');
                  $scope.userId = window.localStorage.getItem('id');
             $http({
                    method: 'GET',
                    url: domain + 'get-categoty-lang',
                    params: {id:$scope.userId,interface:$scope.interface}
                }).then(function successCallback(response) {
                    if (response.data.dataCat) {
                        
                        $scope.cattext = response.data.dataCat;
                        $scope.language = response.data.lang.language;
                        
                    } else {
                      
                    }
                }, function errorCallback(response) {
                   // console.log(response);
                });
            }else{
                $state.go('auth.walkthrough', {}, {reload: true});
            }
        })

        .controller('DoctorConsultationsCtrl', function ($scope, $http, $stateParams, $filter, $ionicPopup, $timeout, $ionicHistory, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.drId = $stateParams.id;
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-dr-app',
                params: {drId: $scope.drId, userId: $scope.userId}
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
                $scope.drId = drId;
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
//                        $http({
//                            method: 'GET',
//                            url: domain + 'appointment/cancel-app',
//                            params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, drId: $scope.drId}
//                        }).then(function successCallback(response) {
//                            console.log(response.data);
//                            if (response.data == 'success') {
//                                alert('Your appointment is cancelled successfully.');
//                                $state.go('app.doctor-consultations', {}, {reload: true});
//                            } else {
//                                alert('Sorry your appointment is not cancelled.');
//                            }
//                            $state.go('app.consultations-list', {}, {reload: true});
//                        }, function errorCallback(response) {
//                            console.log(response);
//                        });
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
        })

        .controller('AssPatientListCtrl', function ($scope, $http, $stateParams, $ionicModal, $ionicLoading, $filter) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.drId = $stateParams.id;
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.users = {};
            $http({
                method: 'GET',
                url: domain + 'assistants/get-drs-patients',
                params: {userId: $scope.userId, drId: $scope.drId,interface:$scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.allUsers.length);
                 $scope.patient_list = response.data.patient_list;
                 $scope.add = response.data.add;
                 $scope.add_patient = response.data.add_patient;
                 $scope.submit = response.data.submit;
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
                callAjax("POST", domain + "assistants/save-patient", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert("Patient added successfully!");
                    window.location.reload();
                });
            };
        })

        .controller('AssPatientCtrl', function ($scope, $http, $stateParams, $ionicModal, $rootScope, $filter, $ionicLoading, $state) {
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
            window.localStorage.setItem('patientId', $scope.patientId);
            window.localStorage.setItem('drId', $scope.drId);
            console.log($scope.drId + "--" + $scope.patientId);
            //$scope.interface = window.localStorage.getItem('interface_id');
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
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd HH:mm:ss');
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
            $scope.checkAvailability = function (uid, prodId) {
                console.log("prodId " + prodId);
                console.log("uid " + uid);
                 $scope.interface = window.localStorage.getItem('interface_id');
                $rootScope.$broadcast('loading:hide');
                $ionicLoading.show();
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-doctor-availability',
                    params: {id: uid,interface:$scope.interface}
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
            $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-doctor-availability',
                    params: {id: $scope.uid,interface:$scope.interface}
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
                            //$state.go('app.consultations-profile', {'data': $scope.prodid}, {reload: true});
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
                        $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                    }
                }, function errorCallback(responsekookoo) {
                    if (responsekookoo.data == 0)
                    {
                        alert('No doctrs available');
                        $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
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
                        console.log(response.data);
                        if (response.data == '0')
                        {
                            alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                            $timeout.cancel(stopped);
                            $state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                        } else {
                            window.localStorage.setItem('kookooid', response.data);
                            window.localStorage.setItem('kookooid1', response.data);
                        }

                    }, function errorCallback(response) {
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                    });
                }
                if ($scope.counter == 0) {
                    $scope.IsVisible = false;
                    // $scope.showConfirm();
                    $timeout.cancel(stopped);
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
                    console.log(patientresponse.data);
                    $timeout.cancel(stopped);
                    window.localStorage.removeItem('kookooid');
                    $state.go('app.doctrslist', {}, {reload: true});
                    //$state.go('app.ass-patient', {'id': $scope.patientId, 'drId': $scope.drId}, {reload: true});
                }, function errorCallback(patientresponse) {
                    console.log(e);
                });
            };
        })

        .controller('PaymentCtrl', function ($scope, $http, $state, $filter, $location, $stateParams, $rootScope, $ionicLoading, $ionicGesture, $timeout, $ionicHistory) {
            $scope.counter1 = 300;
            var stopped1;
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
                    $scope.kookooID = window.localStorage.getItem('kookooid');
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/payment-time-expired',
                        params: {kookooid: $scope.kookooID}

                    }).then(function successCallback(responseData) {
                        alert('Sorry, Your payment time expired');
                        window.localStorage.removeItem('kookooid');
                        $timeout(function () {
                            $state.go('app.doctrslist', {}, {reload: true});
                        }, 3000);
                    }, function errorCallback(response) {
                        $state.go('app.doctrslist', {}, {reload: true});
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
                params: {id: $scope.supid, prodId: $scope.prodid, interface: $scope.interface}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                $ionicLoading.show({template: 'Loading...'});
                //$ionicLoading.hide();
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
                        $state.go('app.failure', {'id': response.data.orderId, 'serviceId': response.data.scheduleId});
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('ThankyouCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.data);
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
                window.localStorage.removeItem('prodId');
                window.localStorage.removeItem('patientId');
                window.localStorage.removeItem('drId');
                window.localStorage.removeItem('supid');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $state.go('app.doctrslist', {}, {reload: true});
            }
        })


        .controller('AssInwardCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('AssOutgoCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        /*.controller('AppointmentListCtrl', function ($scope, $http, $stateParams, $ionicModal, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-app',
                params: {userId: $scope.userId, interface:$scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                
                //end past section
                $scope.all_app = response.data.all_appointments;
                $scope.all_usersData = response.data.all_usersData;
                $scope.all_doctor = response.data.all_doctor;
                $scope.all_products = response.data.all_products;
                $scope.all_time = response.data.all_time;
                $scope.all_end_time = response.data.all_end_time;
                //past section //
                $scope.all_app_past = response.data.all_appointments_past;
                $scope.all_doctor_past = response.data.all_doctor_past;
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
                $scope.drId = drId;
                $scope.cancel = '';
                console.log(drId);
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
                        
                    }
                } else {
                    if (mode == 1) {
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/cancel-app',
                            params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, drId: $scope.drId}
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
        })
*/
.controller('AppointmentListCtrl', function ($scope, $http, $stateParams, $ionicModal, $filter, $state) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.interface = window.localStorage.getItem('interface_id');
           
            $http({
                method: 'GET',
                url: domain + 'assistapp/get-all-app',
                params: {userId: $scope.userId, interface:$scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.tabmenu = response.data.tabmenu;
                $scope.language = response.data.lang.language;
                //end past section
                $scope.all_app = response.data.all_appointments;
                $scope.all_usersData = response.data.all_usersData;
                $scope.all_doctor = response.data.all_doctor;
                $scope.all_products = response.data.all_products;
                $scope.all_time = response.data.all_time;
                $scope.all_end_time = response.data.all_end_time;
                //past section //
                $scope.all_app_past = response.data.all_appointments_past;
                $scope.all_doctor_past = response.data.all_doctor_past;
                $scope.all_usersData_past = response.data.all_usersData_past;
                $scope.all_products_past = response.data.all_products_past;
                $scope.all_time_past = response.data.all_time_past;
                $scope.all_end_time_past = response.data.all_end_time_past;
                //end past section//
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.searchFilter = function (obj) {
                var re = new RegExp($scope.searchText, 'i');
                return !$scope.searchText || re.test(obj.name) || re.test(obj.age.toString());
            };
            $scope.cancelAppointment = function (appId, drId, mode, startTime) {
                $scope.appId = appId;
                $scope.userId = get('id');
                $scope.drId = drId;
                $scope.cancel = '';
                console.log(drId);
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
                            params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, drId: $scope.drId}
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
        })

        .controller('NewPatientCtrl', function ($scope, $http, $state, $stateParams, $ionicModal, $ionicLoading, $filter) {
            $scope.userId = window.localStorage.getItem('id');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd');
            $http({
                method: 'GET',
                url: domain + 'assistants/get-patient-list',
                params: {userId: $scope.userId,interface:$scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data.allUsers.length);
                $scope.doctrs = response.data.doctrs;
             
                $scope.patient_list = response.data.patient_list;
                 $scope.add = response.data.add;
                 $scope.add_patient = response.data.add_patient;
                 $scope.submit = response.data.submit;
                 $scope.language = response.data.lang.language; 
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
                callAjax("POST", domain + "assistants/save-patient", data, function (response) {
                    console.log(response);
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert("Patient added successfully!");
                    window.location.reload();
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
                    })
                    $state.go('app.assistants', {}, {reload: true});
                } catch (err) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    $state.go('app.assistants', {}, {reload: true});
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
                    $state.go('app.assistants', {}, {reload: true});
                    //window.location.href = "#/app/category-listing";
                } catch (err) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    $state.go('app.assistants', {}, {reload: true});
                }


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
           $scope.userId = get('id');
           console.log($scope.patientId);
           $http({
               method: 'GET',
               url: domain + 'assistants/get-patient-details',
               params: {userId: $scope.userId, patientId: $scope.patientId}
           }).then(function successCallback(response) {
               console.log(response.data);
               $scope.activeAppCnt = response.data.activeAppCnt;
               $scope.pastAppCnt = response.data.pastAppCnt;
               $scope.patientDetails = response.data.patientDetails;
           }, function errorCallback(e) {
               console.log(e);
           });
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
              $scope.interface = window.localStorage.getItem('interface_id');
            $http({
                method: 'GET',
                url: domain + 'doctrsrecords/get-fields',
                params: {patient: $scope.patientId, userId: $scope.userId, catId: $scope.catId,interface:$scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.patients = response.data.patients;
                $scope.cases = response.data.cases;
                $scope.language = response.data.lang.language;
                $scope.add = response.data.add;
                $scope.note = response.data.note;
                $scope.save = response.data.save;
                $scope.cancel = response.data.cancel;
                  $scope.plane_text = response.data.plane_text;
                   $scope.select_category = response.data.select_category;
                $scope.submit = response.data.submit;
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
