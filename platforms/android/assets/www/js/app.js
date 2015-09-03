var app = angular.module("truckfinder", [
    'ngMaterial', 
    'ngRoute',     
    'appControllers',
    'appServices'
]);
        
app.config(function($mdThemingProvider, $routeProvider) {
    $mdThemingProvider
    .theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('orange', {
            'default': '800'
    });

    $routeProvider
    .when("/", {
        templateUrl: "templates/mapa.html",
        controller: "Mapa"
    })
    .when("/mapa/", {
        templateUrl: "templates/mapa.html",
        controller: "Mapa"
    })
    .when("/truck/:id",{
        templateUrl: "templates/truck.html",
        controller: "Truck"
    })
    .when("/cardapio/:id",{
        templateUrl: "templates/cardapio.html",
        controller: "Cardapio"
    })    
    .otherwise({
        redirectTo: "/"
    });
}).run(function() {
        //remove 300ms delay touch
        FastClick.attach(document.body);
    });

/*
app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    }; 
}])

.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
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
  })
  
.controller('Mapa', function(){
    console.log("Carregou Mapa (route)");
})

.controller('Cardapio', function($scope, $routeParams){    
    $scope.id = $routeParams.id;
})

.controller('WidthDemoCtrl', DemoCtrl);
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
*/
