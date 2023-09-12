"""ui_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views
from django.conf.urls.static import static
from ui_server import settings
from django.urls import include

urlpatterns = [
    path('login/', views.login),
    path('AddNode/', views.AddNode),
    path('AddGinseng/', views.AddGinseng),
    path('DelGinseng/', views.DelGinseng),
    path('GetGinseng/', views.GetGinseng),
    path('GetGinsengValue/', views.GetGinsengValue),
    path('UpdateGinsengValue/', views.UpdateGinsengValue),
    path('AddData/', views.AddData),
    path('GetData/', views.GetData),
    path('AddVariable/', views.AddVariable),
    path('GetVariable/', views.GetVariable),
    path('DelVariable/', views.DelVariable),
    path('GetVariableValue/', views.GetVariableValue),
    path('GetNode/', views.GetNode),
    path('GetNodeType/', views.GetNodeType),
    path('ProjectGet/', views.ProjectGet),
    path('ProjectAdd/', views.ProjectAdd),
    path('Project_Del/', views.Project_Del),
    path('Project_Updata/', views.Project_Updata),
    path('adduser/', views.adduser),
    path('logout/', views.logout),
    path('home_000/', views.home_000),
    path('url_000/', views.url_000),
    path('ui_000/', views.ui_000),
    path('Strategy/', views.Strategy),
    path('mysql_000/', views.mysql_000),
    path('position_000/', views.position_000),
    path('py3/', views.py3),
    path('pyrun/', views.pyrun),
    path('New_template/', views.New_template),
    path('select_template/', views.select_template),
    path('del_template/', views.del_template),
    path('generateTemplate/', views.generateTemplate),
    path('Workflow_save/', views.Workflow_save),
    path('GetWorkflow/', views.GetWorkflow),
    path('Workflow_del/', views.Workflow_del),
    path('Workflow_Del/', views.Workflow_Del),
    # path('Workflow_Run/<str:WorkflowId>/', views.Workflow_Run),
    path('Workflow_Run/', views.Workflow_Run),
    path('Workflow_Updata/', views.Workflow_Updata),

    path('NodeDel/', views.NodeDel),

    # path('node_Run_log/', views.node_Run_log),

    path('Workflwow_log_get/', views.Workflwow_log_get),
    path('runstatus/', views.runstatus),
    path('noderunstatus/', views.noderunstatus),
    # path('sendMeaasge/<str:WorkflowId>/', views.sendMeaasge),
    
    path('Workflow_Reset/', views.Workflow_Reset),
    path('workflow_data/', views.workflow_data),
    path('run_workflow_api/', views.run_workflow_api),
    path('Node_status/', views.Node_status),
    path('RunScenesStatus/', views.RunScenesStatus),

    # path('file_save/', views.file_save),
    # path('file_del/', views.file_del),
    # path('file_import/', views.file_import),
    # path('file_copy/', views.file_copy),
    # path('file_merge/', views.file_merge),
    # path('file_updata/', views.file_updata),
    # path('file_server/', views.file_server),
    # path('file_add/', views.file_add),
    # path('jenkins/', views.jenkins),
    # path('jenkins_select/', views.jenkins_select),
    # path('jenkins_trigger/', views.jenkins_trigger),
    # path('log_000/', views.log_000),
    # path('log_file_name/', views.log_file_name),
    # path('log_file_data/', views.log_file_data),
    # path('log_file_del/', views.log_file_del),
    # path('Local_file/', views.Local_file),
    path('url_000_test/', views.url_000_test),
    path('mysql_000_test/', views.mysql_000_test),
    path('mysql_000_connect/', views.mysql_000_connect),
    path('if_000/', views.if_000),
    path('condition_000/', views.condition_000),
    path('data_000/', views.data_000),
    path('rpa_000/', views.rpa_000),
    path('rpa_Recording_000/', views.rpa_Recording_000),
    path('rpa_test_000/', views.rpa_test_000),
    path('rpa_updata_000/', views.rpa_updata_000),
    path('merge_000/', views.merge_000),
    path('captcha/', include('captcha.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
