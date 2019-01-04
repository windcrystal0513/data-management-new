function DisplayTrunk(dataset){

    //document.getElementById("RightfacetTree").innerHTML='';
   $("#topicTreeDiv").empty();
    var datas = []; 
    multiple=1;
    datas.push(dataset);
    //分面树所占空间大小
    svg = d3.select("div#topicTreeDiv")
                .append("svg")
                .attr("width", $("#topicTreeDiv").width() * multiple)
                .attr("height",$("#topicTreeDiv").height() * multiple);
    //分面树的位置
    $("svg").draggable();   
    var seed = {x: $("#topicTreeDiv").width()*0.5* multiple, y:($("#topicTreeDiv").height()-60)* multiple, name:dataset.topicName}; 
    var tree = buildTree(dataset, seed4, multiple);
    draw_trunk(tree, seed, svg, multiple);    
}
//显示树干和树枝
function DisplayBranch(dataset){
    $("#topicTreeDiv").empty();
    var datas = []; 
    multiple=0.9;
    datas.push(dataset);
    //分面树所占空间大小
    svg = d3.select("div#topicTreeDiv")
                .append("svg")
                .attr("width", $("#topicTreeDiv").width())
                .attr("height",$("#topicTreeDiv").height());
    //分面树的位置    
    $("svg").draggable();
    var seed = {x: $("#topicTreeDiv").width()*0.5, y: $("#topicTreeDiv").height()-30, name:dataset.topicName}; 
    var tree = buildBranch(dataset, seed, multiple);
    draw_tree(tree, seed, svg, multiple);
    //对分面树进行缩放
    $("div#topicTreeDiv").bind('mousewheel', function(evt) {
        var temp = multiple;//判断是保持0.25或者1.25不变
        if( 0.3< multiple && multiple<1){
            multiple+=evt.originalEvent.wheelDelta/5000;
        }else if(multiple < 0.3){
            if(evt.originalEvent.wheelDelta>0){
                multiple+=evt.originalEvent.wheelDelta/5000;
            }
        }else{
            if(evt.originalEvent.wheelDelta<0){
                multiple+=evt.originalEvent.wheelDelta/5000;
            }
        }
        d3.selectAll("svg").remove(); //删除之前的svg
        svg = d3.select("div#topicTreeDiv")
                    .append("svg")
                    .attr("width", w * multiple)
                    .attr("height", h * multiple);
        var seed0 = {x: $("#topicTreeDiv").width()*0.5, y: $("#topicTreeDiv").height()-30, name:dataset.name};
        var tree0 = buildBranch(dataset, seed0, multiple);
        draw_tree(tree0, seed0, svg, multiple);
    }); 
    /*****************************************************/ 
}