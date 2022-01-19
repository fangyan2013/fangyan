#!/usr/bin/env python
"""工作流执行逻辑"""
import traceback
from playwright.sync_api import Playwright, sync_playwright
import jsonpath
import json
#import url_request
from Function.run_workflow import url_request
from Function.run_workflow import sql
from Function.run_workflow import position
from app import MyJSONEncoder
import pyautogui
import re
import os
import copy
import json
import time
#节点参数替换
class parameter_replace:
    def __init__(self):
        '''节点逻辑'''
        pass
        
    def val_replace_api(self,node,data):
        '''api替换参数,分开好维护'''
        print(self.list_r_data,'返回值')
        print(self.Ginseng,'匹配规则')
        print(node,'节点id')
        print(data=='1','参数')
        val_list=re.findall(r"\$\{(.*?)\}",json.dumps(data),re.M|re.S)
        print(val_list,'val_list')
        #{'i3wrzh': [{'title': 'json', 'sex': 'JsonPath', 'desc': '$.code'}], '1ps10d': []}
        #{'i3wrzh': {'node_id': 'i3wrzh', 'Return_parameter': '{"code": 200, "msg": "\\u6d4b\\u554a\\u6d4b", "data": [{"API": "POST", "val_a": "1234", "val_b": null}]}', 'status': 'Success', 'Workflow_name': '\n\t\t\t\t这里是api名称\n\t\t\t'}} 
        for G_val in self.Ginseng:
            for val in self.Ginseng[G_val]:
                for val2 in val_list:
                    if val['title']==val2:
                        print("是不是list1",data)
                        if val['sex']=="JsonPath":
                            r_log=self.list_r_data[G_val]['Return_parameter']
                            print("是不是list1",r_log)
                            if not isinstance(r_log,list):#出参为sql的时候是list转json会报错
                                r_log=json.loads(r_log)
                            replace_val=jsonpath.jsonpath(r_log,val['desc'])
                            print(replace_val,"jsonpath没配到")
                            #print(replace_val,len(replace_val),'jsonpath匹配值')
                            if not replace_val:
                                replace_val=""
                            else:
                                if len(replace_val)>0:
                                    replace_val=replace_val[0]
                                else:
                                    replace_val=""
                            data = re.sub(r"\$\{"+val2+"\}",str(replace_val),json.dumps(data))
                            data = json.loads(data)
                        if val['sex']=="re":
                            r_log=self.list_r_data[G_val]['Return_parameter']
                            replace_val=re.findall(val['desc'],r_log,re.M|re.S)
                            print(replace_val,len(replace_val),'正则匹配值')
                            if len(replace_val)>0:
                                replace_val=replace_val[0]
                            else:
                                replace_val=""
                            data = re.sub(r"\$\{"+val2+"\}",replace_val,json.dumps(data))
                            print("是不是list",data)
                            data = json.loads(data)
        return data
        
        
    def val_replace_sql(self,node,data):
        '''sql替换参数,分开好维护'''
        print(self.list_r_data,'返回值')
        print(self.Ginseng,'匹配规则')
        print(node,'节点id')
        print(data,'参数')
        if data=='':
            return data
        val_list=re.findall(r"\$\{(.*?)\}",data,re.M|re.S)
        print(val_list,'val_list')
        for G_val in self.Ginseng:
            for val in self.Ginseng[G_val]:
                for val2 in val_list:
                    if val['title']==val2:
                        if val['sex']=="JsonPath":
                            r_log=self.list_r_data[G_val]['Return_parameter']
                            if not isinstance(r_log,list):#出参为sql的时候是list转json会报错
                                r_log=json.loads(r_log)
                            replace_val=jsonpath.jsonpath(r_log,val['desc'])	
                            if not replace_val:
                                replace_val=""
                            else:
                                if len(replace_val)>0:
                                    replace_val=replace_val[0]
                                else:
                                    replace_val=""
                            data = re.sub(r"\$\{"+val2+"\}",str(replace_val),data)
                        if val['sex']=="re":
                            r_log=self.list_r_data[G_val]
                            print(r_log,'-----------',val['desc'])
                            replace_val=re.findall(val['desc'],json.dumps(r_log),re.M|re.S)
                            if len(replace_val)>0:
                                replace_val=replace_val[0]
                            else:
                                replace_val=""
                            data = re.sub(r"\$\{"+val2+"\}",replace_val,data)
        print(data,'这是sql保存的值')
        return data


    def val_replace_rpa(self,node,data):
        '''rpa替换参数,分开好维护'''
        if data=='':
            return data
        val_list=re.findall(r"\$\{(.*?)\}",data,re.M|re.S)
        print(val_list,'val_list--------------------------------------')
        for G_val in self.Ginseng:
            print(G_val,'val_list--------------------------------------11')
            for val in self.Ginseng[G_val]:
                print(val,'valval--------------------------------------22')
                for val2 in val_list:
                    print(val2,'val2val2--------------------------------------33')
                    if val['title']==val2:
                        print(val['title'],val['sex'],'val2val2--------------------------------------44')
                        if val['sex']=="JsonPath":
                            r_log=self.list_r_data[G_val]['Return_parameter']
                            if not isinstance(r_log,list):#出参为sql的时候是list转json会报错
                                r_log=json.loads(r_log)
                            replace_val=jsonpath.jsonpath(r_log,val['desc'])
                            if not replace_val:
                                replace_val=""
                            else:
                                if len(replace_val)>0:
                                    replace_val=replace_val[0]
                                else:
                                    replace_val=""

                            
                            data = re.sub(r"\$\{"+val2+"\}",str(replace_val),data)
                        if val['sex']=="re":
                            print(val['sex'],'val2val2--------------------------------------55',self.list_r_data[G_val])
                            r_log=self.list_r_data[G_val]['Return_parameter']
                            print(r_log,'r_logr_logr_logr_logr_logr_logr_log')
                            replace_val=re.findall(val['desc'],json.dumps(r_log),re.M|re.S)
                            if len(replace_val)>0:
                                replace_val=replace_val[0]
                            else:
                                replace_val=""
                            
                            print(replace_val,val2,data,'val2val2--------------------------------------66')
                            data = re.sub(r"\$\{"+val2+"\}",replace_val,data)
        return data


