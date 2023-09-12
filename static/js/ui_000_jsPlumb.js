
var echo_html=[]//编辑后这个有问题
var Upper_endpoint_id=""//上端的
var Lower_endpoint_id=""//下端点
var Label_relationship={}//标签关系
localStorage.setItem('savestatus',false);//提示保存校验状态


//新增的时候这几个是得重置的
function GetWorkflowData(Workflow_id){//回显示
    add_workfliow()


    Workflow_name=$("#"+Workflow_id).children("span").text()//通过id获取流程名称
    console.log(Workflow_name,'Workflow_nameWorkflow_name')
    $(".WorkflowId").html(Workflow_name)//回显流程中的名称
    $(".WorkflowId").data("WorkflowId",Workflow_id)//添加id到标签

    $.ajax({//查询节点数据
        url:"/GetWorkflow/",
        type:"POST",                    
        data:{
            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
            'Workflow_id':Workflow_id,
        },
        success:function (data) {
            if(data.code==201){
                return
            }else if(data.code==200){
                localStorage.setItem('savestatus',false);//提示保存校验状态
                PositionVal=JSON.parse(data['data'])
                Workflwow_data=JSON.parse(PositionVal['Workflwow_obj'])
                var connections = JSON.parse(Workflwow_data['connections'])//只有一个节点的时候可能这里会是空的

                // "canvastop":canvastop,
                // "canvasleft":canvasleft

                console.log(Workflwow_data["canvastop"])
                console.log(Workflwow_data["canvasleft"],'lefttttttttttttttttt')

                var canvastop = $("#draggable_canvas").css({
                    "top":Workflwow_data["canvastop"],
                    "left":Workflwow_data["canvasleft"]
                })

                console.log(connections,'connectionsconnections',Workflwow_data)
                //echo_html      位置是空的，所以有问题
                var echo_html_data = Workflwow_data['echo_html']//只有一个节点的时候可能这里会是空的
                console.log(JSON.stringify(echo_html_data),'如何记录位置呢,按连线数据去记录位置')

                echo_html=echo_html_data

                for (var echo in echo_html_data){
                    var echo_values = echo_html_data[echo]
                    console.log(echo_values,'echo_valuesecho_values')
                    add_node_html(
                        echo_values['img_status'],
                        echo_values['data'],
                        echo_values['img_name'],
                        echo_values['x'],
                        echo_values['y'],
                        echo_values['node_id'],
                        echo_values['nodename']
                    )
                }
                jsPlumb.ready(function () {      
                    for (var len in connections){
                        console.log(Workflwow_data['echo_html'],'夜落')
                            jsPlumb.setContainer('draggable_canvas')
                            var common = {
                              isSource: true,
                              isTarget: true,
                              connector: ['Straight'],
                              endpoint: ["Dot", { radius:5 }],//端点形状
                              paintStyle:{ width:15, height:15, fillStyle:'#b3b3b3' },//端点样式
                              connectorStyle : { strokeStyle:"#b3b3b3"},//连线样式
                            }//端点连线样式
                            var Connect = {
                                  anchor: 'Bottom',
                                  connectorOverlays:[
                                      [ "Arrow", { width:8, length:20, location:1, id:"arrow" } ],
                                  ],
                            }
                            var u_Rear = connections[len]['current']
                            var u_current = connections[len]['Rear']
                            
                            for (var echo_html_len in Workflwow_data['echo_html']){
                                if (Workflwow_data['echo_html'][echo_html_len]['node_id']==u_Rear){
                                    var u_Rear_name=Workflwow_data['echo_html'][echo_html_len]['img_name']
                                }
                                if (Workflwow_data['echo_html'][echo_html_len]['node_id']==u_current){
                                    var u_current_name=Workflwow_data['echo_html'][echo_html_len]['img_name']
                                }
                            } 
                                    
                            if ($(".ui").length==1 && len==0 && $(".logic_css").length==null){//流程节点只有一位时只添加下面的节点
                                Lower_endpoint(u_Rear,Connect,common)
                                jsPlumb.draggable(u_Rear)//可移动节点
                                return
                            }
                            
                            if (u_current_name=='merge'){
                                //聚合节点,是上端点的时候追加属性可以连多条线
                                common['maxConnections']=-1
                                Connect['anchor']='Top'
                                Connect['uuid']=u_current
                                Upper_endpoint(u_current,Connect,common)//上 u_current
                                delete common['maxConnections']
                            }else{
                                Connect['anchor']='Top'
                                Connect['uuid']=u_current
                                Upper_endpoint(u_current,Connect,common)
                            }
                
                            if (u_Rear_name=='separate'){
                                //分支节点,是下端点的时候追加属性可以拉多条线
                                console.log(u_current_name,u_current,'分支节点应该只有两个')
                                common['maxConnections']=-1
                                Connect['anchor']='Bottom'
                                Connect['connectorOverlays']=[
                                    [ "Label", { label:'<a class="criteria" style="cursor:pointer;" herf="http://www.baidu.com"><img style="width:20px;height:20px;" src="../static/img_server/点击.png"></a>', id:"label" } ],
                                    [ "Arrow", { width:8, length:20, location:1, id:"arrow" } ],
                                ]
                                console.log(Connect,'分支节点调这个')
                                Connect['uuid']=u_Rear
                                Lower_endpoint(u_Rear,Connect,common)//下 u_Rear
                                delete common['maxConnections']
                            }else{
                                Connect['uuid']=u_Rear
                                Connect['anchor']='Bottom'
                                Lower_endpoint(u_Rear,Connect,common)
                            }
                            jsPlumb.draggable(u_current)//可移动节点
                            jsPlumb.draggable(u_Rear)//可移动节点
                            jsPlumb.connect({ uuids: [u_Rear, u_current] })
                    }
                })//添加端点
    
                // $.ajax({//查询流程日志
                //     url:"/Workflwow_log_get/",
                //     type:"GET",                    
                //     data:{
                //         'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                //         'WorkflowId':Workflow_id,
                //     },
                //     success:function (data) {
                //         $(".ui_d0").css({'background-color': '#32CD32'})//重制节点颜色
                //         $("#log_html").html('')//重置流程日志
                //         console.log(data,'datadatadata')
                //     },
                //     error:function (data) {
                //         console.log("失败",data);
                //     }
                // })
            }
        },
        error:function (data) {
            console.log("失败",data);
        }
    })
}

