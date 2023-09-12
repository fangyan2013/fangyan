$("#shut_down").click(function(){
	//关闭判断节点
	$(".popping-box-wrap", parent.document).hide(500);
});

$( "#myP" ).click(function(e){//点击时可编辑
	var x = document.getElementById("myP");
	x.contentEditable = "true";
	$("#myP").focus();
})
			
$("#myP").focus(function(){//聚焦改变颜色
	var x = document.getElementById("myP");
	x.style.color='#000000'
});
			
$( "#myP" ).blur(function(){//失去改变颜色不可编辑
	var x = document.getElementById("myP");
	x.contentEditable = "false";
	x.style.color='#7d7d7d'
});

$('input[name="Judgment_value"]').blur(function(){
	//失去焦点时触发
	var val = $(this).parent().prev().children('select').val()
	if (val == 0 || val ==1){
		if (isNaN($(this).val())){
			layer.msg('判断大于小于时只能输入数字')
			$(this).val('')
		}
	}
}) 

var Judgment_Group = {};
layui.use(['form', 'layedit', 'laydate','dropdown'], function(){
    var form = layui.form
    ,layer = layui.layer
    ,layedit = layui.layedit
    ,laydate = layui.laydate
	,dropdown = layui.dropdown
    laydate.render({
      elem: '#date'
    });
    laydate.render({
      elem: '#date1'
    });
	var edit_id = localStorage.getItem("edit_id")
	$.ajax({//查询节点数据
		url:"/GetNode/",
		type:"POST",                    
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			'nodeid':edit_id,
		},
		success:function (data) {
			PositionVal=JSON.parse(data['data'])
			if (PositionVal != null){
				PositionVal=JSON.parse(PositionVal['nodejson'])
				p_dict = PositionVal[edit_id]
				Judgment_Group=p_dict['Judgment_node']
				for (var key in p_dict['Judgment_node']) {
					html_str=''
					html_str+='    <div  class="itab_but">'
					html_str+='        <div class="itab_but_div">'
					if (key.length>4){
						html_str+='         <font id='+key+' class="itab_but_a">'+ key.slice(0, 4)+'...' +'</font>'
					}else{
						html_str+='         <font id='+key+' class="itab_but_a">'+ key +'</font>'
					}
					html_str+='        </div>'
					html_str+='        <i id="tab_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;"></i>'
					html_str+='    </div>'
					$(".Judgment_Pool").append(html_str);
				}
			}
		},
		error:function (data) {
			console.log("失败",data);
		}
	})

	$( "#add_pd" ).click(function(){
		//新增一列判断
		var str_html=""
		str_html+='  <div>'
		str_html+='	  <div class="layui-form-item">'
		str_html+='		<div class="layui-input-inline" style="width:75px;">'
		str_html+='		  <select name="logic_operation">'
		str_html+='			<option value="or">or</option>'
		str_html+='			<option value="and">and</option>'
		str_html+='		  </select>'
		str_html+='		</div>'
		str_html+='		<div class="layui-input-inline" style="width: 274px;">'
		str_html+='			<input type="text" name="Ginseng" lay-verify="title" autocomplete="off" placeholder="请输入判断条件" class="layui-input">'
		str_html+='		</div>'

		str_html+='		<div class="layui-input-inline" style="width:75px;">'
		str_html+='		  <select name="Compare">'
		str_html+='			<option value="0">大于</option>'
		str_html+='			<option value="1">小于</option>'
		str_html+='			<option value="2">等于</option>'
		str_html+='			<option value="3">不等于</option>'
		str_html+='		  </select>'
		str_html+='		</div>'
		str_html+='		<div class="layui-input-inline" style="width: 274px;">'
		str_html+='		  <input type="text" name="Judgment_value" lay-verify="title" autocomplete="off" placeholder="请输入标题" class="layui-input">'
		str_html+='		</div>'
		str_html+='		<div class="layui-input-inline" style="width: 25px;">'
		str_html+='			<button id="del_but" style="margin-top:3px;" type="button" class="layui-btn layui-btn-primary layui-btn-sm">'
		str_html+='				<i class="layui-icon"></i>'			
		str_html+='			</button>'
		str_html+='		</div>'
		str_html+='	  </div>'
		str_html+='  </div>'
		$('.from-overflow').append(str_html)
		form.render()	
		// dr()
	})
 
	$(document).on("click",'#del_but',function(){
		//删除一列
		var index = $(this).parents('.layui-form-item').parent('div').index()
		$(this).parents(".layui-form-item").parent('div').eq(0).remove();
	})
  
    $('#site_add').click(function(){
		//重置表单
        $('#from_pd')[0].reset()
		form.render()	
	})
  
    $('#from_Reset').click(function(){
		//重置表单
        $('#from_pd')[0].reset()
		form.render()	
	})

	function default_from() {
		//重置
		var default_str=""
		default_str+='	<div>'
		default_str+='	  <div class="layui-form-item">'
		default_str+='		<label class="layui-form-label">出参</label>'
		default_str+='		<div class="layui-input-inline" style="width: 274px;">'
		default_str+='			<input type="text" name="Ginseng" lay-verify="title" autocomplete="off" placeholder="请输入判断条件" class="layui-input">'
		default_str+='		</div>'

		default_str+='		<div class="layui-input-inline" style="width:75px;">'
		default_str+='		  <select name="Compare">'
		default_str+='			<option value="0">大于</option>'
		default_str+='			<option value="1">小于</option>'
		default_str+='			<option value="2">等于</option>'
		default_str+='			<option value="3">不等于</option>'
		default_str+='		  </select>'
		default_str+='		</div>'
		default_str+='		<div class="layui-input-inline" style="width: 274px;">'
		default_str+='		  <input type="text" name="Judgment_value" lay-verify="title" autocomplete="off" placeholder="请输入标题" class="layui-input">'
		default_str+='		</div>'
		default_str+='	  </div>'
		default_str+='	</div>'
		$('.from-overflow').html(default_str)
		form.render()
		// dr()
	}

    $('#save').click(function(){
		//获取表单中判断条件内容写入缓存
        var title = $('input[name="title"]').val()//判断名称
        var val_condition=$('div[class="from-overflow"]').children('div')
		var judgment_list=[]
        for(var i=0;i<val_condition.length;i++){
			var judgment_dict={}
			// console.log(val_condition.eq(i).find('input[name="Ginseng"]').attr(),"xxxxxxxxxxxxxxxxxxxxxx")

			if(i==0){
				// judgment_dict['node'] = val_condition.eq(i).find('input[name="node"]').val()
				judgment_dict['node_id'] = edit_id
			    judgment_dict['Ginseng'] = val_condition.eq(i).find('input[name="Ginseng"]').val()
			    judgment_dict['Compare'] = val_condition.eq(i).find('select[name="Compare"]').val()
			    judgment_dict['Judgment_value'] = val_condition.eq(i).find('input[name="Judgment_value"]').val()
				judgment_list.push(judgment_dict)
			}else{
			    judgment_dict['logic_operation'] = val_condition.eq(i).find('select[name="logic_operation"]').val()
			    // judgment_dict['node'] = val_condition.eq(i).find('input[name="node"]').val()
				judgment_dict['node_id'] = edit_id
			    judgment_dict['Ginseng'] = val_condition.eq(i).find('input[name="Ginseng"]').val()
			    judgment_dict['Compare'] = val_condition.eq(i).find('select[name="Compare"]').val()
			    judgment_dict['Judgment_value'] = val_condition.eq(i).find('input[name="Judgment_value"]').val()
				judgment_list.push(judgment_dict)
			}
		}
		Judgment_Group[title]=judgment_list
		for (var l=0;l<$('.itab_but_a').length;l++){
			if ($('.itab_but_a').eq(l).attr("id")==title){
				//编辑时退出
			    layer.msg("编辑成功");
				return
			}
		}
		//添加的时候才走下面那一段
		html_str=''
		html_str+='    <div  class="itab_but">'
		html_str+='        <div class="itab_but_div">'		
		if (title.length>4){
			html_str+='         <font id='+title+' class="itab_but_a">'+ title.slice(0, 3)+'...' +'</font>'
		}else{
			html_str+='         <font id='+title+' class="itab_but_a">'+ title +'</font>'
		}
		html_str+='        </div>'
		html_str+='        <i id="tab_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;"></i>'
		html_str+='    </div>'
		$(".Judgment_Pool").append(html_str);
		default_from()//重置
        $('#from_pd')[0].reset()
		form.render()	
	})
	
	$(document).on("click",'.itab_but_div',function(e){
        //编辑
		default_from()//重置
		var title = $(this).children('font').attr('id')
		$('.itab_but').css({"border":"1px solid #c9c9c9"});
		$(this).parent('div').css({"border":"1px solid #1E9FFF"});
		$('input[name="title"]').val(title)//判断名称
		for(var i=0;i<Judgment_Group[title].length;i++){
			console.log(Judgment_Group[title][i],'ssssssssssssssssssssssssssssss')
			if(i==0){
				var val_condition=$('div[class="from-overflow"]').children('div')
				// val_condition.eq(i).find('input[name="node"]').val(Judgment_Group[title][i]['node'])
				val_condition.eq(i).find('input[name="Ginseng"]').val(Judgment_Group[title][i]['Ginseng'])
				val_condition.eq(i).find('select[name="Compare"]').val(Judgment_Group[title][i]['Compare'])
				val_condition.eq(i).find('input[name="Judgment_value"]').val(Judgment_Group[title][i]['Judgment_value'])
			}else{
				$( "#add_pd" ).click()
				var val_condition=$('div[class="from-overflow"]').children('div')
				val_condition.eq(i).find('select[name="logic_operation"]').val(Judgment_Group[title][i]['logic_operation'])
				// val_condition.eq(i).find('input[name="node"]').val(Judgment_Group[title][i]['node'])
				val_condition.eq(i).find('input[name="Ginseng"]').val(Judgment_Group[title][i]['Ginseng'])
				val_condition.eq(i).find('select[name="Compare"]').val(Judgment_Group[title][i]['Compare'])
				val_condition.eq(i).find('input[name="Judgment_value"]').val(Judgment_Group[title][i]['Judgment_value'])
			}
		}
		form.render()
	})

	$(document).on("click",'#tab_del',function(){
        //删除一个判断
		var title = $(this).prev().children('font').attr('id')
		delete Judgment_Group[title];
        $(this).parent().remove()
		default_from()//重置
        $('#from_pd')[0].reset()
   });

    $('#Save_node').click(function(){
		//保存判断节点所有数据
		var edit_id = localStorage.getItem("edit_id")
		node_data={}
		node_data["Judgment_node"]=Judgment_Group
		node_data['node_name']=$('#myP').text()
		judgment_data={}
		judgment_data[edit_id]=node_data
		$.ajax({//节点保存到redis
			url:"/AddNode/",
			type:"POST",                    
			data:{
				'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
				"Workflow_name":$('#myP').text(),
				'nodeid':edit_id,
				'nodejson':JSON.stringify(judgment_data),
				'nodetype':"judge",
			},
			success:function (data) {
				parent.add_nodename(edit_id,$('#myP').text())//添加节点名称到节点标签
				localStorage.setItem('savestatus',true);
				$(".popping-box-wrap", parent.document).hide(500);
			},
			error:function (data) {
				console.log("失败",data);
			}	   
		})
	})
});
