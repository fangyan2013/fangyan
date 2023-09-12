
var edit_id = localStorage.getItem("edit_id")
var editor = ace.edit("editor");
this.editor.setTheme('ace/theme/gob');
editor.session.setMode("ace/mode/sql");
editor.resize()

$.ajax({//查询sql节点数据
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
			PositionVal[edit_id].Workflow_name
			if(PositionVal.hasOwnProperty(edit_id)){
				//回显
				$('#myP').text(PositionVal[edit_id].Workflow_name)
				$('input[name="ip"]').val(PositionVal[edit_id].ip)
				$('input[name="port"]').val(PositionVal[edit_id].port)
				$('input[name="db"]').val(PositionVal[edit_id].db)
				$('input[name="username"]').val(PositionVal[edit_id].username)
				$('input[name="password"]').val(PositionVal[edit_id].password)
				editor.getSession().setValue(PositionVal[edit_id].editor_value)
			}
		}
	},
	error:function (data) {
		console.log("失败",data);
	}
})

$("#shut_down").click(function(){
	//关闭sql节点
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

//切换至连接时缩小宽高
$("#connect").click(function(){
	$(".sql_edit").css({"width":"460px","height":"430px"})
	$(".ul_head").css({"width":"460px"})
})

//切换至查询时放大宽高
$("#select").click(function(){
	$(".sql_edit").css({"width":"939px","height":"660px"})
	$(".ul_head").css({"width":"942px"})
})
 
$("#Connection_test").click(function(){
    //测试连接
	$.ajax({
	   url:"/mysql_000_connect/",
	   type:"POST",                    
	   data:{
		   'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		   "host":$('input[name="ip"]').val(),
		   "port":$('input[name="port"]').val(),
		   "db":$('input[name="db"]').val(),
		   "user":$('input[name="username"]').val(),
		   "passwd":$('input[name="password"]').val(),
	   },
	   success:function (data) {
			if (data.data){
				layer.msg('连接成功')
			}else{
				layer.msg('连接失败')
			}
	   },
	   error:function (data) {
		   console.log("失败",data.data);
	   }
	});
})

$("#sql_test").click(function(){
    //测试sql
	$.ajax({
	   url:"/mysql_000_test/",
	   type:"POST",                    
	   data:{
		   'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		   "host":$('input[name="ip"]').val(),
		   "port":$('input[name="port"]').val(),
		   "db":$('input[name="db"]').val(),
		   "user":$('input[name="username"]').val(),
		   "passwd":$('input[name="password"]').val(),
		   "str_sql":editor.getValue()
	   },
	   success:function (data) {
			if(data.code=="200"){
				var str_html=''
				str_html+='<table id="tb_3" cellspacing="0" cellpadding="2" width="100%" border="1">'
				str_html+='	<tbody>'
				str_html+='		<tr align="center" bgcolor="#dcdcdc">'
								for (var keys in data.data[0]){
									str_html+='<td>'+keys+'</td>'
								}
				str_html+='		</tr>'
								for (var len in data.data){
				str_html+='		<tr>'
									for (var values in data.data[len]){
										str_html+='<td>'+data.data[len][values]+'</td>'
									}
				str_html+='		</tr>'
								}
				str_html+='	</tbody>'
				str_html+='</table>'
				$("#t").html(str_html)
				table_width()
			}else if(data.code=="201"){
				$("#t").html(data.data)
			}else(
				console.log("不在里面??")
			)
	   },
	   error:function (data) {
		   console.log("失败",data.data);
	   }
	});	
})

$("#Save_node").click(function(){
    //点击保存	
	if ($('#myP').text()===''){//url非空
		layer.msg('节点名称不能空'); 
		return
	}else if($('input[name="ip"]').val()===''){//工作流名称非空
		layer.msg('ip不能空'); 
		return
	}else if($('input[name="port"]').val()===''){//工作流名称非空
		layer.msg('port不能空'); 
		return
	}else if($('input[name="db"]').val()===''){//工作流名称非空
		layer.msg('db不能空'); 
		return
	}else if($('input[name="username"]').val()===''){//工作流名称非空
		layer.msg('账号不能空'); 
		return
	}else if($('input[name="password"]').val()===''){//工作流名称非空
		layer.msg('密码不能空'); 
		return
	}else if(editor.getValue()===''){//工作流名称非空
		layer.msg('sql不能空'); 
		return
	}
    recording_val={
		"Workflow_name":$('#myP').text(),
		"ip":$('input[name="ip"]').val(),
		"port":$('input[name="port"]').val(),
		"db":$('input[name="db"]').val(),
		"username":$('input[name="username"]').val(),
		"password":$('input[name="password"]').val(),
		"editor_value":editor.getValue()
	}
    var edit_id = localStorage.getItem("edit_id")
	var recording_obj={}
	recording_obj[edit_id]=recording_val
	$.ajax({//节点保存到redis
        url:"/AddNode/",
        type:"POST",                    
        data:{
            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
            'nodeid':edit_id,
			"Workflow_name":$('#myP').text(),
            'nodejson':JSON.stringify(recording_obj),
            'nodetype':"sql",
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
});

function table_width(){
	//列表列宽缩放
	var tTD;      
	var table = document.getElementById("tb_3");
	for (j = 0; j < table.rows[0].cells.length; j++) {
		table.rows[0].cells[j].onmousedown = function () {
			tTD = this;
			if (event.offsetX > tTD.offsetWidth - 10) {
				tTD.mouseDown = true;
				tTD.oldX = event.x;
				tTD.oldWidth = tTD.offsetWidth;
			}
		};
		table.rows[0].cells[j].onmouseup = function () {
			if (tTD == undefined) tTD = this;
			tTD.mouseDown = false;
			tTD.style.cursor = 'default';
		};
		table.rows[0].cells[j].onmousemove = function () {
			if (event.offsetX > this.offsetWidth - 10)
				this.style.cursor = 'col-resize';
			else
				this.style.cursor = 'default';
			if (tTD == undefined) tTD = this;
			if (tTD.mouseDown != null && tTD.mouseDown == true) {
				tTD.style.cursor = 'default';
				if (tTD.oldWidth + (event.x - tTD.oldX) > 0)
					tTD.width = tTD.oldWidth + (event.x - tTD.oldX);
				tTD.style.width = tTD.width;
				tTD.style.cursor = 'col-resize';
				table = tTD;
				while (table.tagName != 'TABLE') table = table.parentElement;
				for (j = 0; j < table.rows.length; j++) {
					table.rows[j].cells[tTD.cellIndex].width = tTD.width;
				}
			}
		};
	}
}