$("body").on("dblclick", 'div[data-name="API"][class^="ui"]', function(e) {
    //编辑api节点
    $(".popping-box-wrap").children("iframe").attr("src","/url_000/"); 
    $(".popping-box-wrap").show(500);
    localStorage.setItem('edit_id',e.currentTarget.id);
});

$("body").on("dblclick", 'div[data-name="separate"][class^="logic_css"]', function(e) {
    //编辑分支节点
    $(".popping-box-wrap").children("iframe").attr("src","/if_000/"); 
    $(".popping-box-wrap").show(500);
    localStorage.setItem('edit_id',e.currentTarget.id);
});

$("body").on("dblclick", 'div[data-name="merge"][class^="logic_css"]', function(e) {
    //编辑合并节点
    var list_sourceId=[]
    var connections = jsPlumb.getAllConnections();
    for(var i in connections){
        if(connections[i].targetId==e.currentTarget.id){
            list_sourceId.push(connections[i].sourceId)
        }
    }
    $(".popping-box-wrap").children("iframe").attr("src","/merge_000/");
    $(".popping-box-wrap").show(500);
    localStorage.setItem('edit_id',e.currentTarget.id);
    localStorage.setItem('list_sourceId',JSON.stringify({"list_sourceId":list_sourceId}));
});

$("body").on("dblclick", 'div[data-name="UI"][class^="ui"]', function(e) {
    //rpa节点
    $(".popping-box-wrap").children("iframe").attr("src","/rpa_000/"); 
    $(".popping-box-wrap").show(500);
    localStorage.setItem('edit_id',e.currentTarget.id);
});

$("body").on("dblclick", 'div[data-name="position"][class^="ui"]', function(e) {
    //元素定位节点
    $(".popping-box-wrap").children("iframe").attr("src","/position_000/"); 
    $(".popping-box-wrap").show(500);
    localStorage.setItem('edit_id',e.currentTarget.id);
});

$("body").on("dblclick", 'div[data-name="py3"][class^="ui"]', function(e) {
    //python3节点
    $(".popping-box-wrap").children("iframe").attr("src","/py3/");
    $(".popping-box-wrap").show(500);
    localStorage.setItem('edit_id',e.currentTarget.id);
});


$("body").on("dblclick", 'div[data-name="sql"][class^="ui"]', function(e) {
    //mysql节点
    $(".popping-box-wrap").children("iframe").attr("src","/mysql_000/"); 
    $(".popping-box-wrap").show(500);
    localStorage.setItem('edit_id',e.currentTarget.id);
});

$("body").on("dblclick", 'a[class="criteria"]', function(e) {
    //编辑选择判断条件
    if (!e.currentTarget.id){
        $(this).attr('id', Math.random().toString(36).slice(-6));
    }
    $(".popping-box-wrap").children("iframe").attr("src","/condition_000/");
    $(".popping-box-wrap").show(500);
    localStorage.setItem('edit_id',e.currentTarget.id);
});


$("body").on("click", '#data_workflow', function(e) {
    //打开参数界面渲染参数输入框
    $("#myDiv",window.parent.document).hide()
    $(".popping-box-wrap").children("iframe").attr("src","/data_000/");
    $(".popping-box-wrap").show(500);
    // $(".WorkflowId").data("WorkflowId",Workflow_id)
    localStorage.setItem('edit_id','Data'+$(".WorkflowId").data("WorkflowId"));
})

function add_workfliow(){
    //添加时一定得先保存当前的流程
    jsPlumb.detachEveryConnection()
    jsPlumb.deleteEveryEndpoint()
    $(".ui,.logic_css").remove()
    $("#myP").text('')

}

function del_workfliow(e){
    $.ajax({
       url:"/Workflow_del/",
       type:"GET",         
       data:{
           'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
           'id':e,
       },
       success:function (data) {
            if(data.code==301){
                layer.msg(data.msg);
            }else if(data.code==200){
                layer.msg(data.msg);
                window.location = '/ui_000/'
            }else if(data.code==500){
                layer.msg(data.msg);
            }
       },
       error:function (data) {
            layer.msg("失败",data);
       }	   
    })
}


