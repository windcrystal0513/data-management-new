// 自适应程序
var zidingyi_height;
$(document).ready(function(){
 var header=$(".content-header").offset().top+$(".content-header").height()
 var footer=$(".main-footer").offset().top
 zidingyi_height=footer-header;
 // console.log(zidingyi_height);
 console.log($("#topicTreeDiv"));
 $("#topicTreeDiv").css("height",zidingyi_height*0.65+"px");
 
 $("#topicAllDiv").css("height",zidingyi_height*0.85+"px");

 $("#topicAddDiv").css("height",zidingyi_height*0.15+"px");
           
})


var nowOperateTopic;
var nowDeleteModifyTopic;



$(function () { $("[data-toggle='tooltip']").tooltip(); });
var app = angular.module('myApp', [ ]);
app.directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {$event:event});
                });
            });
        };
    });
app.controller('myCon',function($scope,$http){
    // $http.get(ip+"/domain/getDomainsGroupBySubject").success(function(response) { 
    //     data = response["data"];
    //     $scope.subjects = response["data"];
    //     // console.log($scope.subjects);
    //         // 切回导航页面时，读取现有课程并更新两个框的值
    //         for(i = 0; i < data.length; i++) {
    //             if(data[i].subjectName == getCookie("NowSubject")) {
    //                 $scope.subject = data[i];
    //                 for(j = 0; j < data[i].domains.length; j++) {
    //                     if(data[i].domains[j].domainName == getCookie("NowClass")) {
    //                         $scope.domain = data[i].domains[j];
    //                     }
    //                 }
    //             }
    //         }
    $http({
        method:'GET',
        url:ip+"/domain/getDomainsAndSubjectsByUseId",
        params:{userName:JSON.parse(getCookie("userinfo")).userName}
    }).then(function successCallback(response){
        console.log(response["data"]["data"]);
        data = response["data"];
        data=data["data"]
        $scope.subjects = data;
        console.log($scope.subjects);
            // 切回导航页面时，读取现有课程并更新两个框的值
        for(i = 0; i < data.length; i++) {
            if(data[i].subjectName == getCookie("NowSubject")) {
                $scope.subject = data[i];
                for(j = 0; j < data[i].domains.length; j++) {
                    if(data[i].domains[j].domainName == getCookie("NowClass")) {
                        $scope.domain = data[i].domains[j];
                    }
                }
            } 
        }
        $scope.getDefault(getCookie("NowClass"));
    });

    $scope.getDefault=function(domain){
        $http({
            method:'GET',
            url:ip+"/topic/getTopicsByDomainName",
            params:{domainName:domain}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response.data[0].topicName);
            $scope.topics=response.data;
            $("#nowClass").text(domain+"所有主题");
            $("#nowAddTopicClass").text(domain+"添加认知关系");
            $("#nowTopicTree").text(response.data[0].topicName+"主题分面树");
            $scope.showFacetTreeWithoutLeaves(response.data[0].topicName);
        }, function errorCallback(response){

        });
        $http({
            method:'GET',
            url:ip+"/dependency/getDependenciesByDomainName",
            params:{domainName:domain}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response.data);
            $scope.dependences=response.data;
            $("#dependenceNum").text(domain+"下认知关系共"+response.data.length+"条");
        }, function errorCallback(response){

        });
        
    }

    $scope.subject_change=function(){
        if($scope.subject==null){
            // alert("请选择学科及课程");
        }
        else{
            setCookie("NowSubject", $scope.subject.subjectName, "d900");
            // console.log($scope.subject);
        }
    }

    $scope.domain_change=function(){
        if($scope.domain!=null & $scope.subject!=null){
            setCookie("NowClass", $scope.domain.domainName, "d900");
            setCookie("NowSubject", $scope.subject.subjectName, "d900");
            var subject=$scope.subject.subjectName;
            var domain=$scope.domain.domainName;
            $scope.getDefault(domain);
        }
        else if($scope.domain==null & $scope.subject!=null){
            // alert("请选择课程");
        }
        
    }

    $scope.nowTopic=function(t){
        nowOperateTopic=t;
        $("#nowTopicTree").text(t+"主题分面树");
    }

    $scope.getTopicInfo=function(t){
        $http({
            method:'GET',
            url:ip+"/topic/getTopicInformationByDomainNameAndTopicName",
            params:{domainName:getCookie("NowClass"),topicName:t}
        }).then(function successCallback(response){
            // console.log(response.data.data);
            $("#"+response.data.data.topicId).attr("title","主题下共有分面"+response.data.data.facetNumber+"个,碎片"+response.data.data.assembleNumber+"个");
        }, function errorCallback(response){

        });
    }
    $scope.rightTopic=function(t){
        console.log(t);
        nowDeleteModifyTopic=t;
    }

    $scope.addTopic=function(){

        $http({
            method:'GET',
            url:ip+"/topic/insertTopicByNameAndDomainName",
            params:{domainName:getCookie("NowClass"),topicName:$("input[name='addTopicName']").val()}
        }).then(function successCallback(response){
            alert(response.data.data);
            $scope.domain_change();
            // $scope.chooseSubject(nowOperateSubject);
        }, function errorCallback(response){

        });
    }

    $scope.deleteTopic=function(){
        // console.log(getCookie("NowClass"));
        // console.log(nowDeleteModifyTopic);
        $http({
            method:'GET',
            url:ip+"/topic/deleteTopicByNameAndDomainName",
            params:{domainName:getCookie("NowClass"),topicName:nowDeleteModifyTopic}
        }).then(function successCallback(response){
            response = response["data"];
            alert(nowOperateTopic+response.data);
            $scope.getDefault(getCookie("NowClass"));
        }, function errorCallback(response){

        });
    }

    $scope.showModifyModal=function(){
        $("#modifyTopicModal").modal();
    }

    $scope.modifyTopic=function(){
        console.log("modify");
        $http({
            method:'GET',
            url:ip+"/topic/updateTopicByTopicName",
            params:{oldTopicName:nowDeleteModifyTopic,newTopicName:$("input[name='NewTopicName']").val(),domainName:getCookie("NowClass")}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response);
            alert(response.data);
            $scope.getDefault(getCookie("NowClass"));
        }, function errorCallback(response){

        });
    }

    $scope.addDependence=function(){
        var topic1=document.getElementById("Topic1").value;
        var topic2=document.getElementById("Topic2").value;
        console.log(topic1+" "+topic2);
        $http({
            method:'POST',
            url:ip+"/dependency/insertDependency",
            params:{domainName:getCookie("NowClass"),startTopicName:topic1,endTopicName:topic2}
        }).then(function successCallback(response){
            console.log(response);
            response = response["data"];
            alert(response.data);
            $scope.getDefault(getCookie("NowClass"));
        }, function errorCallback(response){
            alert(response.data.msg);
        });
    }

    $scope.deleteDependence=function(a,b){
        $http({
            method:'POST',
            url:ip+"/dependency/deleteDependency",
            params:{domainName:getCookie("NowClass"),startTopicId:a,endTopicId:b}
        }).then(function successCallback(response){
            alert(response.data.data);
            $scope.getDefault(getCookie("NowClass"));
        }, function errorCallback(response){

        });
    }
    $scope.queryByKeyword=function(){
        $http({
            method:'GET',
            url:ip+"/dependency/getDependenciesByKeyword",
            params:{domainName:getCookie("NowClass"),keyword:$("input[name='chaxun']").val()}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.dependences=response.data;
        }, function errorCallback(response){

        });
    }

    //杨宽添加，显示分面树函数
    $scope.showFacetTreeWithoutLeaves=function(topicName){
        $.ajax({

            type: "POST",
            url: ip+"/topic/getCompleteTopicByNameAndDomainNameWithHasFragment",
            data: $.param( {
                domainName:getCookie("NowClass"),
                topicName:topicName,
                hasFragment:false
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},            
            success: function(response){
                data = response["data"];
                //console.log(data);
                //DisplayTrunk(data);
                DisplayBranch(data);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                //通常情况下textStatus和errorThrown只有其中一个包含信息
                //alert(textStatus);
            }
        });
 
    }
});
