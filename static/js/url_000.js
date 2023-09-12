var edit_id = localStorage.getItem("edit_id")
var head_status='head_table'
var body_status='body_table'
var editor = ace.edit("editor");
this.editor.setTheme('ace/theme/gob');
editor.session.setMode("ace/mode/javascript");
var editor_h = ace.edit("editor_h");
this.editor_h.setTheme('ace/theme/gob');
editor_h.session.setMode("ace/mode/javascript");
editor_h.resize()
var Log_editor = ace.edit("Log_editor");
this.Log_editor.setTheme('ace/theme/gob');
Log_editor.session.setMode("ace/mode/javascript");
Log_editor.setReadOnly(true);
Log_editor.resize()
Log_editor.setOption("wrap", "free")

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

$(".head_tap").click(function(){
    //切换请求头的图标
    $(this).children('i').attr('class','layui-icon layui-icon-radio')
    if($(this).index()==0){
        $(this).next().children('i').attr('class','layui-icon layui-icon-circle')
    }else{
        $(this).prev().children('i').attr('class','layui-icon layui-icon-circle')
    }
    head_status=$(this)[0].dataset['status']
})

$(".body_tap").click(function(){
    //切换请求参数的图标
    $(this).children('i').attr('class','layui-icon layui-icon-radio')
    if($(this).index()==0){
        $(this).next().children('i').attr('class','layui-icon layui-icon-circle')
    }else{
        $(this).prev().children('i').attr('class','layui-icon layui-icon-circle')
    }
    body_status=$(this)[0].dataset['status']
})

$(".a_tab").click(function(){
    //点击改变颜色
    $(this).children("font").css("color","#1E9FFF");
    if($(this).index()==0){
        $(this).siblings().eq(1).children("font").css("color","#999");
    }else{
        $(this).siblings().eq(0).children("font").css("color","#999");
    }
})

console.log(edit_id,'edit_idedit_idedit_id    zyu4ur')

