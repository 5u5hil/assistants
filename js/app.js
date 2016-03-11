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

            $ionicPlatform.on("deviceready", function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                PushNotificationsService.register();
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
                PushNotificationsService.register();
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

                    .state('auth.forgot-password', {
                        url: "/forgot-password",
                        templateUrl: "views/auth/forgot-password.html",
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

                    .state('app.doctor-consultations', {
                        cache: false,
                        url: "/doctor-consultations/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/doctor-consultations.html",
                                controller: 'DoctorConsultationsCtrl'
                            }
                        }
                    })

                    .state('app.consultation-past', {
                        url: "/consultations/past/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/consultations-past.html",
                                controller: 'DoctorConsultationsCtrl'
                            }
                        }
                    })
                    /* assistants */

                    .state('app.assistants', {
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
                        url: "/disbursement",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/disbursement.html",
                                controller: 'DisbursementCtrl'
                            }
                        }
                    })

                    .state('app.add-disbursement', {
                        url: "/add-disbursement",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/add-disbursement.html",
                                controller: 'AddDisbursementCtrl'
                            }
                        }
                    })

                    .state('app.search-medicine', {
                        url: "/search-medicine",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/search-medicine.html",
                                controller: 'SearchMedicineCtrl'
                            }
                        }
                    })

                    .state('app.medicine-details', {
                        url: "/medicine-details",
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
                        url: "/doctrslist",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/doctrslist.html",
                                controller: 'DoctrslistsCtrl'
                            }
                        }
                    })

                    .state('app.ass-patient-list', {
                        url: "/ass-patient-list/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/ass-patient-list.html",
                                controller: 'AssPatientListCtrl'
                            }
                        }
                    })

                    .state('app.ass-patient', {
                        url: "/ass-patient/{id:int}/{drId:int}",
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
                        url: "/appointment-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/appointment-list.html",
                                controller: 'AppointmentListCtrl'
                            }
                        }
                    })
                    .state('app.past-appointment-list', {
                        url: "/past-appointment-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/past-appointment-list.html",
                                controller: 'AppointmentListCtrl'
                            }
                        }
                    })

                    .state('app.new-patient', {
                        url: "/new-patient",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/new-patient.html",
                                controller: 'NewPatientCtrl'
                            }
                        }
                    })

                    .state('app.app-doctrlist', {
                        url: "/app-doctrlist",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/assistants/app-doctrlist.html",
                                controller: 'DoctrslistsCtrl'
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
                        url: "/thankyou/{data:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/thankyou.html",
                                controller: 'ThankyouCtrl'
                            }
                        }
                    })
                    /* end of assistants */

                    .state('app.consultations-note', {
                        url: "/consultations-note",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations-note.html",
                                controller: 'ConsultationsNoteCtrl'
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
                                controller: 'ConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.measurement', {
                        url: "/consultation-note/measurement",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/measurement.html",
                                controller: 'ConsultationsNoteCtrl'
                            }
                        }
                    })
                    .state('app.observation', {
                        url: "/consultation-note/observation",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/observation.html",
                                controller: 'ConsultationsNoteCtrl'
                            }
                        }
                    })

                    .state('app.testresult', {
                        url: "/consultation-note/testresult",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultation-note/testresult.html",
                                controller: 'ConsultationsNoteCtrl'
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

                    .state('app.diagnosis', {
                        url: "/diagnosis",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/diagnosis.html",
                                controller: 'DiagnosisCtrl'
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
                        url: "/createdbyu",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/createdbyu.html",
                                controller: 'CreatedbyuCtrl'
                            }
                        }
                    })

                    .state('app.sharedwithu', {
                        url: "/sharedwithu",
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

                    .state('app.patient-list', {
                        url: "/patient-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patient-list.html",
                                controller: 'PatientListCtrl'
                            }
                        }
                    })

                    .state('app.patient', {
                        url: "/patient",
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
