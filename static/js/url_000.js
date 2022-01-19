var api_node = localStorage.getItem('api_node');//新增的时候初始化缓存
var rpa_node = localStorage.getItem('rpa_node');//新增的时候初始化缓存
var sql_node = localStorage.getItem('sql_node');//新增的时候初始化缓存

var w_name={}
if (api_node !='None'){
	var api_node = JSON.parse(api_node)
	for (var api_node_key in api_node){
		w_name[api_node_key]=api_node[api_node_key]['Workflow_name'].replace(/^\s*|\s*$/g,"");
	}
}

if (rpa_node !='None'){
	var rpa_node = JSON.parse(rpa_node)
	for (var rpa_node_key in rpa_node){
		w_name[rpa_node_key]=rpa_node[rpa_node_key]['Workflow_name'].replace(/^\s*|\s*$/g,"");
	}
}

if (sql_node !='None'){
	var sql_node = JSON.parse(sql_node)
	for (var sql_node_key in sql_node){
		w_name[sql_node_key]=sql_node[sql_node_key]['Workflow_name'].replace(/^\s*|\s*$/g,"");
	}
}



var edit_id = localStorage.getItem("edit_id")
var api_node = localStorage.getItem("api_node")

var l_data = localStorage.getItem("list_data")
if (l_data!='None'){
	var list_data=JSON.parse(l_data)
}else{
	var list_data={}
}

var Ginseng = localStorage.getItem("Ginseng")
console.log('Ginseng',Ginseng)
if (Ginseng!='None'){
	console.log(JSON.parse(Ginseng),'11111111122222333333333',edit_id)
	if (JSON.parse(Ginseng).hasOwnProperty(edit_id)){
		var list_quote=JSON.parse(Ginseng)[edit_id]
	}else{
		var list_quote=[]
	}
	var dict_quote=JSON.parse(Ginseng)
}else{
	var list_quote=[]
	var dict_quote={}
}



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









if(api_node != 'None'){
    //回显
	console.log(api_node)
    api_node=JSON.parse(api_node)
    console.log(api_node.hasOwnProperty(edit_id),'放电影---------------------------',edit_id)

    
    if (api_node.hasOwnProperty(edit_id)){
    
        api_node[edit_id]['table_body']
        console.log(api_node[edit_id]['table_body'],'body字符串-----')
        
        
        var strhtml=''
        strhtml+=	'<tr>'
        strhtml+=	'<th></th>'
        strhtml+=	'<th>key</th>'
        strhtml+=	'<th>value</th>'
        strhtml+=	'<th>DESCRIPTION</th>'
        strhtml+=	'</tr>'
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
        $('#body').children('tbody').html(strhtml)

        
        var strhtml=''
        strhtml+=	'<tr>'
        strhtml+=	'<th></th>'
        strhtml+=	'<th>key</th>'
        strhtml+=	'<th>value</th>'
        strhtml+=	'<th>DESCRIPTION</th>'
        strhtml+=	'</tr>'
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
        $('#head').children('tbody').html(strhtml)

        
        $('#myP').html(api_node[edit_id]['Workflow_name'])
        
        $('#url').val(api_node[edit_id]['url'])
        
        editor_h.getSession().setValue(api_node[edit_id]['json_head'])
        editor.getSession().setValue(api_node[edit_id]['json_body'])
        
        
		var Ginseng = JSON.parse(localStorage.getItem("Ginseng"))			
		console.log(Ginseng,'-----------',edit_id)
		
		if (Ginseng.hasOwnProperty(edit_id)){
		
			for (const Ginseng_i of Ginseng[edit_id]) {//回显当前节点的出参
				html_str=''
				html_str+='    <div  class="tab_but">'
				html_str+='        <div class="tab_but_div">'
				
				if (Ginseng_i['title'].length>4){
					html_str+='            <font class="tab_but_a" id='+ Ginseng_i['title'] +'>'+ Ginseng_i['title'].slice(0, 3)+'...' +'</font>'
				}else{
					html_str+='            <font class="tab_but_a" id='+ Ginseng_i['title'] +'>'+ Ginseng_i['title'] +'</font>'
				}
					
				//html_str+='            <font class="tab_but_a">'+ Ginseng_i['title'] +'</font>'
				html_str+='        </div>'
				html_str+='        <i id="tab_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;"></i>'
				html_str+='    </div>'
				$("#tab_1").append(html_str);
				console.log(list_quote,'高产',Ginseng_i)
				//list_quote.push(Ginseng_i)
			}
		}
		
        
        $(".head_tap").data('status',api_node[edit_id]['head_status'])
        $(".body_tap").data('status',api_node[edit_id]['body_status'])
        
        console.log(api_node[edit_id]['type'],api_node[edit_id]['head_status'],'------------11122111------------',$('.layui-select-title').children('input'))
        $('li[data-status="'+api_node[edit_id]['head_status']+'"]').click()//回显状态
        $('li[data-status="'+api_node[edit_id]['body_status']+'"]').click()//回显状态
		
		
        $("select[name='modules']").val(api_node[edit_id]['type']);

    }
}



