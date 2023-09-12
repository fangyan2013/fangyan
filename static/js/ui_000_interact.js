
var Toolbar_data={//工具栏数据结构
    "code":200,
    "msg":"返回成功",
    "data":[
        {
            "name":"software_test",
            "img_url":"../static/img_server/软件测试.png",
            "data":[
                //{"img_url":"../static/img_server/UI自动化.png","name":"UI"},
                // {"img_url":"{% static 'img_server/UI自动化.png' %}","name":"UI"},
                {"img_url":"../static/img_server/API.png","name":"API"},
                {"img_url":"../static/img_server/sql.png","name":"sql"},
                {"img_url":"../static/img_server/元素定位.png","name":"position"},
                {"img_url":"../static/img_server/python3.png","name":"py3"},
            ],
        },
        {
        
            "name":"logic",//分支 聚合 开始循环 结束循环
            "img_url":"../static/img_server/逻辑.png",
            "data":[
                {"img_url":"../static/img_server/分.png","name":"separate"},
                {"img_url":"../static/img_server/合.png","name":"merge"},
                //{"img_url":"../static/img_server/循环开始.png","name":"Start_loop"},
                //{"img_url":"../static/img_server/循环结束.png","name":"stop_loop"},
                //{"img_url":"../static/img_server/退出循环.png","name":"break_loop"},
            ],
        
        }
        
    ]
}




//工具包填充数据
var str_Toolkit=""
str_Toolkit+='	<div style="border: none;">'
str_Toolkit+='		<img style="margin-left:10px;width:20px;height:20px;" src="../static/img_server/上下.png">'
str_Toolkit+='	</div>'


for(const Toolbar_set of Toolbar_data['data']){
    str_Toolkit+='	<div>'
    str_Toolkit+='		<img class="Toolkit_img" src="'+ Toolbar_set['img_url'] +'" data-name="'+ Toolbar_set['name'] +'">'
    str_Toolkit+='	</div>'
}


str_Toolkit+='	<div style="border: none;position:absolute;margin-top:325px;">'
str_Toolkit+='		<img style="margin-left:10px;width:20px;height:20px;transform: rotate(180deg)" src="../static/img_server/上下.png">'
str_Toolkit+='	</div>'
                
$(".Toolkit").html(str_Toolkit)



//工具栏遍历
$(".Toolkit_img").click(function(){
    var str_toolbar=""
    for(const Toolbar_set of Toolbar_data['data']){
        if(Toolbar_set['name']==$(this).data('name')){
            for(const toolbar of Toolbar_set['data']){
                str_toolbar+='	<div ondragstart="dragStart(event)">'
                str_toolbar+='		<img src="'+ toolbar['img_url'] +'" data-name="'+ toolbar['name'] +'">'
                str_toolbar+='	</div>'
                $(".Below_drawer_d1").html(str_toolbar)
            }
        }
    }
})



