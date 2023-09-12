var edit_id = localStorage.getItem("edit_id")

var editor = ace.edit('editor');
editor.setOptions({
	enableBasicAutocompletion: true,
	enableSnippets: true,
	enableLiveAutocompletion: true
});
editor.setTheme("ace/theme/xcode");
editor.getSession().setMode("ace/mode/python")
editor.resize()

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

$.ajax({//查询python节点数据
	url:"/GetNode/",
	type:"POST",                    
	data:{
		'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		'nodeid':edit_id,
	},
	success:function (data) {
		console.log(JSON.parse(data.data),'妈的妈的')

		console.log(JSON.parse(data.data).nodejson,'妈的妈的')

		try {
			editor.getSession().setValue(JSON.parse(JSON.parse(data.data).nodejson))
		} catch(e) {
			editor.getSession().setValue(JSON.parse(data.data).nodejson)
		}
	},
	error:function (data) {
		console.log("失败",data);
	}
})



$("#save").click(function(){
    //保存	
    var edit_id = localStorage.getItem("edit_id")
	if ($('#url').val()===''){//url非空
		layer.msg('url不能空'); 
		return
	}else if($('#myP').text()===''){//工作流名称非空
		layer.msg('节点名称不能空'); 
		return
	}

    $.ajax({//节点保存到redis
        url:"/AddNode/",
        type:"POST",                    
        data:{
            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),		   
            'nodeid':edit_id,
            "Workflow_name":$('#myP').text(),
            'nodejson':editor.getValue(),
            'nodetype':"py3",
        },
        success:function (data) {
            localStorage.setItem('savestatus',true);
            parent.add_nodename(edit_id,$('#myP').text())//添加节点名称到节点标签
        },
        error:function (data) {
            console.log("失败",data);
        }	   
    })
    $(".popping-box-wrap", parent.document).hide(500);
});

$("#verification").click(function(){
	//测试
	$.ajax({
	   url:"/pyrun/",
	   type:"POST",                    
	   data:{
		   'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		   'data':editor.getValue(),
	   },
	   success:function (data) {
			console.log('成功',data,'成功人事达文西')
			str_html='           <div><pre><font style="font-size:15px;color:#444444">'+data.data+'</font></pre></div>'
			$("#Log_editor").html(str_html)
	   },
	   error:function (data) {
		   layer.msg("失败",data);
	   }
	});
}); 

$("#shut_down").click(function(){
    //关闭
    $(".popping-box-wrap", parent.document).hide(500);
});



$(".Top_border").hover(function(){
    $(".Log").css("border-top-color","#1E9FFF");
},function(){
    $(".Log").css("border-top-color","#e6e6e6");
});
    
$(document).ready(function(){
    //上下拖动
    $(".Top_border").mousedown(function(){
        var begin=event.pageY
        var h=$(".Log").height()
        var l_h=$(".list-div").height()
        $(document).mousemove(function(e){
            console.log(e.pageX + ", " + e.pageY)
            if(begin<e.pageY){
                if ($(".Log").height()<43){
                    $(document).unbind('mousemove')
                    return
                }else{
                    $(".Log").height(h-(e.pageY-begin))
                    $("#Log_editor").parent('div').height(h-(e.pageY-begin))
                    $(".list-div").height(l_h+(e.pageY-begin))
					$("#editor").height(l_h+(e.pageY-begin)-85)
                }
            }else if(begin>e.pageY){
                if ($(".Log").height()>270){
                    $(document).unbind('mousemove')
                    return
                }else{
                    $(".Log").height(h+(begin-e.pageY))
                    $("#Log_editor").parent('div').height(h+(begin-e.pageY))
                    $(".list-div").height(l_h-(begin-e.pageY))
					$("#editor").height(l_h+(e.pageY-begin)-85)
                }
            }
        });
    });
    $(".Top_border").mouseup(function(){
        $(document).unbind('mousemove')
    });
});


