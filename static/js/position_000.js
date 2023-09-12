var nodeid = localStorage.getItem("edit_id")
var p_dict={}
var id_Sort={}
// print('进入了position') js里的print是下载pdf，屎都坑出来了

$.ajax({//查询定位节点数据
	url:"/GetNode/",
	type:"POST",                    
	data:{
		'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		'nodeid':nodeid,
	},
	success:function (data) {
		PositionVal=JSON.parse(data['data'])
		console.log(PositionVal,'定位节点输出的内容')
		// if (PositionVal.constructor != Object){
		// 	PositionVal=JSON.parse(PositionVal)
		// }

		// console.log(PositionVal,'定位节点输出的内容')

		if (PositionVal){
			PositionVal=JSON.parse(PositionVal['nodejson'])
			p_dict = PositionVal[nodeid]
			id_Sort = PositionVal[nodeid+"_Sort"]

			console.log(p_dict,'p_dictp_dict')
			console.log(id_Sort,'id_Sortid_Sort')

			

			for (var t_name in id_Sort){
				console.log(p_dict[t_name],' p_dict[t_name]',t_name)
				$("#sortable").append(
					'<li id='+id_Sort[t_name]+' class="ui-state-default ui-sortable-handle"><div class="tab_path" style="line-height: 17px;width:152px;display:inline-block;">'+ p_dict[id_Sort[t_name]]['path_name'] +'</div><i id="position_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;display:inline-block;"></i></li>'
				)
			}
		}
	},
	error:function (data) {
		console.log("失败",data);
	}
})


$(function() {
	$( "#sortable" ).sortable({
		revert: true
	});
	$( "#draggable" ).draggable({
		connectToSortable: "#sortable",
		helper: "clone",
		revert: "invalid"
	});
	$( "ul, li" ).disableSelection();
});


