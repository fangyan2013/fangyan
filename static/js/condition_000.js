
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


layui.use(['form', 'layedit', 'laydate'], function(){
    var form = layui.form
    ,layer = layui.layer
    ,layedit = layui.layedit
    ,laydate = layui.laydate;
	var source_id=parent.Upper_endpoint_id
	// var edit_id = localStorage.getItem("edit_id")
	var edit_id = 'condition'+parent.Lower_endpoint_id
	console.log(edit_id,'edit_idedit_idedit_id')
	$.ajax({//查询上一个判断节点的数据
		url:"/GetNode/",
		type:"POST",                    
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			'nodeid':source_id,
		},
		success:function (data) {
			if (data.code==302){
				$(location).attr("href", "/login/");
			}

			PositionVal=JSON.parse(data['data'])
			nodejson=JSON.parse(PositionVal['nodejson'])
			Judgment_node=nodejson[source_id]['Judgment_node']
			str_html=""
			for(var i in Judgment_node){
				str_html+='		 <div style="display:flex;">'
				str_html+='		    <div class="node_name">'
				if (i.length>10){
					str_html+='				<font id='+i+'>'+ i.slice(0, 10)+'...' +'</font>'
				}else{
					str_html+='				<font id='+i+'>'+ i +'</font>'
				}
				str_html+='			</div>'
				str_html+='			<div class="layui-input-block">'
				if(PositionVal['nodejson']== edit_id){
					if(list_id.indexOf(i) > -1){
						str_html+='             <input type="checkbox" checked="" name="'+i+'" lay-skin="switch" lay-filter="switchTest" lay-text="ON|OFF">'
					}else{
						str_html+='				<input type="checkbox"  name="'+i+'" lay-skin="switch" lay-text="ON|OFF">'
					}
				}else{
					str_html+='				<input type="checkbox"  name="'+i+'" lay-skin="switch" lay-text="ON|OFF">'
				}
				str_html+='			</div>'
				str_html+='	    </div>'
			}
			$("#container").html(str_html)
			form.render()
			$.ajax({//查询节点数据
				url:"/GetNode/",
				type:"POST",                    
				data:{
					'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
					'nodeid':edit_id,
				},
				success:function (data) {
					if (data.code==302){
						$(location).attr("href", "/login/");
					}
					PositionVal=JSON.parse(data['data'])
					if (PositionVal != null){
						// {11: 'on'}
						echo={}
						PositionVal=JSON.parse(PositionVal['nodejson'])
						$('#myP').text(PositionVal['Workflow_name'])
						for (var e_status in PositionVal['data']){
							if(PositionVal['data'][e_status]['status'] == "on"){//这里有问题					
								echo[PositionVal['data'][e_status]['title']]=true
							}else{
								echo[PositionVal['data'][e_status]['title']]=false
							}
						}
						form.val('switchGoodsID', echo);
					}
				},
				error:function (data) {
					console.log("失败",data);
				}
			})
		},
		error:function (data) {
			console.log("失败",data);
		}
	})


    $('#Save_node').click(function(){
		//保存分支节点所有数据
		var data = form.val('switchGoodsID');
		for (var n_key=0;n_key<$('.node_name').length;n_key++){
			var keys=$('.node_name').eq(n_key).children('font').eq(0).html()
			if (! data.hasOwnProperty(keys)){
				data[keys]="OFF"
			}
		}
		list_data=[]
		for(var keys in data){
			list_data.push({
				"title":keys,
				"status":data[keys]			
			})
		}
        condition_json={}
		condition_json["nodeid"]=edit_id
		condition_json["Workflow_name"]=$('#myP').text()
		condition_json["data"]=list_data
		condition_json["Lower_endpoint_id"]=parent.Lower_endpoint_id
		condition_json["Upper_endpoint_id"]=parent.Upper_endpoint_id
		$.ajax({//节点保存到redis
			url:"/AddNode/",
			type:"POST",                    
			data:{
				'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
				"Workflow_name":$('#myP').text(),
				'nodeid':edit_id,
				'nodejson':JSON.stringify(condition_json),
				'nodetype':"condition",
			},
			success:function (data) {
				if (data.code==302){
					$(location).attr("href", "/login/");
				}
				parent.add_nodename(localStorage.getItem("edit_id"),$('#myP').text())//添加节点名称到节点标签
				localStorage.setItem('savestatus',true);
				$(".popping-box-wrap", parent.document).hide(500);
			},
			error:function (data) {
				console.log("失败",data);
			}	   
		})
    })
});


layui.use(['form', 'layedit', 'laydate','dropdown'], function(){
    var form = layui.form
    ,layer = layui.layer
	//悬停展示
	var  tip_index;
	$("font").hover(function(){
		if ($(this).attr("id").length<10){
			return
		}else{
			tips_index = layer.tips($(this).attr("id"),this,{time:0});
		}
	},function(){
		layer.close(tips_index);
	});
});