# position_function

    def val_replace_position(self,node,data):#明天接着这里写
        '''定位节点参数替换'''
        print(self.Node_information,'返回值')
        print(self.Ginseng,'匹配规则')
        print(node,'节点id')
        print(data=='1','参数')
        val_list=re.findall(r"\$\{(.*?)\}",json.dumps(data),re.M|re.S)
        print(val_list,'val_list')
        #{'i3wrzh': [{'title': 'json', 'sex': 'JsonPath', 'desc': '$.code'}], '1ps10d': []}
        #{'i3wrzh': {'node_id': 'i3wrzh', 'Return_parameter': '{"code": 200, "msg": "\\u6d4b\\u554a\\u6d4b", "data": [{"API": "POST", "val_a": "1234", "val_b": null}]}', 'status': 'Success', 'Workflow_name': '\n\t\t\t\t这里是api名称\n\t\t\t'}} 
        for G_val in self.Ginseng:
            for val in self.Ginseng[G_val]:
                for val2 in val_list:
                    if val['title']==val2:
                        print("是不是list1",data)
                        if val['sex']=="JsonPath":
                            r_log=self.Node_information[G_val]['Return_parameter']
                            print("是不是list1",r_log)
                            if not isinstance(r_log,list):#出参为sql的时候是list转json会报错
                                r_log=json.loads(r_log)
                            replace_val=jsonpath.jsonpath(r_log,val['desc'])
                            print(replace_val,"jsonpath没配到")
                            #print(replace_val,len(replace_val),'jsonpath匹配值')
                            if not replace_val:
                                replace_val=""
                            else:
                                if len(replace_val)>0:
                                    replace_val=replace_val[0]
                                else:
                                    replace_val=""
                            data = re.sub(r"\$\{"+val2+"\}",str(replace_val),json.dumps(data))
                            data = json.loads(data)							
                        if val['sex']=="re":
                            r_log=self.Node_information[G_val]['Return_parameter']
                            replace_val=re.findall(val['desc'],r_log,re.M|re.S)
                            print(replace_val,len(replace_val),'正则匹配值')
                            if len(replace_val)>0:
                                replace_val=replace_val[0]
                            else:
                                replace_val=""
                            data = re.sub(r"\$\{"+val2+"\}",replace_val,json.dumps(data))
                            print("是不是list",data)
                            data = json.loads(data)
        return data