$(document).on("click",'#shut_down',function(){
	//关闭节点
	console.log("触发了关闭")
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

var editor;
layui.use(['form','layer'], function(){
	var form = layui.form;
	var layer = layui.layer;
	$(document).on("click",'.tab_path',function(){//切换元素tab

		// var id = $(this).text()
		console.log($(this).parent().attr('id'),'$(this)')
		var id = $(this).parent().attr('id')
		$("#positionid").val(id)//切换的时候整成切换的id
		
		if(p_dict=='None'){
			console.log('没有数据不回显')
		}else{
			if (p_dict.hasOwnProperty(id)){
				if(p_dict[id]['Positioning']==8){
					//js注入
					var str_html=""
					str_html+='<div id="editor" style="width:515px;min-height:300px;margin:15px -21px 0px 110px;;">'
					str_html+='</div>'
					$("#from_Interactive_1").html(str_html)
					editor = ace.edit("editor");
					editor.setTheme("ace/theme/monokai");
					editor.session.setMode("ace/mode/javascript");
					editor.setValue(p_dict[id]['js'])
					form.render();
				}else if(p_dict[id]['Positioning']==9){
					//切换iframe
					var str_html=""
						str_html+='<div class="layui-form-item" style="margin-top: 15px;">'
						str_html+='	<label class="layui-form-label">元素</label>'
						str_html+='	<div class="layui-input-block">'
						str_html+='	  <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="输入ifame标签的id,name,或者index" lay-reqtext="岂能为空？" class="layui-input">'
						str_html+='	</div>'
						str_html+='</div>'
					$("#from_Interactive_1").html(str_html)
					form.render();
				}else if(p_dict[id]['Positioning']==10){
					//鼠标拖动
						var str_html=""
						str_html+='<div style="display: flex;margin-top:15px;">'
						str_html+='<div class="layui-form-item">'
						str_html+='	<div class="layui-inline">'
						str_html+='	  <label class="layui-form-label">起始</label>'
						str_html+='	  <div class="layui-input-inline" style="width: 80px;">'
						str_html+='		<input type="text" name="Start_width" placeholder="x坐标" autocomplete="off" class="layui-input">'
						str_html+='	  </div>'
						str_html+='	  <div class="layui-form-mid">-</div>'
						str_html+='	  <div class="layui-input-inline" style="width: 80px;">'
						str_html+='		<input type="text" name="Start_height" placeholder="y坐标" autocomplete="off" class="layui-input">'
						str_html+='	  </div>'
						str_html+='	</div>'
						str_html+='  </div>'
						str_html+='  <div class="layui-form-item">'
						str_html+='	<div class="layui-inline">'
						str_html+='	  <label class="layui-form-label" style="width:40px">目标</label>'
						str_html+='	  <div class="layui-input-inline" style="width: 80px;">'
						str_html+='		<input type="text" name="end_width" placeholder="x坐标" autocomplete="off" class="layui-input">'
						str_html+='	  </div>'
						str_html+='	  <div class="layui-form-mid">-</div>'
						str_html+='	  <div class="layui-input-inline" style="width: 80px;">'
						str_html+='		<input type="text" name="end_height" placeholder="y坐标" autocomplete="off" class="layui-input">'
						str_html+='	  </div>'
						str_html+='	</div>'
						str_html+='  </div>'				
						str_html+='  </div>'				
						$("#from_Interactive_1").html(str_html)
						form.render();
				}else if(p_dict[id]['Positioning']==11){
					//python会话
					var str_html=""
					str_html+='<div id="editor" style="width:515px;min-height:300px;margin:15px -21px 0px 110px;;">'
					str_html+='</div>'
					$("#from_Interactive_1").html(str_html)
					editor = ace.edit("editor");
					editor.setTheme("ace/theme/monokai");
					editor.session.setMode("ace/mode/python");
					editor.setValue(p_dict[id]['py'])
				}else if(p_dict[id]['Positioning']==12){
					//url
					var str_html=""
						str_html+='<div class="layui-form-item" style="margin-top: 15px;">'
						str_html+='	<label class="layui-form-label">url</label>'
						str_html+='	<div class="layui-input-block">'
						str_html+='	  <input type="text" name="url" lay-verify="title" autocomplete="off" placeholder="输入url" lay-reqtext="岂能为空？" class="layui-input">'
						str_html+='	</div>'
						str_html+='</div>'
					$("#from_Interactive_1").html(str_html)
					form.render();					  
				}else if(p_dict[id]['Positioning']==13){
					//关闭
					var str_html=""
					$("#from_Interactive_1").html(str_html)
					form.render();
				}else{
					var str_html=""
						str_html+='<div class="layui-form-item" style="margin-top: 15px;">'
						str_html+='	<label class="layui-form-label">元素</label>'
						str_html+='	<div class="layui-input-block">'
						str_html+='	  <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入元素" lay-reqtext="岂能为空？" class="layui-input">'
						str_html+='	</div>'
						str_html+='</div>'
						str_html+='<label class="layui-form-label">操作方式</label>'
						str_html+='<div class="layui-input-block"  lay-reqtext="岂能为空？">'
						str_html+='  <select name="interest" lay-filter="companyList">'
						str_html+='	<option value="0" selected="">左键点击</option>'
						str_html+='	<option value="2">输入内容</option>'
						str_html+='	<option value="3">获取div内容</option>'
						str_html+='	<option value="5">双击</option>'
						str_html+='	<option value="6">长按</option>'
						str_html+='	<option value="9">获取坐标</option>'
						str_html+='  </select>'
						str_html+='</div>'
						str_html+='<div id="from_Interactive_2">'
						str_html+='</div>'
						$("#from_Interactive_1").html(str_html)
						form.render();
				}
				if(p_dict[id]['interest']==2){
					var str_html=''		
					str_html+='<div class="layui-form-item" style="display:flex;margin-top: 15px;">'
					str_html+='	<label class="layui-form-label" style="text-align: right;">参数</label>'
					str_html+='	<div style="margin-left: 8.5px;" class="layui-input-block">'
					str_html+='		<input style="margin-left:-8px;" type="text" name="data" lay-verify="title" autocomplete="off" placeholder="请输入参数" class="layui-input"  lay-reqtext="岂能为空？">'
					str_html+='	</div>'
					str_html+='	<div style="margin-left:9px">'
					str_html+='		<button id="del_but" style="margin-top:3px;" type="button" class="layui-btn layui-btn-primary layui-btn-sm">'
					str_html+='			<i class="layui-icon"></i>'
					str_html+='		</button>'
					str_html+='	</div>'
					str_html+='</div>'
					str_html+='	<div class="app_but">'
					str_html+='		<button id="add_p" type="button" class="layui-btn layui-btn-primary layui-btn-fluid">添加参数</button>'
					str_html+='	</div>'
					$("#from_Interactive_2").html(str_html)
					form.render();
					//表单赋值
					form.val('feil', p_dict[id]);
				}else{
					form.val('feil', p_dict[id]);
				}
			}
		}
	})


	$("#save").click(function(){//保存每个定位数据

		//保存的时候先去拿id  没有的话就新增

		console.log($("#positionid").val(),'--------------',new Date().getTime())
		if($("#positionid").val()=='null'){
			console.log("什么情况什么情况")
			positionid=new Date().getTime()
			$("#positionid").val(positionid)
		}else{
			positionid=$("#positionid").val()
		}

		var e_data = form.val('example_dw');

		console.log(e_data,'xxxxxsssss')
		var id=e_data['path_name']
		if (e_data['Positioning']==8){
			//js注入时添加js内容
			e_data['js']=editor.getSession().getValue()
		}else if(e_data['Positioning']==9){
			//切换ifame
			console.log(e_data)
		}else if(e_data['Positioning']==10){
			//鼠标拖动
			var winW = window.screen.width;
			var winH = window.screen.height;
			e_data["winW"]=winW;
			e_data["winH"] =winH;
		}else if(e_data['Positioning']==11){
			//python
			e_data['py']=editor.getSession().getValue()
		}

		// e_data['sleep_time']=sleep_time
		
		for (var val in e_data){
			if(e_data[val]=='' || e_data[val]==null){		
				return 1
			}
		}
		p_dict[positionid]=e_data//保存到p_dict
		// p_dict[id]=e_data//保存到p_dict

		var list_tab=[]
		// for (var i=0;i<$(".tab_path").length;i++){
		// 	// list_tab.push($(".tab_path").eq(i).text())
		// 	list_tab.push($(".tab_path").eq(i).attr('id'))

		// }
		$(".tab_path").each(function(){
			// alert($(this).text())
			list_tab.push($(this).parent().attr("id"))
		});

		console.log(list_tab,'list_tablist_tab')
		// if (list_tab.indexOf(id)<0){//列表中有这个id就不追加
		if (list_tab.indexOf(positionid)<0){//列表中有这个id就不追加

			$("#sortable").append(
				'<li id='+positionid+' class="ui-state-default ui-sortable-handle"><div class="tab_path" style="line-height: 17px;width:152px;display:inline-block;">'+ id +'</div><i id="position_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;display:inline-block;"></i></li>'
			)
		}else{
			$("#"+positionid).children('div').text(id)
			layer.msg('编辑成功')
		}

		//	数据没改到

	})
	
	$("#xpath_add").click(function(){//点击新增
		$("#positionid").val('null')//新增的时候搞成null
		var str_html=""
		str_html+='	  <div class="layui-form-item">'
		str_html+='		<label class="layui-form-label">定位名称</label>'
		str_html+='		<div class="layui-input-block">'
		str_html+='		  <input type="text" name="path_name" lay-verify="title" autocomplete="off" placeholder="定位名称" lay-reqtext="岂能为空？" class="layui-input">'
		str_html+='		</div>'
		str_html+='	  </div>'
		str_html+='	  <div class="layui-form-item">'
		str_html+='		<label class="layui-form-label">等待时间</label>'
		str_html+='		<div class="layui-input-block">'
		str_html+='		  <input type="text" value="1" name="sleep_time" lay-verify="title" autocomplete="off" placeholder="等待时间默认为秒" lay-reqtext="岂能为空？" class="layui-input">'
		str_html+='		</div>'
		str_html+='	  </div>'
		str_html+='	<label class="layui-form-label">定位方式</label>'
		str_html+='		<div class="layui-input-block"  lay-reqtext="岂能为空？">'
		str_html+='		  <select name="Positioning" lay-filter="aihao">'
		str_html+='			<option value="0" selected="">querySelector</option>'
		str_html+='			<option value="10">鼠标拖动</option>'
		str_html+='			<option value="11">python脚本</option>'
		str_html+='			<option value="12">打开url</option>'
		str_html+='			<option value="13">关闭</option>'
		str_html+='		  </select>'
		str_html+='		</div>'
		str_html+='		<div id="from_Interactive_1">'
		str_html+='			<div class="layui-form-item" style="margin-top: 15px;">'
		str_html+='				<label class="layui-form-label">元素</label>'
		str_html+='				<div class="layui-input-block">'
		str_html+='				  <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入元素" lay-reqtext="岂能为空？" class="layui-input">'
		str_html+='				</div>'
		str_html+='			</div>'
		str_html+='			<label class="layui-form-label">操作方式</label>'
		str_html+='			<div class="layui-input-block"  lay-reqtext="岂能为空？">'
		str_html+='			  <select name="interest" lay-filter="companyList">'
		str_html+='				<option value="0" selected="">左键点击</option>'
		str_html+='				<option value="2">输入内容</option>'
		str_html+='				<option value="3">获取div内容</option>'
		str_html+='				<option value="5">双击</option>'
		str_html+='				<option value="6">长按</option>'
		str_html+='	            <option value="9">获取坐标</option>'
		str_html+='			  </select>'
		str_html+='			</div>'
		str_html+='			<div id="from_Interactive_2">'
		str_html+='			</div>'
		str_html+='		</div>'
		$("#add_path").html(str_html)
		form.render();
	})
	
	$("#Save_node").click(function(){//保存节点数据
		var id = localStorage.getItem("edit_id")
		var list_tab=[]

		// for (var i=0;i<$(".tab_path").length;i++){
		// 	list_tab.push($(".tab_path").eq(i).text())
		// }

		console.log($("#sortable").children('li').length,'-------------------------')
		if ($("#sortable").children('li').length==0){
			layer.msg('数据不能为空')
			return
		}

		$(".tab_path").each(function(){
			// alert($(this).text())
			list_tab.push($(this).parent().attr("id"))
		});


		console.log(p_dict,'xxxxxxxsssssss',list_tab)

		var Node_val = new Object()
		Node_val[id]=p_dict
		Node_val[id+'_Sort']=list_tab
		Node_val[id+'_Workflow_name']=$('#myP').text()
		$.ajax({//节点保存到redis
			url:"/AddNode/",
			type:"POST",                    
			data:{
				'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
				'nodeid':id,
				"Workflow_name":$('#myP').text(),
				'nodejson':JSON.stringify(Node_val),
				'nodetype':"position",
			},
			success:function (data) {
				console.log("成功",data);	
				localStorage.setItem('savestatus',true);
				parent.add_nodename(id,$('#myP').text())//添加节点名称到节点标签
			},
			error:function (data) {
				console.log("失败",data);
			}	   
		})			
		$(".popping-box-wrap", parent.document).hide(500);
	})
			
	//添加参数
	$(document).on("click",'#add_p',function(){
		var int_i=Math.random().toString(36).slice(-6);
		var str_html=''		
			str_html+='<div class="layui-form-item" style="display:flex;margin-top: 15px;">'
			str_html+='	<label class="layui-form-label" style="text-align: right;">参数</label>'
			str_html+='	<div style="margin-left: 8.5px;" class="layui-input-block">'
			str_html+='		<input style="margin-left:-8px;" type="text" name="data" lay-verify="title" autocomplete="off" placeholder="请输入参数" class="layui-input"  lay-reqtext="岂能为空？">'
			str_html+='	</div>'
			str_html+='	<div style="margin-left:9px">'
			str_html+='		<button id="del_but" style="margin-top:3px;" type="button" class="layui-btn layui-btn-primary layui-btn-sm">'
			str_html+='			<i class="layui-icon"></i>'
			str_html+='		</button>'
			str_html+='	</div>'
			str_html+='</div>'
			str_html+='	<div class="app_but">'
			str_html+='		<button id="add_p" type="button" class="layui-btn layui-btn-primary layui-btn-fluid">添加参数</button>'
			str_html+='	</div>'
			$("#from_Interactive_2").html(str_html)
	})

	$(document).on("click",'#del_but',function(){
		$(this).parents(".layui-form-item").remove();
	})
	
	form.on('select(aihao)', function(e_data){		
		if(e_data.value==8){
			//js注入
			var str_html=""
			str_html+='<div id="editor" style="width:515px;min-height:300px;margin:15px -21px 0px 110px;;">'
			str_html+='</div>'
			$("#from_Interactive_1").html(str_html)
			editor = ace.edit("editor");
			editor.setTheme("ace/theme/monokai");
			editor.session.setMode("ace/mode/javascript");
			form.render();
		}else if(e_data.value==9){
			//切换iframe
			var str_html=""
				str_html+='<div class="layui-form-item" style="margin-top: 15px;">'
				str_html+='	<label class="layui-form-label">元素</label>'
				str_html+='	<div class="layui-input-block">'
				str_html+='	  <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="输入ifame标签的id,name,或者index" lay-reqtext="岂能为空？" class="layui-input">'
				str_html+='	</div>'
				str_html+='</div>'
			$("#from_Interactive_1").html(str_html)
			form.render();
		}else if(e_data.value==10){
			//鼠标拖动
				var str_html=""
				str_html+='<div style="display: flex;margin-top:15px;">'
				str_html+='<div class="layui-form-item">'
				str_html+='	<div class="layui-inline">'
				str_html+='	  <label class="layui-form-label">起始</label>'
				str_html+='	  <div class="layui-input-inline" style="width: 80px;">'
				str_html+='		<input type="text" name="Start_width" placeholder="x坐标" autocomplete="off" class="layui-input">'
				str_html+='	  </div>'
				str_html+='	  <div class="layui-form-mid">-</div>'
				str_html+='	  <div class="layui-input-inline" style="width: 80px;">'
				str_html+='		<input type="text" name="Start_height" placeholder="y坐标" autocomplete="off" class="layui-input">'
				str_html+='	  </div>'
				str_html+='	</div>'
				str_html+='  </div>'
				str_html+='  <div class="layui-form-item">'
				str_html+='	<div class="layui-inline">'
				str_html+='	  <label class="layui-form-label" style="width:40px">目标</label>'
				str_html+='	  <div class="layui-input-inline" style="width: 80px;">'
				str_html+='		<input type="text" name="end_width" placeholder="x坐标" autocomplete="off" class="layui-input">'
				str_html+='	  </div>'
				str_html+='	  <div class="layui-form-mid">-</div>'
				str_html+='	  <div class="layui-input-inline" style="width: 80px;">'
				str_html+='		<input type="text" name="end_height" placeholder="y坐标" autocomplete="off" class="layui-input">'
				str_html+='	  </div>'
				str_html+='	</div>'
				str_html+='  </div>'				
				str_html+='  </div>'				
				$("#from_Interactive_1").html(str_html)
				form.render();
			
		}else if(e_data.value==11){
			//py注入
			var str_html=""
			str_html+='<div id="editor" style="width:515px;min-height:300px;margin:15px -21px 0px 110px;;">'
			str_html+='</div>'
			$("#from_Interactive_1").html(str_html)
			editor = ace.edit("editor");
			editor.setTheme("ace/theme/monokai");
			editor.session.setMode("ace/mode/python");
			form.render();
		}else if(e_data.value==12){
			//url
			console.log(e_data.value); //得到被选中的值             
			var str_html=""
				str_html+='<div class="layui-form-item" style="margin-top: 15px;">'
				str_html+='	<label class="layui-form-label">url</label>'
				str_html+='	<div class="layui-input-block">'
				str_html+='	  <input type="text" name="url" lay-verify="title" autocomplete="off" placeholder="输入url" lay-reqtext="岂能为空？" class="layui-input">'
				str_html+='	</div>'
				str_html+='</div>'
			$("#from_Interactive_1").html(str_html)
			form.render();
		}else if(e_data.value==13){
			//关闭
			var str_html=""
			$("#from_Interactive_1").html(str_html)
			form.render();
		}else{
			var str_html=""
				str_html+='<div class="layui-form-item" style="margin-top: 15px;">'
				str_html+='	<label class="layui-form-label">元素</label>'
				str_html+='	<div class="layui-input-block">'
				str_html+='	  <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入元素" lay-reqtext="岂能为空？" class="layui-input">'
				str_html+='	</div>'
				str_html+='</div>'
				str_html+='<label class="layui-form-label">操作方式</label>'
				str_html+='<div class="layui-input-block"  lay-reqtext="岂能为空？">'
				str_html+='  <select name="interest" lay-filter="companyList">'
				str_html+='	<option value="0" selected="">左键点击</option>'
				str_html+='	<option value="2">输入内容</option>'
				str_html+='	<option value="3">获取div内容</option>'
				str_html+='	<option value="5">双击</option>'
				str_html+='	<option value="6">长按</option>'
				str_html+='	<option value="9">获取坐标</option>'
				str_html+='  </select>'
				str_html+='</div>'
				str_html+='<div id="from_Interactive_2">'
				str_html+='</div>'
				$("#from_Interactive_1").html(str_html)
				form.render();
		}
	});

	form.on('select(companyList)', function(e_data){
		//为输入时弹参数输入框
		if(e_data.value==2){
			var str_html=""
			str_html+='	<div class="app_but">'
			str_html+='		<button id="add_p" type="button" class="layui-btn layui-btn-primary layui-btn-fluid">添加参数</button>'
			str_html+='	</div>'
			$("#from_Interactive_2").html(str_html)
			form.render();
		}else{
			var str_html=""
			$("#from_Interactive_2").html(str_html)
			form.render();
		}			
	})

	$(document).on("click",'#position_del',function(){
		//删除定位元素
		var pval=$(this).prev().text()
		console.log(p_dict,'删除删除',pval)
		delete p_dict[pval]
		$(this).parent().remove()
	});
})