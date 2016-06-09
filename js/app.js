// Ionic Starter App
var domain = "http://stage.doctrs.in/";
//var domain = "http://192.168.2.169/doctors/";
angular.module('underscore', [])
        .factory('_', function () {
            return window._; // assumes underscore has already been loaded on the page
        });
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('your_app_name', [
    'ionic',
    'angularMoment',
    'your_app_name.controllers',
    'your_app_name.directives',
    'your_app_name.filters',
    'your_app_name.services',
    'your_app_name.factories',
    'your_app_name.config',
    'underscore',
    'ngMap',
    'ngResource',
    'ngCordova',
    'slugifier',
    'ionic.contrib.ui.tinderCards',
    'youtube-embed'
])
        .run(function ($ionicPlatform, PushNotificationsService, $rootScope, $ionicConfig, $timeout, $ionicLoading) {
            $ionicPlatform.onHardwareBackButton(function (event) {
                event.preventDefault();
            });
            $ionicPlatform.on("deviceready", function () {
                var notificationOpenedCallback = function (jsonData) {
                    alert('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
                    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));

                    // $state.go("app.content-library-setting");
                    try
                    {
                        if (jsonData.additionalData) {
                            alert("Inside additionalData");
                            alert("id " + jsonData.additionalData.actionSelected);

                            if (jsonData.additionalData.actionSelected == "id1")
                            {

                                alert("Button id1 pressed!");
                                $http({
                                    method: 'GET',
                                    url: domain + 'tracker/captured',
                                    params: {actionid: jsonData.additionalData.actionButtons[0].icon, status: 1}
                                }).then(function successCallback(response) {

                                    if (jsonData.additionalData.yourUrlKey) {
                                        location.href = jsonData.additionalData.yourUrlKey;
                                    }

                                }, function errorCallback(e) {
                                    console.log(e);
                                });
                            }
                            if (jsonData.additionalData.actionSelected == "id2")
                            {
                                alert("Button id2 pressed!");

                                $http({
                                    method: 'GET',
                                    url: domain + 'tracker/captured',
                                    params: {actionid: jsonData.additionalData.actionButtons[1].icon, status: 2}
                                }).then(function successCallback(response) {

                                    if (jsonData.additionalData.yourUrlKey) {
                                        location.href = jsonData.additionalData.yourUrlKey;
                                    }
                                }, function errorCallback(e) {
                                    console.log(e);
                                });
                            }
                            if (jsonData.additionalData.actionSelected == "id3")
                            {
                                alert("Button id3 pressed!");

                                $http({
                                    method: 'GET',
                                    url: domain + 'tracker/captured',
                                    params: {actionid: jsonData.additionalData.actionButtons[2].icon, status: 3}
                                }).then(function successCallback(response) {
                                    if (jsonData.additionalData.yourUrlKey) {
                                        location.href = jsonData.additionalData.yourUrlKey;
                                    }
                                }, function errorCallback(e) {
                                    console.log(e);
                                });
                            }
                        }

                    } catch (err)
                    {
                        alert('No redirection ' + err);
                    }


                };

                window.plugins.OneSignal.init("eaa13ee8-5f59-4fe7-a532-aa47d00cbba0",
                        {googleProjectNumber: "769295732267"}, // jainam account GCM id
                        notificationOpenedCallback);
                try
                {
                    window.plugins.OneSignal.getIds(function (ids) {
                        console.log('getIds: ' + JSON.stringify(ids));
                        if (window.localStorage.getItem('id')) {
                            var userId = window.localStorage.getItem('id');
                        } else {
                            var userId = '';
                        }

                        $http({
                            method: 'GET',
                            url: domain + 'notification/insertPlayerId',
                            params: {userId: userId, playerId: ids.userId, pushToken: ids.pushToken}
                        }).then(function successCallback(response) {
                            if (response.data == 1) {
                                //  alert('Notification setting updated');
                            }
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    });
                } catch (err)
                {
                    console.log('No redirection ' + err);
                }

                window.plugins.OneSignal.enableInAppAlertNotification(true);
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                // PushNotificationsService.register();
            });
            $rootScope.$on('loading:show', function () {
                $ionicLoading.show({template: 'Loading'})
            })

            $rootScope.$on('loading:hide', function () {
                $ionicLoading.hide()
            })
            // This fixes transitions for transparent background views
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                if (toState.name.indexOf('auth.walkthrough') > -1)
                {
                    // set transitions to android to avoid weird visual effect in the walkthrough transitions
                    $timeout(function () {
                        $ionicConfig.views.transition('android');
                        $ionicConfig.views.swipeBackEnabled(false);
                        console.log("setting transition to android and disabling swipe back");
                    }, 0);
                }
            });
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                if (toState.name.indexOf('app.feeds-categories') > -1)
                {
                    // Restore platform default transition. We are just hardcoding android transitions to auth views.
                    $ionicConfig.views.transition('platform');
                    // If it's ios, then enable swipe back again
                    if (ionic.Platform.isIOS())
                    {
                        $ionicConfig.views.swipeBackEnabled(true);
                    }
                    console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
                }
            });
            $ionicPlatform.on("resume", function () {
                //  PushNotificationsService.register();
            });
        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
            $httpProvider.interceptors.push(function ($rootScope) {
                return {
                    request: function (config) {
                        $rootScope.$broadcast('loading:show')
                        return config
                    },
                    response: function (response) {
                        $rootScope.$broadcast('loading:hide')
                        return response
                    }
                }
            })

            $stateProvider
                    //INTRO
                    .state('auth', {
                        url: "/auth",
                        templateUrl: "views/auth/auth.html",
                        abstract: true,
                        controller: 'AuthCtrl'
                    })

                    .state('auth.walkthrough', {
                        url: '/walkthrough',
                        templateUrl: "views/auth/walkthrough.html"
                    })

                    .state('auth.login', {
                        url: '/login',
                        templateUrl: "views/auth/login.html",
                        controller: 'LoginCtrl'
                    })

                    .state('auth.signup', {
                        url: '/signup',
                        templateUrl: "views/auth/signup.html",
                        controller: 'SignupCtrl'
                    })

                    .state('auth.check-otp', {
                        url: '/check-otp',
                        templateUrl: "views/auth/check-otp.html",
                        controller: 'SignupCtrl'
                    })

                    .state('auth.forgot-password', {
                        url: "/forgot-password",
                        templateUrl: "views/auth/forgot-password.html",
                        controller: 'ForgotPasswordCtrl'
                    })

                    .state('auth.update-password', {
                        url: "/update-password",
                        templateUrl: "views/auth/update-password.html",
                        controller: 'ForgotPasswordCtrl'
                    })

                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "views/app/side-menu.html",
                        controller: 'AppCtrl'
                    })

                    .state('app.doctor-settings', {
                        cache: false,
                        url: "/doctor-settings",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/doctor-settings.html",
                                controller: 'DoctorSettingsCtrl'
                            }
                        }
                    })

                    .state('app.consultations-list', {
                        //cache: false,
                        url: "/consultations-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/consultations-list.html",
                                controller: 'ConsultationsListCtrl'
                            }
                        }
                    })

                    .state('app.doctor-consultations', {
                        cache: false,
                        url: "/doctor-consultations/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/doctor-consultations.html",
                                controller: 'DoctorConsultationsActiveCtrl'
                            }
                        }
                    })

                    .state('app.consultation-past', {
                        cache: false,
                        url: "/consultations/past/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/consultations-past.html",
                                controller: 'DoctorConsultationsPastCtrl'
                            }
                        }
                    })
                    /* assistants */
                    .state('app.assistants', {
                        cache: false,
                        url: "/assistants",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/assistants.html",
                                controller: 'AssistantsCtrl'
                            }
                        }
                    })

                    .state('app.inventory', {
                        url: "/inventory",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/inventory.html",
                                controller: 'InventoryCtrl'
                            }
                        }
                    })

                    .state('app.disbursement', {
                        url: "/disbursement/{mid:string}/{appid:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/disbursement.html",
                                controller: 'DisbursementCtrl'
                            }
                        }
                    })

                    .state('app.add-disbursement', {
                        cache: false,
                        url: "/add-disbursement/{mid:string}/{appid:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/add-disbursement.html",
                                controller: 'AddDisbursementCtrl'
                            }
                        }
                    })

                    .state('app.search-medicine', {
                        cache: false,
                        url: "/search-medicine/{key:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/search-medicine.html",
                                controller: 'SerachInventoryCtrl'
                            }
                        }
                    })

                    .state('app.medicine', {
                        cache: false,
                        url: "/add-medicine/{mid:string}/{appid:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/add-medicine.html",
                                controller: 'AddMedicineCtrl'
                            }
                        }
                    })


                    .state('app.medcn', {
                        cache: false,
                        url: "/add-medcn/{mid:string}/{appid:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/add-medcn.html",
                                controller: 'AddNewMedicineCtrl'
                            }
                        }
                    })

                    .state('app.medicine-details', {
                        url: "/medicine-details/{mid:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/medicine-details.html",
                                controller: 'MedicineDetailsCtrl'
                            }
                        }
                    })

                    .state('app.medicine-history', {
                        url: "/medicine-history",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/medicine-history.html",
                                controller: 'MedicineHistoryCtrl'
                            }
                        }
                    })

                    .state('app.medicine-outgo', {
                        url: "/medicine-outgo",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/medicine-outgo.html",
                                controller: 'MedicineOutgoCtrl'
                            }
                        }
                    })

                    .state('app.doctrslist', {
                        cache: false,
                        url: "/doctrslist/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/doctrslist.html",
                                controller: 'DoctrslistsCtrl'
                            }
                        }
                    })

                    .state('app.ass-patient-list', {
                        cache: false,
                        url: "/ass-patient-list/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/ass-patient-list.html",
                                controller: 'AssPatientListCtrl'
                            }
                        }
                    })

                    .state('app.ass-patient', {
                        cache: false,
                        url: "/ass-patient/{id:string}/{drId:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/ass-patient.html",
                                controller: 'AssPatientCtrl'
                            }
                        }
                    })

                    .state('app.ass-inward', {
                        url: "/ass-inward",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/ass-inward.html",
                                controller: 'AssInwardCtrl'
                            }
                        }
                    })

                    .state('app.ass-outgo', {
                        url: "/ass-outgo",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/ass-outgo.html",
                                controller: 'AssOutgoCtrl'
                            }
                        }
                    })

                    .state('app.appointment-list', {
                        cache: false,
                        url: "/appointment-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/appointment-list.html",
                                controller: 'AppointmentListActiveCtrl'
                            }
                        }
                    })

                    .state('app.past-appointment-list', {
                        cache: false,
                        url: "/past-appointment-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/past-appointment-list.html",
                                controller: 'AppointmentListPastCtrl'
                            }
                        }
                    })

                    .state('app.patient-app-list', {
                        cache: false,
                        url: "/patient-app-list/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patients/patient-app-list.html",
                                controller: 'PatientAppointmentListCtrl'
                            }
                        }
                    })

                    .state('app.patient-past-app-list', {
                        cache: false,
                        url: "/patient-past-app-list/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patients/patient-past-app-list.html",
                                controller: 'PatientAppointmentListCtrl'
                            }
                        }
                    })

                    .state('app.new-patient', {
                        cache: false,
                        url: "/new-patient",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/new-patient.html",
                                controller: 'NewPatientCtrl'
                            }
                        }
                    })

                    .state('app.app-doctrlist', {
                        cache: false,
                        url: "/app-doctrlist",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/app-doctrlist.html",
                                controller: 'AppDoctrslistsCtrl'
                            }
                        }
                    })

                    .state('app.payment', {
                        url: "/payment",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/payment.html",
                                controller: 'PaymentCtrl'
                            }
                        }
                    })

                    .state('app.checkavailable', {
                        cache: false,
                        url: "/checkavailable/{data:int}/{uid:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/checkavailable.html",
                                controller: 'CheckavailableCtrl'
                            }
                        }
                    })

                    .state('app.failure', {
                        url: "/failure/{id:int}/{serviceId:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/failure.html",
                                controller: 'FailureCtrl'
                            }
                        }
                    })

                    .state('app.thankyou', {
                        cache: false,
                        url: "/thankyou/{data:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/thankyou.html",
                                controller: 'ThankyouCtrl'
                            }
                        }
                    })
                    /* end of assistants */
                    .state('app.view-note', {
                        cache: false,
                        url: "/view-note/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/view-consultations-note.html",
                                controller: 'ViewConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.view-measure-details', {
                        url: "/view-measure-details/{id:int}/{type:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/measure-details.html",
                                controller: 'MeasureDetailsCtrl'
                            }
                        }
                    })

                    .state('app.view-cn-details', {
                        url: "/view-cn-details/{id:int}/{type:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/cn-details.html",
                                controller: 'OtherDetailsCtrl'
                            }
                        }
                    })

                    .state('app.view-medicine', {
                        cache: false,
                        url: "/view-medicine/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/view-medicine.html",
                                controller: 'ViewMedicineCtrl'
                            }
                        }
                    })

                    .state('app.view-patient-history', {
                        cache: false,
                        url: "/consultation-note/view-patient-history/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/view-patient-history.html",
                                controller: 'ViewPatientHistoryCtrl'
                            }
                        }
                    })

                    .state('app.consultations-note', {
                        cache: false,
                        url: "/consultations-note/{appId:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations-note.html",
                                controller: 'ConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.notetype', {
                        //cache: false,
                        url: "/notetype",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/notetype.html",
                                controller: 'NotetypeCtrl'
                            }
                        }
                    })

                    .state('app.treatment-plan-type', {
                        //cache: false,
                        url: "/treatment-plan-type",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/treatment-plan-type.html",
                                controller: 'treaTmentpCtrl'
                            }
                        }
                    })

                    .state('app.about', {
                        url: "/consultation-note/about",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/about.html",
                                controller: 'ConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.patient-history', {
                        url: "/consultation-note/patient-history",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/patient-history.html",
                                controller: 'PatientHistoryCtrl'
                            }
                        }
                    })

                    .state('app.family-history', {
                        url: "/consultation-note/family-history",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/family-history.html",
                                controller: 'FamilyHistoryCtrl'
                            }
                        }
                    })

                    .state('app.measurement', {
                        url: "/consultation-note/measurement/{mid:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/measurement.html",
                                controller: 'MeasurementCtrl'
                            }
                        }
                    })

                    .state('app.observation', {
                        url: "/consultation-note/observation/{objid:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/observation.html",
                                controller: 'ObservationCtrl'
                            }
                        }
                    })

                    .state('app.diagnosis', {
                        url: "/consultation-note/diagnosis/{diaid:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/diagnosis.html",
                                controller: 'DiagnosisTextCtrl'
                            }
                        }
                    })

                    .state('app.testresult', {
                        url: "/consultation-note/testresult/{testid:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/testresult.html",
                                controller: 'TestResultCtrl'
                            }
                        }
                    })

                    .state('app.investigations', {
                        url: "/consultation-note/investigations",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/investigations.html",
                                controller: 'ConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.newarticle', {
                        url: "/newarticle",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/newarticle.html",
                                controller: 'NewarticleCtrl'
                            }
                        }
                    })

                    .state('app.medication', {
                        url: "/consultation-note/medication",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/medication.html",
                                controller: 'ConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.procedure', {
                        url: "/consultation-note/procedure",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/procedure.html",
                                controller: 'ConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.evaluation', {
                        url: "/evaluation",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/evaluation.html",
                                controller: 'EvaluationCtrl'
                            }
                        }
                    })

                    .state('app.treatment-plan', {
                        url: "/treatmentplan",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/treatment-plan.html",
                                controller: 'TreatmentPlanCtrl'
                            }
                        }
                    })

                    .state('app.createdbyu', {
                        url: "/createdbyu/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/createdbyu.html",
                                controller: 'CreatedbyuCtrl'
                            }
                        }
                    })

                    .state('app.records-view', {
                        cache: false,
                        url: "/records-view/{id:int}/{patientId:int}/{shared:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/records/records-view.html",
                                controller: 'RecordsViewCtrl'
                            }
                        }
                    })

                    .state('app.record-details', {
                        cache: false,
                        url: "/record-details/{id:int}/{patientId:int}/{catId:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/records/record-details.html",
                                controller: 'RecordDetailsCtrl'
                            }
                        }
                    })

                    .state('app.sharedwithu', {
                        cache: false,
                        url: "/sharedwithu/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/sharedwithu.html",
                                controller: 'SharedwithuCtrl'
                            }
                        }
                    })

                    .state('app.treatment-plan-list', {
                        url: "/treatmentplan-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/treatment-plan-list.html",
                                controller: 'TreatmentPlanListCtrl'
                            }
                        }
                    })

                    .state('app.doctor-current-tab', {
                        url: "/doctor-current-tab/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/doctor-current-tab.html",
                                controller: 'DoctorCurrentTabCtrl'
                            }
                        }
                    })

                    .state('app.doctor-join', {
                        cache: false,
                        url: "/doctor-join/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/doctor-join.html",
                                controller: 'DoctorJoinCtrl'
                            }
                        }
                    })

                    .state('app.patient-join', {
                        cache: false,
                        url: "/patient-join/{id:int}/{mode:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patient-join.html",
                                controller: 'PatientJoinCtrl'
                            }
                        }
                    })

                    .state('app.patient-list', {
                        cache: false,
                        url: "/patient-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patient-list.html",
                                controller: 'PatientListCtrl'
                            }
                        }
                    })

                    .state('app.patient', {
                        cache: false,
                        url: "/patient/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patient.html",
                                controller: 'PatientCtrl'
                            }
                        }
                    })

                    .state('app.content-library', {
                        //  cache: false,
                        url: "/content-library",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/content-library/content-library.html",
                                controller: 'ContentLibraryCtrl'
                            }
                        }
                    })

                    .state('app.library-feed', {
                        //  cache: false,
                        url: "/library-feed",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/content-library/library-feed.html",
                                controller: 'LibraryFeedCtrl'
                            }
                        }
                    })

                    .state('app.content-library-list', {
                        //  cache: false,
                        url: "/content-library-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/content-library/content-library-list.html",
                                controller: 'ContentLibraryListCtrl'
                            }
                        }
                    })

                    .state('app.content-library-details', {
                        //  cache: false,
                        url: "/content-library-details.html",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/content-library/content-library-details.html",
                                controller: 'ContentLibraryDetailsCtrl'
                            }
                        }
                    })

                    .state('app.dietplan', {
                        //  cache: false,
                        url: "/dietplan",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/dietplan.html",
                                controller: 'DietplanCtrl'
                            }
                        }
                    })

                    .state('app.dietplan-list', {
                        //  cache: false,
                        url: "/dietplan-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/dietplan-list.html",
                                controller: 'DietplanListCtrl'
                            }
                        }
                    })

                    .state('app.patient-record', {
                        url: "/patient-record",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patient-record.html",
                                controller: 'PatientRecordCtrl'
                            }
                        }
                    })

                    .state('app.patient-consult', {
                        url: "/patient-consult",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patient-consult.html",
                                controller: 'PatientConsultCtrl'
                            }
                        }
                    })

                    /* chat category */

                    .state('app.chatlist', {
                        cache: false,
                        url: "/chatlist",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/chat/chatlist.html",
                                controller: 'ChatListCtrl'
                            }
                        }
                    })

                    .state('app.new-doctorchat', {
                        cache: false,
                        url: "/new-doctorchat",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/chat/new-doctorchat.html",
                                controller: 'newDoctorChatCtrl'
                            }
                        }
                    })

                    .state('app.drchat', {
                        cache: false,
                        url: "/drchat/{id:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/chat/drchat.html",
                                controller: 'DrChatCtrl'
                            }
                        }
                    })

                    /* end of chat category */
                    .state('app.logout', {
                        url: "/logout",
                        views: {
                            'menuContent': {
                                //templateUrl: "views/app/bookmarks.html",
                                controller: 'AppCtrl'
                            }
                        }
                    })
                    ;
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/auth/walkthrough');
        });
