var app = angular.module('ngGitApp', []);

app.controller('ngGitController', function($scope, $http, $timeout) {
    //Makes the call to the Github API and returns a user if found.
    $scope.getUser = function () {
        if ($scope.gitName.name.length > 0) {
            $http.get("https://api.github.com/users/" + $scope.gitName.name)
                .then(function(response) {
                    $scope.user = response.data;
                    console.log($scope.user.repos_url);
                    $http.get($scope.user.repos_url)
                        .then(function(res) {
                            $scope.repos = res.data;
                            $scope.showTableData = true;
                        });
                }, $scope.onError);
        }
    };

    //Displays an error if the user wasn't found
    $scope.onError = function() {
        $scope.errorLabel = "Could not find Github User:  " + $scope.gitName.name;
        $scope.showError = true;
    }

    //Initiate a search half a second after the user stops typing.
    $scope.$watch('gitName.name', function (newValue, oldValue) {
        $scope.showError = false;
        if (newValue != null) {
            if (searchTimeout) {
                $timeout.cancel(searchTimeout);
            }
            searchTimeout = $timeout($scope.getUser, 500);
       }
       
    });

    var searchTimeout;
    $scope.showError = false;
    $scope.showTableData = false;
    $scope.message = "GitHub Search";
});

//Search box directive
app.directive('ngGit', function() {
    return {
        retrict: 'E',
        template: '<div class="col-sm-3">Enter a GitHub Username: <input class="form-control" type="text" ng-model="gitName.name"><label class="label label-danger" ng-show="showError">{{errorLabel}}</label></div>'
    };
});

//Repo Results directive
app.directive('ngGitRepos', function () {
    return {
        retrict: 'E',
        template: '<table class="table table-hover"><thead><tr><th>Repo Name</th><th>Full Repo Name</th><th>Repo URL</th><th>Date Created</th></tr></thead><tr ng-repeat="repo in repos"><td>{{repo.name}}</td><td>{{repo.full_name}}</td><td><a href="{{repo.html_url}}">{{repo.html_url}}</a></td><td>{{repo.created_at | date:\'short\'}}</td></tr></table>'
    };
});
