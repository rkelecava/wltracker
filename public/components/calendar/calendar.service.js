app.factory('WL', ['$http', function ($http) {
    var o = {};

    o.GETBYDATE = function (payload) {
        return $http.post('/api/entry/byDate', payload);
    };

    o.GETALL = function () {
        return $http.get('/api/entry');
    };

    o.ADD = function (payload) {
        return $http.post('/api/entry', payload);
    };

    o.DELETE = function (id) {
        return $http.delete('/api/entry/' + id);
    };

    o.UPDATE = function (entry) {
        return $http.put('/api/entry/' + entry._id, entry);
    };

    o.ADDWEIGHT = function (payload) {
        return $http.post('/api/weighin', payload);
    };

    o.GETALLWEIGHTS = function () {
        return $http.get('/api/weighin');
    };

    return o;
}]);