$("#Zoom_right").click(function(){
    console.log("=============进入了右菜单")
    if($('.Right_drawer_d').is(":hidden")){
        $("#Zoom_right").css('pointer-events',"none");
        $("#Zoom_right").css({
            "-webkit-animation-play-state": "running",
            "animation-play-state": "running",
        })
        var x = document.getElementById("Zoom_right")
        x.addEventListener("webkitAnimationEnd", myEndFunction);
        x.addEventListener("animationend", myEndFunction);
        function myEndFunction() {
            console.log('结束了---')
            $("#Zoom_right").css('pointer-events',"auto");
            $("#Zoom_right").css({
                "-webkit-animation-play-state": "paused",
                "animation-play-state": "paused",
            })
            if($('.Right_drawer_d').is(":hidden")){
                $("#Zoom_right").attr("class", "layui-icon layui-icon-shrink-right Right_drawer_img2");
            }else{
                $("#Zoom_right").attr("class", "layui-icon layui-icon-shrink-right Right_drawer_img");
            }
        }
        setTimeout(function(){        
            $('.Right_drawer_d').toggle({direction: 'right'}, 500)
        },1000);
    }else{
        $('.Right_drawer_d').toggle({direction: 'right'}, 500)
        $("#Zoom_right").css('pointer-events',"none");
        setTimeout(function(){        
            $("#Zoom_right").css({
                "-webkit-animation-play-state": "running",
                "animation-play-state": "running",
                // "-webkit-animation":"mymoveleft 1.5s",
            })

            var x = document.getElementById("Zoom_right")
            x.addEventListener("webkitAnimationEnd", myEndFunction);
            x.addEventListener("animationend", myEndFunction);

            function myEndFunction() {
                console.log('结束了---')
                $("#Zoom_right").css('pointer-events',"auto");
                $("#Zoom_right").css({
                    "-webkit-animation-play-state": "paused",
                    "animation-play-state": "paused",
                    // "-webkit-animation":"mymoveright 1.5s",

                })

                if($('.Right_drawer_d').is(":hidden")){
                    $("#Zoom_right").attr("class", "layui-icon layui-icon-shrink-right Right_drawer_img2");
                }else{
                    $("#Zoom_right").attr("class", "layui-icon layui-icon-shrink-right Right_drawer_img");
                }
            }

        },500);

    }
})



$(document).on("click", '.divfather>i', function() {
    //点击展开隐藏
    console.log($(this).parent('div').parent('div').next())
    // $(this).attr("class", "layui-icon layui-icon-addition");
    // $(this).attr("class", "layui-icon layui-icon-subtraction");
    if($(this).parent('div').parent('div').next().is(":hidden")){
        console.log(111)
        $(this).parent('div').parent('div').next().toggle({direction: 'right'}, 500)
        $(this).attr("class", "layui-icon layui-icon-subtraction");
        // $("#Zoom_right").attr("class", "layui-icon layui-icon-shrink-right Right_drawer_img2");
    }else{
        console.log(222)
        $(this).parent('div').parent('div').next().toggle({direction: 'right'}, 500)
        $(this).attr("class", "layui-icon layui-icon-addition");

        // $("#Zoom_right").attr("class", "layui-icon layui-icon-shrink-right Right_drawer_img");
    }


})


$(document).on("click", '.divfather>span', function() {
    // 点击第一级菜单
    $(".divson>div>div").fadeOut("slow");//隐藏二级菜单操作
    $(".divson>div").css({"border-bottom":"1px solid #e8e8e8"})//隐藏二级菜单下划线
    $(".iconlist").fadeOut("slow");//隐藏一级菜单操作
    $(this).parent().next().fadeIn("slow");//显示当前点击的一级菜单
    $(".divfather").css({"border-bottom":"1px solid #e8e8e8"})//清空一级菜单下划线
    $(this).parent('div').css({"border-bottom":"1px solid #aeaeae"})//显示当前点击的下划线
    $(this).parent().parent().next().children('div').eq(0).children('span').trigger('click')//点击二级菜单第一个
})

$(document).on("click", '.divson>div>span', function() {
    var __obj=$(this)
    console.log(__obj,'__obj__obj__obj__obj')
    function abc(__obj){
        $(".divson>div").css({"border-bottom":"1px solid #e8e8e8"})//隐藏二级菜单下划线
        __obj.parent().css({"border-bottom":"1px solid #aeaeae"})//显示当前点击菜单下划线
        // __obj.parent().css({"background-color":"#c6c6c6"})//显示当前点击的下划线

        $(".divson>div>div").fadeOut("slow");//隐藏二级菜单操作
        __obj.next('div').fadeIn("slow");//显示二级菜单操作

        if (__obj.parent().parent().prev().children('div').eq(1).is(':visible')==false){
            $(".iconlist").fadeOut("slow");//隐藏一级菜单操作
            $(".divfather").css({"border-bottom":"none"})//清空一级菜单下划线
            __obj.parent().parent().prev().children('div').eq(0).css({"border-bottom":"1px solid #aeaeae"})//显示一级菜单下划线
            __obj.parent().parent().prev().children('div').eq(1).fadeIn("slow")//显示一级菜单
    
        }
    
        __obj.parent().parent().prev().children('div')//触发当前一级菜单点击


        $(".ui,.logic_css").each(function(){
            console.log($(this).attr('id'),"11111111")
            jsPlumb.remove($(this).attr('id'))
        });
    
        GetWorkflowData(__obj.parent().attr('id'))

    }

    __data  = localStorage.getItem("savestatus")
    console.log(__data,'__data__data')



    Workflow_id=$(".WorkflowId").data("WorkflowId")
    console.log(Workflow_id,'Workflow_idWorkflow_idWorkflow_id')

    if (__data == 'true'){//为true的时候弹窗提示是否保存
        console.log(__data,'__data==true')
        layer.confirm('还未保存当前用例！确定离开？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            abc(__obj)
            layer.closeAll('dialog');
            return
        });
    }else{
        abc(__obj)
    }
})






