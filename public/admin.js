var pizzaApp = angular.module('pizzaApp', ['ngRoute']);

    //service to show the cost of selected number of pizza (quantity * rate)
    pizzaApp.service('costService', function() {
      this.costVal = function(a,b) {
        return a * b;
      };
    });

    //to maintain cart until placing the order
    pizzaApp.service('cartService', function () {
    var pizid = 0;

    //pizza array stores the details of pizza that has been added to the cart
    var pizzaArray = [];

    //function to add a pizza in to the cart
    this.save = function (pizza) {
      if (pizza.id == null) {
        pizza.id = pizid++;
        pizzaArray.push(pizza);
      } else {
        for (i in pizzaArray) {
          if (pizzaArray[i].id == pizza.id) {
            pizzaArray[i] = pizza;
          }
        }
      }
    }

    //function to remove a pizza from the cart
    this.delete = function (id) {
      for (i in pizzaArray) {
        if (pizzaArray[i].id == id) {
          pizzaArray.splice(i, 1);
        }
      }
    }

    //function to delete the cart after placing the order
    this.deleteAll = function () {
      pizzaArray.splice(0, pizzaArray.length);
    }

    //function to return the current status of cart
    this.list = function () {
      return pizzaArray;
    }
  });

  pizzaApp.config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'pizzaList.html',
        controller: 'pizzaCtrl'
      }).
      when('/home', {
        templateUrl: 'pizzaList.html',
        controller: 'pizzaCtrl'
      }).
      when('/order', {
        templateUrl: 'ordersummary.html',
        controller: 'pizzaOrderCtrl'
      }).
      when('/userdetails', {
        templateUrl: 'userDetails.html',
        controller: 'userDetailCtrl'
      }).
      when('/:pizzadetails', {
        templateUrl: 'pizzaDetails.html',
        controller: 'pizzaDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  });

  //controller for loading pizza list in home page
  pizzaApp.controller('pizzaCtrl',['$scope', '$http', function (scope, http){
    http.post('/pizzadata').success(function(data) {
      scope.details = data;
    });
  }]);

  //controller for showing details of selected pizza
  //also add to cart functionality is handled here
  pizzaApp.controller('pizzaDetailCtrl',['$scope', '$routeParams', '$http', 'cartService', 'costService', function (scope, routeParams, http, cartService, costService){
    scope.name = routeParams.pizzadetails;
      
    http.post('/pizzadata').success(function(data) {
      scope.details = data.filter(function(entry){
        return entry.name === scope.name;
      })[0];

      //calculate the cost and extract the pizza details for adding to the cart
      scope.findCost = function() {
        scope.cost = costService.costVal(scope.newPizza.qty,scope.details.rate);
        scope.newPizza.name = scope.details.name;
        scope.newPizza.cost = scope.cost;
      }
    });

    //to implement add to cart functionality
    scope.pizzaList = cartService.list();
    scope.savePizza = function () {
      cartService.save(scope.newPizza);
      scope.newPizza = {};
    }
  }]);

  //controller for maintaining the cart
  pizzaApp.controller('pizzaOrderCtrl', ['$scope', 'cartService', function (scope, cartService){
    scope.pizzaList = cartService.list();

    //removes an element from the cart, also updates the cost
    scope.delete = function (id,cost) {
      scope.total -= cost;
      cartService.delete(id);
    }

    scope.total = 0;
    for (var i = 0; i < scope.pizzaList.length; i++) {
      scope.total += scope.pizzaList[i].cost;
    };
  }]);

    //controller for managing the entered user details
  pizzaApp.controller('userDetailCtrl',['$scope', '$http', 'cartService', function (scope, http, cartService){
    http.post('/pizzadata').success(function(data) {
      scope.details = data;
    });

    scope.pizzaList = cartService.list();

    //post the user details and cart to the server
    scope.finishOrder = function() {
      scope.pizzaList = cartService.list();
      scope.user.order = scope.pizzaList;
      scope.user.deliveryStatus = "Not Deliverd";

      http({
        method  : 'POST',
        url     : '/insertPizza',
        data    : scope.user,
        headers : {'Content-Type': 'application/json'} 
      })
      .success(function(data) {
        cartService.deleteAll();
      });
    }
  }]);
  