import re
import os
import json
import jsonpath
from playwright.sync_api import Playwright, sync_playwright
from Function.run_workflow import url_request
from Function.run_workflow import url_request
from Function.run_workflow import sql
from Function.run_workflow import position
import datetime
import time
import tempfile
import subprocess

def is_json(__str):
    if isinstance(__str,str):
        try:
            json.loads(__str)
            return True
        except:
            return False
    else:
        return True
    

def is_int(__str):
    try:
        int(__str)
        return True
    except:
        return False


class variable:
    """
        变量类
    """
    def __init__(self):
        pass

    def variable(self,__data):
        """
            取变量值
        """
        Variablelist=[list(i.values()) for i in jsonpath.jsonpath(self.VariableList,'$.[*].VariableJson')]
        __Variablelist=[]
        [__Variablelist.extend(i) for i in Variablelist]
        __Variablelist=[json.loads(i) for i in __Variablelist]
        __VariableStr=[i.get('Variablevalue') for i in __Variablelist if i.get('Variablename')==__data]
        __VariableStr =  __VariableStr[0] if  __VariableStr else False
        return __VariableStr

class ginseng:
    """
        出参类
    """
    def __init__(self):
        pass


    def ginseng(self,__ginseng):
        """
            出参匹配日志取出对应的值
        """
        __GinsengList=[list(i.get('GinsengJson').values()) for i in self.GinsengList]
        __GinsengList=[json.loads(i) for i in __GinsengList[0]]
        __GinsengList=[i for i in __GinsengList if i.get('ginseng_name') in __ginseng]
        # for __value in __GinsengList:#这里应该是永远只有一个，除非变量重名
        __value=__GinsengList[0]#这里应该是永远只有一个，除非变量重名

        __GinsengStr=False
        if __value.get('ginseng_type')=='JsonPath':
            __str=self.runlog[__value.get('nodeid')].get('res')
            if is_json(__str):
                __str=json.loads(__str) if isinstance(__str,str) else __str
                __jvalue=jsonpath.jsonpath(__str,__value.get('ginseng'))
                # __jvalue=jsonpath.jsonpath(json.loads(__str),__value.get('ginseng'))
                if __jvalue: __GinsengStr=__jvalue[0]#目前jsonpath只取第一位
            else:
                # raise Exception(__str+"不能被解析成json")
                print('不能被解析成json')
                __GinsengStr=False

        elif __value.get('ginseng_type')=='re':
            __str=self.runlog[__value.get('nodeid')].get('res')
            replace_val=re.findall(__value.get('ginseng'),__str,re.M|re.S)
            if replace_val:__GinsengStr=replace_val[0]#目前正则只取第一位
        else:
            __GinsengStr=False
            raise Exception("未知的变量匹配模式")

        return __GinsengStr



class StrFind(variable,ginseng):
    """
        替换类
    """
    def __init__(self):
        pass

    
    def StrFind(self,__str):
        """
            分类匹配变量或者出参
        """
        __ginseng=re.findall(r"\$\{__ginseng\((.*?)\)\}",__str,re.M|re.S)
        if __ginseng:
            __valuestr=self.ginseng(__ginseng)
            if __valuestr:
                __str = __str.replace('${__ginseng(%s)}' % __ginseng[0],str(__valuestr))#这里的__valuestr会转成str
        __data=re.findall(r"\$\{__data\((.*?)\)\}",__str,re.M|re.S)
        if __data:
            for __val in __data:
                __valuestr=self.variable(__val)
                if __valuestr:
                    __str = __str.replace('${__data(%s)}' % __val,str(__valuestr))
        return __str