layui.use(['form', 'layedit', 'laydate', 'flow' ,'dropdown'], function(){
    var form = layui.form
    ,layer = layui.layer
    ,layedit = layui.layedit
    ,laydate = layui.laydate
    ,dropdown = layui.dropdown

    $(function() {
        //节点操作删除/断开
        $.contextMenu({
            selector: ".ui,.logic_css",
            callback: function(key, options) {
                var id = $(this).attr('id')
                var nodetype = $(this).data('name')
                console.log(nodetype,'---------name')
                if(key=='cut'){
                    //断开连线
                    var connections = jsPlumb.getAllConnections();
                    for (var i in connections){
                        connections[i].sourceId;
                        connections[i].targetId;
                        if (connections[i].sourceId===id){                            
                            var conn = jsPlumb.getConnections({
                                //only one of source and target is needed, better if both setted
                                source: connections[i].sourceId,
                                target: connections[i].targetId
                            });
                            if (conn[0]) {
                                jsPlumb.detach(conn[0]);
                            }                            
                        }
                    }
                }else if(key=="copy"){
                    //Below_drawer_d1 
                    // $("#nodecopyForm")[0].reset();//清空表单
                    var node_id = Math.random().toString(36).slice(-6)//生成id
                    layer.open({
                        type: 1
                        ,title: '保存模版'
                        ,anim: 5
                        ,content: $("#nodecopy")
                        ,area: ['450px', '250px']
                        ,shade: [0.8, '#393D49']
                        // ,success: function(layero, index){
                        //     console.log(layero, index);
                        // }
                        ,btn: ['确定','取消']
                        ,yes: function(index, layero){
                            c_name=$("input[name='Tnode']").val()
                            $.ajax({
                                url:"/New_template/",
                                type:"POST",
                                data:{
                                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                                    'nodeid':id,
                                    'nodetype':nodetype,
                                    'WorkflowId':$(".WorkflowId").data("WorkflowId"),
                                    'img_status':$("#"+id).data("name"),
                                    'url':$("#"+id).children('div').eq(1).children('img').eq(0).attr("src"),
                                    'name': $("input[name='Tnode']").val(),
                                    'Treegr': $("input[name='Treegr']").val()
                                },
                                success:function (data) {
                                    layer.msg("成功",data);
                                    $.ajax({
                                        url:"/select_template/",
                                        type:"GET",
                                        data:{
                                            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                                        },
                                        success:function (data) {
                                             //这里要触发列表重载
                                             console.log(data,'del_templatedel_templatedel_template')
                                             var html_str=""
                                             for (var keys in data.data){
                                                 var url = data.data[keys]['url']
                                                 var img_status = data.data[keys]['img_status']
                                                 var name = data.data[keys]['name']     
                                                 var id = data.data[keys]['id']
                                                 html_str+='    <div id="'+id+'" style="display:flex;" class="Drag_template" ondragstart="dragStart(event)">'
                                                 html_str+='            <img src="'+url+'" data-name="'+img_status+'" data-id="'+id+'">'
                                                 html_str+='            <div style="width:120px;margin-left:8px;">'+name+'</div>'
                                                 html_str+='            <font style="margin-right:10px;" class="del_template">x</font>'
                                                 html_str+='    </div>'
                                             }
                                             $(".Node_template").html(html_str)
                                        },
                                        error:function (data) {
                                            layer.msg("失败",data);
                                        }
                                     });
                                },
                                error:function (data) {
                                    layer.msg("失败",data);
                                }
                            });
                            layer.close(index);
                        }

                        ,btn1: function(index, layero){
                            //按钮【按钮二】的回调
                            layer.close(index);
                        }
                    });

                }else if(key=="delete"){
                    //删除节点 删除节点的时候拿节点id去数据库查一下，有就删除
                    $.ajax({
                        url:"/NodeDel/",
                        type:"GET",
                        data:{
                            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                            'nodeid':id,
                        },
                        success:function (data) {
                            jsPlumb.remove(id)
                            for (var i in echo_html){
                                if(id==echo_html[i]['node_id']){
                                    console.log('删除了')
                                    arr.splice(i, 1);
                                }
                            }
                            layer.msg("成功",data);
                        },
                        error:function (data) {
                            layer.msg("失败",data);
                        }
                    });
                }
            },
            items: {
                "copy": {name: "设为模板", icon: "copy"},
                "cut": {name: "断开连线", icon: "cut"},
                "delete": {name: "删除节点", icon: "delete"},
                "sep1": "---------",
                "quit": {name: "退出", icon: function(){
                    return 'context-menu-icon context-menu-icon-quit';
                }}
            }
        });
    });

    $(document).on("click", '#Add_Process', function() {
        // console.log("触发了几次");
        layer.open({
            type: 1, 
            title: '添加测试套件'
            ,content: '<div><font class="Projecttile">请输入名称:</font><input type="text" class="ProjectAdd" name="Projectname"></div>' //这里content是一个普通的String
            ,area: ['312px', '176px']
            ,btn: ['确定', '取消']
            ,yes: function(index, layero){
                //按钮【按钮一】的回调
                $.ajax({
                    url:"/ProjectAdd/",
                    type:"POST",                    
                    data:{
                        'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                        'project_name': $("input[name='Projectname']").val(),
                    },
                    success:function (data) {
                        if (data.code==201){
                            layer.msg("测试套件名称已存在",{ icon: 1, time: 1000 });
                        }else{
                            console.log(data,'projectid_tabprojectid_tabprojectid_tab')
                            str_html=''
                            str_html+='        <div class="projectid_tab" data-projectid="'+data['data']['ProjectId']+'">'
                            str_html+='            <div class="divfather">'
                            str_html+='               <i class="layui-icon layui-icon-subtraction" style="font-size: 25px; color: #0a6ae6e3;"></i>'  
                            str_html+='                <span>'+data['data']['project_name']+'</span>'
                            str_html+='            </div>'
                            str_html+='            <div class="iconlist">'
                            str_html+='                <i id="Process_Add" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-add-1" style="font-size: 25px; color: #0a6ae6e3;"></i>'  
                            str_html+='                <i id="Project_Del" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-reduce-circle" style="font-size: 25px; color: #0a6ae6e3;"></i>'
                            str_html+='                <i id="Project_Updata" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-edit" style="font-size: 25px; color: #0a6ae6e3;"></i>'
                            // str_html+='                <i id="Project_Merge" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-404" style="font-size: 25px; color: #0a6ae6e3;"></i>'
                            str_html+='                <i id="Project_Run" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-play" style="font-size: 23px;color: #0a6ae6e3;"></i>'  
                            str_html+='                <i id="Project_Reset" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-refresh-1" style="font-size: 23px; color: #0a6ae6e3;"></i>'
                            str_html+='            </div>'
                            str_html+='        </div>'
                            str_html+='        <div class="divson">'
                            str_html+='        </div>'
                            $("#Processdiv").append(str_html)
                            // $(".Right_drawer_d").children('div').append(str_html)
                            form.render()
                        }
                    },
                    error:function (data) {
                        console.log("失败",data);
                    }
                })
                layer.close(index);
            }
            ,btn2: function(index, layero){
                //按钮【按钮二】的回调
                layer.close(index);
            }
        });
    })


    $(document).on("click", '#Process_Add', function() {
        // 添加流程
        var WorkflowTab=$(this).parent().parent().next()
        layer.open({
            type: 1, 
            title: '添加用例'
            ,content: '<div><font class="Workflotile">请输入名称:</font><input type="text" class="WorkfloAdd" name="Workflowname"></div>' //这里content是一个普通的String
            ,area: ['312px', '176px']
            ,btn: ['确定', '取消']
            ,yes: function(index, layero){
                //按钮【按钮一】的回调
                var Workflowname=$("input[name='Workflowname']").val()//创建时生成name
                var Workflow_id = Math.random().toString(36).slice(-6)//创建时生成id
                $(".WorkflowId").data("WorkflowId",Workflow_id)//添加id
                echo_html=[]//清空list中的节点位置
                str_html=''
                str_html+='        <div id="'+Workflow_id+'" style="border-bottom: 1px solid #e8e8e8;">'
                str_html+='            <span>'+Workflowname+'</span>'
                str_html+='            <div style="display: none;">'
                str_html+='                <i id="Workflow_Del" class="layui-icon layui-icon-reduce-circle" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='                <i id="Workflow_Save" class="layui-icon layui-icon-ok" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='                <i id="Workflow_Updata" class="layui-icon layui-icon-edit" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='                <i id="Workflow_Run" class="layui-icon layui-icon-play" style="font-size: 20px;color: #0a6ae6e3;"></i>'
                str_html+='                <i id="Workflow_Reset" class="layui-icon layui-icon-refresh-1" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='                <i id="data_workflow" class="layui-icon layui-icon-form" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='            </div>'
                str_html+='        </div>'
                WorkflowTab.append(str_html)
                console.log(WorkflowTab,'机械臂')
                form.render()
                add_workfliow()//添加的时候一定得先提示保存流程
                // return false
                $('#'+Workflow_id).children('span').trigger('click')//添加后点击切换到当前创建的
                layer.close(index);
            }
            ,btn2: function(index, layero){
                //按钮【按钮二】的回调
                layer.close(index);
            }
        });
    })

    $(document).on("click", '#Project_Del', function() {
        console.log("Project_Del");
        var ProjectId = $(this).data("projectid")
        console.log(ProjectId)
        thisobj=$(this)
        layer.confirm('是否要删除测试套件？', {
            btn: ['确定', '取消']
        }, function (index, layero) {
            $.ajax({
                url:"/Project_Del/",
                type:"POST",                    
                data:{
                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                    'ProjectId': ProjectId,
                },
                success:function (data) {
                    add_workfliow()//清空画布
                    // $("#"+WorkflowId).remove()//删除tab
                    console.log($("#"+ProjectId).parent('div').parent('div').next())
                    thisobj.parent('div').parent('div').next().remove()//删除下一个兄弟节点
                    thisobj.parent('div').parent('div').remove()//删除tab
                    console.log("成功",data);
                    layer.msg("删除成功!",{ icon: 1, time: 1000 });
                },
                error:function (data) {
                    console.log("失败",data);
                }
            })
            layer.closeAll();  //加入这个信息点击确定 会关闭这个消息框
        });
    })


    $(document).on("click", '#Project_Run', function() {
        var ProjectId = $(this).data("projectid")
        console.log(ProjectId)

        __data  = localStorage.getItem("savestatus")
        console.log(__data)

        function run(WorkflowId){
            $(".ui_d0").css({'background-color': '#32CD32'})//重制节点颜色
            $("#log_html").html('')//重置流程日志
            $.ajax({
                url:"/Workflow_Run/",
                type:"POST",                    
                data:{
                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                    'WorkflowId':WorkflowId
                },
                success:function (data) {
                    console.log("成功",data);
                    layer.msg("执行成功!",{ icon: 1, time: 1000 });
                },
                error:function (data) {
                    console.log("失败",data);
                }
            })
        }

        if (__data=='true'){
            layer.msg("请检查流程是否全部保存",{ icon: 1, time: 1000 });
            return
        }else{
            console.log($(this).parent('div').parent('div').next().children(),'----------')

            workflow_list=$(this).parent('div').parent('div').next().children()

            workflow_list.each(function(){
                WorkflowId=$(this).attr("id")
                console.log($(this).attr("id"))
                run(WorkflowId)
            });
        }
    })



    $(document).on("click", '#Project_Updata', function() {
        //编辑测试套件
        var ProjectId = $(this).data("projectid")
        var __thisobj = $(this)
        __name=$(this).parent().prev().children('span').text()
        layer.prompt({
            formType: 0,
            title: '编辑测试套件名称',
            value: __name,
            area: ['800px', '350px'] //自定义文本域宽高
        }, function(value, index, elem){
            $.ajax({
                url:"/Project_Updata/",
                type:"POST",             
                data:{
                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                    'ProjectId': ProjectId,
                    'name':value
                },
                success:function (data) {
                    __thisobj.parent().prev().children('span').text(value)
                },
                error:function (data) {
                    console.log("失败",data);
                }
            })
            layer.close(index);
        });  
    })



    $(document).on("click", '#Workflow_Del', function() {
        var WorkflowId = $(this).parent('div').parent('div').attr("id")
        layer.confirm('是否要删除信息!', {
            btn: ['确定', '取消']
        }, function (index, layero) {
            $.ajax({
                url:"/Workflow_Del/",
                type:"POST",                    
                data:{
                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                    'WorkflowId': WorkflowId,
                },
                success:function (data) {
                    add_workfliow()//清空画布
                    $("#"+WorkflowId).remove()//删除tab
                    console.log("成功",data);
                    layer.msg("删除成功!",{ icon: 1, time: 1000 });
                },
                error:function (data) {
                    console.log("失败",data);
                }
            })
            layer.closeAll();  //加入这个信息点击确定 会关闭这个消息框
        });
    })



    

    $(document).on("click", '#Workflow_Updata', function() {
        var WorkflowId = $(this).parent('div').parent('div').attr("id")
        __name=$("#"+WorkflowId+">span").text()
        layer.prompt({
            formType: 0,
            title: '编辑用例名称',
            value: __name,
            area: ['800px', '350px'] //自定义文本域宽高
        }, function(value, index, elem){
            $.ajax({
                url:"/Workflow_Updata/",
                type:"POST",             
                data:{
                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                    'WorkflowId': WorkflowId,
                    'name':value
                },
                success:function (data) {
                    $("#"+WorkflowId+">span").text(value)
                },
                error:function (data) {
                    console.log("失败",data);
                }
            })
            layer.close(index);
        });  
    })





    $(document).on("click", '#Workflow_Run', function() {//执行流程
        __data  = localStorage.getItem("savestatus")
        console.log(__data,'__data__data')
        var WorkflowId = $(this).parent('div').parent('div').attr("id")

        function run(){
            $(".ui_d0").css({'background-color': '#32CD32'})//重制节点颜色
            $("#log_html").html('')//重置流程日志
            $.ajax({
                url:"/Workflow_Run/",
                type:"POST",                    
                data:{
                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                    'WorkflowId':WorkflowId
                },
                success:function (data) {
                    console.log("成功",data);
                    layer.msg("执行成功!",{ icon: 1, time: 1000 });
                },
                error:function (data) {
                    console.log("失败",data);
                }
            })
        }


        __save=$(this).prev()
        if (__data == 'true'){//为true的时候弹窗提示是否保存
            layer.confirm('保存后执行？', {
                // icon:3,
                title:"提示",
                btn: ['确定', '否'],
                cancel : function(){
                    // 你点击右上角 X 取消后要做什么
                    return
                },
                btn1:function(index){
                    console.log("确定回调");
                    layer.close(index);
                    __save.trigger("click")
                    run()
                },
                btn2:function(index,layero){
                    console.log("否回调");
                    layer.close(index);
                    return
                }
            });
        }else{
            run()
        }

        // var WorkflowId = $(this).parent('div').parent('div').attr("id")
   
    })
})

