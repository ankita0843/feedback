var MyApp=angular.module('clientApp3', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
myApp.controller('MainController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

   
    $scope.questions = [];
    $scope.noOfQuestions = 0;
    $scope.questionNos = [];
  
   $scope.departments = ['IT', 'CSE', 'ECE', 'BT', 'CE', 'CHE', 'ME', 'MME', 'EE'];
    $scope.selectedDepartments = [];
    $scope.allSelected = false;
    // Background and border colors to be used by all charts

    $scope.reviewId = $window.reviewId;
    $scope.adminInfo = $window.adminInfo;
    
    $scope.backgroundColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];

    $scope.borderColors = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];
      $scope.dummyQuestion = {
        "questionNo": 1,
        "title": "",
        "importance": 10,
        "thoughtProvoking": 2,
        "displayEmotion": true,
        "relatedTo": [],
        "optionTitles": [
            "Very poor",
            "Poor",
            "Ok",
            "Good",
            "Very Good"
        ],
        "optionValues": [
            0,
            1,
            2,
            3,
            4
        ]
    };

    $scope.dummyTextQuestion = {
        questionNo: "",
        title: ""
    };
    $scope.questions = [$scope.dummyQuestion];
    $scope.textQuestions = [];

    $scope.finalObject = {
        "targetedUsers": [],
        //"targetedsub" : [],
        "mcq": [],
        "postedBy": {
            username: "",
            email: "",
            full_name: ""
        },
        "text": []
    };


    $scope.inArray = function (array, value) {
        for (var i = 0; i < array.length; ++i) {
            if (array[i] == value) {
                return i;
            }
        }
        return -1;
    };


  $scope.selectAllDepartments = function (select) {
        if (select) {
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).checked = true;
                $scope.allSelected = true;
            });
        } else {
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).checked = false;
                $scope.allSelected = false;
            });
        }
    };
                
   $scope.departmentSelectionDone = function (done) {
        if (done) {
            // get the values of selected depts
            // push it into $scope.selectedDepartmentsF
            $scope.departments.forEach(function (department) {
                var inputElement = document.getElementById('department-' + department);
             
                if (inputElement.checked) {
                    // if already not in array push
                    if ($scope.inArray($scope.selectedDepartments, inputElement.value) == -1) {
                        $scope.selectedDepartments.push(inputElement.value);
                          console.log(inputElement.value);
                    }
                   
                    //z(inputElement.value);
                }
               
                 else {
                    // not checked means u need to remove
                    if ($scope.inArray($scope.selectedDepartments, inputElement.value) != -1) {
                        var foundIndex = $scope.inArray($scope.selectedDepartments, inputElement.value);
                        $scope.selectedDepartments.splice(foundIndex, 1);
                    }
                }
            });
            
           
             
            // now disable the inputs
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).disabled = true;
            });

        }
         else {
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).disabled = false;
            });
        }
 

        console.log("Department data:", $scope.selectedDepartments);
    };  
 $scope.getResponses = function () {
        $http.get("http://localhost:3000/responses_new/reviewId/" + $scope.reviewId).then(function (response) {
            $scope.apiResponse = response.data;
            $scope.apiResponse[0].mcqResponse.forEach(function (userResponse) {
                $scope.questions.push(userResponse.title);
            });
            console.log("api response:", $scope.apiResponse);
            $scope.noOfUsers = $scope.apiResponse.length;
            $scope.noOfQuestions = $scope.apiResponse[0].mcqResponse.length;
            for (var i = 0; i < $scope.noOfQuestions; ++i) {
                $scope.questionNos.push(i + 1);
            }
        }
    };
            
$scope.getResponses();
    function isInArray(val, arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (val === arr[i]) {
                return i;
            }
        }
        return -1;
    }

    function averageInArray(arr) {
        var length = arr.length;
        var total = 0;
        for (var i = 0; i < length; ++i) {
            total += arr[i];
        }
        return total / length;
    }

    

}]);