#节点功能调用
class node_function:
    def __init__(self):
        '''节点逻辑'''
        pass
        
    def api_function(self,Rear_id):
        '''api功能'''
        self.api_node_dict={}
        self.api_node_dict[Rear_id] = self.api_node[Rear_id]
        #这里调api的东西
        r_p=url_request.Deal_with()
        #参数,节点,返回,匹配规则
        try:
            data = self.val_replace_api(Rear_id,self.api_node_dict)
            r_text=r_p.request_data(data)
            status="Success"
        except Exception as e:
            status="error"
            r_text=str(e)
        Return_val={
            "node_id":Rear_id,
            "Return_parameter":r_text,
            "status":status,
            "Workflow_name":self.api_node[Rear_id]['Workflow_name']
        }
        self.list_r_data[Rear_id]=Return_val#添加每个节点的返回值到dict
        return True
    
    def rpa_function(self,Rear_id):
        '''rpa功能'''
        try:
            with open('./static/rpa_py/%s.py' % self.rpa_node[Rear_id]['file_name'], 'r', encoding='utf-8') as f:
                str_file=f.read()
                
            data = self.val_replace_rpa(Rear_id,str_file)
            print(data,'datadatadatadatadata')
            with open('./static/rpa_py/%s.py' % self.rpa_node[Rear_id]['file_name'], 'w', encoding='utf-8') as f:
                f.write(data)
            
            result=os.popen('python ./static/rpa_py/%s.py' % self.rpa_node[Rear_id]['file_name'])
            res=result.read()
            print(res,'返回值')
            status='Success'
            rp=res
        except Exception as e:
            status='error'
            rp=str(e)
            self.node_id_error.append(Rear_id)
        Return_val={
            "node_id":Rear_id,
            "Return_parameter":rp,
            "status":status,
            "Workflow_name":self.rpa_node[Rear_id]['Workflow_name']
        }
        self.list_r_data[Rear_id]=Return_val#添加每个节点的返回值到dict
        return True


    def position_function(self,Rear_id):
        '''定位功能'''
        try:
            print(self.Node_information,'越说越离谱',self.page_status)
            dict_obj={}
            obj_rp_r={}#可能会有多个出参,这里得跟节点对应
            
            def obj(val):
                obj_rp_r['rp']=val
            
            if not self.page_status:#derver为False的时候给他赋值
                self.page_status=True
                self.p=self.p_function()
                next(self.p)#这里可能有问题
                self.p.send([Rear_id,self.Node_information,obj])
            else:
                self.p.send([Rear_id,self.Node_information,obj])
            status='Success'
            print(dict_obj,obj_rp_r,'得搞钱了再迷茫下去人没了')
            if obj_rp_r:
                dict_obj={**dict_obj,**obj_rp_r['rp']}
            else:
                dict_obj={**dict_obj,**obj_rp_r}
            rp=json.dumps(dict_obj)
            rp=rp.encode('utf-8').decode("unicode_escape")
        except StopIteration as err:
            print('被捕获了')
            status='Success'
            rp=json.dumps({})
        except Exception as e:
            print(e,'马勒戈壁究竟是什么异常')
            status='error'
            rp=str(e)
            self.node_id_error.append(Rear_id)
            print(rp,'请问报的什么')
        print(self.Node_information[Rear_id+"_Workflow_name"],'self.Node_information[Rear_id]')
        Return_val={
            "node_id":Rear_id,
            "Return_parameter":rp,
            "status":status,
            "Workflow_name":self.Node_information[Rear_id+"_Workflow_name"]#这地方得单独写
        }
        self.list_r_data[Rear_id]=Return_val#添加每个节点的返回值到dict
        return True



    def sql_function(self,Rear_id):
        '''sql功能'''
        try:
            #{'Workflow_name': '\n\t\t\tsql节点名称\n\t\t', 'ip': 'localhost', 'port': '3306', 'db': 'ui_server', 'username': 'root', 'password': '123456', 'editor_value': 'SELECT * FROM `app_img_code`'}
            ip=self.sql_node[Rear_id]['ip']
            port=self.sql_node[Rear_id]['port']
            db=self.sql_node[Rear_id]['db']
            username=self.sql_node[Rear_id]['username']
            password=self.sql_node[Rear_id]['password']
            editor_value=self.sql_node[Rear_id]['editor_value']
            editor_value = self.val_replace_sql(Rear_id,editor_value)
            sql_val=sql.sql_lave(ip,int(port),username,password,db).run_sql(editor_value)
            print(sql_val,'sql_valsql_val')
            if sql_val[0]:
                print('我也不知道呀呀呀')
                val=MyJSONEncoder.MYSQL_JSON(sql_val[0],sql_val[1])
                rp=val
            else:
                rp=str(sql_val[1])
            status='Success'
        except Exception as e:
            status='error'
            rp=str(e)
            self.node_id_error.append(Rear_id)
        Return_val={
            "node_id":Rear_id,
            "Return_parameter":rp,
            "status":status,
            "Workflow_name":self.sql_node[Rear_id]['Workflow_name']
        }
        self.list_r_data[Rear_id]=Return_val#添加每个节点的返回值到dict
        return True