$("#template").click(function(){
    //点击展开关闭
    $.ajax({
       url:"/select_template/",
       type:"GET",
       data:{
           'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
       },
       success:function (data) {
            //这里要触发列表重载
            console.log(data,'====================================')
            var html_str=""
            for (var keys in data.data){
                var url = data.data[keys]['url']
                var img_status = data.data[keys]['img_status']
                var name = data.data[keys]['name']     
                var id = data.data[keys]['id']
                html_str+='    <div id="'+id+'" style="display:flex;" class="Drag_template" ondragstart="dragStart(event)">'
                html_str+='            <img src="'+url+'" data-name="'+img_status+'" data-id="'+id+'">'
                html_str+='            <div style="width:120px;margin-left:8px;">'+name+'</div>'
                html_str+='            <font style="margin-right:10px;" class="del_template">x</font>'
                html_str+='    </div>'
            }
            $(".Node_template").html(html_str)
       },
       error:function (data) {
           layer.msg("失败",data);
       }
    });
    $(".template_tab").toggle(500);
})

$("body").on("click", '.del_template', function() {
    //删除模板
    var id = $(this).siblings('img').eq(0).data("id")
    console.log(id,'idididididididid')
    $.ajax({
       url:"/del_template/",
       type:"GET",
       data:{
           'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
           'id': id,
       },
       success:function (data) {
            $.ajax({
               url:"/select_template/",
               type:"GET",
               data:{
                   'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
               },
               success:function (data) {
                    //这里要触发列表重载
                    console.log(data,'del_templatedel_templatedel_template')
                    var html_str=""
                    for (var keys in data.data){
                        var url = data.data[keys]['url']
                        var img_status = data.data[keys]['img_status']
                        var name = data.data[keys]['name']     
                        var id = data.data[keys]['id']
                        html_str+='    <div id="'+id+'" style="display:flex;" class="Drag_template" ondragstart="dragStart(event)">'
                        html_str+='            <img src="'+url+'" data-name="'+img_status+'" data-id="'+id+'">'
                        html_str+='            <div style="width:120px;margin-left:8px;">'+name+'</div>'
                        html_str+='            <font style="margin-right:10px;" class="del_template">x</font>'
                        html_str+='    </div>'
                    }
                    $(".Node_template").html(html_str)
               },
               error:function (data) {
                   layer.msg("失败",data);
               }
            });
       },
       error:function (data) {
           layer.msg("失败",data);
       }
    });
    
})


