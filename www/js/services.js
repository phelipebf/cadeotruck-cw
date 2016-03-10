var appServices = angular.module("appServices", []);

appServices.factory('Login', function ($http) {
    var user;
    var obj = {};
    
    obj = {
        autentica: function (username, password, callback) {
            $http({
                method: 'POST',                
                url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/user/login',
                data: {'username': username, 'password': password},
                responseType: 'json'
            }).success(function (response_data) {
                // erros
                obj.saveUser(response_data);
                callback(response_data);
            }).error(function (response_data) {
                obj.saveUser(response_data);
                callback(response_data);
            });
        },
        saveUser: function (response_data) {
            user = response_data;
        }
    };
    return obj;
});

appServices.factory('Localizacao', function ($http) {
    var checkin;
    var obj = {};
    
    obj = {
        checkin: function (latitude, longitude, hora_fim, id_food_truck, callback) {
            $http({
                method: 'POST',                
                url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/user/checkin',
                data: {'lat': latitude, 'lon': longitude, 'hora_fim': hora_fim, 'id_food_truck': id_food_truck},
                responseType: 'json'
            }).success(function (response_data) {
                // erros
                obj.saveCheckin(response_data);
                callback(response_data);
            }).error(function (response_data) {
                // Error
                //obj.saveCheckin(response_data);
                //callback(response_data);
            });
        },
        saveCheckin: function (response_data) {
            checkin = response_data;
        }
    };
    return obj;
});

appServices.factory('FoodTruck', function ($http) {
    var foodTruckList;
    var obj = {};
    obj = {
        getFoodTruck: function (id, callback) {
//            if (foodTruckList) {
//                callback(foodTruckList);
//                return false;
//            } else {
                $http({
                    method: 'GET',
                    //url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/food-trucks?expand=localizacoes',
                    url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/food-trucks/' + id,
                    //url: 'data/trucks.json',
                    responseType: 'json'
                }).success(function (data) {
                    // erros
                    obj.saveFoodTruck(data);
                    callback(data);
                }).error(function () {
                    //error
                });
//            }
        },
        getFoodTrucks: function (callback) {
//            if (foodTruckList) {
//                callback(foodTruckList);
//                return false;
//            } else {
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
//            }
        },
        saveFoodTruck: function (data) {
            foodTruckList = data;
        }
    }
    return obj;
});

appServices.factory('Cardapio', function ($http) {
    var cardapioList;
    var obj = {};
    obj = {
        getCardapio: function (id, callback) {
            /*if (cardapioList) {
                callback(cardapioList);
                return false;
            } else { */
                $http({
                    method: 'GET',
                    url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/food-trucks/' + id + '?expand=cardapio',
                    //url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/cardapios'
                }).success(function (data) {
                    // erros
                    obj.saveCardapio(data);
                    callback(data);
                }).error(function () {
                    //error
                });
            //}
        },
        saveCardapio: function (data) {
            cardapioList = data;
        }
    }
    return obj;
});

appServices.factory('Agenda', function ($http) {
    var agendaList;
    var obj = {};
    obj = {
        getAgenda: function (id, callback) {
            /*if (cardapioList) {
                callback(cardapioList);
                return false;
            } else { */
                $http({
                    method: 'GET',
                    url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/food-trucks/' + id + '?expand=agenda',
                    //url: 'http://truckfinder-phelipebf.rhcloud.com/api/web/v1/cardapios'
                }).success(function (data) {
                    // erros
                    obj.saveAgenda(data);
                    callback(data);
                }).error(function () {
                    //error
                });
            //}
        },
        saveAgenda: function (data) {
            agendaList = data;
        }
    }
    return obj;
});