#节点逻辑处理
class node_logic:
    def __init__(self):
        '''节点逻辑'''
        pass
        
    def if_logic(self,Rear_id,current_id):
        '''判断'''
        if current_id in self.if_list:#判断属于判断节点,这里用起始端点会出现两次
        

            if json.dumps(self.if_node[current_id]['Judgment_node'])=="{}":
                #判断里没有数据
                return "continue"
            else:
                print(self.condition,'self.condition')
                for self.condition_id in self.condition:#取出判断节点对应的判断条件数据,这里遍历几条连线
                    print(self.condition_id,'self.condition_id')
                    if current_id==self.condition_id[:6] and Rear_id==self.condition_id[-6:]:
                        print('进去没',self.condition[self.condition_id])
                        list_state=[]
                        print(self.condition[self.condition_id],'裂开了')
                        for tj in self.condition[self.condition_id]:#遍历条件可能有多个
                            print(tj,'为什么只有一组判断')
                            if tj=="Workflow_name":
                                continue
                            elif self.condition[self.condition_id][tj]=="on":#开启的时候进行判断
                                Parsing=self.if_node[current_id]['Judgment_node'][tj][0]#取出需要效验的判断条件,这个地方得加个表存节点返回数据
                                #if Parsing["node"] in self.api_list:
                                print(Parsing,'Parsing',self.Ginseng)
                                if self.Ginseng.get(Parsing["node_id"],None):
                                    G_list=self.Ginseng.get(Parsing["node_id"],None)
                                    print(G_list,'G_list')
                                    for G_dict in G_list:
                                        if Parsing['Ginseng'] == G_dict['title']:
                                            #r_log=self.list_r_data[Parsing["node_id"]]#取返回值
                                            print(self.list_r_data,'到底什么数据格式')
                                            r_log=self.list_r_data.get(Parsing["node_id"],None)#取返回值
                                            if G_dict['sex']=='JsonPath':
                                                try:#能转python对象
                                                    #r_log=json.loads(r_log['Return_parameter'])
                                                    if not isinstance(r_log['Return_parameter'],list):#出参为sql的时候是list转json会报错
                                                        r_log=json.loads(r_log['Return_parameter'])
                                                    else:
                                                        r_log=r_log['Return_parameter']
                                                        
                                                    #Parsing["node"]
                                                    if Parsing["node_id"] in self.api_list:#api
                                                        t1=jsonpath.jsonpath(r_log,G_dict['desc'])#通过表达式取返回值中的参数取一组第一个
                                                        if not t1:#是False的时候len会报错
                                                            t1=None
                                                        elif len(t1)>0:
                                                            t1=t1[0]
                                                        else:
                                                            t1=None
                                                    elif Parsing["node_id"] in self.rpa_list:#rpa
                                                        t1=jsonpath.jsonpath(json.loads(r_log),G_dict['desc'])
                                                        if not t1:#是False的时候len会报错
                                                            t1=None
                                                        elif len(t1)>0:
                                                            t1=t1[0]
                                                        else:
                                                            t1=None
                                                    elif Parsing["node_id"] in self.sql_list:#sql
                                                        t1=jsonpath.jsonpath(json.loads(r_log),G_dict['desc'])
                                                        if not t1:#是False的时候len会报错
                                                            t1=None
                                                        elif len(t1)>0:
                                                            t1=t1[0]
                                                        else:
                                                            t1=None
                                                            
                                                    elif Parsing["node_id"] in self.Node_information:#定位
                                                        t1=jsonpath.jsonpath(json.loads(r_log),G_dict['desc'])
                                                        if not t1:#是False的时候len会报错
                                                            t1=None
                                                        elif len(t1)>0:
                                                            t1=t1[0]
                                                        else:
                                                            t1=None
                                                            
                                                    else:
                                                        t1=None
                                                        print('不知名的后置处理方式-jsonpath')
                                                    
                                                except:
                                                    t1=None
                                                Parsing['Compare']#0大于1小于2等于
                                                t2=Parsing['Judgment_value']#判断的值
                                            elif G_dict['sex']=='re':
                                                print('进入re')
                                                try:#能转python对象
                                                    #r_log=json.loads(r_log['Return_parameter'])
                                                    if not isinstance(r_log['Return_parameter'],list):#出参为sql的时候是list转json会报错
                                                        r_log=json.loads(r_log['Return_parameter'])
                                                    else:
                                                        r_log=r_log['Return_parameter']
                                                    print(r_log,'想办法',type(r_log))
                                                    if Parsing["node_id"] in self.api_list:#api   api的好了,别的出参可能还得兼容
                                                        if isinstance(r_log,dict):
                                                            r_log=json.dumps(r_log)
                                                        t1=re.findall( G_dict['desc'] , r_log ,re.M|re.S)
                                                        print(t1,'匹配的是什么屌东西','这是api')
                                                        if len(t1)>0:
                                                            t1=t1[0]
                                                        else:
                                                            t1=None
                                                    elif Parsing["node_id"] in self.rpa_list:#rpa
                                                        t1=re.findall( G_dict['desc'] , json.dumps(r_log) ,re.M|re.S)
                                                        print(t1,'匹配的是什么屌东西','这是rpa')
                                                        if len(t1)>0:
                                                            t1=t1[0]
                                                        else:
                                                            t1=None
                                                    elif Parsing["node_id"] in self.sql_list:#sql
                                                        t1=re.findall( G_dict['desc'] , json.dumps(r_log) ,re.M|re.S)
                                                        print(t1,'匹配的是什么屌东西','这是sql')
                                                        if len(t1)>0:
                                                            t1=t1[0]
                                                        else:
                                                            t1=None
                                                    elif Parsing["node_id"] in self.Node_information:#定位
                                                        t1=re.findall( G_dict['desc'] , json.dumps(r_log) ,re.M|re.S)
                                                        print(t1,'匹配的是什么屌东西','这是定位')
                                                        if len(t1)>0:
                                                            t1=t1[0]
                                                        else:
                                                            t1=None
                                                    else:
                                                        t1=None
                                                        print('不知名的后置处理方式-正则')
                                                except Exception as e:
                                                    print(traceback.print_exc(),'Exception')
                                                    t1=None
                                                Parsing['Compare']#0大于1小于2等于
                                                t2=Parsing['Judgment_value']#判断的值                                            
                                            
                                                # #if r_log['Return_parameter']:#返回值没匹配到的时候直接返回
                                                # print(r_log,'r_log')
                                                # if r_log:
                                                    # pass
                                                # elif r_log.get('Return_parameter',None):#返回值没匹配到的时候直接返回
                                                    # if Parsing["node_id"] in self.api_list:#api
                                                        # t1=re.findall( G_dict['desc'] , r_log['Return_parameter'] ,re.M|re.S)
                                                        # if len(t1)>0:
                                                            # t1=t1[0]
                                                        # else:
                                                            # t1=None
                                                    # elif Parsing["node_id"] in self.rpa_list:#rpa
                                                        # t1=re.findall( G_dict['desc'] , json.dumps(r_log['Return_parameter']) ,re.M|re.S)
                                                        # if len(t1)>0:
                                                            # t1=t1[0]
                                                        # else:
                                                            # t1=None
                                                    # elif Parsing["node_id"] in self.sql_list:#sql
                                                        # t1=re.findall( G_dict['desc'] , json.dumps(r_log) ,re.M|re.S)
                                                        # if len(t1)>0:
                                                            # t1=t1[0]
                                                        # else:
                                                            # t1=None
                                                    # elif Parsing["node_id"] in self.Node_information:#定位
                                                        # t1=re.findall( G_dict['desc'] , json.dumps(r_log) ,re.M|re.S)
                                                        # if len(t1)>0:
                                                            # t1=t1[0]
                                                        # else:
                                                            # t1=None
                                                    # else:
                                                        # t1=None
                                                        # print('不知名的后置处理方式-正则')
                                                    # Parsing['Compare']#0大于1小于2等于
                                                    # t2=Parsing['Judgment_value']#判断的值
                                                
                                            else:
                                                print('找到未知的匹配类型')
                                            
                                            #大于小于用int等于用str
                                            print(t1,t2,'判断的数据',Parsing['Compare'])
                                            if Parsing['Compare']=='0':
                                                state=int(t1)>int(t2)
                                            elif Parsing['Compare']=='1':
                                                state=int(t1)<int(t2)
                                            elif Parsing['Compare']=='2':
                                                state=str(t1).strip()==str(t2).strip()#转换成字符串且去除前后空格
                                            elif Parsing['Compare']=='3':
                                                state=str(t1).strip()!=str(t2).strip()#转换成字符串且去除前后空格
                                            else:
                                                print('抓到一个未知的判断条件')
                                            
                                            list_state.append(state)
                                            print(state,'判断的结果')
                                    
                        
                        #这里判断最终的是否通过,不通过则递归获取子节点添加到list
                        state_i=True
                        for state_j in list_state:
                            state_i=state_i and state_j
                            print(state_i,'究竟怎么回事',state_j)
                        print(state_i,'判断的最终结果')

                        print(Rear_id,'左节点',current_id,'右节点',self.connections,'self.connections')
                        if not state_i:#这里添加到list
                            def tortoise(data):
                                if data in self.merge_list:#判断是否为聚合节点,如果是聚合节点则退出
                                    return
                                self.tortoise_list.append(data)
                                i=0
                                for  node_index_t in self.connections:
                                    current_id_t = self.connections[node_index_t]['current']#起点
                                    Rear_id_t = self.connections[node_index_t]['Rear']#终点
                                    if data==current_id_t:
                                        i=1
                                        return tortoise(Rear_id_t)
                                if i==0:
                                    return
                            tortoise(Rear_id)
                        print(self.tortoise_list,'判断后面的节点id')
            return True
        else:
            return None
                            
        
        
    def merge_logic(self,current_id):
        '''合并'''
        if current_id in self.merge_list:#这是合并节点	
            condition_dict=copy.copy(self.merge_node[current_id])
            print(condition_dict,'合并节点数据')
            del condition_dict['Workflow_name']
            for i in condition_dict:
                print(condition_dict,'------xxs------',i,list(self.list_r_data.keys()))#判断有没有执行结果,另外在不在error里
                if i in self.node_id_error or i not in list(self.list_r_data.keys()):#判断开启且执行成功
                    #当前触发Rear_id放递归
                    def tortoise(data):
                        if data in self.merge_list:#判断是否为聚合节点,如果是聚合节点则退出
                            return
                        self.tortoise_list.append(data)
                        i=0
                        for  node_index_t in self.connections:
                            current_id_t = self.connections[node_index_t]['current']#起点
                            Rear_id_t = self.connections[node_index_t]['Rear']#终点
                            if data==current_id_t:
                                i=1
                                return tortoise(Rear_id_t)
                        if i==0:
                            return
                    tortoise(Rear_id)
                    break
            return True
        return None
        
        
    def end_logic(self,Rear_id):
        '''终点'''
        if Rear_id not in self.list_current_id:#判断是否为结束节点
            if Rear_id not in self.tortoise_list:#判断不通过的子节点不走
                #这里走执行
                return True
        return None
        

