var requests_d_p=require("./requests_d_p");
var jp = require('jsonpath');
var _eval = require('eval')


module.exports = {
	run :function(data,obj){
        console.log(data,'-------------------------------------------------------------')
        // var data = {
        //     Id: 110,
        //     WORK_ID: 'ce21fb',
        //     WORK_NAME: '\n\t\t\t\t\t\t\t杩欓噷鏄伐浣滄祦鍚嶇О\n\t\t\t\t\t\t',
        //     WORK_DATA: '{"ce21fb":{"Workflow_name":"\\n\\t\\t\\t\\t\\t\\t\\t杩欓噷鏄伐浣滄祦鍚嶇О\\n\\t\\t\\t\\t\\t\\t","api_node":"{\\"hprvt6\\":{\\"Workflow_name\\":\\"\\\\n\\\\t\\\\t\\\\t杩欓噷鏄痑pi鍚嶇О\\\\n\\\\t\\\\t\\",\\"type\\":\\"post\\",\\"url\\":\\"http://192.168.3.83:8063/TEST_POST/\\",\\"table_head\\":[{\\"key\\":\\"Content-Type\\",\\"value\\":\\"application/json\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true},{\\"key\\":\\"\\",\\"value\\":\\"\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true}],\\"table_body\\":[{\\"key\\":\\"a\\",\\"value\\":\\"1234\\",\\"status\\":\\"Text\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true},{\\"key\\":\\"b\\",\\"value\\":\\"4321\\",\\"status\\":\\"Text\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true},{\\"key\\":\\"\\",\\"value\\":\\"\\",\\"status\\":\\"Text\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true}],\\"json_head\\":\\"\\",\\"json_body\\":\\"\\",\\"Ginseng\\":[{\\"title\\":\\"json\\",\\"sex\\":\\"JsonPath\\",\\"desc\\":\\"$.code\\"},{\\"title\\":\\"re\\",\\"sex\\":\\"re\\",\\"desc\\":\\"\\\\\\"code\\\\\\":(.*?),\\"}],\\"head_status\\":\\"head_table\\",\\"body_status\\":\\"body_table\\"},\\"iwbqv4\\":{\\"Workflow_name\\":\\"\\\\n\\\\t\\\\t\\\\t杩欓噷鏄痑pi鍚嶇О\\\\n\\\\t\\\\t\\",\\"type\\":\\"post\\",\\"url\\":\\"http://192.168.3.83:8063/TEST_POST/\\",\\"table_head\\":[{\\"key\\":\\"Content-Type\\",\\"value\\":\\"application/json\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true},{\\"key\\":\\"\\",\\"value\\":\\"\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true}],\\"table_body\\":[{\\"key\\":\\"a\\",\\"value\\":\\"1243\\",\\"status\\":\\"Text\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true},{\\"key\\":\\"\\",\\"value\\":\\"\\",\\"status\\":\\"Text\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true}],\\"json_head\\":\\"\\",\\"json_body\\":\\"\\",\\"Ginseng\\":[],\\"head_status\\":\\"head_table\\",\\"body_status\\":\\"body_table\\"},\\"6bdqjw\\":{\\"Workflow_name\\":\\"\\\\n\\\\t\\\\t\\\\t杩欓噷鏄痑pi鍚嶇О\\\\n\\\\t\\\\t\\",\\"type\\":\\"post\\",\\"url\\":\\"http://192.168.3.83:8063/TEST_POST/\\",\\"table_head\\":[{\\"key\\":\\"Content-Type\\",\\"value\\":\\"application/json\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true},{\\"key\\":\\"\\",\\"value\\":\\"\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true}],\\"table_body\\":[{\\"key\\":\\"a\\",\\"value\\":\\"22\\",\\"status\\":\\"Text\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true},{\\"key\\":\\"\\",\\"value\\":\\"\\",\\"status\\":\\"Text\\",\\"DESCRIPTION\\":\\"\\",\\"Disable\\":true}],\\"json_head\\":\\"\\",\\"json_body\\":\\"\\",\\"Ginseng\\":[],\\"head_status\\":\\"head_table\\",\\"body_status\\":\\"body_table\\"}}","if_node":"{\\"zzmrqh\\":{\\"Judgment_node\\":{\\"鍒ゆ柇1\\":[{\\"node\\":\\"hprvt6\\",\\"Ginseng\\":\\"json\\",\\"Compare\\":\\"2\\",\\"Judgment_value\\":\\"200\\"}],\\"鍒ゆ柇2\\":[{\\"node\\":\\"hprvt6\\",\\"Ginseng\\":\\"re\\",\\"Compare\\":\\"2\\",\\"Judgment_value\\":\\"200\\"}]},\\"node_name\\":\\"\\\\n\\\\t\\\\t\\\\t鍒ゆ柇鑺傜偣鍚嶇О\\\\n\\\\t\\\\t\\"}}","rpa_node":"None","merge_node":"None","condition":"{\\"zzmrqh__iwbqv4\\":{\\"鍒ゆ柇1\\":\\"on\\",\\"Workflow_name\\":\\"\\\\n\\\\t\\\\t\\\\t鑱氬悎鑺傜偣鍚嶇О\\\\n\\\\t\\\\t\\"},\\"zzmrqh__6bdqjw\\":{\\"鍒ゆ柇2\\":\\"on\\",\\"Workflow_name\\":\\"\\\\n\\\\t\\\\t\\\\t鑱氬悎鑺傜偣鍚嶇О\\\\n\\\\t\\\\t\\"}}","connections":"{\\"0\\":{\\"current\\":\\"hprvt6\\",\\"Rear\\":\\"zzmrqh\\",\\"current_uuid\\":\\"hprvt6_current\\",\\"Rear_uuid\\":\\"zzmrqh_Rear\\",\\"current_width\\":\\"50484px\\",\\"current_height\\":\\"25041px\\",\\"Rear_width\\":\\"50523px\\",\\"Rear_height\\":\\"25222px\\"},\\"1\\":{\\"current\\":\\"zzmrqh\\",\\"Rear\\":\\"iwbqv4\\",\\"current_uuid\\":\\"zzmrqh_current\\",\\"Rear_uuid\\":\\"iwbqv4_Rear\\",\\"current_width\\":\\"50523px\\",\\"current_height\\":\\"25222px\\",\\"Rear_width\\":\\"50218px\\",\\"Rear_height\\":\\"25341px\\"},\\"2\\":{\\"current\\":\\"zzmrqh\\",\\"Rear\\":\\"6bdqjw\\",\\"current_uuid\\":\\"zzmrqh_current\\",\\"Rear_uuid\\":\\"6bdqjw_Rear\\",\\"current_width\\":\\"50523px\\",\\"current_height\\":\\"25222px\\",\\"Rear_width\\":\\"50709px\\",\\"Rear_height\\":\\"25345px\\"}}"}}',
        //     todoDate: '涓婂崍10:51:55'
        // }



        var WORK_ID=data.WORK_ID
        var WORK_DATA=JSON.parse(data.WORK_DATA)[WORK_ID]
        var list_r_data={}//存返回值
        if (WORK_DATA['api_node']!="None"){
            var api_node=JSON.parse(WORK_DATA['api_node'])
        }else{
            var api_node=WORK_DATA['api_node']
        }
        if (WORK_DATA['if_node']!="None"){
            var if_node=JSON.parse(WORK_DATA['if_node'])
        }else{
            var if_node=WORK_DATA['if_node']
        }
        if (WORK_DATA['rpa_node']!="None"){
            var rpa_node=JSON.parse(WORK_DATA['rpa_node'])
        }else{
            var rpa_node=WORK_DATA['rpa_node']
        }
        if (WORK_DATA['merge_node']!="None"){
            var merge_node=JSON.parse(WORK_DATA['merge_node'])
        }else{
            var merge_node=WORK_DATA['merge_node']
        }
        if (WORK_DATA['condition']!="None"){
            var condition=JSON.parse(WORK_DATA['condition'])
        }else{
            var condition=WORK_DATA['condition']
        }

        var connections=JSON.parse(WORK_DATA['connections'])
        
        var list_current_id=[]//左端点
        var list_Rear_id=[]//右端点
        if (Object.keys(connections).length != 0){//有连线时取出左右端点的放入list后面得用
            //遍历流程
            console.log('Multi-node')
            for (var node_index in connections){
                var current_id = connections[node_index]['current']//起点
                var Rear_id = connections[node_index]['Rear']//终点
                list_current_id.push(current_id)
                list_Rear_id.push(Rear_id)
            }
        }

        //拿到判断节点的id后面流程做判断
        if_list=[]
        for (var if_val in if_node){
            if_list.push(if_val)
        }
        //拿到合并节点的id后面流程做判断
        merge_list=[]
        for (var merge_val in merge_node){
            merge_list.push(merge_val)
        }

        //apilist
        api_list=[]
        for (var api_val in api_node){
            api_list.push(api_val)
        }

        //rpa_list
        rpa_list=[]
        for (var rpa_val in rpa_node){
            rpa_list.push(rpa_val)
        }

        var tortoise_list=[]
        if (Object.keys(connections).length != 0){//多个节点时场景
            //遍历流程
            console.log('Multi-node')
            for (var node_index in connections){
                console.log(list_r_data,'---------chouchou_return--------')//究竟为嘛没存进去
                console.log(list_r_data,'---------===================================================================================================--------')//究竟为嘛没存进去
                var current_id = connections[node_index]['current']//起点
                var Rear_id = connections[node_index]['Rear']//终点
                    console.log(current_id,'nodeid_c')
                    if (if_list.indexOf(current_id) > -1){//判断属于判断节点,这里用起始端点会出现两次
                        if (JSON.stringify(if_node[current_id]['Judgment_node'])=="{}"){
                            //判断里没有数据
                            console.log('if not value')
                            //continue
                        }else{
                            console.log('if_x',current_id)
                            console.log(current_id,'if nodeid',if_list)
                            console.log('Entered the judgment',condition,Rear_id)
                            for (var condition_id in condition){//取出判断节点对应的判断条件数据,这里遍历几条连线
                                console.log(current_id,'==',condition_id)
                                if (current_id==condition_id.slice(0,6) && Rear_id==condition_id.slice(-6)){
                                    console.log(condition[condition_id],'wwwwwwwwwwwwwwwwwww')
                                    var list_state=[]
                                    for (var tj in condition[condition_id]){//遍历条件可能有多个
                                        console.log(tj,'tttttttttjjjjjjjjjj')
                                        if (tj=="Workflow_name"){
                                            continue
                                        }else if(condition[condition_id][tj]=="on"){//开启的时候进行判断
                                            var Parsing=if_node[current_id]['Judgment_node'][tj][0]//取出需要效验的判断条件,这个地方得加个表存节点返回数据
                                            console.log(if_node[current_id]['Judgment_node'][tj][0],'This is the judgment condition')
                                            if (api_list.indexOf(Parsing["node"]) > -1){

                                                console.log('xjbg1',Parsing["node"],api_list)

                                                var G_list = api_node[Parsing["node"]]["Ginseng"]
                                                for (var G_dict in G_list){
                                                    console.log(Parsing['Ginseng'],'xjbg2',G_list[G_dict]['title'])
                                                    if (Parsing['Ginseng'] == G_list[G_dict]['title']){
                                                        console.log(list_r_data,'---------return--------')//这个地方要调调调调调调调调调调调调调调调调
                                                        var r_log=list_r_data[Parsing["node"]]//取返回值
                                                        if (G_list[G_dict]['sex']=='JsonPath'){
                                                            console.log(r_log,'r_log---------')
                                                            if(typeof(r_log)=="string"){
                                                                r_log=JSON.parse(r_log)
                                                            }
                                                            var t1 = jp.query(r_log, G_list[G_dict]['desc']);//通过表达式取返回值中的参数
                                                            Parsing['Compare']//0大于1小于2等于
                                                            var t2=Parsing['Judgment_value']//判断的值
                                                        }else if(G_list[G_dict]['sex']=='re'){
                                                            var t1=r_log.match(G_list[G_dict]['desc'])//通过正则表达式取返回值中的参数
                                                            Parsing['Compare']//0大于1小于2等于
                                                            var t2=Parsing['Judgment_value']//判断的值
                                                        }else{
                                                            alert('找到未知的匹配类型')
                                                        }

                                                        if (Parsing['Compare']=='0'){
                                                            var state=t1>t2
                                                        }else if(Parsing['Compare']=='1'){
                                                            var state=t1<t2
                                                        }else if (Parsing['Compare']=='2'){
                                                            var state=t1==t2
                                                        }else{
                                                            alert('抓到一个未知的判断条件')
                                                        }
                                                        list_state.push(state)
                                                    }
                                                }
                                                console.log(api_node[Parsing["node"]],'pianpianxihuanni')
                                            }
                                        }

                                    }
                                    //这里判断最终的是否通过,不通过则递归获取子节点添加到list
                                    console.log(list_state,'-------------------list_state-------------------')
                                    var state_i=true
                                    for (var state_j in list_state){
                                        state_i=state_i && state_j
                                    }
                                    if(!state_i){//这里添加到list
                                        function tortoise(data){
                                            tortoise_list.push(data)
                                            for (var node_index_t in connections){
                                                var current_id_t = connections[node_index_t]['current']//起点
                                                var Rear_id_t = connections[node_index_t]['Rear']//终点
                                                if(data==current_id_t){
                                                    return tortoise(Rear_id_t)
                                                }else{
                                                    return
                                                }
                                            }
                                        }
                                        tortoise(current_id_t)
                                    }

                                }
                            }
                        }

                        console.log(Rear_id,list_current_id.indexOf(Rear_id),list_current_id,'three',tortoise_list,tortoise_list.indexOf(current_id))

                        if(list_current_id.indexOf(Rear_id) < 0){//这是结束节点,右端点不属于其他节点的左端点的都是结束节点
                            console.log("node_end")
                            if(tortoise_list.indexOf(Rear_id) < 0){//判断不通过的子节点不走
                                console.log('tortoise_list_no')
                                if(api_list.indexOf(Rear_id) > -1){//属于api节点
                                    console.log('api_list_node_node')
                                    api_node_dict={}
                                    api_node_dict[Rear_id] = api_node[Rear_id]
    
                                    requests_d_p.rquests_d_p(api_node_dict,function(event,status){
                                        console.log(event,status,'api--Display after running')
                                        var Return_val={
                                            "node_id":Rear_id,
                                            "Return_parameter":event,
                                            "status":status
                                        }
                                        console.log(Rear_id,'------------no save----------',Return_val)
                                        list_r_data[Rear_id]=Return_val//添加每个节点的返回值到dict
                                        console.log(list_r_data,'------------no save list_r_data----------')
                                        obj(Return_val)//这个地方参数吐出去做节点状态变更
                                    })
                                    
    
                                }else if(rpa_list.indexOf(Rear_id) > -1){//属于rpa节点
                                    rpa_node[Rear_id]
                                    console.log(Rear_id,'rpa--Display after running')
                                    try {
                                        var res = eval(rpa_node[Rear_id]['editor_value'])
                                        
 
                                        
                                        var status='success'
                                    } catch (e) {
                                        var status='error'
                                        console.log(e,'log_____________dangdangdang')
                                    }
                                    var Return_val={
                                        "node_id":Rear_id,
                                        "Return_parameter":'None',
                                        "status":status
                                    }
                                    list_r_data[Rear_id]=Return_val//添加每个节点的返回值到dict
                                    obj(Return_val)//这个地方参数吐出去做节点状态变更
                                }
                            }
                        }

                    }else if(list_current_id.indexOf(Rear_id) < 0){//这是结束节点,右端点不属于其他节点的左端点的都是结束节点
                        console.log("node_end")
                        if(tortoise_list.indexOf(Rear_id) < 0){//判断不通过的子节点不走
                            console.log('tortoise_list_no')
                            if(api_list.indexOf(Rear_id) > -1){//属于api节点
                                console.log('api_list_node_node')
                                api_node_dict={}
                                api_node_dict[Rear_id] = api_node[Rear_id]

                                requests_d_p.rquests_d_p(api_node_dict,function(event,status){
                                    console.log(event,status,'api--Display after running')
                                    var Return_val={
                                        "node_id":Rear_id,
                                        "Return_parameter":event,
                                        "status":status
                                    }
                                    console.log(Rear_id,'------------no save----------',Return_val)
                                    list_r_data[Rear_id]=Return_val//添加每个节点的返回值到dict
                                    console.log(list_r_data,'------------no save list_r_data----------')
                                    obj(Return_val)//这个地方参数吐出去做节点状态变更
                                })
                                

                            }else if(rpa_list.indexOf(Rear_id) > -1){//属于rpa节点
                                rpa_node[Rear_id]
                                console.log(Rear_id,'rpa--Display after running')
                                try {
                                    eval(rpa_node[Rear_id]['editor_value'])
                                    var status='success'
                                    console.log('qewrqwerqwer___')
                                } catch (e) {
                                    var status='error'
                                }
                                var Return_val={
                                    "node_id":Rear_id,
                                    "Return_parameter":'None',
                                    "status":status
                                }
                                list_r_data[Rear_id]=Return_val//添加每个节点的返回值到dict
                                obj(Return_val)//这个地方参数吐出去做节点状态变更
                            }
                        }
                    }else{//应该是先走这个,咋回事
                        console.log('api_x',current_id)
                        console.log(tortoise_list,'------------------tortoise_list------------------')
                        if(tortoise_list.indexOf(current_id) < 0){//判断不通过的子节点不走
                            console.log('tortoise_list_no')
                            if(api_list.indexOf(current_id) > -1){//属于api节点
                                console.log('api_list_node_node')
                                api_node_dict={}
                                api_node_dict[current_id] = api_node[current_id]

                                requests_d_p.rquests_d_p(api_node_dict,function(event,status){
                                    console.log(event,status,'api--Display after running')
                                    var Return_val={
                                        "node_id":current_id,
                                        "Return_parameter":event,
                                        "status":status
                                    }
                                    console.log(current_id,'------------no save----------',Return_val)
                                    list_r_data[current_id]=Return_val//添加每个节点的返回值到dict
                                    console.log(list_r_data,'------------no save list_r_data----------')
                                    obj(Return_val)//这个地方参数吐出去做节点状态变更
                                })
                                

                            }else if(rpa_list.indexOf(current_id) > -1){//属于rpa节点
                                rpa_node[current_id]
                                console.log(current_id,'rpa--Display after running')
                               
                                var res=eval(rpa_node[current_id]['editor_value'])
                                var status='success'
                                function showLogin()
                                {
                                    console.log("here is res ", res);
                                }
                                setTimeout("showLogin()",1000);
                                
                                try {
                                    var res=eval(rpa_node[current_id]['editor_value'])
                                    var status='success'
                                    function showLogin()
                                    {
                                        console.log("here is res ", res);
                                    }
                                    setInterval("showLogin()","1000");
                                } catch (e) {
                                    var status='error'
                                }
                                var Return_val={
                                    "node_id":current_id,
                                    "Return_parameter":'None',
                                    "status":status
                                }
                                list_r_data[current_id]=Return_val//添加每个节点的返回值到dict
                                obj(Return_val)//这个地方参数吐出去做节点状态变更
                            }
                        }
                    }







            }
        }else{//单节点场景
            console.log(api_node,'xxxxxxxxxxxxxxxxxxxxxxxzzzzzzzzzzzzzzzzzzzzzzzzz')
            if (api_node!="None"){//判断是api还是rpa
                for (var api_key in api_node){
                    console.log(api_key,'Display after running')

                    async function allTasks () {
                        await requests_d_p.rquests_d_p(api_node,function(event,status){
                            console.log(event,status,'Display after running')
                            var Return_val={
                                "node_id":api_key,
                                "Return_parameter":event,
                                "status":status
                            }
                            list_r_data[api_key]=Return_val//添加每个节点的返回值到dict
                            obj(Return_val)//这个地方参数吐出去做节点状态变更
                        })
                    }




                }

            }else if(rpa_node != "None"){
                for (var rpa_key in rpa_node){
                    console.log(rpa_key,'Display after running')
                    var status='success'
                    eval(rpa_node[rpa_key]['editor_value'])
                    async function asyncCall(){
                        let b = await eval(rpa_node[rpa_key]['editor_value'])
                        console.log(b,'-----------cons---------')
                    }
                    asyncCall()


                    // setInterval(function () { //每5秒刷新一次图表
                    //     //需要执行的代码写在这里
                    //     console.log(res,'aaaaaaaa'); //boolean
                    //     var res_str=String(res)
                    //     console.log(res_str,'bbbbbbbb'); //boolean
                    //     console.log(typeof res_str); //boolean
                    //     console.log(res_str.search("undefined")); //boolean

                    //     if(res_str.search("undefined") != -1 ){
                    //         console.log(res_str,'111111111')
                    //     }else{
                    //         console.log(res_str,'222222222')
                    //     }
                    // }, 1000);




                    
                    // try {
                    //     eval(rpa_node[rpa_key]['editor_value'])
                    //     var status='success'

                    // } catch (e) {
                    //     var status='error'
                    // }
                    var Return_val={
                        "node_id":rpa_key,
                        "Return_parameter":'None',
                        "status":status
                    }
                    list_r_data[rpa_key]=Return_val//添加每个节点的返回值到dict
                    obj(Return_val)//这个地方参数吐出去做节点状态变更

                }
            }else{
                alert("两个节点都没有")
            }

        }

        obj("执行完成")

        console.log(list_r_data,'------------Rear----------')

    }
}