function url_data(){
    //获取数据
    var tr_val=$("#body").find(".addchar")
    var data=[]//表格body
    for (var i =0;i<tr_val.length;i++){
        //tr_val[i].getElementsByTagName('td')
        
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

    var edit_id = localStorage.getItem("edit_id")	


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
	
	
	
	for (var w_name_id in w_name){
		console.log(w_name_id,'w_name_id',$('#myP').text())
		
		
		var api_node = localStorage.getItem("api_node")
		console.log(api_node,'json字符串-----')

		if(api_node!='None'){
			api_node=JSON.parse(api_node)
			var edit_id = localStorage.getItem("edit_id")
			if (api_node.hasOwnProperty(edit_id)){
				if (api_node[edit_id]['Workflow_name'].replace(/^\s*|\s*$/g,"")!=$('#myP').text().replace(/^\s*|\s*$/g,"")){
					if (w_name[w_name_id]==$('#myP').text().replace(/^\s*|\s*$/g,"")){
						layer.msg('节点重名')
						return
					}
				}
			}else{
				if (w_name[w_name_id]==$('#myP').text().replace(/^\s*|\s*$/g,"")){
					layer.msg('节点重名')
					return
				}
			}
			console.log(api_node,'是不是走了sql节点')
		}
	
	}
	
	
	
	
	
    var edit_id = localStorage.getItem("edit_id")
    var api_node = localStorage.getItem("api_node")
    var Ginseng = localStorage.getItem("Ginseng")
    console.log(api_node,'json字符串-----',$('#url').val(),'加提示')
	
	if ($('#url').val()===''){//url非空
		layer.msg('url不能空'); 
		return
	}else if($('#myP').text()===''){//工作流名称非空
		layer.msg('节点名称不能空'); 
		return
	}

    if(api_node!='None'){
        //新增
        api_node=JSON.parse(api_node)
		for (name in api_node){
			if(api_node[name]['Workflow_name']===$('#myP').text()){
				layer.msg('节点名称唯一');
			}
		}
	}

	
	
	
    if(Ginseng=='None'){
        //新增
        //localStorage.setItem('Ginseng',JSON.stringify(url_data()));
		dict_quote[edit_id]=list_quote
		localStorage.setItem('Ginseng',JSON.stringify(dict_quote));//节点出参保存


    }else{
        //多个节点时新增/编辑
        Ginseng=JSON.parse(Ginseng)
        Ginseng[edit_id]=list_quote
        localStorage.setItem('Ginseng',JSON.stringify(Ginseng))
    }
		
		
	console.log(list_data,'节点保存的数据')
	
	localStorage.setItem('list_data',JSON.stringify(list_data));//节点出参保存


    if(api_node=='None'){
        //新增
        localStorage.setItem('api_node',JSON.stringify(url_data()));
    }else{
        //多个节点时新增/编辑
		console.log(api_node,'解析报错')
        //api_node=JSON.parse(api_node)//到底要转对象否?
		if (typeof(api_node)=='string'){
			api_node=JSON.parse(api_node)
		}
        api_node[edit_id]=url_data()[edit_id]
        localStorage.setItem('api_node',JSON.stringify(api_node))
    }
    //currentWebview.hide(500);
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
		   //console.log('失败',data)
	   }
	});
}); 



$("#shut_down").click(function(){
    //关闭
    $(".popping-box-wrap", parent.document).hide(500);
});




function p_text() {
    //点击选择text
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
    $("t_f").html('file')
}

function p_file() {
    //点击选择file
    console.log('tttttttttttttttttttttttttttttttttt')
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
    console.log(t_id,'-----------')
    
    
    $(this).css({border:'1px solid #e6e6e6'})//光标所在元素位置
    var tr_index = $(this).parent().parent()//获取爷爷级元素
    console.log(tr_index,'cxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxcxccxcxc')
    
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
    console.log(this.scrollHeight,'--------2222222222222----------')
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
    console.log($(this).is(':checked'),'----------cccc2222cccc--------')

    if ($(this).is(':checked') ==false) {
        var val=$(this).parents("tr").find("td div")
        console.log(val,'----------vvvvvvvvvvvaaaaaaaaaaaaaaaaaaaarrrrrrrrrrrrrr--------')
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


