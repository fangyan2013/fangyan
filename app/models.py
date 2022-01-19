from django.db import models
from django.utils import timezone
import datetime
# python manage.py makemigrations
# python manage.py migrate
# Create your models here.


class Scenes(models.Model):
    id = models.AutoField(primary_key=True)
    LEVEL = (
        (1, "open"),
        (2, "off"),
    )
    name = models.CharField(max_length=500)
    run_status = models.SmallIntegerField(choices=LEVEL, default=2, verbose_name="运行状态")
    dict_case = models.CharField(max_length=2000)
    execution_time = models.BigIntegerField(default=0)
    Config_id=models.ForeignKey('Config',on_delete=models.CASCADE)
    D_Config_id=models.ForeignKey('D_Config',on_delete=models.CASCADE)
    project=models.ForeignKey('project',on_delete=models.CASCADE)
    new_time = models.DateTimeField('保存日期',default = timezone.now)
    updata_time = models.DateTimeField('最后修改日期', auto_now = True)
	


class result(models.Model):
    id=models.AutoField(primary_key=True)
    LEVEL = (
        (1, "yes"),
        (2, "no"),
        (3, "pass"),
    )
    run_status = models.SmallIntegerField(choices=LEVEL, default=3, verbose_name="结果状态")
    result_json = models.TextField()
    Execution_time = models.CharField(max_length=32)	
    Scenes_id=models.ForeignKey('Scenes',on_delete=models.CASCADE)
    project=models.ForeignKey('project',on_delete=models.CASCADE)
    new_time = models.DateTimeField('保存日期',default = timezone.now)
    updata_time = models.DateTimeField('最后修改日期', auto_now = True)


class selenium_api(models.Model):
    id = models.AutoField(primary_key=True)
    s_api = models.CharField(max_length=2000)
    api_Remarks = models.CharField(max_length=500)
    new_time = models.DateTimeField('保存日期',default = timezone.now)
    updata_time = models.DateTimeField('最后修改日期', auto_now = True)
	

class Element_operation(models.Model):
    id = models.AutoField(primary_key=True)
    operation_tap = models.CharField(max_length=2000)
    op_Remarks = models.CharField(max_length=500)
    new_time = models.DateTimeField('保存日期',default = timezone.now)
    updata_time = models.DateTimeField('最后修改日期', auto_now = True)

class python_txt(models.Model):
    id = models.AutoField(primary_key=True)
    python_tap = models.CharField(max_length=2000)
    python_Remarks = models.CharField(max_length=500)
    new_time = models.DateTimeField('保存日期',default = timezone.now)
    updata_time = models.DateTimeField('最后修改日期', auto_now = True)


class logic(models.Model):
    id = models.AutoField(primary_key=True)
    logic_json = models.CharField(max_length=2000)
    logic_Remarks = models.CharField(max_length=500)
    new_time = models.DateTimeField('保存日期',default = timezone.now)
    updata_time = models.DateTimeField('最后修改日期', auto_now = True)


class process(models.Model):#流程表
    id = models.AutoField(primary_key=True)
    process_name = models.CharField(max_length=20)
    Judgment_data = models.TextField()
    Node_information = models.TextField()
    process_data = models.TextField()
    project=models.ForeignKey('project',on_delete=models.CASCADE)
    new_time = models.DateTimeField('保存日期',default = timezone.now)
    updata_time = models.DateTimeField('最后修改日期', auto_now = True)




class Config(models.Model):#配置表
    id = models.AutoField(primary_key=True)
    Scenes_name = models.CharField(max_length=100)
    url = models.CharField(max_length=200,default="None")
    db_name = models.CharField(max_length=100)
    db_server = models.CharField(max_length=100)
    test_zh = models.CharField(max_length=100)
    version = models.CharField(max_length=100)
    Email = models.CharField(max_length=200)
    test_range = models.CharField(max_length=100)
    Remarks = models.CharField(max_length=500)
    project=models.ForeignKey('project',on_delete=models.CASCADE)
    Nailed=models.ForeignKey('Nailed',on_delete=models.CASCADE)
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().strftime( '%Y-%m-%d %H:%M:%S' ), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().strftime( '%Y-%m-%d %H:%M:%S' ), verbose_name='更新时间')

class D_Config(models.Model):#分布式配置表
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=200,default="None")
    UA = models.CharField(max_length=200,default="None")
    platform = models.CharField(max_length=200,default="None")
    browserName = models.CharField(max_length=200,default="None")
    version = models.CharField(max_length=200,default="None")
    javascriptEnabled = models.CharField(max_length=200,default="None")
    project=models.ForeignKey('project',on_delete=models.CASCADE)
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().strftime( '%Y-%m-%d %H:%M:%S' ), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().strftime( '%Y-%m-%d %H:%M:%S' ), verbose_name='更新时间')

class project(models.Model):#项目表
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=200,default="None")
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().replace(microsecond=0), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().replace(microsecond=0), verbose_name='更新时间')


class Treegrid(models.Model):#权限表
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    Rights_Groups = models.TextField()
    project=models.ForeignKey('project',on_delete=models.CASCADE)
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().replace(microsecond=0), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().replace(microsecond=0), verbose_name='更新时间')




class user(models.Model):#用户表
    id = models.AutoField(primary_key=True)
    url = models.CharField(max_length=200,default="None")
    user_name = models.CharField(max_length=200,default="None")
    password = models.CharField(max_length=200,default="None")
    c_password = models.CharField(max_length=200,default="None")
    project=models.ForeignKey('project',on_delete=models.CASCADE)
    treegrid=models.ForeignKey('Treegrid',on_delete=models.CASCADE)
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().replace(microsecond=0), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().replace(microsecond=0), verbose_name='更新时间')


class Treegrid_data(models.Model):#权限数据
    id = models.AutoField(primary_key=True)
    urls = models.CharField(max_length=200,default="None")
    urls_name = models.CharField(max_length=200,default="None")
    T_id = models.CharField(max_length=200,default="None")
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().replace(microsecond=0), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().replace(microsecond=0), verbose_name='更新时间')


class img_code(models.Model):#验证码表
    id = models.AutoField(primary_key=True)
    url = models.CharField(max_length=200,default="None")
    text = models.CharField(max_length=200,default="None")
    code = models.CharField(max_length=200,default="None")
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().replace(microsecond=0), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().replace(microsecond=0), verbose_name='更新时间')


class Nailed(models.Model):#钉钉消息表
    id = models.AutoField(primary_key=True)
    url = models.CharField(max_length=200,default="None")
    text = models.CharField(max_length=200,default="None")
    messageUrl = models.CharField(max_length=200,default="None")
    Nailed_url = models.CharField(max_length=200,default="None")
    title = models.CharField(max_length=200,default="None")
    project=models.ForeignKey('project',on_delete=models.CASCADE)
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().replace(microsecond=0), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().replace(microsecond=0), verbose_name='更新时间')

class Execution_status(models.Model):#节点状态表
    id = models.AutoField(primary_key=True)
    s_id = models.CharField(max_length=200,default="None")
    status = models.TextField()
    new_time = models.DateTimeField(auto_now_add=datetime.datetime.now().replace(microsecond=0), verbose_name='创建时间')
    updata_time = models.DateTimeField(auto_now=datetime.datetime.now().replace(microsecond=0), verbose_name='更新时间')

