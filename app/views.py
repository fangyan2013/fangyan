# coding:utf-8
from django.shortcuts import render,redirect,HttpResponse
from django.core.cache import cache,caches
import redis
from utils.redis_pool import POOL
import tempfile
from django.http import FileResponse,StreamingHttpResponse
import io
from django.forms.models import model_to_dict
import subprocess
import re
import json
import uuid
from app import models
from app import MyJSONEncoder
from django.contrib import auth
from Function.run_workflow import url_request
from Function.run_workflow import sql
from Function.run_workflow import run_workflow_a
from django.http import HttpResponseRedirect
from django.utils.timezone import now
from django.db import connection
import pymysql
import time
from django.db.models import Max 
from django.db.models import Count
from django.db.models import Q
from django.core.paginator import Paginator
import os
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.clickjacking import xframe_options_deny
from django.views.decorators.clickjacking import xframe_options_sameorigin
import random
from json_data import workfliow_json
from report import report
import math
import shutil
# User.objects.create(username='runboo',password='123')
# User.objects.create_user(username='runbooo',password='123')
# User.objects.create_superuser(username='runboooo',password='123',email='runboo@163.com')


def login(request):
    #登录页面
    if request.method=="GET":
        print('进入了进入了')
        return render(request,"login.html")
    if request.method=="POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        userid = models.user.objects.get(username=username,password=password).id#查询userid        
        if not userid:
            data = {"code": 500, "msg":"登录失败"}
            return HttpResponse(json.dumps(data),content_type="application/json")
        else:
            Cookie=str(uuid.uuid4())
            request.session["Cookie"] =Cookie
            request.session["Userid"] =userid
            data = {"code": 200, "msg":"登录成功","data":{"Cookie":Cookie}}
            return HttpResponse(json.dumps(data),content_type="application/json")
        
def login_required(func):
    def wrapper(request, *args, **kwargs):
        if request.session.get('Cookie', None)==None or request.session.get('Cookie', None)==None:
            return HttpResponseRedirect('/login/')
        if request.session.get('Cookie', None)==request.headers.get('Cookie').split('Cookie=')[1]:            
            return func(request, *args, **kwargs)
        else:
            return HttpResponseRedirect('/login/')  #用于记录访问历史页面，便于登录后跳转
    return wrapper

def logout(request):
    #退出登录
    if request.method=="GET":
        ppp = auth.logout(request)
        return redirect("/login/")

def adduser(request):
    #添加用户
    if request.method=="GET":
        return render(request,"adduser.html")

    if request.method=="POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")
        # models.user(username=username,password=password,email=email)
        models.user.objects.create(username=username,password=password,email=email)
        return redirect("/login/")


@login_required
def home_000(request):
    #主界面
    return render(request,"home_000.html")

@login_required
def rpa_000(request):
    #rpa节点
    return render(request,"rpa_000.html")