$(".Below_drawer_d2").click(function(){
    //缩放菜单栏
    $(".Below_drawer_d1").toggle();
    if($(this).parent().width()==95){
        $(this).parent().width("76%")
        $(".Below_drawer_img").css({"transform": "rotate(180deg)"})
        
    }else{
        $(this).parent().width(95);
        $(".Below_drawer_img").css({"transform": "rotate(0deg)"})
    }
})


$(".Below_drawer_d0").click(function(){
    //缩放工具包
    $(".Toolkit").toggle();
})



$( "#draggable_canvas" ).draggable();//画布可拖动

$(document).mouseup(function(e){//空白处点击关闭弹窗
    var _con = $(".Pop_ups");   // 设置目标区域
    if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
        $(".Pop_ups").remove();  // 功能代码
    }
});



$(".Workflow_Switch").click(function(){
    //切换工作流
    console.log($(this).data("id"),'这个是工作流id')
    window.location = '/ui_000/?id='+$(this).data("id")
});

function list_node_obj(node) {
    //当前节点前的节点
    var list_node=[]
    function __list_node_obj(node) {
        var connections = jsPlumb.getAllConnections();

        if (connections.length < 2){//兼容一个节点的流程
            if(connections[0]){
                console.log(connections[0].sourceId,'connections[0].sourceId')
                list_node.push(connections[0].sourceId)
            }
            return
        }

        var __list_node= [...list_node]
        for(var i in connections){
            if (node == connections[i].targetId){
                if (connections[i].sourceId){
                    list_node.push(connections[i].sourceId)
                    console.log(connections[i].sourceId,'connections[i].sourceId')
                    __list_node_obj(connections[i].sourceId)//不能放在这儿返回
                }
            }
        }
        if(__list_node.length === list_node.length && __list_node.sort().toString() === list_node.sort().toString()){
            return 
        }
    }
    __list_node_obj(node)
    var set =new Set(list_node)
    return Array.from(set)
}

function list_node_all(){//获取所有节点
    var list_node=[]
    $('.ui').each(function(){
        // $(this).attr('id')
        list_node.push($(this).attr('id'))
    })
    return list_node
}

function id_sourceId(node) {
    //返回前一个节点的id
    var connections = jsPlumb.getAllConnections();
    for(var i in connections){
        if (node == connections[i].targetId){
            if (connections[i].sourceId){
                return connections[i].sourceId//返回前一个节点的id
            }
        }
    }
}



function add_nodename(id,name){//在节点标签中添加nodename
    document.getElementById(id).setAttribute("nodename",name);
    for (var __index in echo_html){
        if(echo_html[__index].node_id==id){
            echo_html[__index]['nodename']=name
        }
    }
    return
}

function get_nodename(id){//在节点标签中获取nodename
    var nodenam = document.getElementById(id).getAttribute("nodename");
    return nodenam
}



function list_node_sourceId(node){//获取前面的节点
    var list_node=[]
    var connections = jsPlumb.getAllConnections();
    console.log(connections,'connectionsconnectionsconnectionsconnections')
    for(var i in connections){
        // connections 是线数据数组
        console.log(connections[i].sourceId,'编辑后的顺序究竟如何',connections[i].targetId)
        if (node == connections[i].targetId){
            list_node.push(connections[i].sourceId)
        }
    }
    var set =new Set(list_node)
    console.log(Array.from(set),'123123--------123123')
    return Array.from(set)
}