$.ajax({//查询api节点数据
	url:"/GetNode/",
	type:"POST",                    
	data:{
		'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		'nodeid':edit_id,
	},
	success:function (data) {
		ApiVal=JSON.parse(data['data'])
        if (data['code']==400){
            return 
        }
        var api_node=JSON.parse(ApiVal['nodejson'])
        if (api_node.hasOwnProperty(edit_id)){
            api_node[edit_id]['table_body']
            var strhtml=''
            strhtml+=	'<tr>'
            strhtml+=	'<th></th>'
            strhtml+=	'<th>key</th>'
            strhtml+=	'<th>value</th>'
            strhtml+=	'<th>DESCRIPTION</th>'
            strhtml+=	'</tr>'
            if(api_node[edit_id]['table_body']){
                for (const body_v of api_node[edit_id]['table_body']) {
                    strhtml+='<tr class="addchar">'
                    strhtml+=	'<td>'
                    if (body_v['Disable']){
                        strhtml+=		'<input class=".dx" style="margin:10px" type="checkbox" name="age" value="18" checked="checked" />'
                    }else{
                        strhtml+=		'<input class=".dx" style="margin:10px" type="checkbox" name="age" value="18"/>'
                    }
                    strhtml+=	'</td>'
                    strhtml+=	'<td width="300px" height="100px" style="position: relative;" >'
                    strhtml+=		'<div style="z-index: 2;" class="tex" contenteditable placeholder="请输入文字">'+body_v['key']+'</div>'
                    strhtml+=		'<div style="position: absolute;z-index: 3;"  class="tab_value">'
                    strhtml+=			'<div style="margin-top: -9px;cursor:pointer;">'
                    strhtml+=				'<font style="font-size:15px;color:#a1a8ad;">'+body_v['status']+'</font>'
                    strhtml+=				'<i class="layui-icon layui-icon-down" style="color: #a1a8ad;font-size:15px;float: right;margin-left: 3px;"></i>'
                    strhtml+=			'</div>'
                    strhtml+=		'</div>'
                    strhtml+=		'<div class="F_T">'
                    strhtml+=			'<div>'
                    strhtml+=				'<font style="font-size:15px;color:#a1a8ad;">Text</font>'
                    strhtml+=			'</div>'
                    strhtml+=			'<div>'
                    strhtml+=				'<font style="font-size:15px;color:#a1a8ad;">File</font>'
                    strhtml+=			'</div>'
                    strhtml+=		'</div>'
                    strhtml+=	'</td>'
                    if (body_v['status']=="File"){
                        strhtml+=	'<td width="300px" height="100px"><input style="border:none;outline:medium;" type="file"></td>'
                    }else{
                        strhtml+=	'<td width="300px" height="100px"><div class="tex" contenteditable placeholder="请输入文字">'+body_v['value']+'</div></td>'
                    }
                    strhtml+=	'<td width="300px" height="100px" style="position: relative;"><div class="tex" contenteditable placeholder="请输入文字">'+body_v['DESCRIPTION']+'</div>'
                    strhtml+=		'<i id="del" class="layui-icon layui-icon-close" style="color: #a1a8ad;position: absolute;"></i>'
                    strhtml+=	'</td>'
                    strhtml+='</tr>'
                }
            }

            $('#body').children('tbody').html(strhtml)
            var strhtml=''
            strhtml+=	'<tr>'
            strhtml+=	'<th></th>'
            strhtml+=	'<th>key</th>'
            strhtml+=	'<th>value</th>'
            strhtml+=	'<th>DESCRIPTION</th>'
            strhtml+=	'</tr>'

            if(api_node[edit_id]['table_head']){
                for (const head_v of api_node[edit_id]['table_head']) {
                    strhtml+='<tr class="addchar">'
                    strhtml+=	'<td>'
                    if (head_v['Disable']){
                        strhtml+=		'<input class=".dx" style="margin:10px" type="checkbox" name="age" value="18" checked="checked" />'
                    }else{
                        strhtml+=		'<input class=".dx" style="margin:10px" type="checkbox" name="age" value="18"/>'
                    }
                    strhtml+=	'</td>'
                    strhtml+=	'<td width="300px" height="100px"><div class="tex" contenteditable placeholder="请输入文字">'+head_v['key']+'</div></td>'
                    strhtml+=	'<td width="300px" height="100px"><div class="tex" contenteditable placeholder="请输入文字">'+head_v['value']+'</div></td>'
                    strhtml+=	'<td width="300px" height="100px" style="position: relative;"><div class="tex" contenteditable placeholder="请输入文字">'+head_v['DESCRIPTION']+'</div>'
                    strhtml+=		'<i id="del" class="layui-icon layui-icon-close" style="color: #a1a8ad;position: absolute;"></i>'
                    strhtml+=	'</td>'
                    strhtml+='</tr>'
                }
            }

            $('#head').children('tbody').html(strhtml)
            $('#myP').html(api_node[edit_id]['Workflow_name'])
            $('#url').val(api_node[edit_id]['url'])
            editor_h.getSession().setValue(api_node[edit_id]['json_head'])
            editor.getSession().setValue(api_node[edit_id]['json_body'])        
            $(".head_tap").data('status',api_node[edit_id]['head_status'])
            $(".body_tap").data('status',api_node[edit_id]['body_status'])
            $('li[data-status="'+api_node[edit_id]['head_status']+'"]').click()//回显状态
            $('li[data-status="'+api_node[edit_id]['body_status']+'"]').click()//回显状态
            $("select[name='modules']").val(api_node[edit_id]['type']);
        }
	},
	error:function (data) {
		console.log("失败",data);
	}
})