class branch(StrFind):
    """
        分支类
    """
    def __init__(self):
        pass

    def not_run_node_add(self,nodeid):
        """
            添加不执行的节点
        """
        DataList=[i for i in self.connections.values()]
        CurrentList=[i.get('current') for i in DataList]
        RearList=[i.get('Rear') for i in DataList]
        addstatus=False
        Rear=None
        for __dict in DataList:
            current=__dict.get("current")#当前节点
            if current == nodeid:addstatus=True#开启添加
            if addstatus:

                if Rear == current or Rear == None or current in self.notrun:
                    
                    if self.models.Node.objects.filter(Nodeid=current).values("NodeType")[0].get("NodeType")==6:break
                    # if Rear:pass
                    self.notrun.add(current)#添加至set
                    if self.models.Node.objects.filter(Nodeid=__dict.get("Rear")).values("NodeType")[0].get("NodeType")!=6:self.notrun.add(__dict.get("Rear"))#添加至set


                    runnode=Rear if Rear not in CurrentList else False#没有下一个节点的情况
                    if runnode:
                        if self.models.Node.objects.filter(Nodeid=current).values("NodeType")[0].get("NodeType")==6:break
                        self.notrun.add(current)#添加至set
                Rear= __dict.get("Rear")#下一个节点


    def logical_transport(self,GList):
        """
            逻辑运算
        """
        # print('进入到了逻辑运算')
        for __dict in GList:
            v_1=self.StrFind(__dict.get('Ginseng'))#判断
            Compare=__dict.get('Compare')#判断条件
            v_2=self.StrFind(__dict.get('Judgment_value'))#判断值
            if Compare=="0":
                if is_int(v_1) and is_int(v_2):
                    status=v_1>v_2
                else:
                    raise Exception("大小判断必须为数字")
            elif Compare=="1":
                if is_int(v_1) and is_int(v_2):
                    status=v_1<v_2
                else:
                    raise Exception("大小判断必须为数字")
            elif Compare=="2":
                print(v_1,'小方不是文化人',v_2)
                status=v_1==v_2
            elif Compare=="3":
                status=v_1!=v_2
            else:
                raise Exception("未知的判断类型")
            if status==False:return status#一个判断不成功就直接返回
        return True


    def the_branch(self,nodeid):
        """
            分支连线
        """
        # print('进入了分支')
        branchjson=[json.loads(jsonpath.jsonpath(json.loads(i),r"$.nodejson")[0]) for i in jsonpath.jsonpath(self.ConditionList,r"$[*].ConditionJson")]
        node_dict=self.models.Node.objects.filter(Nodeid=nodeid).values("NodeType","NodeJson","name")
        NodeName=node_dict[0].get("name")
        nodejson=json.loads(node_dict[0].get("NodeJson"))
        Judgment_node=nodejson[nodeid]['Judgment_node']
        status=False
        for __data in branchjson:
            title_list=jsonpath.jsonpath(__data,r"$.data[?(@.status=='on')].title")
            if title_list:
                for __title in title_list:
                    if Judgment_node.get(__title):#判断是否存在
                        status=self.logical_transport(Judgment_node[__title])#进入到逻辑运算
                        if status==False:#失败时添加节点
                            self.not_run_node_add(__data['Lower_endpoint_id'])
                            break#只要一个判断失败就返回
        res={
            "name":NodeName,
            "status":status,#节点执行状态0没执行，1成功，2失败 
            "res":None#响应参数json
        }

        self.runlog[nodeid]=res#把日志添加到runlog

        yield




class Merge:
    """
        合并类
    """
    def __init__(self):
        pass

    def run_merge(self,nodeid):
        """
            合并节点执行
        """
        node_dict=self.models.Node.objects.filter(Nodeid=nodeid).values("NodeType","NodeJson","name")
        status_type=node_dict[0].get("NodeType")
        NodeJson=node_dict[0].get("NodeJson")
        NodeName=node_dict[0].get("name")

        print('进入了合并节点',nodeid)
        # print(NodeJson)
        __dict=json.loads(NodeJson).get(nodeid)
        __dict.pop('Workflow_name')

        for node_id in __dict:
            print(self.runlog.get(node_id),'self.runlog.get(node_id)')
            DataList=[i for i in self.connections.values()]

            if self.runlog.get(node_id):
                if self.runlog.get(node_id).get("status")!=1:
                    for __dict in DataList:
                        if __dict.get("current")==nodeid:#当前节点
                            self.not_run_node_add(__dict.get("Rear"))#不等于1也是失败

                    # self.not_run_node_add(nodeid)#不等于1也是失败
                    break
            else:
                for __dict in DataList:
                    if __dict.get("current")==nodeid:#当前节点
                        self.not_run_node_add(__dict.get("Rear"))#不等于1也是失败
                # self.not_run_node_add(nodeid)#日志里没有就等于没执行添加当前节点到控制节点前的
                break

        res={
            "status":1,#节点执行状态0没执行，1成功，2失败 
            "res":None,#响应参数json
            "name":NodeName
        }

        self.runlog[nodeid]=res#把日志添加到runlog


        yield



