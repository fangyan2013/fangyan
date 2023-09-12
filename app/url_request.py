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
		
		
		
		
		