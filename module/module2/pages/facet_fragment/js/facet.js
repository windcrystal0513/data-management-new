// 自适应程序
var zidingyi_height;
$(document).ready(function(){
 var header=$(".content-header").offset().top+$(".content-header").height()
 var footer=$(".main-footer").offset().top
 zidingyi_height=footer-header;
 // console.log(zidingyi_height);
 
 $("#fragmentClassDiv").css("height",zidingyi_height*0.85+"px");
 
 $("#facetAddDiv").css("height",zidingyi_height*0.15+"px");

 $("#facetTreeDiv").css("height",zidingyi_height*0.65+"px");

 $("#fragmentInfoDiv").css("height",zidingyi_height*0.85+"px");   

 // $("#wang").css("height",zidingyi_height*0.4+"px");  


 })    




var E = window.wangEditor
var editor = new E('#wang')
editor.customConfig.uploadImgServer = ip+"/assemble/uploadImage";
editor.customConfig.uploadFileName = 'image';
editor.customConfig.hideLinkImg = true;
editor.create();

// var nowOperateClass;
var nowOperateTopic;
var nowOperateFacet1;
var nowOperateFacet2;
var nowOperateFacet3;
var nowOperateFacet1Id;
var nowOperateFacet2Id;
var nowOperateFacet3Id;
var nowOperateFacetLayer;

var nowDeleteModifyTopicName;
var nowDeleteModifyFacetLayer;
var nowDeleteModifyFacetId;

var modify_add_flag;
var nowAddFragmentFacetId;
var nowModifyFragmentId;


$(function () { $("[data-toggle='tooltip']").tooltip(); });


