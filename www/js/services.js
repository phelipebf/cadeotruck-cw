var appServices = angular.module("appServices", []);

appServices.factory('FoodTruck', function ($http) {
    var foodTruckList;
    var obj = {};
    obj = {
        getFoodTrucks: function (callback) {
            if (foodTruckList) {
                callback(foodTruckList);
                return false;
            } else {
                $http({
                    method: 'GET',
                    url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/food-trucks?expand=localizacoes',
                    //url: 'data/trucks.json',
                    responseType: 'json'
                }).success(function (data) {
                    // erros
                    obj.saveFoodTruck(data);
                    callback(data);
                }).error(function () {
                    //error
                });
            }
        },
        saveFoodTruck: function (data) {
            foodTruckList = data;
        }
    }
    return obj;
});

appServices.factory('Cardapio', function ($http, $scope) {
    var cardapioList;
    var obj = {};
    obj = {
        getCardapio: function (callback) {
            if (cardapioList) {
                callback(cardapioList);
                return false;
            } else {
                $http({
                    method: 'GET',
                    url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/food-trucks/' + $scope.id + '?expand=cardapio',
                    //url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/cardapios'
                }).success(function (data) {
                    // erros
                    obj.saveCardapio(data);
                    callback(data);
                }).error(function () {
                    //error
                });
            }
        },
        saveCardapio: function (data) {
            cardapioList = data;
        }
    }
    return obj;
});