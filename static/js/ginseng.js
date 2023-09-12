//-----------------------------------------出参---------------------------------------------
var edit_id = localStorage.getItem("edit_id")
var list_node = parent.list_node_obj(edit_id)//当前节点前的节点
var list_quote=[]
var list_Ginseng=[]
console.log('进入了ginseng')
$.ajax({//查询节点的变量回显当前新增节点
	url:"/GetGinseng/",
	type:"POST",                    
	data:{
		'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		'nodeid':'Ginseng'+edit_id,
	},
	success:function (data) {
		for (var Ginseng_i in data['data']){
			var form_data=JSON.parse(data['data'][Ginseng_i])
			var html_str=''
			html_str+='    <div  class="tab_but" id="'+Ginseng_i+'">'
			html_str+='        <div class="tab_but_div">'		
			if (form_data['ginseng_name'].length>4){
				html_str+='            <font id='+form_data['ginseng_name']+' class="tab_but_a">'+ form_data['ginseng_name'].slice(0, 3)+'...' +'</font>'
			}else{
				html_str+='            <font id='+form_data['ginseng_name']+' class="tab_but_a">'+ form_data['ginseng_name'] +'</font>'
			}
			html_str+='        </div>'
			html_str+='        <i id="tab_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;"></i>'
			html_str+='    </div>'
			$("#tab_1").append(html_str);
		}
	},
	error:function (data) {
		console.log("失败",data);
	}	   
})

for (var list_node_index in list_node){
	$.ajax({//查询节点的变量
		url:"/GetGinseng/",
		type:"POST",                    
		data:{
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			'nodeid':'Ginseng'+list_node[list_node_index],
		},
		success:function (data) {
			list_Ginseng.push(data['data'])//添加节点变量数据到dict用于回显
			for (var Ginseng_i in data['data']){
				var Ginsengval = data['data'][Ginseng_i]
				list_quote.push(Ginsengval['ginseng_name'])//添加节点名称到list里，后面用于做重名校验
				Ginsengval=JSON.parse(data['data'][Ginseng_i])
				html_str=''
				html_str+='    <div id="'+Ginseng_i+'" class="tab_but">'
				html_str+='        <div class="tab_but_div">'
				if (Ginsengval['ginseng_name'].length>4){
					html_str+='            <font id='+ Ginsengval['ginseng_name'] +' class="tab_but_a" style="pointer-events: none;">'+ Ginsengval['ginseng_name'].slice(0, 3)+'...' +'</font>'
				}else{
					html_str+='            <font id='+ Ginsengval['ginseng_name'] +' class="tab_but_a" style="pointer-events: none;">'+ Ginsengval['ginseng_name'] +'</font>'
				}
				html_str+='        </div>'
				html_str+='        <i id="tab_copy" data-id="'+Ginseng_i+'" data-title="'+ Ginsengval['ginseng_name'] +'" class="layui-icon layui-icon-list tab_copy" style="font-size: 16px; color: #000000;cursor:pointer;"></i>'
				html_str+='    </div>'
				$("#tab_2").append(html_str);
			}
		},
		error:function (data) {
			console.log("失败",data);
		}	   
	})
}

