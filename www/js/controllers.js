var appControllers = angular.module('appControllers', []);

appControllers.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();        
    }; 
    
   
}])

appControllers.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
            //$log.debug("close LEFT is done");            
        });        
    };
    
    $scope.menus = [{
      //icone : imagePath,      
      titulo: "Mapa"
    }, {
      //icone : imagePath,      
      titulo: "Agenda"
    }, {
      //icone : imagePath,      
      titulo: "Eventos"
    }];
  });
  
appControllers.controller('Mapa', ['$scope', '$rootScope', '$window', '$mdDialog', 'FoodTruck', function($scope, $rootScope, $window, $mdDialog, FoodTruck){
        
        var map = null;
        var myLocation = null;
        //$scope.foodTrucks = {};
        
        // Define tamanho do mapa pra tela toda - altura do top header
        $scope.height = window.innerHeight - document.getElementsByTagName('md-toolbar')[0].clientHeight;
        
//        var foodTrucks = null;
//                                
//        FoodTruck.getFoodTrucks(function(data) {
//            
//            foodTrucks = data;
//
////                    var arrFoodTrucks = [];
////                    for (var elem in foodTrucks) {
////                       arrFoodTrucks.push(foodTrucks[elem]);
////                    }
//            //debugger;
//        });
                                        
        document.addEventListener("deviceready", function () {
                                        
            var div = document.getElementById("map_canvas");
        
            map = plugin.google.maps.Map.getMap(div, {
                'controls': {
                    'compass': true,
                    'myLocationButton': true,
                    'indoorPicker': true,
                    'zoom': true
                }
            });
            map.addEventListener(plugin.google.maps.event.MAP_READY, function(map){

                // Seta o foco do mapa no local atual do usuário/GPS
                map.getMyLocation(function (location) 
                {
                    myLocation = location.latLng;

                    map.animateCamera({                
                        'target': {
                            lat: location.latLng.lat,
                            lng: location.latLng.lng
                        },
                        'tilt': 60,
                        'zoom': 18,
                        'bearing': 140
                    });
                }, 
                function (location) 
                {
                    var msg = ["Localidade:\n",
                                "latitude: " + location.latLng.lat,
                                "longitude: " + location.latLng.lng,
                                "speed: " + location.speed,
                                "time: " + location.time,
                                "bearing: " + location.bearing].join("\n").toString();            

                    alert("Erro: Impossível determinar localização\n" + msg);
                });

                // Markers
                // TODO: Implementar serviço REST para buscar markers/trucks
                var foodTrucks = [
                    {"id":2, "latlng":[-15.879222, -48.012081], "nome":"Geleia", "descricao":"Hoje, 14:00 - 20:00"},
                    {"id":1, "latlng":[-15.878773, -48.014715], "nome":"Bistruck", "descricao":"Hoje, 14:00 - 20:00"},
                    {"id":3, "latlng":[-15.881348, -48.014130], "nome":"Teste Truck", "descricao":"Hoje, 14:00 - 20:00"},                    
                ];
                
//                var foodTrucks = null;
//                                
//                FoodTruck.getFoodTrucks(function(data) {
//                    //debugger;
//                    foodTrucks = data;
//                    
////                    var arrFoodTrucks = [];
////                    for (var elem in foodTrucks) {
////                       arrFoodTrucks.push(foodTrucks[elem]);
////                    }
//                });
                        

                // Itera a lista de markers e adiciona os markers no mapa
                //var bounds = foodTrucks.map(function(info) {
                var bounds = foodTrucks.map(function(info) {
                    var latLng = new plugin.google.maps.LatLng(info.latlng[0], info.latlng[1]);
                    //var latLng = new plugin.google.maps.LatLng(info.localizacoes[0].latitude, info.localizacoes[0].longitude);

                    map.addMarker({
                        "position": latLng,                        
                        "title": info.nome,
                        "snippet": info.descricao,
                        icon: "orange"
                    }, function(marker) {
                            marker.showInfoWindow();

                            /**
                             * Ao clicar no info window (balão informativo) acima
                             * do marker, chama sistema de navegação do aparelho 
                             */
                            marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
                                
                                $rootScope.myLocation = myLocation;
                                $rootScope.latLng = latLng;
                                
                                $window.location.href = "#/truck/" + info.id;
                                
                                /* plugin.google.maps.external.launchNavigation({
                                    "from": myLocation,
                                    "to": latLng
                                }); */
                            });
                        }
                    );                

                    return latLng;
                });

		// Quando terminar de carregar o mapa, esconde a splash screen e exibe o app
		navigator.splashscreen.hide();

                map.moveCamera({
                    "target": bounds
                });
            });
            
        }, false);
                            
    console.log("Carregou Mapa (route)");
    
    $scope.check_in = function() {
        
        map.setClickable( false );
        
        $mdDialog
            .show(
                $mdDialog.alert()
                  .title('Check-in')
                  .content('Latitude: ' + myLocation.lat + '\nLongitude: ' + myLocation.lng)
                  //.content('Check-in realizado com sucesso.')
                  .ok('OK')
            )
            .finally(function() {
                map.setClickable( true );
            });
    }
}]);

appControllers.controller('Truck', function($scope, $rootScope, $routeParams, FoodTruck, Cardapio, Agenda){    
    
    $scope.id = $routeParams.id;
        
    $scope.height = window.innerHeight 
            - document.getElementsByTagName('md-toolbar')[0].clientHeight
            - document.getElementsByTagName('md-card')[0].clientHeight
            - document.getElementsByTagName('md-tabs-wrapper')[0].clientHeight;
    
    console.log("Carregou Truck: " + $scope.id + " (route) - " + $scope.height);
    
    $scope.food_truck = {};
    
    FoodTruck.getFoodTrucks($scope.id, function(data) {
        //debugger;
        $scope.food_truck = data;
    });
    
    $scope.cardapio = {};
                
    Cardapio.getCardapio($scope.id, function(data) {
        //debugger;
        $scope.cardapio = data;
    });

    $scope.agenda = {};
                
    Agenda.getAgenda($scope.id, function(data) {
        //debugger;
        $scope.agenda = data;
    });
    
    
    //$scope.foodTrucks = {};
//    var foodTrucks = {};
//    FoodTruck.getFoodTrucks(function(data) {
//        
//        foodTrucks = data;
//        
//        var arrFoodTrucks = [];
//        for (var elem in foodTrucks) {
//           arrFoodTrucks.push(foodTrucks[elem]);
//        }
//        
//        debugger;
//    });
    
    $scope.navegar = function() {
                        
        plugin.google.maps.external.launchNavigation({
            "from": $rootScope.myLocation,
            "to": $rootScope.latLng
        });
    }
});

appControllers.controller('Cardapio', function($scope, $routeParams){    
    $scope.id = $routeParams.id;
    console.log("Carregou Cardapio: " + $scope.id + " (route)");
});

appControllers.controller('WidthDemoCtrl', DemoCtrl);
function DemoCtrl($mdDialog) {
  var vm = this;
  this.announceClick = function(index) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('You clicked!')
        .content('You clicked the menu item at index ' + index)
        .ok('Nice')
    );
  };
}
;