$("#tabinput").click(function(){
    btitle=$(this).html()
    console.log(btitle,'btitlebtitle')
    if (btitle=='选择测试套件'){
        $(this).html("新增测试套件")
        
        $.ajax({
            url:"/ProjectGet/",
            type:"GET",                    
            data:{
                'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
            },
            success:function (data) {
                console.log("成功你自己说的",data.data.Workflow_data);	
                let htmlstr=""
                var Workflow_data=data.data.Workflow_data
                for (var __index in Workflow_data){
                    console.log(Workflow_data[__index].projectid__id,'Workflow_data[__index].projectid__id')
                    htmlstr+='<option value="'+Workflow_data[__index].id+'">'+Workflow_data[__index].name+'</option>'
                }
                console.log($("#xiala"))
                $("#xiala").html(htmlstr)
                var form = layui.form
                form.render()
            },
            error:function (data) {
                 //clearInterval(myVar)
                 console.log("失败",data);
             }	   
         })
        $("#xuanzhe").show()
        $("#shuru").hide()
    }else if(btitle=='新增测试套件'){
        $(this).html("选择测试套件")
        $("#xuanzhe").hide()
        $("#shuru").show()
    }
})


$("body").on("mousedown", ".ui,.logic_css", function() {//移动节点的时候给true
    $("body").on("mousemove", ".Workflow_canvas", function() {
        // console.log('移动时给了true')
        localStorage.setItem('savestatus',true);

        // if (localStorage.getItem("savestatus")==false){
        //     localStorage.setItem('savestatus',true);
        //     console.log('移动时给了true')
        // }
    })
})

$("body").on("mouseup", ".ui,.logic_css", function() {
    $("body").off("mousemove", ".Workflow_canvas")
})



function RunStatus(){
    $.ajax({//第一次进来的时候查询流程执行状态  轮询这个就行
        url:"/RunScenesStatus/",
        type:"GET",                    
        data:{
            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
        },
        success:function (data) {
            for (var __index in data.data){
                if (data.data[__index].status=='2'){
                    $("#"+data.data[__index].Scenesid+">div>i[id=Workflow_Run]").attr({"class":"layui-icon layui-anim layui-anim-rotate layui-anim-loop layui-icon-loading"})
                    $("#"+data.data[__index].Scenesid+">div>i").css("cursor", "not-allowed");
                    $("#"+data.data[__index].Scenesid+">span").css("color", "#b8bbbfe3");
                    $("#"+data.data[__index].Scenesid+">div>i").css("color", "#b8bbbfe3");
                    $("#"+data.data[__index].Scenesid).css('pointer-events',"none");
                }else{
                    $("#"+data.data[__index].Scenesid+">div>i").css("cursor", "pointer");
                    $("#"+data.data[__index].Scenesid+">span").css("color", "#7d7d7d");
                    $("#"+data.data[__index].Scenesid+">div>i").css("color", "#0a6ae6e3");
                    $("#"+data.data[__index].Scenesid).css('pointer-events',"auto");
                    $("#"+data.data[__index].Scenesid+">div>i[id=Workflow_Run]").attr({"class":"layui-icon layui-icon-play"})
                }
            }
        },
        error:function (data) {
             console.log("失败",data);
         }	   
    })
}
var statustimer=self.setInterval(RunStatus,1000);


