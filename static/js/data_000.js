
var edit_id = localStorage.getItem("edit_id")
var Workflow_parameter = {}
var parameter_dict={}
var WorkflowId = window.parent.$(".WorkflowId").data("WorkflowId")

$("#shut_down").click(function(){
	//关闭判断节点
	$(".popping-box-wrap", parent.document).hide(500);
});

var  tip_index;
$("#dxqm").hover(function(){
	tips_index = layer.tips("开启后执行工作流会使用data里的数据",this,{time:0});
},function(){
    layer.close(tips_index);
});

layui.use(['form', 'layedit', 'laydate','dropdown'], function(){
    var form = layui.form
    ,layer = layui.layer
    ,layedit = layui.layedit
    ,laydate = layui.laydate
	,dropdown = layui.dropdown
    //日期
    laydate.render({
      elem: '#date'
    });
    laydate.render({
      elem: '#date1'
    });
    var edit_id = localStorage.getItem("edit_id")
    var list_node = parent.list_node_all()//所有节点id
	// for (var list_node_index in list_node){
		$.ajax({//查询流程变量
			url:"/GetVariable/",
			type:"POST",                    
			data:{
				'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
				'nodeid':'Variable'+WorkflowId,
			},
			success:function (data) {
				var str_html=""
				for (var Variable_i in data['data']){
					Variableval=JSON.parse(data['data'][Variable_i])
					//遍历所有的变量生成表单
					str_html+='  <div class="layui-form-item">'
					str_html+='	<label class="layui-form-label">'+Variableval['Variablename']+'</label>'
					str_html+='	<div class="layui-input-block">'
					str_html+='	  <input type="text" name="val" value="'+Variableval['Variablevalue']+'" lay-verify="title" autocomplete="off" placeholder="请输入value" class="layui-input">'
					str_html+='	</div>'
					str_html+='  </div>'
				}
				$('.from-overflow').append(str_html)
				form.render()	
			},
			error:function (data) {
				console.log("失败",data);
			}
		})
	// }
  
    $('#site_add').click(function(){
		//重置表单
        $('#from_pd')[0].reset()
	})
  
    $('#from_Reset').click(function(){
		//重置表单
        $('#from_pd')[0].reset()
	})

	$.ajax({//查询定位节点数据
		url:"/GetData/",
		type:"POST",                    
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			'nodeid':edit_id,
		},
		success:function (data) {
			PositionVal=JSON.parse(data['data'])
			if (PositionVal){
				PositionVal=JSON.parse(PositionVal['nodejson'])
				Workflow_parameter['Workflow_parameter']=PositionVal['Workflow_parameter']
				parameter_dict=PositionVal['Workflow_parameter']
				if (PositionVal['data_status']){//true的时候开启按钮
					$('input[name="switch_status"]').attr("checked",true)
				}
				for (var title in PositionVal['tab_status']) {
					html_str=''
					html_str+='    <div  class="tab_but">'
					if (PositionVal['tab_status'][title]){
						html_str+='   		<input style="margin-left:4px;font-size: 3px;" type="checkbox" name="sex" value="'+title+'" title="'+title+'" checked="" >'
					}else{
						html_str+='   		<input style="margin-left:4px;font-size: 3px;" type="checkbox" name="sex" value="'+title+'" title="'+title+'" >'
					}
					html_str+='        <div class="tab_but_div" style="width:40px;">'
					if (title.length>4){
						html_str+='            <font id='+title+' class="tab_but_a">'+ title.slice(0, 3)+'...' +'</font>'
					}else{
						html_str+='            <font id='+title+' class="tab_but_a">'+ title +'</font>'
					}
					html_str+='        </div>'
					html_str+='        <i id="tab_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;"></i>'
					html_str+='    </div>'
					$(".Judgment_Pool").append(html_str);
				}
				form.render()
			}
		},
		error:function (data) {
			console.log("失败",data);
		}
	})

    $('#save').click(function(){
		//获取表单中参数内容写入缓存
        var title = $('input[name="title"]').val()//参数组名称
        var val_condition=$('div[class="from-overflow"]').children('div')
		var judgment_list=[]
        for(var i=0;i<val_condition.length;i++){
			var judgment_dict={}
			judgment_dict['data_name'] = title
			judgment_dict['key'] = val_condition.eq(i).find('label[class="layui-form-label"]').text()
			judgment_dict['value'] = val_condition.eq(i).find('input[name="val"]').val()
			judgment_list.push(judgment_dict)
		}
        parameter_dict[title]=judgment_list
		Workflow_parameter['Workflow_parameter']=parameter_dict
		for (var l=0;l<$('.tab_but_a').length;l++){
			if ($('.tab_but_a').eq(l).text()==title){
			    layer.msg("编辑成功");
				return
			}
		}
		html_str=''
		html_str+='    <div  class="tab_but">'
		html_str+='   		<input style="margin-left:4px;font-size: 3px;" type="checkbox" name="sex" value="'+title+'" title="'+title+'" checked="" >'
		html_str+='        <div class="tab_but_div" style="width:40px;">'		
		if (title.length>4){
			html_str+='            <font id='+title+' class="tab_but_a">'+ title.slice(0, 3)+'...' +'</font>'
		}else{
			html_str+='            <font id='+title+' class="tab_but_a">'+ title +'</font>'
		}
		html_str+='        </div>'
		html_str+='        <i id="tab_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;"></i>'
		html_str+='    </div>'
		$(".Judgment_Pool").append(html_str);
        $('#from_pd')[0].reset()
		form.render()	
	})
	
	$(document).on("click",'.tab_but_div',function(e){
        //编辑
		var title = $(this).children('font').attr('id')
        $('.tab_but').css({"border":"1px solid #c9c9c9"});
		$(this).parent('div').css({"border":"1px solid #1E9FFF"});
		$('input[name="title"]').val(title)//参数组名称
        for(var i=0;i<parameter_dict[title].length;i++){			
			var val_condition=$('div[class="from-overflow"]').children('div')
			val_condition.eq(i).find('label[class="layui-form-label"]').text(parameter_dict[title][i]['key'])
			val_condition.eq(i).find('input[name="val"]').val(parameter_dict[title][i]['value'])
		}
		form.render()
	})

	$(document).on("click",'#tab_del',function(){
        //删除一个判断
		var title = $(this).prev().children('font').text()
		delete parameter_dict[title];
        $(this).parent().remove()
		default_from()//重置
        $('#from_pd')[0].reset()
   });

    $('#Save_node').click(function(){
		//保存判断节点所有数据
		var edit_id = localStorage.getItem("edit_id")
		var data_status = $('input[name="switch_status"]').is(':checked')
		var tab_status = {}
		var tab_list = $('div[class="tab_but"]>input')
		for (var t_len=0;t_len<tab_list.length;t_len++){
			tab_status[tab_list.eq(t_len).val()]=tab_list.eq(t_len).is(':checked')
		}
		Workflow_parameter["Workflow_parameter"]=parameter_dict
		Workflow_parameter['data_status']=data_status
		Workflow_parameter['tab_status']=tab_status
		$.ajax({//节点保存到redis
			url:"/AddData/",
			type:"POST",                    
			data:{
				'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
				'nodeid':edit_id,
				// "Workflow_name":$('#myP').text(),
				'nodejson':JSON.stringify(Workflow_parameter),
				'nodetype':"data",
				'Workflowid':$("#run_workflow").data('id'),
			},
			success:function (data) {
				parent.add_nodename("data_workflow",edit_id)//添加节点名称到节点标签
				localStorage.setItem('savestatus',true);
			},
			error:function (data) {
				console.log("失败",data);
			}	   
		})
		$(".popping-box-wrap", parent.document).hide(500);
	})
});