#流程逻辑处理
class workflow(node_logic,node_function,parameter_replace):
    def __init__(self,data):
        '''数据初始化处理'''
        WORK_DATA=json.loads(data['Workflwow_obj'])[list(json.loads(data['Workflwow_obj']).keys())[0]]
        print(WORK_DATA,'WORK_DATAWORK_DATAWORK_DATAWORK_DATA')
        self.list_r_data={}#存返回值
        self.node_id_error=[]#存返回状态做判断
        if WORK_DATA['api_node']!="None":
            self.api_node=json.loads(WORK_DATA['api_node'])
        else:
            self.api_node=WORK_DATA['api_node']
        
        if WORK_DATA['if_node']!="None":
            self.if_node=json.loads(WORK_DATA['if_node'])
        else:
            self.if_node=WORK_DATA['if_node']
        
        if WORK_DATA['rpa_node']!="None":
            self.rpa_node=json.loads(WORK_DATA['rpa_node'])
        else:
            self.rpa_node=WORK_DATA['rpa_node']
        
        if WORK_DATA['Node_information']!="None":
            self.Node_information=json.loads(WORK_DATA['Node_information'])
        else:
            self.Node_information=WORK_DATA['Node_information']
        
        
        if WORK_DATA['merge_node']!="None":
            self.merge_node=json.loads(WORK_DATA['merge_node'])
        else:
            self.merge_node=WORK_DATA['merge_node']
        
        
        if WORK_DATA['sql_node']!="None":
            self.sql_node=json.loads(WORK_DATA['sql_node'])
        else:
            self.sql_node=WORK_DATA['sql_node']
        
        if WORK_DATA['condition']!="None":
            self.condition=json.loads(WORK_DATA['condition'])
        else:
            self.condition=WORK_DATA['condition']
        
        if WORK_DATA['Ginseng']!="None":
            self.Ginseng=json.loads(WORK_DATA['Ginseng'])
        else:
            self.Ginseng=WORK_DATA['Ginseng']
            
        self.connections=json.loads(WORK_DATA['connections'])
        self.list_current_id=[]#左端点
        self.list_Rear_id=[]#右端点
        if len(self.connections.keys()) > 0:#有连线时取出左右端点的放入list后面得用
            #遍历流程
            for node_index in self.connections:
                current_id = self.connections[node_index]['current']#起点
                Rear_id = self.connections[node_index]['Rear']#终点
                self.list_current_id.append(current_id)
                self.list_Rear_id.append(Rear_id)
            
        #拿到判断节点的id后面流程做判断
        self.if_list=[]
        for if_val in self.if_node:
            self.if_list.append(if_val)
        
        #拿到合并节点的id后面流程做判断
        self.merge_list=[]
        for merge_val in self.merge_node:
            self.merge_list.append(merge_val)
        
        #apilist
        self.api_list=[]
        if self.api_node!="None":
            for api_val in self.api_node:
                self.api_list.append(api_val)
        
        #rpa_list
        self.rpa_list=[]
        if self.rpa_node!="None":
            for  rpa_val in self.rpa_node:
                self.rpa_list.append(rpa_val)
            
        #sql_list
        self.sql_list=[]
        if self.sql_node!="None":
            for  sql_val in self.sql_node:
                self.sql_list.append(sql_val)
        
        #information_list
        self.information_list=[]
        if self.Node_information!="None":
            for  information_val in self.Node_information:
                self.information_list.append(information_val)
        
        
        
        #判断的节点id
        self.tortoise_list=[]
        
        #保存page状态
        self.page_status=False
        
        #保存page对象
        self.page=None
        
        #保存生成器
        self.p=None
        
        
    def dict_Sort(self,dict_val):
        list_current=[]
        list_Rear=[]
        for i in dict_val:
            list_current.append(dict_val[i]['current'])
            list_Rear.append(dict_val[i]['Rear'])

        # print(list_current)
        # print(list_Rear)

        for j in list_current:
            if j not in list_Rear:
                # print(j)
                current_1=j


        list_sx=[]
        def px(c):
            for dict in dict_val:
                if dict_val[dict]['current']==c:#左端点等于其他节点右端点
                    list_sx.append(json.dumps(dict_val[dict]))
                    px(dict_val[dict]['Rear'])
        px(current_1)


        def list_De(val):#这一步去掉多余的数据
            if len(val) == len(set(val)):#判断没有重复就退出
                return val

            for x in list(range(len(val))):#遍历list
                # print(val[x],'xxxxxxxxxxxxx',type(val[x]))
                if val.count(val[x])>1:#判断每组数据是否是唯一
                    val.pop(x)#重复就删除当前的
                    return list_De(val)
                    
        list_De(list_sx)

        #print(list_sx,len(list_sx),'\n\nlist_sxlist_sx\n\n')



        dict_cnm={}
        index=0
        while len(list_sx)>index:
            dict_cnm[str(index)]=json.loads(list_sx[index])
            index+=1
            
        #r_val=json.dumps(dict_cnm)
        # print(r_val)
        return dict_cnm
        
        
        
    def run_node(self,Rear_id,obj):
        '''执行节点'''
        if Rear_id in self.tortoise_list:#判断失败后的节点
            obj(self.list_r_data)#传给回调函数
            return
        
        if Rear_id in self.api_list:#属于api节点
            print('api_api')
            self.api_function(Rear_id)
            obj(self.list_r_data)#传给回调函数

        elif Rear_id in self.rpa_list:#属于rpa节点
            print('rpa_rpa')
            self.rpa_function(Rear_id)
            obj(self.list_r_data)#传给回调函数
            
        elif Rear_id in self.Node_information:#属于定位节点
            print('Node_information')
            self.position_function(Rear_id)
            obj(self.list_r_data)#传给回调函数
                
        elif Rear_id in self.sql_list:#属于sql节点
            print('sql_sql')
            self.sql_function(Rear_id)
            obj(self.list_r_data)#传给回调函数
                
                
    def run_logic(self,obj):
        '''执行'''
        print(self.connections,'从这里解决')#先考虑排序方式解决
        if len(self.connections.keys())>0:#多个节点时场景
            #遍历流程
            self.connections = self.dict_Sort(self.connections)#执行前得重新排序,待测试
            
            
            print(self.connections,'-----------------------')
            for  node_index in self.connections:
                # import time
                # time.sleep(2)
                current_id = self.connections[node_index]['current']#起点
                Rear_id = self.connections[node_index]['Rear']#终点
                #执行节点前先判断属于判断/合并,结尾节点
                if_status=self.if_logic(Rear_id,current_id)
                print(if_status,"if_status")
                if if_status=="continue":continue
                
                #合并跟分支还得判断是否有结束节点
                if if_status:#为判断节点
                    print('判断节点',Rear_id)
                    if self.end_logic(Rear_id):
                        self.run_node(Rear_id,obj)
                    else:
                        self.run_node(current_id,obj)
                elif self.merge_logic(current_id):#为合并节点
                    print('合并节点',Rear_id)
                    if self.end_logic(Rear_id):
                        self.run_node(Rear_id,obj)
                    else:
                        self.run_node(current_id,obj)
                    
                elif self.end_logic(Rear_id):#结束节点
                    print('结束节点',Rear_id)
                    if current_id not in self.if_list and current_id not in self.merge_list:
                        self.run_node(current_id,obj)#先执行正常节点再走结束节点
                    self.run_node(Rear_id,obj)
                else:
                    print('普通节点',current_id)
                    self.run_node(current_id,obj)

                
        else:#单节点场景
            print('单节点场景',self.api_list)
            #self.run_node(current_id,obj)
            if self.api_list:#属于api节点
                self.run_node(self.api_list[0],obj)
            elif self.rpa_list:#属于rpa节点
                self.run_node(self.rpa_list[0],obj)
            elif self.sql_list:#属于sql节点
                self.run_node(self.sql_list[0],obj)
            elif self.information_list:#属于定位节点
                print('进的是哪一个单节点')
                self.run_node(self.information_list[0],obj)


    def p_function(self):
        #定位时候处理的
        with sync_playwright() as playwright:
            #run(playwright)
            browser = playwright.chromium.launch(headless=False)
            context = browser.new_context()
            self.page = context.new_page()
            while True:
                res=yield
                id=res[0]
                Node_information=res[1]
                print(id,'到底对不对',Node_information)
                #
                Sort=Node_information[id+"_Sort"]
                for path_name in Sort:#得是节点名称带异常状态
                    try:
                        Node_information[id][path_name]#每个定位
                        print(Node_information[id][path_name],'关键中的关键')
                        # 这里出过一个原始字符串的坑,这里得有睡眠跟出参返回
                        if Node_information[id][path_name]['Positioning']=='0':
                            print(Node_information[id][path_name]['title'],"Node_information[id][path_name]['title']")
                            webderver=position.Playwright_api(self.page).single_selector(Node_information[id][path_name]['title'])
                            print(webderver,'webderver------None的时候就是没定位到')
                            position.action(webderver,path_name,res[2]).deal_with(Node_information[id][path_name])
                        elif Node_information[id][path_name]['Positioning']=='1':
                            position.Playwright_api(self.page).all_selector(Node_information[id][path_name]['title'])
                            position.action(webderver,path_name,res[2]).deal_with(res)
                        elif Node_information[id][path_name]['Positioning']=='2':
                            position.Playwright_api(self.page).wait_selector(Node_information[id][path_name]['title'])
                            position.action(webderver,path_name,res[2]).deal_with(res)
                        elif Node_information[id][path_name]['Positioning']=='8':#js对话
                            print("进入了js会话")
                            position.Playwright_api(self.page).dialogue(Node_information[id][path_name]['js'])
                        elif Node_information[id][path_name]['Positioning']=='10':#拖拽,这地方得前端效验int类型不然会报错
                            #'Start_width': '200', 'Start_height': '400', 'end_width': '400', 'end_height': '600',
                            Start_width = Node_information[id][path_name]['Start_width']
                            Start_height = Node_information[id][path_name]['Start_height']
                            end_width = Node_information[id][path_name]['end_width']
                            end_height = Node_information[id][path_name]['end_height']
                            position.Playwright_api(self.page).Drag(int(Start_width),int(Start_height),int(end_width),int(end_height))#拖拽要传四个
                        elif Node_information[id][path_name]['Positioning']=='11':
                            #python脚本
                            print('进来python脚本没')
                            print(repr(Node_information[id][path_name]['py']),'用户选的')
                            #eval(repr(Node_information[id][path_name]['py']))
                            exec(Node_information[id][path_name]['py'])
                            #eval(repr(Node_information[id][path_name]['py']))
                            
                        elif Node_information[id][path_name]['Positioning']=='12':#进入到url
                            self.page=position.Playwright_api(self.page).open_url(Node_information[id][path_name]['url'])
                            
                        elif Node_information[id][path_name]['Positioning']=='13':#关闭界面并且退出函数
                            print('请进先生')
                            sleep_time = Node_information[id][path_name]['sleep_time']
                            time.sleep(int(sleep_time))
                            self.page.close()
                            self.page = None
                            context.close()
                            browser.close()
                            return
                    
                    except StopIteration as err:
                        print('异常处理过滤StopIteration')
                    except Exception as e:
                        raise ValueError({path_name:e})
                        #raise ValueError('{%s:%s}' % (path_name,e))

                    #可能得优化StopIteration跟异常卡死后的关闭