$(document).on("click",'.tab_copy',function(){//复制变量名
	//复制出参
	console.log('进入了出参复制')
	var id = $(this).data('id')
	var title = $(this).data('title')
	const input = document.createElement('input');
	input.setAttribute('readonly', 'readonly');
	input.setAttribute('value', "${__ginseng("+title+")}");
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
	$(document).on("click",'#site_add',function(){
		//添加出参
		$("#addGoodsForm")[0].reset();//清空表单
		layer.open({
			type: 1
			,title: '节点出参'
			,anim: 5
			,content: $("#test")
			,area: ['600px', '400px']
			,shade: [0.8, '#393D49']
			,btn: ['确定','取消']
			,yes: function(index, layero){
				var form_data = form.val('example');
				var tab_var=$(".tab_but_a")
				for (var l in tab_var){			
					if (tab_var.eq(l).attr("id")===form_data['title']){
						layer.msg('出参不能重名'); 
						return
					}
				}
				//一个节点有多个变量
				$.ajax({//出参保存到redis
					url:"/AddGinseng/",
					type:"POST",                    
					data:{
						'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
						'nodeid':edit_id,
						// "Workflow_name":$('#myP').text(),
						'ginseng':form_data['desc'],
						'ginseng_type':form_data['sex'],
						'ginseng_name':form_data['title'],
					},
					success:function (data) {
						localStorage.setItem('savestatus',true);
						html_str=''
						html_str+='    <div  class="tab_but" id="'+data['data']['Ginsengid']+'">'
						html_str+='        <div class="tab_but_div">'		
						if (form_data['title'].length>4){
							html_str+='            <font id='+form_data['title']+' class="tab_but_a">'+ form_data['title'].slice(0, 3)+'...' +'</font>'
						}else{
							html_str+='            <font id='+form_data['title']+' class="tab_but_a">'+ form_data['title'] +'</font>'
						}
						html_str+='        </div>'
						html_str+='        <i id="tab_del" class="layui-icon layui-icon-close" style="font-size: 3px; color: #1E9FFF;cursor:pointer;"></i>'
						html_str+='    </div>'
						$("#tab_1").append(html_str);
					},
					error:function (data) {
						console.log("失败",data);
					}	   
				})
				layer.closeAll();
			}
			,btn2: function(index, layero){
				layer.closeAll();
			}
		});
	});


	$(document).on("click",'.tab_but_a',function(e){
		//编辑出参	
		var Ginsengid = $(this).parent('div').parent('div').attr("id")
		var Ginsengthis = $(this)
		$("#addGoodsForm")[0].reset();//清空表单
		layer.open({
			type: 1
			,title: '节点出参'
			,anim: 5
			,content: $("#test")
			,area: ['600px', '400px']
			,shade: [0.8, '#393D49']
			,btn: ['确定','取消']
			,success: function(layero, index){
				//回显
				$.ajax({//查询出参数据
					url:"/GetGinsengValue/",
					type:"POST",                    
					data:{
						'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
						'nodeid':'Ginseng'+edit_id,
						'Ginsengid':Ginsengid,
					},
					success:function (data) {
						var ginsengval= JSON.parse(data['data'])
						form.val(//回显
							'example',
							{
								"title":ginsengval['ginseng_name'],
								"sex":ginsengval['ginseng_type'],
								"desc":ginsengval['ginseng'],
							}
						);

					},
					error:function (data) {
						console.log("失败",data);
					}	   
				})
			}
			,yes: function(index, layero){
				var form_data = form.val('example');
				$.ajax({//编辑变量
					url:"/UpdateGinsengValue/",
					type:"POST",                    
					data:{
						'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
						'nodeid':'Ginseng'+edit_id,
						'Ginsengid':Ginsengid,
						'ginseng':form_data['desc'],
						'ginseng_type':form_data['sex'],
						'ginseng_name':form_data['title'],

					},
					success:function (data) {
						localStorage.setItem('savestatus',true);
						Ginsengtile=data['data']['__value']['ginseng_name']
						$("#"+Ginsengid).children('div').children('font').attr('id',Ginsengtile)
						if (Ginsengtile.length>4){
							$("#"+Ginsengid).children('div').children('font').text(Ginsengtile.slice(0, 3)+'...')
							Ginsengthis.text(Ginsengtile.slice(0, 3)+'...')
						}else{
							$("#"+Ginsengid).children('div').children('font').text(Ginsengtile)
							Ginsengthis.text(Ginsengtile)
						}
					},
					error:function (data) {
						console.log("失败",data);
					}	   
				})
				layer.closeAll();
			}
			,btn2: function(index, layero){
				layer.closeAll();
			}
		});
	});

	$(document).on("click",'#tab_del',function(){
		//删除出参
		var Ginsengid = $(this).parent('div').attr("id")
		$.ajax({//删除出参
			url:"/DelGinseng/",
			type:"POST",                    
			data:{
				'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
				'nodeid':'Ginseng'+edit_id,
				'Ginsengid':Ginsengid
			},
			success:function (data) {
				localStorage.setItem('savestatus',true);
				list_quote.splice($(this).parent().index(),1)
				$(this).parent().remove()

			},
			error:function (data) {
				console.log("失败",data);
			}	   
		})
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

