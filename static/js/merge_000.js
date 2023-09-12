var edit_id = localStorage.getItem("edit_id")
var list_node = parent.list_node_sourceId(edit_id)//当前节点前的节点

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
    str_html=""
	console.log(list_node,'list_nodelist_node')

	for(var list_node_id in list_node){
		var nodenam = parent.get_nodename(list_node[list_node_id])//在节点标签中获取nodename
		$("div").data("greeting")
		str_html+='		 <div style="display:flex;" id="'+list_node[list_node_id]+'">'
		str_html+='		    <div class="node_name">'

		console.log(nodenam,'nodenamnodenam')
		if (nodenam.length>10){
			str_html+='				<font id='+nodenam+'>'+ nodenam.slice(0, 10)+'...' +'</font>'
		}else{
			str_html+='				<font id='+nodenam+'>'+ nodenam +'</font>'
		}
		str_html+='			</div>'
		str_html+='			<div class="layui-input-block">'	
		str_html+='				<input type="checkbox"  name="'+list_node[list_node_id]+'" lay-skin="switch" lay-text="ON|OFF">'
		str_html+='			</div>'
		str_html+='	    </div>'
	}
    $("#container").html(str_html)
	form.render()
    //保存节点数据
    $('#Save_node').click(function(){
		//保存分支节点所有数据
		var data = form.val('switchGoodsID');
		data["Workflow_name"]=$('#myP').text()
        merge_json={}
		merge_json[edit_id]=data
		$.ajax({//节点保存到redis
			url:"/AddNode/",
			type:"POST",                    
			data:{
				'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
				'nodeid':edit_id,
				"Workflow_name":$('#myP').text(),
				'nodejson':JSON.stringify(merge_json),
				'nodetype':"merge",
			},
			success:function (data) {
				parent.add_nodename(edit_id,$('#myP').text())//添加节点名称到节点标签
				localStorage.setItem('savestatus',true);
			},
			error:function (data) {
				console.log("失败",data);
			}
		})	
		$(".popping-box-wrap", parent.document).hide(500);
    })

	$.ajax({//查询定位节点数据
		url:"/GetNode/",
		type:"POST",          
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			'nodeid':edit_id,
		},
		success:function (data) {
			PositionVal=JSON.parse(data['data'])
			if (PositionVal){
				PositionVal=JSON.parse(PositionVal['nodejson'])
				p_dict = PositionVal[edit_id]
				form.val('switchGoodsID', p_dict);
				form.render();
			}
		},
		error:function (data) {
			console.log("失败",data);
		}
	})

	var  tip_index;
	$("font").hover(function(){
		tips_index = layer.tips($(this).attr("id"),this,{time:0});
	},function(){
		layer.close(tips_index);
	});
});