def run_data(val,list_r_data):
    #参数处理
    val2=copy.copy(val)
    print(val,'valvalvalval')
    if not val:
        print('参数是空的')
        return
    Participate=[]#有几组数据
    WORK_DATA=json.loads(val['Workflwow_obj'])[list(json.loads(val['Workflwow_obj']).keys())[0]]
    if WORK_DATA['Workflow_parameter']!="None":
        Workflow_parameter=json.loads(WORK_DATA['Workflow_parameter'])
        if Workflow_parameter['data_status']:
            #判断是否开启
            for data_tile in Workflow_parameter['Workflow_parameter']:
                #遍历参数
                for tab_tile in Workflow_parameter['tab_status']:
                    if data_tile==tab_tile and Workflow_parameter['tab_status'][tab_tile]:
                        Participate.append(Workflow_parameter['Workflow_parameter'][data_tile])
                        
        if WORK_DATA['list_data']!="None":
            list_data=json.loads(WORK_DATA['list_data'])
        else:
            list_data=WORK_DATA['list_data']
        
        #{"val1":[{"data_name":"val1","key":"a","value":"你好"}]
        print(Participate,'Participate')
        if Participate:
            for k in Participate:#遍历组
                for l in k:#这一层得替换多次
                    for variable in list_data:
                        print(l['key'],variable,l['value'],val['Workflwow_obj'],'白发少年')
                        if l['key']==variable:
                            s=r'\$\{__data\((%s)\)\}' % l['key']
                            val2['Workflwow_obj']=re.sub(s,l['value'],val2['Workflwow_obj'])
                print(val2['Workflwow_obj'],'valvalvalvalvalvalvalvalvalvalval')
                workflow(val2).run_logic(list_r_data)	
                val2=copy.copy(val)
        else:
            #
            print('进去了!进去了!')
            for variable in list_data:
                #list_data#有几个变量	
                s=r'\$\{__data\((%s)\)\}' % variable
                val2['Workflwow_obj']=re.sub(s,list_data[variable],val2['Workflwow_obj'])
            workflow(val2).run_logic(list_r_data)	
            val2=copy.copy(val)#可能有问题	

        
        
    else:
        print('发生肾么事了')
        if WORK_DATA['list_data']!="None":
            list_data=json.loads(WORK_DATA['list_data'])
        else:
            list_data=WORK_DATA['list_data']
        print('list_data',list_data,type(list_data))
        if not list_data:
            print('来了没')
            Workflow_parameter=WORK_DATA['Workflow_parameter']
            workflow(val).run_logic(list_r_data)
        else:
            print('没来')
            for variable in list_data:
                print(variable,'variablevariable',list_data[variable],val2['Workflwow_obj'])
                s=r'\$\{__data\((%s)\)\}' % variable
                print(re.sub(s,list_data[variable],val2['Workflwow_obj']),'val2')
                val2['Workflwow_obj']=re.sub(s,list_data[variable],val2['Workflwow_obj'])
                #print(val2['Workflwow_obj'],'val2')
            workflow(val2).run_logic(list_r_data)
            val2=copy.copy(val)

        