class positionrun(StrFind):
    def __init__(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(channel="chrome",headless=True,args=["--start-maximized"])
        # self.browser = self.playwright.chromium.launch(channel="chrome",headless=False,args=["--start-maximized"])
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
        # pass

    def run_position(self,nodeid):
        """
            定位节点
        """
        node_dict=self.models.Node.objects.filter(Nodeid=nodeid).values("NodeType","NodeJson","name")

        print(list(node_dict),'我要找节点名称')
        NodeJson=node_dict[0].get("NodeJson")
        NodeName=node_dict[0].get("name")
        requets_data=json.loads(self.StrFind(NodeJson))
        print(requets_data,'requets_datarequets_datarequets_data')



        try:
            logdict={}
            def obj(val):
                logdict.update(val)
            Node_information=requets_data[nodeid]
            Sort=requets_data[nodeid+"_Sort"]
            for path_name in Sort:#得是节点名称带异常状态
                # context = self.browser.new_context(record_video_dir="../Function/run_workflow/videos/%s" % nodeid)
                # context = self.browser.new_context(record_video_dir="/Users/fangyan2013/Desktop/videos/%s/" % nodeid)
                # Node_information[path_name]['path_name']
                try:
                    Node_information[path_name]#每个定位
                    if Node_information[path_name]['Positioning']=='0':
                        webderver=position.Playwright_api(self.page).single_selector(Node_information[path_name]['title'])
                        position.action(webderver,Node_information[path_name]['path_name'],obj).deal_with(Node_information[path_name])
                    elif Node_information[path_name]['Positioning']=='1':
                        position.Playwright_api(self.page).all_selector(Node_information[path_name]['title'])
                        position.action(webderver,Node_information[path_name]['path_name'],obj).deal_with(Node_information[path_name])
                    elif Node_information[path_name]['Positioning']=='2':
                        position.Playwright_api(self.page).wait_selector(Node_information[path_name]['title'])
                        position.action(webderver,Node_information[path_name]['path_name'],obj).deal_with(Node_information[path_name])
                    elif Node_information[path_name]['Positioning']=='8':#js对话
                        position.Playwright_api(self.page).dialogue(Node_information[path_name]['js'])
                    elif Node_information[path_name]['Positioning']=='10':#拖拽,这地方得前端效验int类型不然会报错
                        #'Start_width': '200', 'Start_height': '400', 'end_width': '400', 'end_height': '600',
                        Start_width = Node_information[path_name]['Start_width']
                        Start_height = Node_information[path_name]['Start_height']
                        end_width = Node_information[path_name]['end_width']
                        end_height = Node_information[path_name]['end_height']
                        position.Playwright_api(self.page).Drag(int(Start_width),int(Start_height),int(end_width),int(end_height))#拖拽要传四个
                    elif Node_information[path_name]['Positioning']=='11':#python脚本
                        exec(Node_information[path_name]['py'])                        
                    elif Node_information[path_name]['Positioning']=='12':#进入到url
                        self.page=position.Playwright_api(self.page).open_url(Node_information[path_name]['url'])
                    elif Node_information[path_name]['Positioning']=='13':#关闭界面并且退出函数
                        sleep_time = Node_information[path_name]['sleep_time']
                        time.sleep(int(sleep_time))
                        self.page.screenshot(path=f'./static/PositionImg/%s' % nodeid)
                        print('关闭了')
                        self.page.close()
                        self.page = None
                        self.context.close()
                        self.browser.close()
                        self.playwright.stop()

                        # return
                    time.sleep(int(Node_information[path_name]['sleep_time']))#睡眠时间

                except StopIteration as err:
                    print('异常处理过滤StopIteration')
                except Exception as e:
                    raise ValueError({path_name:e})

            print(self.page,'++'*10)
            # if self.page:self.page.screenshot(path=f'./static/PositionImg/%s' % nodeid)

            status=1
            res=logdict
            print(res,'resresresresresresresresres')
        except Exception as e:
            res="ERROR:%s" % e
            status=2
            # self.page.screenshot(path=f'./static/PositionImg/%s' % nodeid)
            print(res,'resresresresresresresresres')
        
        self.page.screenshot(path=f'./static/PositionImg/%s' % nodeid)

        res={
            "status":status,#节点执行状态0，1，2
            "res":res,#响应参数json
            "name":NodeName,
            'img':'../static/PositionImg/%s' % nodeid
        }

        # if self.page:res['img']='../static/PositionImg/%s' % nodeid

        self.runlog[nodeid]=res#把日志添加到runlog
        yield res

                




class RunLogic(branch,Merge,positionrun):
    """
        执行逻辑
    """
    def __init__(self,connections,GinsengList,VariableList,ConditionList,Workflow_id,DataJson,models,conn,userid):
        self.connections=connections
        self.GinsengList=GinsengList
        self.VariableList=VariableList
        self.ConditionList=ConditionList
        self.DataJson=DataJson
        self.Workflow_id=Workflow_id
        self.models=models
        self.conn=conn
        self.userid=userid
        self.notrun=set()#不执行的节点
        self.runlog=dict()
        self.runlogsort=list()
        positionrun.__init__(self)

    def node_type(self,nodeid):
        """
            节点类型判断
        """
        map_obj={
            1:self.run_api(nodeid),#api
            2:self.run_sql(nodeid),#sql节点
            3:self.run_rpa(nodeid),#rpa
            4:self.run_position(nodeid),#定位节点
            5:self.the_condition(nodeid),#分支节点数据
            6:self.run_merge(nodeid),#合并节点
            7:self.the_branch(nodeid),#条件节点 
            8:self.run_py3(nodeid),#py节点 
        }

        node_dict=self.models.Node.objects.filter(Nodeid=nodeid).values("NodeType")
        status_type=node_dict[0].get("NodeType")
        print(status_type,'==========================',nodeid)
        # map_obj[status_type]#执行节点



        try:
            next(map_obj[status_type])
        except StopIteration:
            pass
        print('进入了节点类型判断并执行节点')

    def run_api(self,nodeid):
        """
            api节点
        """
        node_dict=self.models.Node.objects.filter(Nodeid=nodeid).values("NodeType","NodeJson","name")
        NodeJson=node_dict[0].get("NodeJson")
        NodeName=node_dict[0].get("name")
        requets_data=json.loads(self.StrFind(NodeJson))

        try:
            res=url_request.Deal_with().request_data(requets_data)
            res = json.loads(res) if is_json(res) else res
            # print(res,'resresresresresresresresres')
            status=1
        except Exception as e:
            res="ERROR:%s" % e
            status=2
            print(res,'resresresresresresresresres')

        res={
            "status":status,#节点执行状态0，1，2
            "res":res,#响应参数json
            "name":NodeName
        }

        self.runlog[nodeid]=res#把日志添加到runlog
        yield res



    def run_py3(self,nodeid):
        """
            python3节点
        """
        node_dict=self.models.Node.objects.filter(Nodeid=nodeid).values("NodeType","NodeJson","name")
        NodeJson=node_dict[0].get("NodeJson")
        NodeName=node_dict[0].get("name")
        print(NodeJson,'NodeJsonNodeJsonNodeJsonNodeJson',self.StrFind(NodeJson))
        requets_data=self.StrFind(NodeJson)
        print(requets_data)

        try:
            # pyval=request.POST.get('data')
            with tempfile.NamedTemporaryFile('w+t',delete=False,suffix='.py',dir='./static/tempfile') as tmp:
                print(tmp.name)
                tmp.write(requets_data)
            res=subprocess.getstatusoutput('python3 {py}'.format(py=tmp.name))
            print(res,'resultresultresult')
            res=res[1]
            tmp.close()
            os.unlink(tmp.name)
            status=1
        except Exception as e:
            res="ERROR:%s" % e
            status=2
            print(res,'resresresresresresresresres')
        res={
            "status":status,#节点执行状态0，1，2
            "res":res,#响应参数json
            "name":NodeName
        }
        self.runlog[nodeid]=res#把日志添加到runlog
        yield res


    def run_sql(self,nodeid):
        """
            sql节点
        """
        yield

    def run_rpa(self,nodeid):
        """
            rpa节点
        """
        yield

    def the_condition(self,nodeid):
        """
            分支节点
        """
        yield

    def node_sort(self):
        """
            节点排序
                找出应该执行的节点
                data:流程节点顺序数据
        """
        self.models.Scenes.objects.filter(Scenesid=self.Workflow_id).update(status=2)#状态改为执行中
        self.conn.set('runWorkflowIdstatus'+self.Workflow_id,json.dumps({"Workflowid":self.Workflow_id,"status":'run'}),ex=60*60*3)#流程执行状态
        DataList=[i for i in self.connections.values()]
        CurrentList=[i.get('current') for i in DataList]
        RearList=[i.get('Rear') for i in DataList]
        # if len(DataList)==0:
        #     #单节点         self.Workflow_id=Workflow_id
        #     Scenesobj = self.models.Scenes.objects.get(Scenesid=self.Workflow_id)
        #     Nodeid = self.models.Node.objects.filter(ScenesId=Scenesobj).values('Nodeid')
        #     print(Nodeid,"list(Nodeid)[0].get('Nodeid')")
        #     DataList.append(list(Nodeid)[0].get('Nodeid'))


        #     pass

        for __dict in DataList:
            current=__dict.get("current")#当前节点
            Rear= __dict.get("Rear")#下一个节点
            print(self.notrun,'self.notrunself.notrun')
            if current not in self.notrun:
                starttime=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")#开始时间
                self.node_type(current)#判断节点类型
                endtime=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")#结束时间
                self.runlog.get(current)["starttime"]=starttime#添加开始时间
                self.runlog.get(current)["endtime"]=endtime#添加结束时间
                self.conn.set('runWorkflowId'+self.Workflow_id,json.dumps({current:self.runlog.get(current)}),ex=60*60*3)
                self.runlogsort.append(current)#添加节点执行顺序
                if self.runlog.get(current).get('status')==2:#节点失败时终止流程
                    DataList.clear()
            runnode=Rear if Rear not in CurrentList else False#没有下一个节点的情况
            if runnode:
                if runnode not in self.notrun:
                    starttime=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")#开始时间
                    test=self.node_type(runnode)#判断节点类型并执行
                    endtime=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")#结束时间
                    self.runlog.get(runnode)["starttime"]=starttime#添加开始时间
                    self.runlog.get(runnode)["endtime"]=endtime#添加结束时间
                    self.conn.set('runWorkflowId'+self.Workflow_id,json.dumps({runnode:self.runlog.get(runnode)}),ex=60*60*3)
                    self.runlogsort.append(runnode)#添加节点执行顺序
                    if self.runlog.get(runnode).get('status')==2:#节点失败时终止流程
                        DataList.clear()
                        self.models.Scenes.objects.filter(Scenesid=self.Workflow_id).update(status=4)#状态改为执行失败
            self.conn.set('runlog'+self.Workflow_id,json.dumps({"runlog":self.runlog,"runlogsort":self.runlogsort}),ex=60*60*3)#流程当前执行状态
        else:
            print('是否进入了保存日志')
            Workflow_obj=self.models.Scenes.objects.get(Scenesid=self.Workflow_id)
            self.models.WorkflowLog.objects.create(LogJson={"runlog":self.runlog,"runlogsort":self.runlogsort},ScenesId=Workflow_obj)
            self.runlogsort.clear()
            self.runlog.clear()
            if self.page:#不为none的时候关闭
                self.page.close()
                self.context.close()
                self.browser.close()
                self.playwright.stop()
                print('关闭了')

            self.models.Scenes.objects.filter(Scenesid=self.Workflow_id).update(status=1)#状态改为执行成功
            self.conn.set('runWorkflowIdstatus'+self.Workflow_id,json.dumps({"Workflowid":self.Workflow_id,"status":'Finish'}),ex=60*60*3)

