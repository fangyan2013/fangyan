from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import render,redirect,HttpResponse
import json
from app import models
from app import MyJSONEncoder


class login_authority(MiddlewareMixin):
    def process_request(self, request):
        if  request.path[1:-1] in ['break_sign','Sign_in','img_code','report',"ui_000","url_000","url_000_test","if_000","merge_000","yanxing"]:
            return
        if request.session.get('is_login',None):
            return
        else:
            return redirect('/Sign_in/')


class user_authority(MiddlewareMixin):
    def process_request(self, request):
        userid=request.session.get('userid')
        request.session.set_expiry(60 * 30)
        if userid==None:
            return
        if  request.path[1:-1] in ['home','break_sign','Sign_in','img_code','report','help','Clone','url_000',"ui_000","url_000_test","if_000","merge_000","yanxing"]:#权限太多第一版上线前整理一下
            return
        R_list=models.user.objects.filter(id=userid).values("treegrid__Rights_Groups")
        R_list=MyJSONEncoder.MyJSONEncoder(R_list)
        if len(R_list) == 0:
            return
        R_list=json.loads(R_list[0]['treegrid__Rights_Groups'])
        list_t=[]
        for i in R_list['Rights_Groups']:
            t_data=models.Treegrid_data.objects.filter(T_id=i).values("urls")
            t_data=MyJSONEncoder.MyJSONEncoder(t_data)
            for j in t_data:
                list_t.append(j.get('urls'))
        if request.path[1:-1] in list_t:
            return
        data = {"code": 0, "msg":"您的权限不足请及时充值"}
        return HttpResponse(json.dumps(data),content_type="application/json")