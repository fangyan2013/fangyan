#!/usr/bin/python
# -*- encoding: utf-8 -*-
import time
import os
import ast
import json
import argparse
from sys import version_info

# projectname 项目名称
# version    项目版本
# destpath代码源
# nexus url  http://192.168.3.89:8081/repository/maven-releases/com/jk/demo/maven-metadata.xml
# admin admin

jkparser = argparse.ArgumentParser(description='jkstauuuck-dpa')
jkparser.add_argument('--projectname', type=str, default='', help='')#目标目录
jkparser.add_argument('--destpath', type=str, default='', help='')#代码源
jkparser.add_argument('--nexusurl', type=str, default='', help='')#下载地址
jkparser.add_argument('--username', type=str, default='', help='')#账号
jkparser.add_argument('--password', type=str, default='', help='')#密码


    # username,
    # password,

exec_args = jkparser.parse_args()
print(exec_args)
print(exec_args.projectname)
# 变量赋值

try:
    projectname = ast.literal_eval(exec_args.projectname)
except Exception as e:
    projectname = exec_args.projectname

try:
    destpath = ast.literal_eval(exec_args.destpath)
except Exception as e:
    destpath = exec_args.destpath

try:
    nexusurl = ast.literal_eval(exec_args.nexusurl)
except Exception as e:
    nexusurl = exec_args.nexusurl

try:
    username = ast.literal_eval(exec_args.username)
except Exception as e:
    username = exec_args.username

try:
    password = ast.literal_eval(exec_args.password)
except Exception as e:
    password = exec_args.password


new_time=str(time.strftime("%Y-%m-%d--%H:%M:%S", time.localtime()))
# 业务




dirs="/opt/"+projectname

if not os.path.exists(dirs):#没有就创建
    os.makedirs(dirs)


destpath_l=destpath[:-4]
destpath_r=destpath[-4:]

nexusurl_r=nexusurl[7:]
nexusurl_l=nexusurl[:7]


# mv /opt/${PROJECT_NAME}/${PROJECT_NAME}-${VERSION}.jar /opt/${PROJECT_NAME}/${PROJECT_NAME}-${VERSION}-$CURRENT_DATE.jar
# wget -P /opt/${PROJECT_NAME} http://jkpublic:JKpublic%401@192.168.1.181/repository/jkstack-dpa/smics/jk/${PROJECT_NAME}/${VERSION}/${PROJECT_NAME}-${VERSION}.jar
# http://192.168.3.89:8081/repository/maven-releases/com/jk/demo/2.1.1/demo-2.1.1.jar

str_mv="cp %s %s-%s%s" % (
    destpath,
    destpath_l,
    new_time,
    destpath_r
)
print(str_mv)

# os.system(str_mv)

str_wget="wget -P %s %s%s:%s@%s" % (
    "/opt/"+projectname,
    nexusurl_l,
    username,
    password,
    nexusurl_r,
)
print(str_wget)
# os.system(str_wget)

if version_info.major == 2:
    #python2走这个
    import commands
    def runcmd(val):
        a,b = commands.getstatusoutput(val)
        if a == 0:
            print("success:",b)
        else:
            raise Exception({"error:%s" % b})
    runcmd(str_mv)
    runcmd(str_wget)
else:
    import subprocess
    def runcmd(command):
        ret = subprocess.run(command,shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,encoding="utf-8",timeout=240)
        if ret.returncode == 0:
            print("success:",ret)
        else:
            raise Exception({"error:%s" % ret})
    runcmd(str_mv)
    runcmd(str_wget)



msg="/opt/"+projectname+"/"+nexusurl.split("/")[-1]
print(msg)

JK_OUT_ARGS=dict()