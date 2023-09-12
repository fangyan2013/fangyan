var edit_id = localStorage.getItem("edit_id")
// var WorkflowId = $(".WorkflowId").data("WorkflowId")
var WorkflowId = window.parent.$(".WorkflowId").data("WorkflowId")
var list_quote=[]
var list_node = parent.list_node_all()//所有节点id
console.log('进入了ginseng')
console.log('WorkflowId',WorkflowId)


// for (var list_node_index in list_node){
	$.ajax({//查询流程变量
		url:"/GetVariable/",
		type:"POST",                    
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			// 'nodeid':'Variable'+list_node[list_node_index],
			'nodeid':'Variable'+WorkflowId,
		},
		success:function (data) {
			console.log(data,'datadata')
			for (var Variable_i in data['data']){
				Variableval=JSON.parse(data['data'][Variable_i])
				html_str=''
				html_str+='	<div id="'+Variable_i+'" class="tab_but" style="position:relative;"> '
				html_str+='		<div class="tab_but_div data_updata" id="'+Variableval['Variablename']+'">'				
				if (Variableval['Variablename'].length>4){
					html_str+='			<font id='+Variableval['Variablename']+' style="line-height: 0px;margin-left:17px;">'+ Variableval['Variablename'].slice(0, 3)+'...' +'</font>'
				}else{
					html_str+='			<font id='+Variableval['Variablename']+' style="line-height: 0px;margin-left:17px;">'+Variableval['Variablename']+'</font>'
				}
				html_str+='		</div> '
				html_str+='		<i id="data_copy" data-key="'+Variableval['Variablename']+'" data-value="'+Variableval['Variablevalue']+'" class="layui-icon layui-icon-list data_copy" style="font-size: 16px; color: #000000;cursor:pointer;"></i>'
						
				html_str+='		<i id="data_del" data-key="'+Variableval['Variablename']+'" data-value="'+Variableval['Variablevalue']+'"  class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;position:absolute;top:-5px;left:3px;"></i>'
				html_str+='	</div>'
				$("#tab_data").append(html_str);
			}
		},
		error:function (data) {
			console.log("失败",data);
		}
	})
// }

$(document).on("click",'#add_data',function(){
	//添加变量
	var data_key = $("input[name='data_key']").val()
	var data_value = $("textarea[name='data_value']").val()

	
	// $("#tab_data").children('div').each(function(){
	// 	console.log($(this).attr("id"))
	// 	console.log($(this).children('div').children('font').text())
	// });


	$.ajax({//添加流程变量
		url:"/AddVariable/",
		type:"POST",                    
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			'nodeid':'Variable'+WorkflowId,
			'Variablename':data_key,
			'Variablevalue':data_value
		},
		success:function (data) {
			localStorage.setItem('savestatus',true);
			html_str=''
			html_str+='	<div id="'+data['data']['Variableid']+'" class="tab_but" style="position:relative;"> '
			html_str+='		<div class="tab_but_div data_updata" id="'+data_key+'">'
			if (data_key.length>4){
				html_str+='			<font id='+data_key+' style="line-height: 0px;margin-left:17px;">'+ data_key.slice(0, 3)+'...' +'</font>'
			}else{
				html_str+='			<font id='+data_key+' style="line-height: 0px;margin-left:17px;">'+data_key+'</font>'
			}
			html_str+='		</div> '
			html_str+='		<i id="data_copy" data-key="'+data_key+'" data-value="'+data_value+'" class="layui-icon layui-icon-list data_copy" style="font-size: 16px; color: #000000;cursor:pointer;"></i>'
			html_str+='		<i id="data_del" data-key="'+data_key+'" data-value="'+data_value+'"  class="layui-icon layui-icon-close data_del" style="font-size: 3px; color: #1E9FFF;cursor:pointer;position:absolute;top:-5px;left:3px;"></i>'
			html_str+='	</div>'
			$("#tab_data").append(html_str);
			$("input[name='data_key']").val('')
			$("textarea[name='data_value']").val('')
		},
		error:function (data) {
			console.log("失败",data);
		}	   
	})
})

$(document).on("click",'#data_del',function(){
    //删除变量
	var Variabid = $(this).parent('div').attr("id")
	$.ajax({//删除全局变量
		url:"/DelVariable/",
		type:"POST",
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			'nodeid':'Variable'+WorkflowId,
			'Variabid':Variabid
		},
		success:function (data) {
			localStorage.setItem('savestatus',true);
			console.log("成功删除",data);
		},
		error:function (data) {
			console.log("失败",data);
		}	   
	})
	$(this).parent().remove()
});

$(document).on("click",'.data_updata',function(){
    //编辑变量
    $('.tab_but').css({"border":"1px solid #c9c9c9"});
	$(this).parent('div').css({"border":"1px solid #1E9FFF"});
	var Variabid = $(this).parent('div').attr("id")
	$.ajax({//查询变量数据
		url:"/GetVariableValue/",
		type:"POST",                    
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			'nodeid':'Variable'+WorkflowId,
			'Variabid':Variabid,
		},
		success:function (data) {
			localStorage.setItem('savestatus',true);	
			var Variableval= JSON.parse(data['data'])
			console.log(Variableval,'VariablevalVariableval')
			$("textarea[name='data_value']").val(Variableval['Variablevalue'])
			$("input[name='data_key']").val(Variableval['Variablename'])
		},
		error:function (data) {
			console.log("失败",data);
		}	   
	})
});

$(document).on("click",'.data_copy',function(){//复制变量名
	//复制变量名
	var key = $(this).data('key')
	var value = $(this).data('value')
	const input = document.createElement('input');
	input.setAttribute('readonly', 'readonly');
	input.setAttribute('value', "${__data("+key+")}");
	document.body.appendChild(input);
	input.select();
	if (document.execCommand('copy')) {
		document.execCommand('copy');
		layer.msg('复制成功');
	}
	document.body.removeChild(input);
});
	

layui.use(['form','element','layedit', 'laydate','code'], function(){
	var element = layui.element;
	var form = layui.form;
	var layedit = layui.layedit;
	var laydate = layui.laydate;
	var layer = layui.layer;
	var code = layui.code;
	layui.code({
	title: 'Response',
	about: false,
	});
	$(document).on("click",'#tab_del',function(){
		localStorage.setItem('savestatus',true);
		//删除全局变量
		list_quote.splice($(this).parent().index(),1)
		console.log(list_quote,$(this).parent().index())
		$(this).parent().remove()
	});
	//悬停展示
	var  tip_index;
	$(document).on("hover",'.tab_but_div',function(){
		console.log('进入了悬停展示')
		tips_index = layer.tips($(this).children("font").attr("id"),this,{time:0});
	},function(){
		layer.close(tips_index);
	});
});