function Runlogstatus(){
    Workflowid = $(".WorkflowId").data("WorkflowId")
    $.ajax({//第一次进来的时候查询流程执行状态  轮询这个就行
        url:"/noderunstatus/",
        type:"GET",                    
        data:{
            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
            "Workflowid":Workflowid   
        },
        success:function (data) {
            if (data.code==201){
                console.log("失败",data.msg);
            }else if(data.code==200){
                // console.log("noderunstatus",data.data);
                data=JSON.parse(data.data)
                console.log(data,'datadatadatadata==========')
                if (data){
                    runlog=data.runlog
                    runlogsort=data.runlogsort
                    var str_html=''
                    for (var __key in runlogsort){
                        if (runlog[runlogsort[__key]].status==0){
                            $("#"+runlogsort[__key]).children('div').eq(0).css({'background-color': '#32CD32'})//未执行
                        }else if(runlog[runlogsort[__key]].status==1){
                            $("#"+runlogsort[__key]).children('div').eq(0).css({'background-color': '#0a6ae6e3'})//成功
                        }else if(runlog[runlogsort[__key]].status==2){
                            $("#"+runlogsort[__key]).children('div').eq(0).css({'background-color': '#cd326b'})//失败
                        }else{
                            console.log("未知的节点日志状态")
                        }
                        console.log(runlogsort[__key],'__key__key__key__key')

                        
                        str_html+='	<ul class="layui-timeline" style="width:700px">'
                        str_html+='		  <li class="layui-timeline-item">'
                        str_html+='			<i class="layui-icon layui-timeline-axis"></i>'
                        str_html+='			<div style="color:#444444" class="layui-timeline-content layui-text">'

                        if (typeof runlog[runlogsort[__key]]=="object"){
                            str_html+='			  <h3 class="layui-timeline-title"><font style="font-size:15px;color:#444444">'+runlog[runlogsort[__key]].name+'</font></h3>'
                            str_html+='			  <p>'

                            if (runlog[runlogsort[__key]].status==1){//执行状态
                                str_html+='           <div><font style="font-size:15px;color:#444444">执行状态:</font>&nbsp&nbsp<font style="font-size:15px;color:#444444">成功</font></div>'
                            }else{
                                str_html+='           <div><font style="font-size:15px;color:#444444">执行状态:</font>&nbsp&nbsp<font style="font-size:15px;color:#444444">失败</font></div>'
                            }
                            str_html+='           <div><font style="font-size:15px;color:#444444">执行开始时间:</font>&nbsp&nbsp<font style="font-size:15px;color:#999999">'+runlog[runlogsort[__key]].starttime+'</font></div>'
                            str_html+='           <div><font style="font-size:15px;color:#444444">执行结束时间:</font>&nbsp&nbsp<font style="font-size:15px;color:#999999">'+runlog[runlogsort[__key]].endtime+'</font></div>'
                            if (typeof runlog[runlogsort[__key]].res=="object"){
                                str_html+='           <div><font style="font-size:15px;color:#444444">执行日志:</font><pre><font style="font-size:15px;color:#444444">'+JSON.stringify(runlog[runlogsort[__key]].res,null,4)+'</font></pre></div>'
                            }else{
                                str_html+='           <div><font style="font-size:15px;color:#444444">执行日志:</font><font style="font-size:15px;color:#444444">'+runlog[runlogsort[__key]].res+'</font></div>'
                            }
                            if (runlog[runlogsort[__key]].img){
                                str_html+='           <div><font style="font-size:15px;color:#444444">截图:</font></div>'
                                str_html+='           <div><img style="width:650px" src="'+runlog[runlogsort[__key]].img+'" data-name="API"></div>'
                            }else{
                                
                            }
                        }else{
                            str_html+=                runlog[runlogsort[__key]]
                        }
        
                        str_html+='			  </p>'
                        str_html+='			</div>'
                        str_html+='		  </li>'
                        str_html+=' </ul>'
                    }
                    $("#log_html").html(str_html)
                }
            }

        },
        error:function (data) {
             //clearInterval(myVar)
             console.log("失败",data);
         }	   
    })
}

var runtimer=self.setInterval(Runlogstatus,1000);


$("body").on("dblclick", ".ui,.logic_css,.criteria", function() {
    // console.log($("#myDiv"),'$("#myDiv")$("#myDiv")$("#myDiv")')
    $("#myDiv",window.parent.document).hide()
    // $("#myDiv").hide()
})
