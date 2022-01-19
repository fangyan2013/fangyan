var http_request=require("./requests");

module.exports = {
	rquests_d_p :function(value,obj){
        //console.log(value,'pppppppppppppppppppppppppppppppppppppppppppp')
        var head_dict
        var body_dict
        for(var i in value){
          var type=value[i]['type']
          var url=value[i]['url']
          var head_status=value[i]['head_status']
          var body_status=value[i]['body_status']
          if(head_status=="head_table"){
            var head=value[i]['table_head']
            if (head.length==1 && head[0]['key']==''){//不传任何东西
              head_dict=null
            }else{
              head_dict={}
              for (var h_val in head){
                if (head[h_val]['Disable']){
                  head_dict[head[h_val]['key']] = head[h_val]['value']
                }
              }
            }
          }else{
            var head=value[i]['json_head']
            if (head == ''){//不传任何东西
                head_dict=null
            }else{
                if(typeof(head)=='string'){
                    head_dict=JSON.parse(head)
                }else{
                    head_dict=head
                }


            }
          }
      
          if (body_status=="body_table"){
            var body=value[i]['table_body']
            if (body.length==1 && body[0]['key']==''){//不传任何东西
              body_dict=null
            }
            else{
              body_dict={}
              for (h_val in body){
                  if (body[h_val]['Disable']){
                      body_dict[body[h_val]['key']] = body[h_val]['value']
                  }
              }
            }
          }else{
            var body=value[i]['json_body']
            if (body == ''){//不传任何东西
                body_dict=null
            }else{
                if(typeof(body)=='string'){
                    body_dict=JSON.parse(body)
                }else{
                    body_dict=body
                }


            }
      
          }
        }
        //console.log(type,'pppppppppppppppppppppppppppppppppppppppppppp2')
        delete head_dict['']
        delete body_dict['']
        if (type=="get"){
            http_request.request_get(url)
            console.log("现在只取url后面参数,用于调试工作流后面不用request封装")
        }else if(type=="post"){
            //console.log(type,'pppppppppppppppppppppppppppppppppppppppppppp3')
           // console.log(body_dict,'xxccvv')
           // console.log(head_dict)
            //http_request.
            http_request.request_post(
                url=url,
                data=body_dict,
                head=head_dict,
                function(val,status){
                    //console.log(val,'xxxxxxxxxxxxxxxxxxx')
                    obj(val,status);
                }
            )
        }else if(type=="get"){
      
        }else if(type=="head"){
      
        }else if(type=="put"){
      
        }else if(type=="patch"){
      
        }else if(type=="delete"){
      
        }else{
      
        }

    }
}