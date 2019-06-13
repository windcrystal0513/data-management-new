// 自适应程序
var zidingyi_height;
$(document).ready(function(){
    var header=$(".content-header").offset().top+$(".content-header").height()
    var footer=$(".main-footer").offset().top
    zidingyi_height=footer-header;
    //  var header=$(".content-header").height();
    // var mainheader=$(".main-header").height();
    // var footer=$(".main-footer").height();
    // zidingyi_height=window.innerHeight-footer-header-mainheader;
    // console.log(zidingyi_height);
    $("#myChart").css("height",zidingyi_height*0.87+"px");
    
})



var app=angular.module('myApp', []);
app.controller('myCon',function($scope,$http){
    // $http.get(ip+'/domain/getDomainsGroupBySubject').success(function(response){
    //     data = response["data"];
    //     $scope.subjects = response["data"];
    //     var classSum = 0;
    //         // 切回导航页面时，读取现有课程并更新两个框的值
    //     for(i = 0; i < data.length; i++) {
    //         classSum = classSum + data[i].domains.length;
    //         if(data[i].subjectName == getCookie("NowSubject")) {
    //             $scope.subject = data[i];
    //             for(j = 0; j < data[i].domains.length; j++) {
    //                 if(data[i].domains[j].domainName == getCookie("NowClass")) {
    //                     $scope.domain = data[i].domains[j];
    //                 }
    //             }
    //         }
    //     }
    $http({
        method:'GET',
        url:ip+"/domain/getDomainsAndSubjectsByUseId",
        params:{userName:JSON.parse(getCookie("userinfo")).userName}
    }).then(function successCallback(response){
        data = response["data"];
        data=data["data"]
        $scope.subjects = data;
        console.log($scope.subjects);
        var classSum = 0;
            // 切回导航页面时，读取现有课程并更新两个框的值
        for(i = 0; i < data.length; i++) {
            classSum = classSum + data[i].domains.length;
            if(data[i].subjectName == getCookie("NowSubject")) {
                $scope.subject = data[i];
                for(j = 0; j < data[i].domains.length; j++) {
                    if(data[i].domains[j].domainName == getCookie("NowClass")) {
                        $scope.domain = data[i].domains[j];
                    }
                }
            }
        }
        $scope.subjectNum = data.length;
        $scope.classSum = classSum;
    });

    // $scope.subject_change=function(){
    //     var subject=$scope.subject.subjectName;
    //     console.log(subject);
    // }
    $scope.queryByKeyword=function(){
        console.log($("input[name='KeyWord']").val());
        $http({
            method:'GET',
            url:ip+"/statistics/queryKeyword",
            params:{keyword:$("input[name='KeyWord']").val()}
        }).then(function successCallback(response){
            response = response["data"];
            var subjectArray=[];
            var topicArray=[];
            var facetArray=[];
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].type=="domain"){

                    subjectArray.push(response.data[i]);
                }
                else if(response.data[i].type=="topic"){
                    topicArray.push(response.data[i]);
                }
                else{
                    facetArray.push(response.data[i]);
                }
            }

            $scope.querysubjects=subjectArray;
            $scope.querytopics=topicArray;
            $scope.queryfacets=facetArray;
        }, function errorCallback(response){

        });
    }


    /**
     * 根据课程：选择学科之后显示的课程信息
     */
    $scope.subject_change = function() {
        if ($scope.subject==null) {
            alert("请选择学科及课程！");
        } else {
            var subject=$scope.subject.subjectName
            console.log('课程统计2-选择学科：' + subject);
            var domainStatistics; // 课程所有统计数据

            $http({
            method:'GET',
            url:ip+"/statistics/getStatisticalInformationBySubjectName",
            params:{subjectName:subject}
        }).then(function successCallback(response){
            console.log(response.data.data);
            domainStatistics = response.data.data;

            var myChart = echarts.init(document.getElementById('myChart'));
            // 指定图表的配置项和数据
            // var dataBeast = domainStatistics.topicList.slice(1);
            // var dataBeauty = [541, 513, 792, 701, 660, 729, 782, 660, 841, 521, 820, 578, 727, 598, 660, 841, 521, 820, 578, 727, 598, 792, 701, 660, 729, 513, 792, 701];
            var dataTopicList = domainStatistics.topicNumbers.slice(1);
            var dataFacetList = domainStatistics.facetNumbers.slice(1);
            var dataFragmentList = domainStatistics.assembleNumbers.slice(1);
            var dataDependencyList = domainStatistics.dependencyNumbers.slice(1);
            var xAxisData = domainStatistics.domainNames;
            // 设置x轴初始显示的主题个数为10个
            var topicLength = xAxisData.length;
            var end = 100; // 显示百分之end的x轴数据
            if (topicLength > 10) {
                end = (10 / topicLength) * 100;
            }
            // 得到数据的和
            var dataTotal = function() {
                var data = [];
                for(var i = 0; i < dataTopicList.length; i++){
                    data.push(dataTopicList[i] + dataFacetList[i] + dataFragmentList[i] + dataDependencyList[i]);
                }
                return data;
            }

            // console.log(dataTotal());

            option = {
                // color:['#019aba','#7a201f','#DB8E71', '#24936E', '#CC0033'],
                color: ['#24936E', '#F596AA', '#DB8E71', '#58B2DC', '#CC0033'],
                // backgroundColor:'#000',
                title: {
                    text: '学科：' + subject,
                    textStyle: {
                        color:'#000',
                        fontSize:18,
                        fontWeight:'bold',
                        
                    },
                    // subtext:'作者：从零开始',
                    subtextStyle: {
                        color:'#000',
                    },
                },
                legend:{
                    right:'20%',
                    textStyle: {
                        color: '#000',
                        fontSize: 12,
                    },
                    data:['主题','分面','认知关系','碎片', '总数量'],
                },
                tooltip:{
                    show:true,
                    trigger: 'axis',
                    axisPointer: {
                        type:'cross',
                        crossStyle:{
                           color:'#000',
                           
                       },

                    },
                },
                toolbox:{
                    // right:20,
                    // feature:{
                    //     saveAsImage: {},
                    //     restore: {},
                    //     dataView: {},
                    //     dataZoom: {},
                    //     magicType: {
                    //         type:['line','bar']
                    //     },
                    //     // brush: {},
                    // }
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {
                            readOnly: false
                        },
                        magicType: {
                            type: ['line', 'bar']
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                
                grid:{
                    // left:5,
                    // right:20,
                    top:80,
                    bottom:50,
                    containLabel:true,
                },
                xAxis: {
                  show:true,
                  
                  axisLabel:{
                     interval:0,
                     rotate:-20,
                     margin: 30,
                     textStyle:{
                          color:'#000',
                          align: 'center'
                         
                     },
                  },
                  axisTick:{
                      alignWithLabel:true,
                      lineStyle:{
                          color:'#000',
                          
                      },
                  },
                  data:xAxisData,
                },
                yAxis: [
                    {
                        type:'value',
                        name:'数量',
                        nameTextStyle:{
                            color:'#000',
                        },
                        axisLabel:{
                         textStyle:{
                            color:'#000',
                         },
                        },
                        axisTick:{
                          alignWithLabel:true,
                          lineStyle:{
                              color:'#000',
                              
                          },
                        },
                        splitLine:{
                            show:false,
                        },
                    },
                    {
                        type:'value',
                        name:'总数量',
                        nameTextStyle:{
                            color:'#000',
                        },
                        axisLabel:{
                         textStyle:{
                              color:'#000',
                         },
                        },
                        axisTick:{
                          alignWithLabel:true,
                          lineStyle:{
                              color:'#000',
                              
                          },
                        },
                        splitLine:{
                            show:false,
                        },
                    },
                ],
                dataZoom: [{
                    show: true,
                    height:20,
                    bottom:10,
                    start: 0,
                    end: end,
                    handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                    handleSize: '110%',
                    handleStyle:{ // borderColor:"#5476c2"
                        color:"#7a201f",
                        borderColor:"#7a201f"
                    },
                    textStyle:{color:"#000"}, 
                    borderColor:"#90979c",
                    backgroundColor:"#f7f7f7", /*背景 */
                    fillerColor:"rgba(220,210,230,0.6)", /*被start和end遮住的背景*/
                    dataBackground:{ /*数据背景*/
                        lineStyle:{color:"#dfdfdf"},
                        areaStyle:{color:"#dfdfdf"}
                    },
                    }, 
                    { type: "inside"}
                ],
                series: [
                    {
                        type: 'bar',
                        name:'主题',
                        stack:'数量',
                        data:dataTopicList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                                 textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'分面',
                        stack:'数量',
                        data:dataFacetList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'认知关系',
                        stack:'数量',
                        data:dataDependencyList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'碎片',
                        stack:'数量',
                        data:dataFragmentList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'line',
                        name:'总数量',
                        yAxisIndex:1,
                        stack:'数量',
                        data:dataTotal(),
                        label: {
                            normal: {
                                show:true,
                                position: 'insideTop',
                                offset: [0,-30],
                                 textStyle:{
                                   color:'#000',
                                }, 
                            },
                            emphasis: {
                                textStyle:{
                                   color:'#000',
                                },  
                            },
                        },
                        // symbol:'image://../imgs/point1.png',
                        symbolSize:8,
                        itemStyle: {
                            normal: {
                                // "color": "#01B3D7",
                                barBorderRadius: 0,
                                label: {
                                    show:false,
                                    position: "top",
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        lineStyle: {
                            normal: {
                            color: '#01B3D7',
                            width: 1,
                        
                            },
                        },
                    },
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);


        }, function errorCallback(response){

        });

            
        }
    } 
    // viewByDomain函数结束






    $scope.domain_change = function() {
        if ($scope.domain==null & $scope.subject!=null) {
            $scope.subject_change();
        } else if($scope.domain!=null & $scope.subject!=null) {
            setCookie("NowClass", $scope.domain.domainName, "s900");
            setCookie("NowSubject", $scope.subject.subjectName, "s900");
            var subject=$scope.subject.subjectName;
            var domain=$scope.domain.domainName;
            console.log('主题统计-选择学科：' + subject + '，选择课程：' + domain);
            var domainStatistics; // 主题所有统计数据

            $http({
            method:'GET',
            url:ip+"/statistics/getStatisticalInformationByDomainName",
            params:{domainName:domain}
        }).then(function successCallback(response){
            console.log(response.data.data);
            domainStatistics = response.data.data;

            var myChart = echarts.init(document.getElementById('myChart'));
            // 指定图表的配置项和数据
            var dataFacetList = domainStatistics.facetNumbers.slice(1);
            var dataFacetFirstList = domainStatistics.firstLayerFacetNumbers.slice(1);
            var dataFacetSecondList = domainStatistics.secondLayerFacetNumbers.slice(1);
            var dataFacetThirdList = domainStatistics.thirdLayerFacetNumbers.slice(1);
            var dataDependencyList = domainStatistics.dependencyNumbers.slice(1);
            var dataFragmentList = domainStatistics.assembleNumbers.slice(1);
            var xAxisData = domainStatistics.topicNames;
            // 设置x轴初始显示的主题个数为10个
            var topicLength = xAxisData.length;
            var end = 100; // 显示百分之end的x轴数据
            if (topicLength > 10) {
                end = (10 / topicLength) * 100;
            }
            // 得到数据的和
            var dataTotal = function() {
                var data = [];
                for(var i = 0; i < dataFacetList.length; i++){
                    data.push(dataFacetList[i] + dataFacetFirstList[i] + dataFacetSecondList[i] + dataFacetThirdList[i] + dataDependencyList[i] + dataFragmentList[i]);
                }
                return data;
            }

            // console.log(dataTotal());

            option = {
                // color:['#019aba','#7a201f','#DB8E71', '#24936E', '#CC0033'],
                color: ['#24936E', '#F596AA', '#DB8E71', '#58B2DC', '#019aba','#7a201f', '#CC0033'],
                // backgroundColor:'#000',
                title: {
                    text: '学科：' + subject + '，课程：' + domain,
                    textStyle: {
                        color:'#000',
                        fontSize:18,
                        fontWeight:'bold',
                        
                    },
                    // subtext:'作者：从零开始',
                    subtextStyle: {
                        color:'#000',
                    },
                },
                legend:{
                    right:'20%',
                    textStyle: {
                        color: '#000',
                        fontSize: 12,
                    },
                    data:['分面','一级分面','二级分面','三级分面','认知关系','碎片','总数量'],
                },
                tooltip:{
                    show:true,
                    trigger: 'axis',
                    axisPointer: {
                        type:'cross',
                        crossStyle:{
                           color:'#000',
                           
                       },

                    },
                },
                toolbox:{
                    // right:20,
                    // feature:{
                    //     saveAsImage: {},
                    //     restore: {},
                    //     dataView: {},
                    //     dataZoom: {},
                    //     magicType: {
                    //         type:['line','bar']
                    //     },
                    //     // brush: {},
                    // }
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {
                            readOnly: false
                        },
                        magicType: {
                            type: ['line', 'bar']
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                
                grid:{
                    // left:5,
                    // right:20,
                    top:80,
                    bottom:50,
                    containLabel:true,
                },
                xAxis: {
                  show:true,
                  
                  axisLabel:{
                     interval:0,
                     rotate:-20,
                     margin: 30,
                     textStyle:{
                          color:'#000',
                          align: 'center'
                         
                     },
                  },
                  axisTick:{
                      alignWithLabel:true,
                      lineStyle:{
                          color:'#000',
                          
                      },
                  },
                  data:xAxisData,
                },
                yAxis: [
                    {
                        type:'value',
                        name:'数量',
                        nameTextStyle:{
                            color:'#000',
                        },
                        axisLabel:{
                         textStyle:{
                            color:'#000',
                         },
                        },
                        axisTick:{
                          alignWithLabel:true,
                          lineStyle:{
                              color:'#000',
                              
                          },
                        },
                        splitLine:{
                            show:false,
                        },
                    },
                    {
                        type:'value',
                        name:'总数量',
                        nameTextStyle:{
                            color:'#000',
                        },
                        axisLabel:{
                         textStyle:{
                              color:'#000',
                         },
                        },
                        axisTick:{
                          alignWithLabel:true,
                          lineStyle:{
                              color:'#000',
                              
                          },
                        },
                        splitLine:{
                            show:false,
                        },
                    },
                ],
                dataZoom: [{
                    show: true,
                    height:20,
                    bottom:10,
                    start: 0,
                    end: end,
                    handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                    handleSize: '110%',
                    handleStyle:{ // borderColor:"#5476c2"
                        color:"#7a201f",
                        borderColor:"#7a201f"
                    },
                    textStyle:{color:"#000"}, 
                    borderColor:"#90979c",
                    backgroundColor:"#f7f7f7", /*背景 */
                    fillerColor:"rgba(220,210,230,0.6)", /*被start和end遮住的背景*/
                    dataBackground:{ /*数据背景*/
                        lineStyle:{color:"#dfdfdf"},
                        areaStyle:{color:"#dfdfdf"}
                    },
                    }, 
                    { type: "inside"}
                ],
                series: [
                    {
                        type: 'bar',
                        name:'分面',
                        stack:'数量',
                        data:dataFacetList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                                 textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'一级分面',
                        stack:'数量',
                        data:dataFacetFirstList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'二级分面',
                        stack:'数量',
                        data:dataFacetSecondList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'三级分面',
                        stack:'数量',
                        data:dataFacetThirdList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'认知关系',
                        stack:'数量',
                        data:dataDependencyList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'碎片',
                        stack:'数量',
                        data:dataFragmentList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'line',
                        name:'总数量',
                        yAxisIndex:1,
                        stack:'数量',
                        data:dataTotal(),
                        label: {
                            normal: {
                                show:true,
                                position: 'insideTop',
                                offset: [0,-30],
                                 textStyle:{
                                   color:'#000',
                                }, 
                            },
                            emphasis: {
                                textStyle:{
                                   color:'#000',
                                },  
                            },
                        },
                        // symbol:'image://../imgs/point1.png',
                        symbolSize:8,
                        itemStyle: {
                            normal: {
                                // "color": "#01B3D7",
                                barBorderRadius: 0,
                                label: {
                                    show:false,
                                    position: "top",
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        lineStyle: {
                            normal: {
                            color: '#01B3D7',
                            width: 1,
                        
                            },
                        },
                    },
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);


        }, function errorCallback(response){

        });

        }
    }
    // viewByTopic 函数结束

 
    $http.post(ip+'/statistics/getDomainDistribution').success(function(response){
        var statistics=response.data;
        // console.log(statistics);
        var xAxisData=new Array();
        var dataTopicList=new Array();
        var dataFacetList=new Array();
        var dataFragmentList=new Array();
        var dataDependencyList=new Array();
        for(var i=0;i<statistics.length;i++){
            xAxisData.push(statistics[i].domainName);
            dataTopicList.push(statistics[i].topicNumber);
            dataFacetList.push(statistics[i].facetNumber);
            dataFragmentList.push(statistics[i].assembleNumber);
            dataDependencyList.push(statistics[i].dependencyNumber);
        }
        var myChart=echarts.init(document.getElementById('myChart'));
        // 设置x轴初始显示的主题个数为10个
        var topicLength = xAxisData.length;
        var end = 100; // 显示百分之end的x轴数据
        if (topicLength > 10) {
            end = (10 / topicLength) * 100;
        }
        // 得到数据的和
        var dataTotal = function() {
            var data = [];
            for(var i = 0; i < dataTopicList.length; i++){
                data.push(dataTopicList[i] + dataFacetList[i] + dataFragmentList[i] + dataDependencyList[i]);
            }
            return data;
        }

        option = {
                // color:['#019aba','#7a201f','#DB8E71', '#24936E', '#CC0033'],
                color: ['#24936E', '#F596AA', '#DB8E71', '#58B2DC', '#CC0033'],
                // backgroundColor:'#000',
                title: {
                    text: '所有课程统计信息',
                    textStyle: {
                        color:'#000',
                        fontSize:18,
                        fontWeight:'bold',
                        
                    },
                    // subtext:'作者：从零开始',
                    subtextStyle: {
                        color:'#000',
                    },
                },
                legend:{
                    right:'20%',
                    textStyle: {
                        color: '#000',
                        fontSize: 12,
                    },
                    data:['主题','分面','认知关系','碎片', '总数量'],
                },
                tooltip:{
                    show:true,
                    trigger: 'axis',
                    axisPointer: {
                        type:'cross',
                        crossStyle:{
                           color:'#000',
                           
                       },

                    },
                },
                toolbox:{
                    // right:20,
                    // feature:{
                    //     saveAsImage: {},
                    //     restore: {},
                    //     dataView: {},
                    //     dataZoom: {},
                    //     magicType: {
                    //         type:['line','bar']
                    //     },
                    //     // brush: {},
                    // }
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {
                            readOnly: false
                        },
                        magicType: {
                            type: ['line', 'bar']
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                
                grid:{
                    // left:5,
                    // right:20,
                    top:80,
                    bottom:50,
                    containLabel:true,
                },
                xAxis: {
                  show:true,
                  
                  axisLabel:{
                     interval:0,
                     rotate:-20,
                     margin: 30,
                     textStyle:{
                          color:'#000',
                          align: 'center'
                         
                     },
                  },
                  axisTick:{
                      alignWithLabel:true,
                      lineStyle:{
                          color:'#000',
                          
                      },
                  },
                  data:xAxisData,
                },
                yAxis: [
                    {
                        type:'value',
                        name:'数量',
                        nameTextStyle:{
                            color:'#000',
                        },
                        axisLabel:{
                         textStyle:{
                            color:'#000',
                         },
                        },
                        axisTick:{
                          alignWithLabel:true,
                          lineStyle:{
                              color:'#000',
                              
                          },
                        },
                        splitLine:{
                            show:false,
                        },
                    },
                    {
                        type:'value',
                        name:'总数量',
                        nameTextStyle:{
                            color:'#000',
                        },
                        axisLabel:{
                         textStyle:{
                              color:'#000',
                         },
                        },
                        axisTick:{
                          alignWithLabel:true,
                          lineStyle:{
                              color:'#000',
                              
                          },
                        },
                        splitLine:{
                            show:false,
                        },
                    },
                ],
                dataZoom: [{
                    show: true,
                    height:20,
                    bottom:10,
                    start: 0,
                    end: end,
                    handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                    handleSize: '110%',
                    handleStyle:{ // borderColor:"#5476c2"
                        color:"#7a201f",
                        borderColor:"#7a201f"
                    },
                    textStyle:{color:"#000"}, 
                    borderColor:"#90979c",
                    backgroundColor:"#f7f7f7", /*背景 */
                    fillerColor:"rgba(220,210,230,0.6)", /*被start和end遮住的背景*/
                    dataBackground:{ /*数据背景*/
                        lineStyle:{color:"#dfdfdf"},
                        areaStyle:{color:"#dfdfdf"}
                    },
                    }, 
                    { type: "inside"}
                ],
                series: [
                    {
                        type: 'bar',
                        name:'主题',
                        stack:'数量',
                        data:dataTopicList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                                 textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'分面',
                        stack:'数量',
                        data:dataFacetList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'认知关系',
                        stack:'数量',
                        data:dataDependencyList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'bar',
                        name:'碎片',
                        stack:'数量',
                        data:dataFragmentList,
                        label: {
                            normal: {
                                show:false,
                                position: 'insideTop',
                                offset:[0,20],
                                textStyle:{
                                   color:'#000',
                                },
                            },
                            emphasis: {
                               textStyle:{
                                   color:'#000',
                                }, 
                            },
                        },
                    },
                    {
                        type: 'line',
                        name:'总数量',
                        yAxisIndex:1,
                        stack:'数量',
                        data:dataTotal(),
                        label: {
                            normal: {
                                show:true,
                                position: 'insideTop',
                                offset: [0,-30],
                                 textStyle:{
                                   color:'#000',
                                }, 
                            },
                            emphasis: {
                                textStyle:{
                                   color:'#000',
                                },  
                            },
                        },
                        // symbol:'image://../imgs/point1.png',
                        symbolSize:8,
                        itemStyle: {
                            normal: {
                                // "color": "#01B3D7",
                                barBorderRadius: 0,
                                label: {
                                    show:false,
                                    position: "top",
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        lineStyle: {
                            normal: {
                            color: '#01B3D7',
                            width: 1,
                        
                            },
                        },
                    },
                ]
            };
            myChart.setOption(option);
    });




});