function url_data(){
    //获取数据
    var tr_val=$("#body").find(".addchar")
    var data=[]//表格body
    for (var i =0;i<tr_val.length;i++){
        var Disable = tr_val[i].getElementsByTagName('td')[0].getElementsByTagName('input')[0]
        var data_key = tr_val[i].getElementsByTagName('td')[1].getElementsByTagName('div')[0].innerText
        var data_status = tr_val[i].getElementsByTagName('td')[1].getElementsByTagName('div')[1].getElementsByTagName('div')[0].getElementsByTagName('font')[0].innerText
        if (data_status=="File"){
            var data_value = tr_val[i].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value
        }else{
            var data_value = tr_val[i].getElementsByTagName('td')[2].getElementsByTagName('div')[0].innerText
        }
        var data_DESCRIPTION = tr_val[i].getElementsByTagName('td')[3].getElementsByTagName('div')[0].innerText
        data.push({
            'key':data_key,
            'value':data_value,
            'status':data_status,
            'DESCRIPTION':data_DESCRIPTION,
            'Disable':$(Disable).prop('checked'),
        })
    }
    var tr_val=$("#head").find(".addchar")
    var head=[]//表格head
    for (var i =0;i<tr_val.length;i++){
        var Disable = tr_val[i].getElementsByTagName('td')[0].getElementsByTagName('input')[0]
        var data_key = tr_val[i].getElementsByTagName('td')[1].getElementsByTagName('div')[0].innerText
        var data_value = tr_val[i].getElementsByTagName('td')[2].getElementsByTagName('div')[0].innerText
        var data_DESCRIPTION = tr_val[i].getElementsByTagName('td')[3].getElementsByTagName('div')[0].innerText
        head.push({
            'key':data_key,
            'value':data_value,
            'DESCRIPTION':data_DESCRIPTION,
            'Disable':$(Disable).prop('checked'),
        })
    }
    $('#myP').text()
    Request_data={}
    Request_data[edit_id]={
        "Workflow_name":$('#myP').text(),//工作流名称
        "type":$('.layui-select-title').children('input').val(),//请求类型
        "url":$('#url').val(),//请求url
        "table_head":head,//table类型的head
        "table_body":data,//table类型的body
        "json_head":editor_h.getValue(),//json类型的head
        "json_body":editor.getValue(),//json类型的body
        "Ginseng":list_quote,//节点出参
        "head_status":head_status,//head数据类型状态
        "body_status":body_status,//body数据类型状态
    }
    return Request_data
}

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
            'nodejson':JSON.stringify(url_data()),
            'nodetype':"api",
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
	   url:"/url_000_test/",
	   type:"POST",                    
	   data:{
		   'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		   'data':JSON.stringify(url_data()),
	   },
	   success:function (data) {
			console.log('成功',data,'成功人事达文西')
			Log_editor.getSession().setValue(data['data'])
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

function p_text() {
    //点击选择text
    $("t_f").html('file')
}

function p_file() {
    //点击选择file
    $("t_f").html('text')
}

$(document).on("click",'.tab_value',function(){//切换filex跟text
    $(this).next().show();
    $(document).on("click",'.F_T>div',function(){
        $(this).parent().prev().children("div").children("font").text($(this).text())
        $(this).parent().hide();
        if ($(this).children('font').html()=='File'){//切换value输入框中的内容
            str_html="<input style='border:none;outline:medium;' type='file'>"
            $(this).parents('td').nextAll()[0].innerHTML= str_html;
        }else{
            str_html="<div class='tex' contenteditable placeholder='请输入文字'></div>"
            $(this).parents('td').nextAll()[0].innerHTML= str_html;
        }
    });
    $(document).mouseup(function(e){//空白处点击关闭弹窗
      var _con = $(".F_T>div");   // 设置目标区域
      if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
          $(".F_T").hide();  // 功能代码
      }
    });
});