var app=angular.module('myApp', ['ui.bootstrap']);
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
app.controller('myCon',function($scope,$http,$sce){
    // $("[data-toggle='tooltip']").tooltip();
    $http.get(ip+'/domain/getDomainsGroupBySubject').success(function(response){
        data = response["data"];
        $scope.subjects = response["data"];
        // console.log($scope.subjects);
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

    $scope.isCollapsed = true;
    $scope.isCollapsedchildren = true;
    $scope.isCollapsedchildren2=true;

    $scope.rightFacet=function(topic,facetLayer,facetId){
        console.log(topic+" "+facetLayer+" "+facetId);
        nowDeleteModifyTopicName=topic;
        nowDeleteModifyFacetLayer=facetLayer;
        nowDeleteModifyFacetId=facetId;
    }


    

    $scope.getDefault=function(domain){
        $http({
            method:'GET',
            url:ip+"/domain/getDomainTreeByDomainName",
            params:{domainName:domain}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response.data);
            $scope.classInfo=response.data;
            $("#class_name").text(domain);
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
            $http({
                method:'GET',
                url:ip+"/domain/getDomainTreeByDomainName",
                params:{domainName:domain}
            }).then(function successCallback(response){
                response = response["data"];
                console.log(response.data);
                $scope.classInfo=response.data;
                $("#class_name").text(domain);
            }, function errorCallback(response){

            });
        }
        else if($scope.domain==null & $scope.subject!=null){
            // alert("请选择课程");
        }
        
    }

    $scope.getTopicInfo=function(a){
        // var facetNumber;
        // var fragmentNumber;
        // console.log(t);
        $http({
            method:'GET',
            url:ip+"/topic/getTopicInformationByDomainNameAndTopicName",
            params:{domainName:getCookie("NowClass"),topicName:a}
        }).then(function successCallback(response){
            // console.log(response["data"]);
            response = response["data"];
            $("#"+a+"_choose").attr("title","主题下共有分面"+response.data.facetNumber+"个,碎片"+response.data.assembleNumber+"个");
        }, function errorCallback(response){

        });
    }

    $scope.countFirstFacetInfo=function(a,b,c,d){
        // console.log(d);
        $http({
            method:'GET',
            url:ip+"/facet/countFacetInfo",
            params:{domainName:getCookie("NowClass"),topicName:a,facetLayer:c,facetId:d}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response.data);
            $("#"+a+"_"+b+"_choose").attr("title","分面下共有二级分面"+response.data.secondLayerFacetNumber+"个,碎片"+response.data.assembleNumber+"个");
        }, function errorCallback(response){

        });
    }

    $scope.countSecondFacetInfo=function(a,b,c,d,e){
        // console.log(d);
        $http({
            method:'GET',
            url:ip+"/facet/countFacetInfo",
            params:{domainName:getCookie("NowClass"),topicName:a,facetLayer:d,facetId:e}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response.data);
            $("#"+a+"_"+b+"_"+c+"_choose").attr("title","分面下共有三级分面"+response.data.thirdLayerFacetNumber+"个,碎片"+response.data.assembleNumber+"个");
        }, function errorCallback(response){

        });
    }

    $scope.countThirdFacetInfo=function(a,b,c,d,e,f){
        // console.log(d);
        $http({
            method:'GET',
            url:ip+"/facet/countFacetInfo",
            params:{domainName:getCookie("NowClass"),topicName:a,facetLayer:e,facetId:f}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response.data);
            $("#"+a+"_"+b+"_"+c+"_"+d+"_a").attr("title","分面下共有碎片"+response.data.assembleNumber+"个");
        }, function errorCallback(response){

        });
    }



    $scope.gettopicfacet=function(a,b){
        // nowOperateClass=a;
        nowOperateTopic=b;
        $("#nowtype").text("主题");
        $("#addfacetname").text(" "+b+" 添加分面");
        $("#topictree").text(b+" 实例化主题分面树");
    }

    $scope.getfacet1facet=function(a,b,c,d){
        // nowOperateClass=a;
        nowOperateTopic=b;
        nowOperateFacet1=c;
        nowOperateFacetLayer=1;
        nowOperateFacet1Id=d;
        nowAddFragmentFacetId=d;
        $("#nowtype").text("一级分面");
        $("#addfacetname").text(" "+c+" 添加分面");
        $("#topictree").text(b+" 实例化主题分面树");
    }

    $scope.getfacet2facet=function(a,b,c,d,e){
        // nowOperateClass=a;
        nowOperateTopic=b;
        nowOperateFacet1=c;
        nowOperateFacet2=d;
        nowOperateFacetLayer=2;
        nowOperateFacet2Id=e;
        nowAddFragmentFacetId=e;
        $("#nowtype").text("二级分面");
        $("#addfacetname").text(" "+d+" 添加分面");
        $("#topictree").text(b+" 实例化主题分面树");
    }

    $scope.getfacet3facet=function(a,b,c,d,e,f){
        // nowOperateClass=a;
        nowOperateTopic=b;
        nowOperateFacet1=c;
        nowOperateFacet2=d;
        nowOperateFacet3=e;
        nowOperateFacetLayer=3;
        nowOperateFacet3Id=f;
        nowAddFragmentFacetId=f;
        $("#nowtype").text("三级分面");
        $("#addfacetname").text(" "+e+" 添加分面");
        $("#topictree").text(b+" 实例化主题分面树");
    }

    $scope.addFacet=function(){
        var nowtype=document.getElementById("nowtype").innerText;
        // console.log(nowtype);
        var facetname=$("input[name='FacetName']").val();
        if(nowtype=="主题"){

            $http({
                method:'GET',
                url:ip+"/facet/insertFirstLayerFacet",
                params:{domainName:getCookie("NowClass"),topicName:nowOperateTopic,facetName:facetname}
            }).then(function successCallback(response){
                response = response["data"];
                alert(response.data);
                $scope.domain_change();
            }, function errorCallback(response){
                response = response["data"];
                alert(response.msg);

            });
        }
        else if(nowtype=="一级分面"){

            $http({
                method:'GET',
                url:ip+"/facet/insertSecondLayerFacet",
                params:{domainName:getCookie("NowClass"),topicName:nowOperateTopic
                    ,firstLayerFacetName:nowOperateFacet1,secondLayerFacetName:facetname}
                }).then(function successCallback(response){
                    response = response["data"];
                    alert(response.data);
                    $scope.domain_change();
                }, function errorCallback(response){
                    response = response["data"];
                    alert(response.msg);

                });
            }
            else if(nowtype=="二级分面"){

                $http({
                    method:'GET',
                    url:ip+"/facet/insertThirdLayerFacet",
                    params:{domainName:getCookie("NowClass"),topicName:nowOperateTopic
                        ,firstLayerFacetName:nowOperateFacet1
                        ,secondLayerFacetName:nowOperateFacet2
                        ,thirdLayerFacetName:facetname}
                    }).then(function successCallback(response){
                        response = response["data"];
                        alert(response.data);
                        $scope.domain_change();
                    }, function errorCallback(response){
                        response = response["data"];
                        alert(response.msg);

                    });
                }
                else if(nowtype=="三级分面"){
                    alert("三级分面下不可添加分面！");
                }
    }

    $scope.deleteFacet=function(){
        console.log("delete");
        $http({
            method:'GET',
            url:ip+"/facet/deleteFacet",
            params:{domainName:getCookie("NowClass"),topicName:nowDeleteModifyTopicName,facetLayer:nowDeleteModifyFacetLayer,facetId:nowDeleteModifyFacetId}
        }).then(function successCallback(response){
            response = response["data"];
            alert(response.data);
            $scope.domain_change();
        }, function errorCallback(response){

        });
    }

    $scope.showModal=function(){
        $("#modifyFacetModal").modal();
    }

    $scope.modifyFacet=function(){
        console.log("modify");
        $http({
            method:'GET',
            url:ip+"/facet/updateFacet",
            params:{domainName:getCookie("NowClass"),topicName:nowDeleteModifyTopicName,facetLayer:nowDeleteModifyFacetLayer,facetId:nowDeleteModifyFacetId,newFacetName:$("input[name='NewFacetName']").val()}
        }).then(function successCallback(response){
            response = response["data"];
            // console.log(response);
            alert(response.data);
            $scope.domain_change();
        }, function errorCallback(response){

        });
    }

    $scope.gettopicfragment=function(a,b){

        $http({
            method:'GET',
            url:ip+"/assemble/getAssemblesInTopic",
            params:{domainName:getCookie("NowClass"),topicName:b}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].assembleContent=$sce.trustAsHtml($scope.fragments[i].assembleContent);
           }
           $("#fragment_title").text("主题 "+b+" 下碎片");
        }, function errorCallback(response){

        });
    }

    $scope.getfacet1fragment=function(a,b,c,d){

        $http({
            method:'GET',
            url:ip+"/assemble/getAssemblesByFacetId",
            params:{facetId:d}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].assembleContent=$sce.trustAsHtml($scope.fragments[i].assembleContent);
           }
           $("#fragment_title").text("一级分面 "+c+" 下碎片");
        }, function errorCallback(response){

        });
    }

    $scope.getfacet2fragment=function(a,b,c,d){

        $http({
            method:'GET',
            url:ip+"/assemble/getAssemblesByFacetId",
            params:{facetId:d}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].assembleContent=$sce.trustAsHtml($scope.fragments[i].assembleContent);
           }
           $("#fragment_title").text("二级分面 "+c+" 下碎片");
        }, function errorCallback(response){

        });
    }

    $scope.getfacet3=function(a,b,c,d){

        $http({
            method:'GET',
            url:ip+"/assemble/getAssemblesByFacetId",
            params:{facetId:d}
        }).then(function successCallback(response){
            response = response["data"];
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].assembleContent=$sce.trustAsHtml($scope.fragments[i].assembleContent);
           }
           $("#fragment_title").text("三级分面 "+c+" 下碎片");
        }, function errorCallback(response){

        });
    }

    $scope.addFragment=function(){
        
        $("#fragmentAddModifyModal").modal();
        modify_add_flag=0;
    }

    $scope.modifyFragment=function(a){
       
        modify_add_flag=1;
        nowModifyFragmentId=a;
        $("#fragmentAddModifyModal").modal();

        $http({
            method:'GET',
            url:ip+"/assemble/getAssembleById",
            params:{assembleId:a}
        }).then(function successCallback(response){
            // console.log(response.data.data.assembleContent);
            // $("#wang").html(response.data.data.assembleContent);
            var html = editor.txt.html(response.data.data.assembleContent)+" ";
              $scope.fragmentUrlNg = response.data.data.url;
              $scope.fragmentSourceNg = response.data.data.sourceName;
        }, function errorCallback(response){

        });
    }

    $scope.fragmentAddModify=function(){

        fragmentUrl = document.getElementById("fragmentUrl").value;
        fragmentSource = document.getElementById("fragmentSource").value;

        var html = editor.txt.html()+" ";
        var type=document.getElementById("fragment_title").innerText.split(" ")[0];
        if(modify_add_flag==0){
            console.log("addFragment");
            $http({
                method:'POST',
                url:ip+"/assemble/appendAssemble",
                data : $.param({domainName:getCookie("NowClass"),
                    facetId:nowAddFragmentFacetId,
                    assembleContent :html,
                    url:fragmentUrl,
                    sourceName:fragmentSource,
                               }),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function successCallback(response){
                response = response["data"];
                alert("添加碎片成功");
                console.log(type);
                if(type=="主题"){
                    $scope.gettopicfragment(getCookie("NowClass"),nowOperateTopic);
                }
                else if(type=="一级分面"){
                    $scope.getfacet1fragment(getCookie("NowClass"),nowOperateTopic,nowOperateFacet1,nowOperateFacet1Id);
                }
                else if(type=="二级分面"){
                    $scope.getfacet2fragment(getCookie("NowClass"),nowOperateTopic,nowOperateFacet2,nowOperateFacet2Id);
                }
                else if(type=="三级分面"){
                    $scope.getfacet3(getCookie("NowClass"),nowOperateTopic,nowOperateFacet3,nowOperateFacet3Id);
                }
            }, function errorCallback(response){
            // console.log(html);
            alert("添加碎片失败");
        });
        }else if(modify_add_flag==1){
            console.log("modifyAssemble_"+nowModifyFragmentId);
            $http({
                method:'POST',
                url:ip+"/assemble/updateAssemble",
                data : $.param({assembleId:nowModifyFragmentId,
                                 assembleContent : html,
                                 url:fragmentUrl,
                                 sourceName:fragmentSource,
                             }),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function successCallback(response){
                alert("更新碎片成功");
                console.log(type);
                if(type=="主题"){
                    $scope.gettopicfragment(getCookie("NowClass"),nowOperateTopic);
                }
                else if(type=="一级分面"){
                    $scope.getfacet1fragment(getCookie("NowClass"),nowOperateTopic,nowOperateFacet1,nowOperateFacet1Id);
                }
                else if(type=="二级分面"){
                    $scope.getfacet2fragment(getCookie("NowClass"),nowOperateTopic,nowOperateFacet2,nowOperateFacet2Id);
                }
                else if(type=="三级分面"){
                    $scope.getfacet3(getCookie("NowClass"),nowOperateTopic,nowOperateFacet3,nowOperateFacet3Id);
                }
                // modify_add_flag=0;
            }, function errorCallback(response){
            console.log(response);
            alert("更新碎片失败");
            // modify_add_flag=0;
        });
        }
    }

    $scope.deleteFragment=function(a){

        $http({
            method:'GET',
            url:ip+"/assemble/deleteAssemble",
            params:{assembleId:a}
        }).then(function successCallback(response){
            response = response["data"];
            alert(response.data);
        }, function errorCallback(response){

        });
    }

    $scope.getFragmentDetail=function(obj){
        console.log(obj);
        $('#fragmentDetail').modal('show');
        document.getElementById("fragmentDetailContent").innerHTML=obj.assembleContent;
      
    }

    $scope.showFacetTreeWithLeaves=function(className,subjectName){
        $.ajax({

            type: "POST",
            url: ip+"/topic/getCompleteTopicByNameAndDomainNameWithHasFragment",
            data: $.param( {
                domainName:className,
                topicName:subjectName,
                hasFragment:true
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},            
            success: function(response){
                data = response["data"];
                //console.log(data);
                //DisplayTrunk(data);
                // DisplayBranch(data);
                displayTree(data);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                //通常情况下textStatus和errorThrown只有其中一个包含信息
                //alert(textStatus);
            }
        });
 
    }
});
