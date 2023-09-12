from django import forms
from django.core.exceptions import ValidationError
from app import models
from captcha.fields import CaptchaField
class New_Scene(forms.Form):
    url=forms.CharField(
        max_length=200,
        label='url',
        error_messages={
            'max_length':"url不能大于200位",
            'required':"url不能为空",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )    

    Scenes_name=forms.CharField(
        max_length=200,
        label='Scenes_name',
        error_messages={
            'max_length':"Scenes名称不能大于200位",
            'required':"Scenes名称不能为空",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )
    db_name=forms.CharField(
        max_length=100,
        label='db_name',
        error_messages={
            'max_length':"库名不能大于100位",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )
    db_server=forms.CharField(
        max_length=100,
        label='db_server',
        error_messages={
            'max_length':"数据库url不能大于100位",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )
    test_zh=forms.CharField(
        max_length=100,
        label='test_zh',
        error_messages={
            'max_length':"测试账号不能大于100位",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )
    version=forms.CharField(
        max_length=100,
        label='version',
        error_messages={
            'max_length':"版本号不能大于200位",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )
    Remarks=forms.CharField(
        max_length=500,
        label='Remarks',
        error_messages={
            'max_length':"备注不能大于500位",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )
    Email=forms.CharField(
        max_length=200,
        label='Email',
        error_messages={
            'max_length':"邮箱不能大于200位",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )
    test_range=forms.CharField(
        max_length=100,
        label='test_range',
        error_messages={
            'max_length':"测试范围不能大于100位",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )

    dict_case=forms.CharField(
        max_length=2000,
        label='dict_case',
        error_messages={
            'max_length':"dict_case不能大于2000",
            'required':"dict_case不能为空",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )

class yzm(forms.Form):#验证码
    captcha = CaptchaField(label='验证码')


class dl(forms.Form):#登录
    username=forms.CharField(
        max_length=16,
        label='用户名',
        error_messages={
            'max_length':"用户名不能大于16位",
            'required':"用户名不能为空",
        },
        widget=forms.widgets.TextInput(
           attrs={'class': 'form-control'}
        )
    )
    password=forms.CharField(
        min_length=6,
        label='密码',
        error_messages={
            'min_length':"密码不能小于6位",
            'required':"密码不能为空",
        },
        widget = forms.widgets.PasswordInput
    )
    vercode=forms.CharField(
        min_length=4,
        label='验证码',
        error_messages={
            'min_length':"验证码不能小于4位",
            'required':"验证码不能为空",
        },
        widget = forms.widgets.PasswordInput
    )
    yzm_code=forms.CharField(
        label='code',
        error_messages={
            'required':"code不能为空",
        },
        widget = forms.widgets.PasswordInput
    )

