var app=angular.module('myApp',['ngRoute']);


const {remote}=require('electron')

   

//part2
app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl:'./select.html',
        controller:'selectCtrl'
    })
    .when('/edit',{
        templateUrl:'./edit.html',
        controller:'editCtrl'
    })
    .otherwise({
        template:'Page Not Found'
    })
})

//part3
app.service('imageService',function(){
    var imagePath="";

    this.setImagePath=function(path){
        imagePath=path;
    }

    this.getImagePath=function(){
        return imagePath;
    }
})

app.controller('frameCtrl',function($scope){

    var win=remote.getCurrentWindow();
    $scope.close=function(){
        win.close();
    }
    $scope.max=function(){
        if(win.isMaximized()){
            win.unmaximize()
        }else{
            win.maximize()
        }
    }
    $scope.min=function(){
        win.minimize();
    }

});

//part2
app.controller('selectCtrl',function($scope,$location,/*part3*/imageService){
    //part3
    var dragFile= document.getElementById("imageSelector");

    dragFile.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
  
      for (let f of e.dataTransfer.files) {
        //image/jpeg  image/png
        if(f.type=="image/jpeg"||f.type=="image/png"){
        $location.path('/edit');
        $scope.$apply();
        imageService.setImagePath(f.path);
        }
      }
    });
    dragFile.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    //part2
    $scope.imageSelect=function(){
        var {dialog}=remote;

    dialog.showOpenDialog({
            properties:['OpenFile'],
            filters:[{
                name:'Images',
                extensions:['jpg','jpeg','png']
            }]
        },function(file){
            if(!!file){
                var path=file[0];
                $location.path('/edit');
                $scope.$apply();

                /*part3*/
                imageService.setImagePath(path);
            }
        })
    }

    
});

//part3
app.controller('editCtrl',function($scope,imageService){

    $scope.controlActive=false;

    $scope.imagePath=imageService.getImagePath();

    $scope.effects={
        'Contrast':{val:100,min:0,max:200,scale:'%'},
        'Invert':{val:0,min:0,max:100,scale:'%'},
        'Brightness':{val:100,min:0,max:200,scale:'%'},
        'Grayscale':{val:0,min:0,max:100,scale:'%'},
        'Sepia':{val:0,min:0,max:100,scale:'%'},
        'Blur':{val:0,min:0,max:5,scale:'px'},
    };

    $scope.imageEffect=function(effectName){
        console.log(effectName);
        $scope.activeEffect=effectName;
        $scope.controlActive=true;

    }
})