@login_required
def rpa_Recording_000(request):
    #rpa录制接口 暂时弃用
    if request.method=="POST":
        file_name=request.POST.get("file_name")
        file_url=request.POST.get("file_url")
        result=os.system("python -m playwright codegen --target python -o ./static/rpa_py/%s.py -b chromium %s" % (file_name,file_url))
        with open('./static/rpa_py/%s.py' % file_name, 'r', encoding='utf-8') as f:
            str_file=f.read()
        data = {"code": 0, "msg":"成功", "data":str_file}
        return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def rpa_test_000(request):
    #rpa测试接口
    if request.method=="POST":
        file_name=request.POST.get("file_name")
        result=os.system('python ./static/rpa_py/%s.py' % file_name)
        data = {"code": 0, "msg":"成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
	
@login_required
def rpa_updata_000(request):
    #rpa文件更新接口
    if request.method=="POST":
        file_name=request.POST.get("file_name")
        rpa_txt=request.POST.get("rpa_txt")
        with open('./static/rpa_py/%s.py' % file_name, 'w', encoding='utf-8') as f:
            f.write(rpa_txt)
        data = {"code": 0, "msg":"成功", "data":[]}
        return HttpResponse(json.dumps(data),content_type="application/json")


@login_required
def Strategy(request):
    #测试策略
    return render(request,"Strategy.html")


@login_required
def url_000(request):
    #api节点
    return render(request,"url_000.html")

@login_required
def ui_000(request):
    #工作流界面
    if request.method=="GET":
        project_obj=models.project.objects.all()
        __list=list()
        for i in project_obj:
            Scenes_obj = models.Scenes.objects.filter(projectid=i).values("Scenesid", "id","name","projectid__id","projectid__name")
            __list_workflow=[]
            for __dict in Scenes_obj:
                __list_workflow.append(
                    {
                        "Scenesid":__dict.get("Scenesid"),
                        "name":__dict.get("name"),
                        "id":__dict.get("id")
                    }
                )
            __dict={
                "projectid":i.id,
                "projectname":i.name,
                "Workflow_list":__list_workflow
            }
            __list.append(__dict)
        data = {"code": 200, "msg":"成功", "data":__list}
    return render(request,"ui_000.html",data)

@login_required
def position_000(request):
    #定位界面
    return render(request,"position_000.html")	

@login_required
def py3(request):
    #python3界面
    return render(request,"py3.html")	

@login_required
def pyrun(request):
    #python测试
    if request.method=="POST":
        pyval=request.POST.get('data')
        with tempfile.NamedTemporaryFile('w+t',delete=False,suffix='.py',dir='./static/tempfile') as tmp:
            tmp.write(pyval)
        result=subprocess.getstatusoutput('python3 {py}'.format(py=tmp.name))
        tmp.close()
        os.unlink(tmp.name)
        data = {"code": 200, "msg":"成功", "data":result[1]}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def mysql_000(request):
    '''mysql界面'''
    return render(request,"mysql_000.html")

@login_required
def mysql_000_test(request):
    '''mysql测试'''
    if request.method=="POST":
        host=request.POST.get('host')
        port=request.POST.get('port')
        user=request.POST.get('user')
        passwd=request.POST.get('passwd')
        db=request.POST.get('db')
        str_sql=request.POST.get('str_sql')
        sql_val=sql.sql_lave(host,int(port),user,passwd,db).run_sql(str_sql)
        if sql_val[0]:
            val=MyJSONEncoder.MYSQL_JSON(sql_val[0],sql_val[1])
            data = {"code": 200, "msg":"成功", "data":val}
        else:
            data = {"code": 201, "msg":"成功", "data":str(sql_val[1])}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def mysql_000_connect(request):
    '''mysql连接'''
    if request.method=="POST":
        host=request.POST.get('host')
        port=request.POST.get('port')
        user=request.POST.get('user')
        passwd=request.POST.get('passwd')
        db=request.POST.get('db')
        try:
            sql.sql_lave(host,int(port),user,passwd,db)
            status=True
        except:
            status=False
    data = {"code": 0, "msg":"成功","data":status}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def url_000_test(request):
    #接口验证
    if request.method=="POST":
        value=json.loads(request.POST.get('data'))
        r_p=url_request.Deal_with()
        r_text=r_p.request_data(value)
        data = {"code": 0, "msg":"成功", "data":r_text}
        return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def if_000(request):
    #分支
    return render(request,"if_000.html")

@login_required
def merge_000(request):
    #合并
    return render(request,"merge_000.html")

@login_required
def condition_000(request):
    #连线判断
    return render(request,"condition_000.html")

@login_required
def data_000(request):
    #参数配置界面
    return render(request,"data_000.html")

@login_required
def New_template(request):
    #模板新增
    if request.method=="POST":
        img_status=request.POST.get('img_status')
        url=request.POST.get('url')
        name=request.POST.get('name')
        nodeid=request.POST.get('nodeid')
        nodetype=request.POST.get('nodetype')
        WorkflowId=request.POST.get('WorkflowId')
        Treegr=request.POST.get('Treegr')
        node_obj = models.Node.objects.get(Nodeid=nodeid)
        userid=request.session.get('Userid')
        userid = models.user.objects.get(id=userid)
        models.NodeTemplate.objects.create(name=name,url=url,img_status=img_status,NodeId=node_obj,userid=userid,Treegr=Treegr,nodetype=nodetype)
        data = {"code": 200, "msg":"成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
        
@login_required
def select_template(request):
    #模板查询
    if request.method=="GET":
        userid=request.session.get('Userid')
        userid = models.user.objects.get(id=userid)
        value = models.NodeTemplate.objects.filter(Q(userid=userid)|Q(Treegr=1)).values('id','name','url','img_status','NodeId_id')
        value= list(value) if value else None
        data = {"code": 200, "msg":"成功",'data':value}
        return HttpResponse(json.dumps(data),content_type="application/json")
        
@login_required
def del_template(request):
    #模板删除
    if request.method=="GET":
        id=request.GET.get('id')
        models.NodeTemplate.objects.filter(id=id).delete()
        data = {"code": 200, "msg":"删除成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
        
@login_required
def generateTemplate(request):
    #模板生成节点数据
    if request.method=="GET":
        id=request.GET.get('id')
        nodeid=request.GET.get('nodeid')
        WorkflowId=request.GET.get('WorkflowId')
        NodeJson = models.NodeTemplate.objects.filter(id=id).values('NodeId_id')
        NodeJson = models.Node.objects.filter(id=NodeJson[0].get("NodeId_id")).values()
        NodeJson = NodeJson[0] if NodeJson else None
        if NodeJson==None:
            data = {"code": 200, "msg":"无法查询到模版数据"}
            return HttpResponse(json.dumps(data),content_type="application/json")
        try:
            __nodejson=json.loads(NodeJson.get('NodeJson')).get(NodeJson.get('Nodeid'))
            if NodeJson.get('NodeType')==4:
                __nodejson_Sort=json.loads(NodeJson.get('NodeJson')).get(NodeJson.get('Nodeid')+"_Sort")
                __NodeJson={
                    nodeid:__nodejson,
                    nodeid+"_Sort":__nodejson_Sort
                }
            else:
                __NodeJson={nodeid:__nodejson}
        except:
            __nodejson=NodeJson.get('NodeJson')#这里python节点数据兼容
            __NodeJson=__nodejson
        status_type=NodeJson.get('NodeType')
        __value={
            "nodeid":nodeid,
            "name":NodeJson.get('name')+'_copy',
            "nodejson":json.dumps(__NodeJson),
        }
        conn = redis.Redis(connection_pool=POOL)
        if status_type==1:#api
            __value["nodetype"]="api"
            conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        elif status_type==2:#sql节点
            __value["nodetype"]="sql"
            conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        elif status_type==3:#rpa
            __value["nodetype"]="rpa"
            conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        elif status_type==4:#定位节点
            __value["nodetype"]="position"
            conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        elif status_type==5:#分支节点数据
            __value["nodetype"]="condition"
            conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        elif status_type==6:#合并节点
            __value["nodetype"]="merge"
            conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        elif status_type==7:#条件节点
            __value["nodetype"]="judge"
            conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        elif status_type==8:#py3
            __value["nodetype"]="py3"
            conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        else:
            print("未知的类型")
        data = {"code": 200, "msg":"生成成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
        
@login_required
def Workflow_save(request):
    #保存工作流数据
    if request.method=="POST":
        Workflow_id=request.POST.get('Workflow_id')
        Workflow_name=request.POST.get('Workflow_name')
        Workflwow_obj=request.POST.get('Workflwow_obj')
        projectid=request.POST.get('projectid')
        ScenesJson={
            "Workflow_id":Workflow_id,
            "Workflow_name":Workflow_name,
            "Workflwow_obj":Workflwow_obj
        }
        userid=request.session.get('Userid')
        objects_obj = models.project.objects.get(id=projectid)
        user_obj = models.user.objects.get(id=userid)
        models.Scenes.objects.update_or_create(Scenesid=Workflow_id,defaults={'userid':user_obj,'projectid':objects_obj,'ScenesJson':json.dumps(ScenesJson),"name":Workflow_name})
        Workflwow_dict=json.loads(Workflwow_obj)
        connections=json.loads(Workflwow_dict.get('connections'))
        node_tupe=set()
        for keys in connections:
            values=connections.get(keys)
            current=values.get('current')
            Rear=values.get('Rear')
            node_tupe.add(current)
            node_tupe.add(Rear)
        conn = redis.Redis(connection_pool=POOL)
        Workflow_obj=models.Scenes.objects.get(Scenesid=Workflow_id)
        for nodeid in node_tupe:#从redis中保存节点数据至mysql
            if conn.exists(nodeid):
                nodetype=json.loads(conn.get(nodeid)).get('nodetype')
                nodejson=json.loads(conn.get(nodeid)).get('nodejson')
                nodename=json.loads(conn.get(nodeid)).get('name')
                if nodetype=="condition":#分支节点数据
                    models.Node.objects.update_or_create(Nodeid=nodeid,defaults={'NodeJson':nodejson,'NodeType':5,'ScenesId':Workflow_obj,'name':nodename})
                elif nodetype=="judge":#条件节点
                    models.Node.objects.update_or_create(Nodeid=nodeid,defaults={'NodeJson':nodejson,'NodeType':7,'ScenesId':Workflow_obj,'name':nodename})
                elif nodetype=="merge":#合并节点
                    models.Node.objects.update_or_create(Nodeid=nodeid,defaults={'NodeJson':nodejson,'NodeType':6,'ScenesId':Workflow_obj,'name':nodename})
                elif nodetype=="sql":#sql节点
                    models.Node.objects.update_or_create(Nodeid=nodeid,defaults={'NodeJson':nodejson,'NodeType':2,'ScenesId':Workflow_obj,'name':nodename})
                elif nodetype=="position":#定位节点
                    models.Node.objects.update_or_create(Nodeid=nodeid,defaults={'NodeJson':nodejson,'NodeType':4,'ScenesId':Workflow_obj,'name':nodename})
                elif nodetype=="rpa":#rpa
                    models.Node.objects.update_or_create(Nodeid=nodeid,defaults={'NodeJson':nodejson,'NodeType':3,'ScenesId':Workflow_obj,'name':nodename})
                elif nodetype=="api":#api
                    models.Node.objects.update_or_create(Nodeid=nodeid,defaults={'NodeJson':nodejson,'NodeType':1,'ScenesId':Workflow_obj,'name':nodename})
                elif nodetype=="py3":#py3
                    models.Node.objects.update_or_create(Nodeid=nodeid,defaults={'NodeJson':nodejson,'NodeType':8,'ScenesId':Workflow_obj,'name':nodename})
                else:
                    print("未知的节点类型")

            if conn.exists("Ginseng"+nodeid):#从redis中保存出参数据至mysql
                GinsengJson=conn.hgetall("Ginseng"+nodeid)
                node_obj=models.Node.objects.get(Nodeid=nodeid)
                models.Ginseng.objects.update_or_create(GinsengId="Ginseng"+nodeid,defaults={"GinsengJson":GinsengJson,"NodeId":node_obj})
            if conn.exists("Variable"+Workflow_id):#从redis中保存变量数据至mysql
                VariableJson=conn.hgetall("Variable"+Workflow_id)
                models.RunVariable.objects.update_or_create(VariableId="Variable"+Workflow_id,defaults={"VariableJson":VariableJson,"ScenesId":Workflow_obj})
            if conn.exists("condition"+nodeid):#从redis中保存判断连线数据至mysql
                ConditionJson=conn.get("condition"+nodeid)
                models.Condition.objects.update_or_create(ConditionId="Condition"+nodeid,defaults={"ConditionJson":ConditionJson,"ScenesId":Workflow_obj,'name':nodename})
        if conn.exists("Data"+Workflow_id):#从redis中保存执行时参数至mysql
            DataJson=conn.get("Data"+Workflow_id)
            models.ScenesData.objects.update_or_create(DataId="Data"+Workflow_id,defaults={"DataJson":DataJson,"ScenesId":Workflow_obj})
        data = {"code": 200, "msg":"成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def GetWorkflow(request):#查询
    #查询工作流数据
    if request.method=="POST":
        Workflow_id=request.POST.get('Workflow_id')
        ScenesJson = models.Scenes.objects.filter(Scenesid=Workflow_id).values('ScenesJson')
        if ScenesJson.exists():
            print("yes,we have this email")
        else:
            print("sorry,email is not register")
            data = {"code": 201, "msg":"成功"}
            return HttpResponse(json.dumps(data),content_type="application/json")
        ScenesJson=ScenesJson[0]['ScenesJson']
        Workflwow_obj=json.loads(ScenesJson).get("Workflwow_obj")
        Workflwow_dict=json.loads(Workflwow_obj)
        connections=json.loads(Workflwow_dict.get('connections'))
        node_tupe=set()
        for keys in connections:
            values=connections.get(keys)
            current=values.get('current')
            Rear=values.get('Rear')
            node_tupe.add(current)
            node_tupe.add(Rear)
        conn = redis.Redis(connection_pool=POOL)
        for nodeid in node_tupe:#从mysql中保存数据至redis
            node_dict=models.Node.objects.filter(Nodeid=nodeid).values("NodeType","NodeJson","name")
            status_type=node_dict[0].get("NodeType")
            nodejson=node_dict[0].get("NodeJson")
            nodename=node_dict[0].get("name")
            __value={
                "nodeid":nodeid,
                "name":nodename,
                "nodejson":nodejson,
            }
            if status_type==1:#api
                __value["nodetype"]="api"
                conn.set(nodeid,json.dumps(__value),ex=60*60*3)
            elif status_type==2:#sql节点
                __value["nodetype"]="sql"
                conn.set(nodeid,json.dumps(__value),ex=60*60*3)
            elif status_type==3:#rpa
                __value["nodetype"]="rpa"
                conn.set(nodeid,json.dumps(__value),ex=60*60*3)
            elif status_type==4:#定位节点
                __value["nodetype"]="position"
                conn.set(nodeid,json.dumps(__value),ex=60*60*3)
            elif status_type==5:#分支节点数据
                __value["nodetype"]="condition"
                conn.set(nodeid,json.dumps(__value),ex=60*60*3)
            elif status_type==6:#合并节点
                __value["nodetype"]="merge"
                conn.set(nodeid,json.dumps(__value),ex=60*60*3)
            elif status_type==7:#条件节点
                __value["nodetype"]="judge"
                conn.set(nodeid,json.dumps(__value),ex=60*60*3)
            elif status_type==8:#py3
                __value["nodetype"]="py3"
                conn.set(nodeid,json.dumps(__value),ex=60*60*3)
            else:
                print("未知的类型")
            Ginseng_obj=models.Ginseng.objects.filter(GinsengId="Ginseng"+nodeid).values()
            if Ginseng_obj:#节点出参保存到redis
                GinsengJson=Ginseng_obj[0]['GinsengJson']
                for Ginsengid in GinsengJson:
                    __Ginseng=json.loads(GinsengJson[Ginsengid])
                    __value={
                        "nodeid":__Ginseng.get('nodeid'),
                        "ginseng":__Ginseng.get('ginseng'),
                        "ginseng_type":__Ginseng.get('ginseng_type'),
                        "ginseng_name":__Ginseng.get('ginseng_name')
                    }
                    conn.hmset('Ginseng'+nodeid,{Ginsengid:json.dumps(__value)})#添加散列
                    conn.expire('Ginseng'+nodeid,60*60*3)#三小时后失效

            RunVariable_obj=models.RunVariable.objects.filter(VariableId="Variable"+nodeid).values()
            if RunVariable_obj:#流程变量保存至redis
                RunVariable_obj=RunVariable_obj[0]['VariableJson']
                for Variableid in RunVariable_obj:
                    __Variable=json.loads(RunVariable_obj[Variableid])
                    __value={
                        "nodeid":__Variable.get('nodeid'),
                        "Variablename":__Variable.get('Variablename'),
                        "Variablevalue":__Variable.get('Variablevalue'),
                    }
                    conn.hmset(__Variable.get('nodeid'),{Variableid:json.dumps(__value)})#添加散列
                    conn.expire(__Variable.get('nodeid'),60*60*3)#三小时后失效
            Condition_obj=models.Condition.objects.filter(ConditionId="Condition"+nodeid).values()
            if Condition_obj:#条件连线数据保存至redis
                __value={
                    "nodeid":"condition"+nodeid,
                    "name":nodename,
                    "nodejson":json.loads(Condition_obj[0].get('ConditionJson')).get("nodejson"),
                    "nodetype":"condition",
                }
                conn.set("condition"+nodeid,json.dumps(__value),ex=60*60*3)
        ScenesData_obj=models.ScenesData.objects.filter(DataId="Data"+Workflow_id).values()
        if ScenesData_obj:#执行时入参保存至redis
            DataJson=json.loads(ScenesData_obj[0].get("DataJson"))
            __value={
                "nodeid":DataJson.get('nodeid'),
                "nodejson":DataJson.get('nodejson'),
                "nodetype":"data",
                "Workflowid":Workflow_id
            }
            conn.set(DataJson.get('nodeid'),json.dumps(__value),ex=60*60*3)
        data = {"code": 200, "msg":"成功","data":ScenesJson}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Workflow_del(request):
    #删除工作流数据
    if request.method=="GET":
        Workflow_id=request.GET.get('id')
        if len(list(workfliow_json.json_data['workfliow'].keys()))<2:
            data = {"code": 500, "msg":"工作流小于2个时无法被删除"}
            return HttpResponse(json.dumps(data),content_type="application/json")
        del workfliow_json.json_data['workfliow'][Workflow_id]
        json_str=json.dumps(workfliow_json.json_data)
        if not workfliow_json.json_data['json_file_url']:
            data = {"code": 301, "msg":"成功","data":json_str}
            return HttpResponse(json.dumps(data),content_type="application/json")
        else:
            json_file_url=workfliow_json.json_data['json_file_url']
            with open(json_file_url, 'w') as f:
                f.write(json.dumps(json_str))
            data = {"code": 200, "msg":"成功"}
            return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Workflow_Reset(request):
    #重置工作流
    if request.method=="GET":
        Workflow_id=request.GET.get('id')		
        models.Scenes.objects.filter(Scenesid=Workflow_id).update(status=3)#状态改为未执行
        conn = redis.Redis(connection_pool=POOL)
        if conn.exists('runlog'+Workflow_id):
            conn.delete('runlog'+Workflow_id)
        data = {"code": 200, "msg":"成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")        
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Workflow_Updata(request):
    """编辑流程名称"""
    if request.method=="POST":
        Workflow_id=request.POST.get('WorkflowId')		
        name=request.POST.get('name')	
        models.Scenes.objects.filter(Scenesid=Workflow_id).update(name=name)#编辑名称
        data = {"code": 200, "msg":"成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")        
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def jenkins_trigger(request):
    #触发执行 暂时弃用
    if request.method=="GET":
        Version=request.GET.get('Version')
        jenkins=workfliow_json.json_data
        if isinstance(jenkins,str):
            jenkins=json.loads(jenkins)
        list_node = json.loads(jenkins['jenkins'])[Version]['data']
        for dict_node in list_node:
            id=dict_node['node_id']
            val=workfliow_json.json_data.get('workfliow').get(id)
            workfliow_json.json_data['log'][id]={}#清空日志
            def list_r_data(data):
                if workfliow_json.json_data['log']:#有参数则追加没有就新增
                    data_dict={**workfliow_json.json_data['log'][id], **data}
                    workfliow_json.json_data['log'][id]=data_dict
                else:
                    workfliow_json.json_data['log'][id]=data
            json_file_url=workfliow_json.json_data['json_file_url']
            file_data=json.dumps(workfliow_json.json_data)
            with open(json_file_url, 'w') as f:
                f.write(file_data)
        report_dict=report.report(workfliow_json.json_data).run_report()#生成日志并返回url
        date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        report_data={"report_dict":report_dict,"date":date,"Version":Version}
        report_file = Version+"_"+str(time.time())
        report_url = "./report/report_json/%s.json" % report_file
        with open(report_url, 'w') as f:
            f.write(json.dumps(report_data))
        data = {"code": 200, "msg":"成功","data":jenkins,"report_url":report_url}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def log_000(request):
    #log_000界面
    if request.method=="GET":
        return render(request,"log_000.html")

@login_required
def runstatus(request):
    """
        执行状态查询
    """
    if request.method=="GET":
        Workflowid=request.GET.get("Workflowid")
        conn = redis.Redis(connection_pool=POOL)
        __value=conn.get('runWorkflowId'+Workflowid)
        data = {"code": 200, "msg":"成功","data":__value}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为GET请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def noderunstatus(request):
    """
        执行日志查询
    """
    if request.method=="GET":
        Workflowid=request.GET.get("Workflowid")
        if Workflowid:
            conn = redis.Redis(connection_pool=POOL)
            __value=conn.get('runlog'+Workflowid)
            data = {"code": 200, "msg":"成功","data":__value}
            return HttpResponse(json.dumps(data),content_type="application/json")
        else:
            data = {"code": 201, "msg":"流程id错误或为None"}
            return HttpResponse(json.dumps(data),content_type="application/json") 
    data = {"code": 500, "msg":"接口为GET请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def RunScenesStatus(request):
    if request.method=="GET":
        project_obj=models.project.objects.all()
        __list=list()
        for i in project_obj:
            Scenes_obj = models.Scenes.objects.filter(projectid=i).values("Scenesid","status")
            __list.extend(list(Scenes_obj))
    data = {"code": 200, "msg":"成功","data":__list}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def NodeDel(request):
    """删除节点"""
    if request.method=="GET":
        id=request.GET.get('nodeid')
        models.Node.objects.filter(Nodeid=id).delete()
    data = {"code": 200, "msg":"成功"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def run_workflow_api(request):
    #运行工作流
    if request.method=="GET":
        id=request.GET.get('id')
        val=workfliow_json.json_data.get('workfliow').get(id)
        workfliow_json.json_data['log'][id]={}#清空日志
        def list_r_data(data):
            if workfliow_json.json_data['log']:#有参数则追加没有就新增
                data_dict={**workfliow_json.json_data['log'][id], **data}
                workfliow_json.json_data['log'][id]=data_dict
            else:
                workfliow_json.json_data['log'][id]=data
        json_file_url=workfliow_json.json_data['json_file_url']
        file_data=json.dumps(workfliow_json.json_data)
        with open(json_file_url, 'w') as f:
            f.write(file_data)
        data = {"code": 200, "msg":"成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def workflow_data(request):
    #查询数据
    if request.method=="GET":
        id=request.GET.get('id')
        s_data=request.GET.get('data')
        r_data=workfliow_json.json_data.get('workfliow').get(id)
        if json.dumps(r_data)==s_data:
            data = {"code": 200, "msg":"成功"}
            return HttpResponse(json.dumps(data),content_type="application/json")
        data = {"code": 500, "msg":"失败"}
        return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Node_status(request):
    #执行时状态日志返回
    if request.method=="GET":
        id=request.GET.get('id')
        val=workfliow_json.json_data.get('workfliow').get(id)
        r_data=workfliow_json.json_data['log'].get(id,None)
        data = {"code": 200, "msg":"成功","data":r_data,"id":workfliow_json.json_data['log']}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def ProjectAdd(request):
    """
        添加一级菜单
        入参:
            project_name（项目名称）
        出参：
            ProjectId（项目id）
            project_name（项目名称）
    """
    if request.method=="POST":
        project_name=request.POST.get('project_name')#获取参数
        project_list=models.project.objects.filter(name=project_name)  #查询数据
        
        if project_list:#查不到
            ProjectId=None
            msg="项目名称已存在"
            code=201
        else:
            project_obj=models.project.objects.create(name=project_name)
            ProjectId=project_obj.id
            msg="成功"
            code=200
        data = {"code": code, "msg":msg,"data":{"ProjectId":ProjectId,"project_name":project_name}}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def ProjectGet(request):
    """
        查询一级菜单
    """
    if request.method=="GET":
        userid=request.session.get('Userid')
        Workflow_data = models.Scenes.objects.filter(userid=userid).values("Scenesid", "id","name","projectid__id","projectid__name")
        Workflow_data=[i for i in Workflow_data]
        Workflow_data=models.project.objects.filter().values("id","name")
        Workflow_data=[i for i in Workflow_data]
        data = {"code": 200, "msg":"删除成功", "data":{"Workflow_data":Workflow_data}}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Project_Del(request):
    """
        删除一级菜单
        入参:
            ProjectId（项目id）
    """
    if request.method=="POST":
        ProjectId=request.POST.get('ProjectId')#获取参数
        models.project.objects.filter(id=ProjectId).delete()
        data = {"code": 200, "msg":"删除成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Project_Updata(request):
    """编辑测试套件名称"""
    if request.method=="POST":
        ProjectId=request.POST.get('ProjectId')		
        name=request.POST.get('name')	
        models.project.objects.filter(id=ProjectId).update(name=name)#编辑名称
        data = {"code": 200, "msg":"成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")        
    data = {"code": 500, "msg":"失败"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Workflow_Del(request):
    """
        删除二级级菜单
        入参:
            WorkflowId（流程id）
    """

    if request.method=="POST":
        WorkflowId=request.POST.get('WorkflowId')#获取参数
        models.Scenes.objects.filter(Scenesid=WorkflowId).delete()
        data = {"code": 200, "msg":"删除成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Workflow_Run(request):
    """
        执行流程
        入参:
            WorkflowId（流程id）
    """
    if request.method=="POST":
        userid=request.session.get('Userid')
        Workflow_id=request.POST.get('WorkflowId')#获取参数
        # Workflow_id=WorkflowId
        ScenesJson = models.Scenes.objects.filter(Scenesid=Workflow_id).values('ScenesJson')
        if len(ScenesJson)==0:
            def tuic():
                yield 'data:%s\n\n' % "notsave"
            response = StreamingHttpResponse(tuic(), content_type="text/event-stream")
            response['Cache-Control'] = 'no-cache'
            return response
        models.Scenes.objects.filter(Scenesid=Workflow_id).update(status=3)
        ScenesJson = models.Scenes.objects.filter(Scenesid=Workflow_id).values('ScenesJson')
        if ScenesJson.exists():
            print("yes,we have this email")
        else:
            print("sorry,email is not register")
            data = {"code": 201, "msg":"成功"}
            return HttpResponse(json.dumps(data),content_type="application/json")
        ScenesJson=ScenesJson[0]['ScenesJson']
        Workflwow_obj=json.loads(ScenesJson).get("Workflwow_obj")
        Workflwow_dict=json.loads(Workflwow_obj)
        connections=json.loads(Workflwow_dict.get('connections'))#流程的,多次保存貌似会数据重复
        node_tupe=set()
        for keys in connections:
            values=connections.get(keys)
            current=values.get('current')
            Rear=values.get('Rear')
            node_tupe.add(current)
            node_tupe.add(Rear)
        GinsengList=[]
        VariableList=[]
        ConditionList=[]
        for nodeid in node_tupe:
            Ginseng_obj=models.Ginseng.objects.filter(GinsengId="Ginseng"+nodeid).values('GinsengJson','GinsengId')
            if Ginseng_obj:#节点出参
                GinsengJson=Ginseng_obj[0]['GinsengJson']
                GinsengList.append(Ginseng_obj[0])
            Condition_obj=models.Condition.objects.filter(ConditionId="Condition"+nodeid).values("ConditionJson","ConditionId")
            if Condition_obj:#条件连线数据
                ConditionList.append(Condition_obj[0])
        RunVariable_obj=models.RunVariable.objects.filter(VariableId="Variable"+Workflow_id).values("VariableJson","VariableId")
        if RunVariable_obj:#流程变量
            VariableList.append(RunVariable_obj[0])
        ScenesData_obj=models.ScenesData.objects.filter(DataId="Data"+Workflow_id).values('DataJson','DataId')
        print(ScenesData_obj,'ScenesData_objScenesData_obj')

        if ScenesData_obj:#执行时入参
            print(ScenesData_obj,'ScenesData_objScenesData_obj')
            DataJson=json.loads(ScenesData_obj[0].get("DataJson"))
            parameter = json.loads(DataJson.get('nodejson')).get('Workflow_parameter')
            __VariableJson=[]
            for __val in list(parameter.values()):
                __dict={}
                for i in list(range(len(__val))):
                    __val[i].get('key')
                    __val[i].get('value')
                    __dict[i]={"nodeid": i, "Variablename": __val[i].get('key'), "Variablevalue": __val[i].get('value')}
                __VariableJson.append({"VariableJson":json.dumps(__dict)})
        conn = redis.Redis(connection_pool=POOL)
        runobj=run_workflow_a.RunLogic(connections=connections,GinsengList=GinsengList,VariableList=VariableList,ConditionList=ConditionList,models=models,conn=conn,Workflow_id=Workflow_id,DataJson=None,userid=userid)
        runobj.node_sort()
        data = {"code": 200, "msg":"成功","data":ScenesJson}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def Workflwow_log_get(request):
    """
        节点运行日志：
            流程id
    """
    if request.method=="GET":
        Workflow_id=request.GET.get('WorkflowId')#获取参数
        Workflow_log = models.Scenes.objects.filter(Scenesid=Workflow_id,status__in=[1,2,4]).order_by('-workflowlog__updata_time')[:1].values("id","workflowlog__LogJson")
        if Workflow_log:
            data = {"code": 200, "msg":"成功","data":Workflow_log[0]}
            return HttpResponse(json.dumps(data),content_type="application/json")
        else:
            data = {"code": 500, "msg":"流程不存在执行日志","data":None}
            return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为GET请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def AddNode(request):
    """
        添加节点
        入参:
            nodeid 节点id
            nodejson 节点数据 
            nodetype 节点类型
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        nodejson=request.POST.get('nodejson')#节点内容
        nodetype=request.POST.get('nodetype')#节点类型
        name=request.POST.get('Workflow_name')#节点名称
        __value={
            "nodeid":nodeid,
            "nodejson":nodejson,
            "nodetype":nodetype,
			"name":name,
        }
        conn = redis.Redis(connection_pool=POOL)
        conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        data = {"code": 200, "msg":"redis缓存创建成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def AddGinseng(request):
    """
        节点出参添加
        入参:
            nodeid 节点id
            ginseng 节点数据 
            nodetype 节点类型
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        ginseng=request.POST.get('ginseng')#变量数据
        ginseng_type=request.POST.get('ginseng_type')#匹配类型
        ginseng_name=request.POST.get('ginseng_name')#匹配节点名称
        __value={
            "nodeid":nodeid,
            "ginseng":ginseng,
            "ginseng_type":ginseng_type,
            "ginseng_name":ginseng_name
        }
        conn = redis.Redis(connection_pool=POOL)
        Ginsengid=str(uuid.uuid4())
        conn.hmset('Ginseng'+nodeid,{Ginsengid:json.dumps(__value)})#添加散列
        conn.expire('Ginseng'+nodeid,60*60*3)#三小时后失效
        data = {"code": 200, "msg":"redis缓存创建成功","data":{"Ginsengid":Ginsengid,"__value":__value}}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def GetGinseng(request):
    """
        节点出参查询
        入参:
            nodeid 节点id
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        conn = redis.Redis(connection_pool=POOL)
        __value=conn.hgetall(nodeid)
        data = {"code": 200, "msg":"查询节点出参成功","data":__value}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def GetGinsengValue(request):
    """
        出参详情查询
        入参:
            nodeid 节点id
            Ginsengid 变量id
    """

    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        Ginsengid=request.POST.get('Ginsengid')#变量id
        conn = redis.Redis(connection_pool=POOL)
        __value=conn.hget(nodeid, Ginsengid)
        data = {"code": 200, "msg":"查询出参数据成功","data":__value}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def DelGinseng(request):
    """
        节点出参删除
        入参:
            nodeid 节点id
            Ginsengid 变量id
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        Ginsengid=request.POST.get('Ginsengid')#变量id
        conn = redis.Redis(connection_pool=POOL)
        conn.hdel(nodeid,Ginsengid)
        data = {"code": 200, "msg":"节点出参删除成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")


@login_required
def UpdateGinsengValue(request):
    """
        节点出参编辑
        入参:
            nodeid 节点id
            Ginsengid 变量id
            ginseng 节点数据 
            ginseng_type 变量类型
            ginseng_name 变量名称
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        ginseng=request.POST.get('ginseng')#变量数据
        Ginsengid=request.POST.get('Ginsengid')#变量id
        ginseng_type=request.POST.get('ginseng_type')#匹配类型
        ginseng_name=request.POST.get('ginseng_name')#匹配节点名称
        __value={
            "nodeid":nodeid,
            "ginseng":ginseng,
            "ginseng_type":ginseng_type,
            "ginseng_name":ginseng_name
        }
        conn = redis.Redis(connection_pool=POOL)
        conn.hset(nodeid,Ginsengid,json.dumps(__value))#编辑散列
        conn.expire('Ginseng'+nodeid,60*60*3)#三小时后失效
        data = {"code": 200, "msg":"redis缓存更新成功","data":{"Ginsengid":Ginsengid,"__value":__value}}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def AddVariable(request):
    """
        流程变量新增
        入参:
            nodeid 节点id
            Variablename 变量名称
            Variablevalue 节点数据 
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        Variablename=request.POST.get('Variablename')#变量名称
        Variablevalue=request.POST.get('Variablevalue')#节点数据
        __value={
            "nodeid":nodeid,
            "Variablename":Variablename,
            "Variablevalue":Variablevalue,
        }
        conn = redis.Redis(connection_pool=POOL)
        Variableid=str(uuid.uuid4())
        conn.hmset(nodeid,{Variableid:json.dumps(__value)})#添加散列
        conn.expire(nodeid,60*60*3)#三小时后失效
        data = {"code": 200, "msg":"redis缓存更新成功","data":{"Variableid":Variableid,"__value":__value}}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def GetVariable(request):
    """
        节点出参查询
        入参:
            nodeid 节点id
    """

    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        conn = redis.Redis(connection_pool=POOL)
        __value=conn.hgetall(nodeid)
        data = {"code": 200, "msg":"查询节点出参成功","data":__value}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def DelVariable(request):
    """
        变量删除
        入参:
            nodeid 节点id
            Variabid 变量id
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        Variabid=request.POST.get('Variabid')#变量id
        conn = redis.Redis(connection_pool=POOL)
        conn.hdel(nodeid,Variabid)
        data = {"code": 200, "msg":"变量删除成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def GetVariableValue(request):
    """
        出参详情查询
        入参:
            nodeid 节点id
            Variabid 变量id
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        Variabid=request.POST.get('Variabid')#变量id
        conn = redis.Redis(connection_pool=POOL)
        __value=conn.hget(nodeid, Variabid)
        data = {"code": 200, "msg":"查询出参数据成功","data":__value}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")


@login_required
def AddData(request):
    """
        添加执行参数配置
        入参:
            nodeid 节点id
            nodejson 节点数据 
            nodetype 节点类型
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        nodejson=request.POST.get('nodejson')#节点内容
        nodetype=request.POST.get('nodetype')#节点类型
        Workflowid=request.POST.get('Workflowid')#流程节点
        __value={
            "nodeid":nodeid,
            "nodejson":nodejson,
            "nodetype":nodetype,
            "Workflowid":Workflowid
        }
        conn = redis.Redis(connection_pool=POOL)
        conn.set(nodeid,json.dumps(__value),ex=60*60*3)
        data = {"code": 200, "msg":"redis缓存创建成功"}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def GetData(request):
    """
        查询流程节点的数据
        入参:nodeid
    
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        conn = redis.Redis(connection_pool=POOL)
        __value=conn.get(nodeid)
        if __value:
            data = {"code": 200, "msg":"查询定位节点数据成功","data":__value}
        else:
            data = {"code": 400, "msg":"没有查询到数据","data":__value}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def GetNode(request):
    """
        查询流程节点的数据
        入参:nodeid
    """
    if request.method=="POST":
        nodeid=request.POST.get('nodeid')#节点id
        conn = redis.Redis(connection_pool=POOL)
        __value=conn.get(nodeid)
        if __value:
            data = {"code": 200, "msg":"查询定位节点数据成功","data":__value}
        else:
            data = {"code": 400, "msg":"没有查询到数据","data":__value}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def GetNodeType(request):
    """
        通过类型查询流程节点的数据
        入参:nodetype
    """
    if request.method=="POST":
        nodetype=request.POST.get('nodetype')#节点id
        Workflow_id=request.POST.get('Workflow_id')#流程id
        ScenesJson = models.Scenes.objects.get(Scenesid=Workflow_id).ScenesJson
        conn = redis.Redis(connection_pool=POOL)
        __value=conn.get(nodetype)
        if __value:
            data = {"code": 200, "msg":"查询定位节点数据成功","data":__value}
        else:
            data = {"code": 400, "msg":"没有查询到数据","data":__value}
        return HttpResponse(json.dumps(data),content_type="application/json")
    data = {"code": 500, "msg":"接口为POST请求"}
    return HttpResponse(json.dumps(data),content_type="application/json")






#http://192.168.3.181:8000/jenkins_trigger/?Version=v1.1.1.1

#http://192.168.3.83:8063/TEST_POST/

#http://192.168.3.83:8063/emali/
#{"configId":247,"queryFields":[],"emali_url":"1104541868@qq.com"}
#http://api.qingyunke.com/api.php?key=free&appid=0&msg=你好


#api节点入参切换问题
#api节点回显貌似有问题,得重现
#hede body 状态没有回显
#保存时检查节点是否保存


