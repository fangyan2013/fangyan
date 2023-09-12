
$("#log_Zoom").click(function(){
    //缩放日志
    console.log($(this).parent("div").eq(0).width(),'接班人')
    if ($(this).parent("div").eq(0).width()=="800"){
        $(this).attr("class","layui-icon layui-icon-screen-full")
        $(this).css({"margin-left":"0px"})
        $(this).siblings("div").hide();
        $(this).siblings("hr").hide();
        $(this).parent("div").eq(0).css({"width":"34px","height":"37px"})
        $(".Workflow_log").css({"width":"34px","height":"37px"})
    }else{
        $(this).css({"margin-left":"765px"})
        $(this).siblings("div").show();
        $(this).siblings("hr").show();
        $(this).parent("div").eq(0).css({"width":"800px","height":"632px"})
        $(".Workflow_log").css({"width":"800px","height":"632px"})
        $(this).attr("class","layui-icon layui-icon-screen-restore")
    }
});




// var w_s = $(".Workflow_Switch")
// for (var S_len=0;S_len<w_s.length;S_len++){
//     if (w_s.eq(S_len).data('id')=={{id | safe}}.id){
//         w_s.eq(S_len).parent('div').eq(0).css({
//             "border": "2px solid #0a6ae6e3",
//             "width": "292px",
//             "line-height": "21px"
//         })
        
//         $.get("/Node_status/?id="+w_s.eq(S_len).data('id'), function(result){//工作流状态回显及日志回显
//             console.log(result,'激动人心的雄文')
//             var val=result.data
//             console.log(val,'拿了做判断',result.id)
            
//             for (var r_id in result.id){
//                 for (var r_node in result.id[r_id]){
//                     if (result.id[r_id][r_node]['status']=='error'){
//                         $(".Workflow_Switch[data-id='"+r_id+"']").prev().children('i').eq(0).css({'color': '#cd326b'})
//                         break
//                     }else if(result.id[r_id][r_node]['status']=='Success'){
//                         $(".Workflow_Switch[data-id='"+r_id+"']").prev().children('i').eq(0).css({'color': '#0a6ae6e3'})
//                     }
                
//                 }
//             }
            
//             if(! val){
//                 return
//             }
            
//             var str_html=''
//             for (var key in val){
//                 if(val[key]['status']=='Success'){
//                     $("#"+key).children('div').eq(0).css({'background-color': '#0a6ae6e3'})

//                 }else if(val[key]['status']=='error'){
//                     $("#"+key).children('div').eq(0).css({'background-color': '#cd326b'})
                    
                    
                    
//                 }else{
//                     $("#"+key).children('div').eq(0).css({'background-color': '#32CD32'})
//                 }
                
//                 str_html+='	<ul class="layui-timeline">'
//                 str_html+='		  <li class="layui-timeline-item">'
//                 str_html+='			<i class="layui-icon layui-timeline-axis"></i>'
//                 str_html+='			<div class="layui-timeline-content layui-text">'
//                 str_html+='			  <h3 class="layui-timeline-title">'+val[key]['Workflow_name']+'</h3>'
//                 str_html+='			  <p>'
//                 if (typeof val=="object"){
//                     str_html+=                JSON.stringify(val[key]["Return_parameter"])
//                 }else{
//                     str_html+=                val[key]["Return_parameter"]
//                 }
//                 str_html+='			  </p>'
//                 str_html+='			</div>'
//                 str_html+='		  </li>'
//                 str_html+=' </ul>'
                
//                 $("#log_html").html(str_html)
//             }
//         });
//     }

// }
