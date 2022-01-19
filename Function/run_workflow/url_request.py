import requests
import re
import json
from urllib import parse

class transfer_get:
    def __init__(self,url,head=None,body=None):
        self.url=url
        self.head=head
        self.body=body

		
    def r_get(self):
        #get请求
        print('我要调一波')
        r=requests.get(url=self.url,data=self.body, headers=self.head)
        #print(r.json,'返回的text')
        r.content.decode('utf-8')
        yield r.text
        
		
		
class transfer_post:
    def __init__(self,url,head=None,body=None,files=None):
        self.url=url
        self.head=head
        self.files=files
        if head:
            if 'json' in self.head.get("Content-Type"):
                self.body=json.dumps(body)
            elif 'x-www-form-urlencoded' in self.head.get("Content-Type"):
                self.body = parse.urlencode(body)
            else:
                self.body=body
        else:
            self.body=body

    def r_post(self):
        #post请求
        #print(self.body,'self.bodyself.bodyself.body',self.url)
        r=requests.post(url=self.url,data=self.body, headers=self.head,files=self.files)
        r.content.decode('utf-8')
        yield r.text
		
class transfer_head:
    def __init__(self,url):
        self.url=url
		
    def r_head(self):
        x = requests.head(self.url)
        print(x.headers,x.text)
        r.content.decode('utf-8')
        yield x.text
		

class transfer_put:
    def __init__(self,url,head=None,body=None):
        self.url=url
        self.head=head	
        if head:
            if 'json' in self.head.get("Content-Type"):
                self.body=json.dumps(body)
            elif 'x-www-form-urlencoded' in self.head.get("Content-Type"):
                self.body = parse.urlencode(body)
            else:
                self.body=body
        else:
            self.body=body
			
    def r_put(self):
        r=requests.put(url=self.url,data=self.body, headers=self.head)
        r.content.decode('utf-8')
        yield r.text

		
		
class transfer_patch:
    def __init__(self,url,head=None,body=None):
        self.url=url
        self.head=head	
        if head:
            if 'json' in self.head.get("Content-Type"):
                self.body=json.dumps(body)
            elif 'x-www-form-urlencoded' in self.head.get("Content-Type"):
                self.body = parse.urlencode(body)
            else:
                self.body=body
        else:
            self.body=body
			
    def r_patch(self):
        r=requests.patch(url=self.url,data=self.body, headers=self.head)
        r.content.decode('utf-8')
        yield r.text

class transfer_delete:
    def __init__(self,url,head=None,body=None):
        self.url=url
        self.head=head	
        if head:
            if 'json' in self.head.get("Content-Type"):
                self.body=json.dumps(body)
            elif 'x-www-form-urlencoded' in self.head.get("Content-Type"):
                self.body = parse.urlencode(body)
            else:
                self.body=body
        else:
            self.body=body

    def r_delete(self):
        r=requests.delete(url=self.url,data=self.body, headers=self.head)
        r.content.decode('utf-8')
        yield r.text
		
		
		
		
class Deal_with:
    def __init__(self):
        pass



    def request_data(self,value):
        '''参数处理'''
        for i in value:
            #print(value[i])
            type=value[i].get('type')
            url=value[i].get('url')
            head_status=value[i].get('head_status')
            body_status=value[i].get('body_status')
            print(head_status,'head_status')
            print(body_status,'body_status')
			
            if head_status=="head_table":
                head=value[i].get('table_head')
                if len(head)==1 and head[0]['key']=='':#不传任何东西
                    head_dict=None
                else:
                    head_dict={}
                    for h_val in head:
                        if h_val['Disable'] and h_val['key'] != '':
                            head_dict[h_val['key']] = h_val['value']
            else:
                head=value[i].get('json_head')
                if head == '':#不传任何东西
                    head_dict=None
                else:
                    head_dict=json.loads(head)
							
            if body_status=="body_table":
                body=value[i].get('table_body')
                if len(body)==1 and body[0]['key']=='':#不传任何东西
                    body_dict=None
                else:
                    body_dict={}
                    for h_val in body:
                        if h_val['Disable']  and h_val['key'] != '':
                            body_dict[h_val['key']] = h_val['value']
            else:
                body=value[i].get('json_body')
                if body == '':#不传任何东西
                    body_dict=None
                else:
                    body_dict=json.loads(body)
				
        # print(head_dict,'head----------')
        # print(body_dict,'body----------')
        type_obj={
            "get":transfer_get(url=url,head=head_dict,body=body_dict).r_get(),
            "post":transfer_post(url=url,head=head_dict,body=body_dict).r_post(),
            "head":transfer_head(url=url).r_head(),
            "put":transfer_put(url=url,head=head_dict,body=body_dict).r_put(),
            "patch":transfer_patch(url=url,head=head_dict,body=body_dict).r_patch(),
            "delete":transfer_delete(url=url,head=head_dict,body=body_dict).r_delete(),
        }
        r_text=next(type_obj[type])
        return r_text
		