// $("body").on("click", '.add_Label', function() {
//     //添加标签
//     layer.prompt({title: '输入标签名', formType: 3}, function(l_name, index){
//         layer.msg(l_name)
//         $('.add_Label').prev().append("<div>"+l_name+"</div>")
//         layer.close(index);
//     })

// })

function dragStart(event) {
    var img_url=event.target.src
    var img_status=event.target.parentNode.parentNode.getAttribute("class")
    var img_name=event.target.getAttribute("data-name")
    var img_id=event.target.getAttribute("data-id")

    console.log(img_status,'img_statusimg_statusimg_status')
    event.dataTransfer.setData("url",img_url);
    event.dataTransfer.setData("img_status",img_status);
    event.dataTransfer.setData("img_name",img_name);
    event.dataTransfer.setData("img_id",img_id);
    if (img_status=="Node_template"){//模版拖拽过去的时候拿ID去查询模版数据
        var id=event.target.parentNode.getAttribute("id")
        event.dataTransfer.setData("id",id);
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function add_node_html(img_status,data,img_name,x,y,node_id,nodename){
    //节点html创建
    if (img_status == "Below_drawer_d1" || img_status == 'Node_template'){//工具栏的图标才能拖
        var name_list = ["separate","merge","Start_loop","stop_loop","break_loop"]
        var val = name_list.indexOf(img_name);
        if (val!=-1){
            //逻辑节点的时候样式不一样
            var str_html=""
            str_html+='<div class="logic_css Ambiguity" id="'+ node_id +'" data-name="'+ img_name +'" nodename="'+nodename+'">'
            str_html+='    <div>'
            str_html+='		    <img style="width:10px;height:10px;margin-left:0px;margin-top:0px;" src="../static/img_server/左上角.png">'
            str_html+='		    <img src="'+ data +'">'
            str_html+='	    </div>'
            str_html+='	</div>'
            
        }else{
            //流程节点的样式
            var str_html=""
            str_html+='<div class="ui Ambiguity" id="'+ node_id +'" data-name="'+ img_name +'" nodename="'+nodename+'">'
            str_html+='	<div class="ui_d0">'
            str_html+='	</div>'
            str_html+='	<div class="ui_d1">'
            str_html+='		<img src="'+ data +'">'
            str_html+='	</div>'
            str_html+='	<div class="ui_d2">'
            str_html+='	</div>'
            str_html+='</div>'
        }
        $("#draggable_canvas").append(str_html)
        $("#"+node_id).css("left",x);
        $("#"+node_id).css("top",y);
        add_Process_node(node_id,img_name,val)
    }
}

function abc(node,dict) {
    //拿copy的参数方到节点里
    var node_val = localStorage.getItem(node)
    if(node_val=='None'){
        //新增
        localStorage.setItem(node,JSON.stringify(dict));
    }else{
        //多个节点时新增/编辑
        node_val=JSON.parse(node_val)
        node_val=Object.assign(node_val, dict);
        localStorage.setItem(node,JSON.stringify(node_val))
    }

}


function drop(event) {
    if ($(".WorkflowId").data("WorkflowId")==null){//获取不到data说明没有id，说明是新增的
        console.log("走了新增=====")
        add_Pop_ups()
        return
    }

    localStorage.setItem('savestatus',true);//记录提示保存状态
    event.preventDefault();
    try { 
        var img_status = event.dataTransfer.getData("img_status");
        var data = event.dataTransfer.getData("url");
        var img_name=event.dataTransfer.getData("img_name");
        var id=event.dataTransfer.getData("id");
    }catch(e){
        return
    }    
    var node_id = Math.random().toString(36).slice(-6)//生成id    
    var x=event.offsetX;
    var y=event.offsetY;    
    if (img_status == 'Node_template'){
        console.log('Node_templateNode_template')
        var img_id=event.dataTransfer.getData("img_id");

        $.ajax({
           url:"/generateTemplate/",
           type:"GET",
           data:{
               'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
               'id':id,
               'nodeid':node_id,
               'WorkflowId':$(".WorkflowId").data("WorkflowId"),
           },
           success:function (data) {


                // var dict={}
                // dict[node_id]=data.data[img_id]['data']                
                // //这里要触发列表重载
                // if (img_name==="API"){
                //     abc('api_node',dict)
                // }else if(img_name==="sql"){
                //     abc('sql_node',dict)
                // }else if(img_name==="UI"){
                //     abc('rpa_node',dict)
                // }else if(img_name==="position"){
                //     abc('Node_information',dict)
                // }
                
           },
           error:function (data) {
               layer.msg("失败",data);
           }
        });
    }
    nodename=null
    // nodename=get_nodename(node_id)
    add_node_html(img_status,data,img_name,x,y,node_id,nodename)
    echo_html.push(
        {
            'img_status':img_status,
            'data':data,
            'img_name':img_name,
            'x':x,
            'y':y,
            'node_id':node_id,
            'nodename':nodename
        }
    )
}
    
function Upper_endpoint(id,Connect,common) {
    jsPlumb.addEndpoint(id, Connect, common)
}

function Lower_endpoint(id,Connect,common) {
    jsPlumb.addEndpoint(id,Connect,common)
}

function add_Process_node(id,name,val) {
    var common = {
      isSource: true,
      isTarget: true,
      connector: ['Straight'],
      endpoint: ["Dot", { radius:5, }],//端点形状
      paintStyle:{ width:15, height:15, fillStyle:'#b3b3b3' },//端点样式
      connectorStyle : { strokeStyle:"#b3b3b3"},//连线样式
    }//端点连线样式

    var Connect = {
          anchor: 'Bottom',
          connectorOverlays:[
              [ "Arrow", { width:8, length:20, location:1, id:"arrow" } ],
          ],
    }

    jsPlumb.ready(function () {
      if ($(".ui").length==1 && val==-1){//流程节点只有一位时只添加下面的节点
         Lower_endpoint(id,Connect,common)
         jsPlumb.draggable(id)//可移动节点
         return
      }
      if (name=='merge'){
          //聚合节点,是上端点的时候追加属性可以连多条线
           common['maxConnections']=-1
           Connect['anchor']='Top'
           Upper_endpoint(id,Connect,common)
           delete common['maxConnections']
      }else{
           Connect['anchor']='Top'
           Upper_endpoint(id,Connect,common)
      }
      if (name=='separate'){
          //分支节点,是下端点的时候追加属性可以拉多条线
           common['maxConnections']=-1
           Connect['anchor']='Bottom'
           Connect['connectorOverlays']=[
               [ "Label", { label:'<a class="criteria" style="cursor:pointer;" herf="http://www.baidu.com"><img style="width:20px;height:20px;" src="../static/img_server/点击.png"></a>', id:"label" } ],
               [ "Arrow", { width:8, length:20, location:1, id:"arrow" } ],
           ]
           Lower_endpoint(id,Connect,common)
           delete common['maxConnections']
      }else{
           Connect['anchor']='Bottom'
           Lower_endpoint(id,Connect,common)
      }
      jsPlumb.draggable(id)//可移动节点
    })//添加端点
}

jsPlumb.bind("click",function(conn){
    //点击连线事件
    Upper_endpoint_id=conn.endpoints[0].elementId
    Lower_endpoint_id=conn.endpoints[1].elementId
})

function add_Pop_ups(){
    $("#savatitleForm")[0].reset();//清空表单
    layer.open({
        type: 1
        ,title: '用例创建'
        ,anim: 5
        ,content: $("#savatitle")
        ,area: ['480px', '300px']
        ,shade: [0.8, '#393D49']
        ,btn: ['确定','取消']
        ,yes: function(index, layero){
            var form = layui.form
            var form_data = form.val('example');
            btitle=$("#tabinput").html()
            console.log(btitle,'btitlebtitlebtitlebtitle')
            if (btitle=='选择测试套件'){//新增测试套件方式进行创建
                if (form_data.ProjectNameAdd==null){
                    layer.msg('请填写测试套件名称')
                }
                $.ajax({
                    url:"/ProjectAdd/",
                    type:"POST",                    
                    data:{
                        'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
                        'project_name': form_data.ProjectNameAdd,
                    },
                    success:function (data) {
                        str_html=''
                        str_html+='        <div class="projectid_tab" data-projectid="'+data['data']['ProjectId']+'">'
                        str_html+='            <div class="divfather">'
                        str_html+='               <i class="layui-icon layui-icon-subtraction" style="font-size: 25px; color: #0a6ae6e3;"></i>'  
                        str_html+='                <span>'+data['data']['project_name']+'</span>'
                        str_html+='            </div>'
                        str_html+='            <div class="iconlist">'
                        str_html+='                <i id="Process_Add" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-add-1" style="font-size: 25px; color: #0a6ae6e3;"></i>'  
                        str_html+='                <i id="Project_Del" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-reduce-circle" style="font-size: 25px; color: #0a6ae6e3;"></i>'
                        str_html+='                <i id="Project_Updata" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-edit" style="font-size: 25px; color: #0a6ae6e3;"></i>'
                        // str_html+='                <i id="Project_Merge" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-404" style="font-size: 25px; color: #0a6ae6e3;"></i>'
                        str_html+='                <i id="Project_Run" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-play" style="font-size: 23px;color: #0a6ae6e3;"></i>'  
                        str_html+='                <i id="Project_Reset" data-ProjectId="'+data['data']['ProjectId']+'" class="layui-icon layui-icon-refresh-1" style="font-size: 23px; color: #0a6ae6e3;"></i>'
                        str_html+='            </div>'
                        str_html+='        </div>'
                        str_html+='        <div class="divson">'
                        str_html+='        </div>'
                        $(".Right_drawer_d").append(str_html)
                        form.render()
                        var WorkflowTab=$('.projectid_tab[data-projectid="'+data['data']['ProjectId']+'"]').next()
                        var Workflowname=form_data.WorkflowNameAdd//创建时生成name
                        var Workflow_id = Math.random().toString(36).slice(-6)//创建时生成id
                        $(".WorkflowId").data("WorkflowId",Workflow_id)
                        $(".WorkflowId").text(Workflowname)
                        str_html=''
                        str_html+='        <div id="'+Workflow_id+'" style="border-bottom: 1px solid #e8e8e8;">'
                        str_html+='            <span>'+Workflowname+'</span>'
                        str_html+='            <div style="display: none;">'
                        str_html+='                <i id="Workflow_Del" class="layui-icon layui-icon-reduce-circle" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                        str_html+='                <i id="Workflow_Save" class="layui-icon layui-icon-ok" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                        str_html+='                <i id="Workflow_Updata" class="layui-icon layui-icon-edit" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                        str_html+='                <i id="Workflow_Run" class="layui-icon layui-icon-play" style="font-size: 20px;color: #0a6ae6e3;"></i>'
                        str_html+='                <i id="Workflow_Reset" class="layui-icon layui-icon-refresh-1" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                        str_html+='                <i id="data_workflow" class="layui-icon layui-icon-form" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                        str_html+='            </div>'
                        str_html+='        </div>'
                        WorkflowTab.append(str_html)
                        form.render()
                        add_workfliow()//添加的时候一定得先提示保存流程
                        layer.closeAll();
                    },
                    error:function (data) {
                        console.log("失败",data);
                    }
                })
                $("#savatitle").hide()
            }else if (btitle=='新增测试套件'){
                if (form_data.optionProjectNameAdd==null){
                    layer.msg('请选择测试套件')
                }
                var WorkflowTab=$('.projectid_tab[data-projectid="'+form_data.optionProjectNameAdd+'"]').next()
                var Workflowname=form_data.WorkflowNameAdd//创建时生成name
                var Workflow_id = Math.random().toString(36).slice(-6)//创建时生成id
                $(".WorkflowId").data("WorkflowId",Workflow_id)
                $(".WorkflowId").text(Workflowname)
                str_html=''
                str_html+='        <div id="'+Workflow_id+'" style="border-bottom: 1px solid #e8e8e8;">'
                str_html+='            <span>'+Workflowname+'</span>'
                str_html+='            <div style="display: none;">'
                str_html+='                <i id="Workflow_Del" class="layui-icon layui-icon-reduce-circle" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='                <i id="Workflow_Save" class="layui-icon layui-icon-ok" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='                <i id="Workflow_Updata" class="layui-icon layui-icon-edit" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='                <i id="Workflow_Run" class="layui-icon layui-icon-play" style="font-size: 20px;color: #0a6ae6e3;"></i>'
                str_html+='                <i id="Workflow_Reset" class="layui-icon layui-icon-refresh-1" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='                <i id="data_workflow" class="layui-icon layui-icon-form" style="font-size: 20px; color: #0a6ae6e3;"></i>'
                str_html+='            </div>'
                str_html+='        </div>'
                WorkflowTab.append(str_html)
                form.render()
                add_workfliow()//添加的时候一定得先提示保存流程
				layer.closeAll();
            }
            $("#savatitle").hide()
        }
        ,btn2: function(index, layero){
            layer.closeAll();
            $("#savatitle").hide()
        }
        ,cancel: function(index, layero){//关闭x
            $("#savatitle").hide()

        }


    });
}

$("body").on("click", '#Workflow_Save', function() {
    if ($(".ui").length<1){
        layer.msg('流程节点数量不能小于1')
        return
    }
    var node_list=[]
    var connections = jsPlumb.getAllConnections();
    var workflow_dict={}


    for(var i in connections){
        var dict_1 = new Object()
        dict_1['current']=connections[i].sourceId
        dict_1['Rear']=connections[i].targetId
        dict_1['current_uuid']=connections[i].sourceId+'_current'
        dict_1['Rear_uuid']=connections[i].targetId+"_Rear"
        var current_width = $('#'+connections[i].sourceId).css('left');
        var current_height = $('#'+connections[i].sourceId).css('top');
        var Rear_width = $('#'+connections[i].targetId).css('left');
        var Rear_height = $('#'+connections[i].targetId).css('top');
        dict_1['current_width']=current_width
        dict_1['current_height']=current_height
        dict_1['Rear_width']=Rear_width
        dict_1['Rear_height']=Rear_height
        workflow_dict[i]=dict_1
        console.log(workflow_dict,'workflow_dict')
        console.log(echo_html,'真的echo_html')

        for (var echo_len in echo_html){//回显添加位置,可能是这里的问题-----百分之99是这里问题
            var echo_id=echo_html[echo_len]['node_id']
            if (echo_id==connections[i].sourceId){
                echo_html[echo_len]['x']=current_width
                echo_html[echo_len]['y']=current_height
                echo_html[echo_len]['nodename']=echo_html[echo_len]['nodename']
            }
            if (echo_id==connections[i].targetId){
                echo_html[echo_len]['x']=Rear_width
                echo_html[echo_len]['y']=Rear_height
                echo_html[echo_len]['nodename']=echo_html[echo_len]['nodename']
            }
        }
    }
    var echo_html_order=[]//看点别的,下次再写    应该是好了
    if (connections.length == 0){
        console.log('进入了第一次等于0',echo_html)
        for (var echo_len in echo_html){//回显添加位置,可能是这里的问题-----百分之99是这里问题
            echo_html_order.push(echo_html[echo_len])
        }
        current=$(".ui").attr('id')
        console.log(current,'currentcurrentcurrentcurrent')
        var dict_1 = new Object()
        dict_1['current']=current
        dict_1['Rear']=current
        dict_1['current_uuid']=current+'_current'
        dict_1['Rear_uuid']=current+"_Rear"
        var current_width = $('#'+current).css('left');
        var current_height = $('#'+current).css('top');
        var Rear_width = $('#'+current).css('left');
        var Rear_height = $('#'+current).css('top');
        dict_1['current_width']=current_width
        dict_1['current_height']=current_height
        dict_1['Rear_width']=Rear_width
        dict_1['Rear_height']=Rear_height
        workflow_dict[0]=dict_1
        console.log(workflow_dict,'=====xxxx====sssss')

        // Rear=null
        // current_uuid=current+"_current"
        // Rear_uuid=null
    }else{
        for(var z in connections){
            for (var echo_len in echo_html){//回显添加位置,可能是这里的问题-----百分之99是这里问题
                var echo_id=echo_html[echo_len]['node_id']
                if (connections[z].targetId==echo_id || connections[z].sourceId==echo_id){
                    echo_html_order_list=[]
                    for (var echo_html_order_id in echo_html_order){
                        echo_html_order_list.push(echo_html_order[echo_html_order_id]['node_id'])
                    }
                    if (echo_html_order_list.indexOf(echo_html[echo_len]['node_id'])<0){
                        echo_html_order.push(echo_html[echo_len])//加个判断echo_html_order有的就不加了
                    }
                }
            }
        }
    }

    //第一次保存应该没的问题
    //echo_html_order    这玩意有问题
    console.log(echo_html_order,'echo_html_orderecho_html_order')

    node_list=[...new Set(node_list)]
    var node_node=$(".ui,.logic_css")
    if (node_list.length!=0){//节点是否连线
        for (var len_node=0;len_node<node_node.length;len_node++){
            if (node_list.indexOf(node_node.eq(len_node).attr('id')) < 0){
                layer.msg('请检查节点连线')
                return
            }
        }
    }



    
    var canvastop = $("#draggable_canvas").css("top")
    var canvasleft = $("#draggable_canvas").css("left")
    console.log(canvastop,canvasleft,'canvasleftcanvasleftcanvasleftcanvasleftcanvasleft')

    Workflow_id=$(".WorkflowId").data("WorkflowId")
    Workflowname=$(this).parent().prev().html()
    $(".WorkflowId").text(Workflowname)
    var projectid=$("#"+Workflow_id).parent().prev().data('projectid')
    Workflwow_data={//连线id 参数配置id 模版的id
        "Workflow_id":Workflow_id,
        "Workflow_name":$('.WorkflowId').text(),
        "connections":JSON.stringify(workflow_dict),
        "echo_html":echo_html_order,//应该是这里的问题
        "canvastop":canvastop,
        "canvasleft":canvasleft
    }
    var Workflow_name=$('.WorkflowId').text();
    $.ajax({
       url:"/Workflow_save/",
       type:"POST",                    
       data:{
           'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
           'Workflow_id':Workflow_id,
           'Workflow_name':Workflow_name,
           "projectid":projectid,
           'Workflwow_obj':JSON.stringify(Workflwow_data),
       },
       success:function (data) {
            localStorage.setItem('savestatus',false);//提示保存校验状态
            layer.msg('流程保存成功')
            console.log('成功',data,'成功人事达文西')
       },
       error:function (data) {
           layer.msg("流程保存失败",data);
       }
    });
})


$("body").on("click", '#Workflow_Reset', function() {
    //重置
    var WorkflowId = $(this).parent('div').parent('div').attr("id")
    $.ajax({
       url:"/Workflow_Reset/",
       type:"GET",         
       data:{
           'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
           'id':WorkflowId,
       },
       success:function (data) {
           layer.msg("重置成功");
           $("#"+WorkflowId).children('span').trigger('click')//触发点击事件重载画布
       },
       error:function (data) {
           layer.msg("重置失败");
       }	  
    })
})

window.onload =function()
{
    $("#loading").hide();
}
