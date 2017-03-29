app.controller('CalCtrl', ['$scope', 'WL', function ($scope, WL) {

    $scope.checkObj = function (obj) {
        if (!isEmpty(obj)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.updateEntry = function (entry) {
        console.log('what');
        WL.UPDATE(entry).then(function successCallBack(res) {
            console.log(res.data);
            $scope.changeMonth();
        });
    };

    $scope.deleteEntry = function (entry) {
        WL.DELETE(entry._id).then(function successCallBack(res) {
            $scope.changeMonth();
        });
    };

    $scope.addItem = function (day) {
        var date = new Date($scope.currentDate);
        date.setDate(day);


        var item = {};

        $scope.calendar.forEach(function(calItem) {
            if (calItem.day === day) {
                item = calItem;
            }
        }, this);

        var payload = {
            logged: Date.parse(date),
            description: item.addDescription,
            calories: item.addCalories
        };

        if (item.addWeight && item.addWeight !== '') {
            var newPayload = {
                entered: Date.parse(date),
                weight: item.addWeight
            };
            if (item.addDescription && item.addDescription !== '') {
                WL.ADDWEIGHT(newPayload).then(function successCallBack(res) {
                    WL.ADD(payload).then(function successCallBack(res) {
                        $scope.calendar.forEach(function(calItem) {
                            if (calItem.day === day) {
                                $scope.changeMonth();
                            }
                        }, this);
                    });
                });
            } else {
                WL.ADDWEIGHT(newPayload).then(function successCallBack(res) {
                    $scope.changeMonth();
                });                
            }
        } else {
            WL.ADD(payload).then(function successCallBack(res) {
                $scope.calendar.forEach(function(calItem) {
                    if (calItem.day === day) {
                        $scope.changeMonth();
                    }
                }, this);
            });
        }


        
    };

    $scope.changeMonth = function (option) {

        WL.GETALLWEIGHTS().then(function successCallBack(res1) {

            WL.GETALL().then(function successCallBack(res) {

                var date = $scope.myDate;
                if (option === 'forward') {
                    if (date.getMonth() + 1 === 12) {
                        date.setFullYear(date.getFullYear() + 1);
                        date.setMonth(0);
                        var d = date;
                    } else {
                        date.setMonth(date.getMonth() + 1);
                        var d = date;
                    }
                } else if (option === 'backward'){
                    if (date.getMonth() - 1 === -1) {
                        date.setFullYear(date.getFullYear() - 1);
                        date.setMonth(11);
                        var d = date;
                    } else {
                        date.setMonth(date.getMonth() - 1);
                        var d = date;
                    } 
                } else {
                    var d = date;
                }

                var t = new Date(d.getFullYear(), d.getMonth(), 1);
                var weekDay = t.getDay();
                var startOffset = 0;
                var daysInCurrentMonth = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
                var previousMonth = d.getMonth() - 1;
                var previousYear = d.getFullYear();
                if (previousMonth === -1) {
                    previousMonth = 12;
                    previousYear = previousYear - 1;
                }

                var newD = new Date(previousYear, previousMonth, 0);

                var daysInPreviousMonth = new Date(previousYear, previousMonth+1, 0).getDate();

                switch(weekDay) {
                    case 0:
                        startOffset = 7;
                        break;
                    case 1:
                        startOffset = 1;
                        break;
                    case 2:
                        startOffset = 2;
                        break;
                    case 3:
                        startOffset = 3;
                        break;
                    case 4:
                        startOffset = 4;
                        break;
                    case 5:
                        startOffset = 5;
                        break;
                    case 6:
                        startOffset = 6;
                        break;
                    default:
                        break;
                }

                var totalDaysFromStart = startOffset + daysInCurrentMonth;

                var currentDay = 0;
                var endDay = 0;

                var items = [];
                for(var i = 0; i < 42; i++) {
                    currentDay++;
                    if ((currentDay) <= startOffset) {
                        var previousMonthDay = daysInPreviousMonth - (startOffset - (currentDay));
                        var item = {
                            pos: i,
                            style: 'calendar-disabled',
                            day: previousMonthDay
                        };
                        items.push(item);
                    } else {
                        var newDay = (currentDay) - startOffset;
                        if (newDay > daysInCurrentMonth) {
                            endDay++;
                            var item = {
                                pos: i,
                                style: 'calendar-disabled',
                                day: endDay
                            };
                            items.push(item);                    
                        } else {
                            var matchingEntries = [];
                            var actualWeighin = {};
                            var total = 0;
                            res.data.forEach(function(entry) {
                                var date = new Date(entry.logged);
                                if (t.getMonth() === date.getMonth() && t.getFullYear() === date.getFullYear() && date.getDate() === newDay) {
                                    matchingEntries.push(entry);
                                    total+=entry.calories;
                                }
                            }, this);
                            res1.data.forEach(function(weighin) {
                                var date = new Date(weighin.entered);
                                if (t.getMonth() === date.getMonth() && t.getFullYear() === date.getFullYear() && date.getDate() === newDay) {
                                    actualWeighin = weighin; 
                                }
                            }, this);
                            var item = {
                                pos: i,
                                day: newDay,
                                formFlag: false,
                                entries: matchingEntries,
                                total: total,
                                actualWeighin: actualWeighin
                            };
                            items.push(item);
                        }
                    }
                }

                $scope.calendar = items;
                $scope.currentDate = Date.parse(d);
                $scope.myDate = d;

            });

        });     
        
    };

    function buildCalendarStructure() {
        WL.GETALLWEIGHTS().then(function successCallBack(res1) {

        WL.GETALL().then(function successCallBack(res) {


                var d = new Date(window.d);
                var t = new Date(d.getFullYear(), d.getMonth(), 1);
                var weekDay = t.getDay();
                var startOffset = 0;
                var daysInCurrentMonth = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
                var previousMonth = d.getMonth() - 1;
                var previousYear = d.getFullYear();

                if (previousMonth === -1) {
                    previousMonth = 12;
                    previousYear = previousYear - 1;
                }

                var newD = new Date(previousYear, previousMonth, 0);

                var daysInPreviousMonth = new Date(previousYear, previousMonth+1, 0).getDate();
                switch(weekDay) {
                    case 0:
                        startOffset = 6;
                        break;
                    case 1:
                        startOffset = 0;
                        break;
                    case 2:
                        startOffset = 1;
                        break;
                    case 3:
                        startOffset = 2;
                        break;
                    case 4:
                        startOffset = 3;
                        break;
                    case 5:
                        startOffset = 4;
                        break;
                    case 6:
                        startOffset = 5;
                        break;
                    default:
                        break;
                }

                var totalDaysFromStart = startOffset + daysInCurrentMonth;

                var currentDay = 0;
                var endDay = 0;

                var items = [];

                for(var i = 0; i < 42; i++) {
                    currentDay++;
                    if ((currentDay-1) <= startOffset) {
                        var previousMonthDay = daysInPreviousMonth - (startOffset - (currentDay-1));
                        var item = {
                            pos: i,
                            style: 'calendar-disabled',
                            day: previousMonthDay
                        };
                        items.push(item);
                    } else {
                        var newDay = (currentDay-1) - startOffset;
                        if (newDay > daysInCurrentMonth) {
                            endDay++;
                            var item = {
                                pos: i,
                                style: 'calendar-disabled',
                                day: endDay
                            };
                            items.push(item);                    
                        } else {
                            var matchingEntries = [];
                            var actualWeighin = {};
                            var total = 0;
                            res.data.forEach(function(entry) {
                                var date = new Date(entry.logged);
                                if (t.getMonth() === date.getMonth() && t.getFullYear() === date.getFullYear() && date.getDate() === newDay) {
                                    matchingEntries.push(entry);
                                    total+=entry.calories;
                                }
                            }, this);
                            res1.data.forEach(function(weighin) {
                                var date = new Date(weighin.entered);
                                if (t.getMonth() === date.getMonth() && t.getFullYear() === date.getFullYear() && date.getDate() === newDay) {
                                    actualWeighin = weighin;
                                }                         
                            }, this);
                            console.log(actualWeighin);
                            var item = {
                                pos: i,
                                day: newDay,
                                formFlag: false,
                                entries: matchingEntries,
                                total: total,
                                actualWeighin: actualWeighin
                            };
                            items.push(item);
                        }
                    }
                }

                $scope.calendar = items;
                $scope.currentDate = Date.parse(window.d);
                $scope.myDate = d;



            });

        });

 
    }


    function addToEntries(data, array) {
        var newArray = [];
        array.forEach(function(item) {
            newArray.push(item);
        }, this);
        newArray.push(data);

        return newArray;
    }


    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }




    buildCalendarStructure();

}]);