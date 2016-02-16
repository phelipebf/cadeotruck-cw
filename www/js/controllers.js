var appControllers = angular.module('appControllers', []);

appControllers.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };
}]);

appControllers.controller('LeftCtrl', function ($scope, $mdSidenav, $log, $window, $location) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
            //$log.debug("close LEFT is done");
        });        
    };
    
    $scope.redirect = function(url, refresh) {
        if(refresh || $scope.$$phase) {
            $window.location.href = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
        
        $mdSidenav('left').close()
    }
    
    $scope.menus = [
        {
          //icone : imagePath,      
          titulo: "Login (Trucks)",
          url: "#/login"
        }
        /*{
          //icone : imagePath,      
          titulo: "Mapa"
        }, {
          //icone : imagePath,      
          titulo: "Agenda"
        }, {
          //icone : imagePath,      
          titulo: "Eventos"
        }*/
    ];
});
  
appControllers.controller('Mapa', ['$scope', '$rootScope', '$mdSidenav', '$window', '$mdDialog', 'FoodTruck', function($scope, $rootScope, $mdSidenav, $window, $mdDialog, FoodTruck){
        
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
                        //'tilt': 60,
                        'zoom': 11,
                        //'bearing': 140
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
                
                var food_trucks = {};
                
                FoodTruck.getFoodTrucks(function(data) {        
                    var foodTrucks = [];
                    food_trucks = data;        
                    food_trucks.map(function(truck) {                        
                        foodTrucks[foodTrucks.length] = {"id":truck.id, "latlng":[truck.localizacoes[0].latitude, truck.localizacoes[0].longitude], "nome":truck.nome, "descricao":truck.descricao};
                    });
                    //debugger;
                    
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
                                 * do marker, carrega página com informações detalhadas
                                 * do truck
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
                });

                // Markers
                // TODO: Implementar serviço REST para buscar markers/trucks
                /*var foodTrucks = [
                    {"id":2, "latlng":[-15.822863, -47.987826], "nome":"Geléia", "descricao":"Sanduíche no pão australiano. Hoje, 14:00 - 20:00"},
                    {"id":1, "latlng":[-15.817248, -47.907145], "nome":"Bistruck", "descricao":"Hoje, 14:00 - 20:00"},
                    {"id":3, "latlng":[-15.881348, -48.014130], "nome":"Teste Truck", "descricao":"Food truck fictício. Hoje, 14:00 - 20:00"},                    
                ];*/
                        

                

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
    
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
        map.setClickable( false );
    }
    
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
            //$log.debug("close LEFT is done");
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
    
    FoodTruck.getFoodTruck($scope.id, function(data) {
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
    
    
    
    /*var food_trucks = {};
    var foodTrucks = [];    
    
    FoodTruck.getFoodTrucks(function(data) {        
        food_trucks = data;        
        food_trucks.map(function(info) {                        
            foodTrucks[foodTrucks.length] = {"id":info.id, "latlng":[info.localizacoes[0].latitude, info.localizacoes[0].longitude], "nome":info.nome, "descricao":info.descricao};
        });
        
        var trucks = [
                    {"id":2, "latlng":[-15.822863, -47.987826], "nome":"Geleia", "descricao":"Hoje, 14:00 - 20:00"},
                    {"id":1, "latlng":[-15.817248, -47.907145], "nome":"Bistruck", "descricao":"Hoje, 14:00 - 20:00"},
                    {"id":3, "latlng":[-15.881348, -48.014130], "nome":"Teste Truck", "descricao":"Hoje, 14:00 - 20:00"},                    
                ];        
        
        debugger;
    }); */
    
    
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

appControllers.controller('Login', function($scope, $routeParams){    
    $scope.id = $routeParams.id;
    console.log("Carregou Login (route)");
    
    //$scope.usario = '';
    //$scope.text = 'hello';
    $scope.submit = function() {
        if ($scope.usuario && $scope.senha) {
            //$scope.list.push(this.text);
            //$scope.text = '';
            alert('LOGIN ' + $scope.usuario + ' ' + $scope.senha);
        }
        else
        {
            alert('É necessário preencher todos os campos.');
        }
    }
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
