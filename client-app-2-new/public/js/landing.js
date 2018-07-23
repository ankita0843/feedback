var myApp = angular.module('clientApp2', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
myApp.controller('AdminController1', ['$scope', '$window', '$http', function ($scope, $window, $http) {
	$scope.deactivateForm= function () {
        if ($scope.activate) {

        	$scope.activate=0;
        	document.getElementById('btn').value = "Activate";
        	
        }
        else
        {
        	$scope.activate=1;
        	document.getElementById('btn').value = "Deactivate";+
            
        }
    };
     var putReq = {
            method: 'PUT',
            url: 'http://localhost:3000/reviews/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.activate
        };

        $http(putReq).then(
            function (response) {
                console.log("Ok..", response);

                // TODO: created_reviews

                $http({
                    method : "PUT",
                    url : 'http://localhost:8000/admins/' + $window.userInfo._id + '/created_forms',
                    data : {review_id: response.data._id},
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }).then( function (response) {
                    console.log("ok...", response);

                    $scope.displaySuccessModal();
                    $("#submitted-form-modal").on('hidden.bs.modal', function () {
                        window.location = "http://localhost:8000";
                    });
                    
                }, function (response) {
                    console.log("not ok...", response)
                } );



            },
            function (response) {
                console.log("Not Ok..", response);
            }
        );
}]);