$(document).on("click",'.tex',function(){
    //点击显示边框
    var t_id = $(this).parents("table").attr("id")
    $(this).css({border:'1px solid #e6e6e6'})//光标所在元素位置
    var tr_index = $(this).parent().parent()//获取爷爷级元素    
    $(document).on("blur",this,function(){
        $(this).css("border","none");//隐藏边框
        $(this).css("height","23px");//改变行高		
        $('.tex').unbind('keyup')			
    });
    
    $(document).on("keyup",'.tex',function(e){
        if(tr_index.index() == tr_index.siblings('tr').length && $(this).text().length>0){
            //判断是否为最后一行,是则在下面新增一行
            var strhtml=''
            strhtml+='<tr class="addchar">'
            strhtml+=	'<td>'
            strhtml+=		'<input class=".dx" style="margin:10px" type="checkbox" name="age" value="18" checked="checked" />'
            strhtml+=	'</td>'
            if(t_id=='body'){
                strhtml+=	'<td width="300px" height="100px" style="position: relative;" >'
                strhtml+=		'<div style="z-index: 2;" class="tex" contenteditable placeholder="请输入文字"></div>'
                strhtml+=		'<div style="position: absolute;z-index: 3;"  class="tab_value">'
                strhtml+=			'<div style="margin-top: -9px;cursor:pointer;">'
                strhtml+=				'<font style="font-size:15px;color:#a1a8ad;">Text</font>'
                strhtml+=				'<i class="layui-icon layui-icon-down" style="color: #a1a8ad;font-size:15px;float: right;margin-left: 3px;"></i>'
                strhtml+=			'</div>'
                strhtml+=		'</div>'
                strhtml+=		'<div class="F_T">'
                strhtml+=			'<div>'
                strhtml+=				'<font style="font-size:15px;color:#a1a8ad;">Text</font>'
                strhtml+=			'</div>'
                strhtml+=			'<div>'
                strhtml+=				'<font style="font-size:15px;color:#a1a8ad;">File</font>'
                strhtml+=			'</div>'
                strhtml+=		'</div>'
                strhtml+=	'</td>'
            }else{
                strhtml+=	'<td width="300px" height="100px"><div class="tex" contenteditable placeholder="请输入文字"></div></td>'
            }
            strhtml+=	'<td width="300px" height="100px"><div class="tex" contenteditable placeholder="请输入文字"></div></td>'
            strhtml+=	'<td width="300px" height="100px" style="position: relative;"><div class="tex" contenteditable placeholder="请输入文字"></div>'
            strhtml+=		'<i id="del" class="layui-icon layui-icon-close" style="color: #a1a8ad;position: absolute;"></i>'
            strhtml+=	'</td>'
            strhtml+='</tr>'
            tr_index.parent().append(strhtml)
        }
        return
    })
})


$(document).ready(function(){
  //焦点改变class失去时改回来
  $("body").on("focus", ".tex", function() {
    $(this).css({"z-index":'9999'});
    $(this).css({"overflow-y":'hidden'});
    $(".mc").css('display','block');
    this.style.height = (this.scrollHeight) + 'px';
  });
  
  $("body").on("blur", ".tex", function() {
    $(this).css({"z-index":'0'});
    $(this).css({"overflow-y":'hidden'});
    $(".mc").css('display','none');
  });
});

$("body").on("mouseenter", ".addchar", function() {
    //悬停展示删除图标
    var index_h = $(this)
    var val_d=index_h.find('#del')
    var tr = document.getElementsByClassName('addchar');//数组
    var trlen = $(this).siblings('tr').length
    if (trlen>1){
        val_d.css({"display":"flex"})
    }	
});

$("body").on("mouseleave", ".addchar", function() {
    //悬停事件消失隐藏删除图标
    var index_h = $(this)
    var val_d=index_h.find('#del')
    val_d.css({"display":"none"})
});

$(document).on("click",'#del',function(){
    //点击删除删除标签,删除list中的元素
    $(this).parents("tr").remove()
})		

$(document).on("click",'input:checkbox',function(){
    //禁用输入框
    if ($(this).is(':checked') ==false) {
        var val=$(this).parents("tr").find("td div")
        $(this).parents("tr").css("background-color","#f6f8fb")
        $(this).parents("tr").css("color","#999")
    }else{
        var val=$(this).parents("tr").find("td div")
        val.css("background-color","#fff")
        $(this).parents("tr").css("background-color","#fff")
        $(this).parents("tr").css("color","#000000")
    }
});

function tab_status(starus) {
    //第一层tab切换
    if (starus==1){
        $("#url_head").css('display','none'); 
        $("#url_file").css('display','none'); 
        $("#url_body").css('display','block'); 
    }else if(starus==2){
        $("#url_head").css('display','block'); 
        $("#url_file").css('display','none'); 
        $("#url_body").css('display','none'); 
    }else if(starus==3){
        $("#url_head").css('display','none'); 
        $("#url_file").css('display','block'); 
        $("#url_body").css('display','none'); 
    }else{
         alert("呆!!哪来的tab")
    }
}


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
                }
            }else if(begin>e.pageY){
                if ($(".Log").height()>270){
                    $(document).unbind('mousemove')
                    return
                }else{
                    $(".Log").height(h+(begin-e.pageY))
                    $("#Log_editor").parent('div').height(h+(begin-e.pageY))
                    $(".list-div").height(l_h-(begin-e.pageY))
                }
            }
        });
    });
    $(".Top_border").mouseup(function(){
        $(document).unbind('mousemove')
    });
});


