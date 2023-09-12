from playwright.sync_api import Playwright, sync_playwright
import time


#['__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_dispatcher_fiber', '_gather', '_impl_obj', '_loop', '_sync', '_wrap_handler', 'as_element', 'bounding_box', 'check', 'click', 'content_frame', 'dblclick', 'dispatch_event', 'dispose', 'eval_on_selector', 'eval_on_selector_all', 'evaluate', 'evaluate_handle', 'fill', 'focus', 'get_attribute', 'get_properties', 'get_property', 'hover', 'inner_html', 'inner_text', 'input_value', 'is_checked', 'is_disabled', 'is_editable', 'is_enabled', 'is_hidden', 'is_visible', 'json_value', 'on', 'once', 'owner_frame', 'press', 'query_selector', 'query_selector_all', 'remove_listener', 'screenshot', 'scroll_into_view_if_needed', 'select_option', 'select_text', 'set_input_files', 'tap', 'text_content', 'type', 'uncheck', 'wait_for_element_state', 'wait_for_selector']

class Playwright_api:
    '''Playwright目前支持的定位引擎有：css、xpath、text：'''
    def __init__(self,page):
        self.page=page

    def open_url(self,url):
        '''打开浏览器'''
        #self.page.goto("https://www.baidu.com/")
        self.page.goto(url)
        time.sleep(3)
        return self.page

    def single_selector(self,j_str):
        '''选择单个元素'''
        print(str(j_str),'选择一个',self.page)
        obj=self.page.query_selector(j_str)
        return obj

    def all_selector(self,j_str):
        '''选择多个元素'''
        obj=self.page.query_selectorAll(j_str)
        return obj

    def wait_selector(self,j_str):
        '''选择单个元素，并且自动等待到元素可见、可操作'''
        obj=self.page.waitFor_selector(j_str)
        return obj

    def dialogue(self,js):
        '''js会话'''
        print('进了js会话')
        self.page.evaluate(js)

    def Drag(self,start_width,start_height,Finish_width,Finish_height):
        '''拖拽'''
        print('进了拖拽没')
        self.page.mouse.move(start_width, start_height)#起始点
        self.page.mouse.down()#按下
        self.page.mouse.move(Finish_width, Finish_height)#终点
        self.page.mouse.up()#松开
        #return self.page


# 选择单个元素：querySelector(engine=body)
# 选择多个元素：querySelectorAll(engine=body)
# 选择单个元素，并且自动等待：waitForSelector(engine=body)

#page.keyboard.press

#dblclick右键

#touchscreen.tap(x, y)
#点击
#输入
#键盘事件



class action:
    def __init__(self,page,path_name,obj=None):
        self.page=page
        self.obj=obj
        self.path_name=path_name

    def Left_click(self):
        '''左键单击'''
        print(self.page,'一坑更比一坑坑')
        self.page.click()

    def Double_click(self):
        '''左键双击'''
        print(self.page,'一坑更比一坑坑')
        self.page.dblclick()

    def Right_click(self):
        '''右键键单击'''
        self.page.mouse.move(200, 405)#起始点
        self.page.mouse.down()#按下
        self.page.mouse.move(400, 605)#终点
        self.page.mouse.up()#松开

    def Press(self,width,height,t):
        '''长按'''
        self.page.mouse.move(width, height)#按压位置
        self.page.mouse.down()#按下
        time.sleep(t)#按压时间
        self.page.mouse.up()#松开

    def enter(self,value):
        '''输入'''
        print(self.page,value,'下班之后轻松秒杀')
        self.page.fill(value)
        #return 

    def text_val(self):
        '''获取元素文本'''
        val=self.page.text_content()
        print(self.path_name,'到哪儿了兄弟',val)
        self.obj({self.path_name:val})#通过回调函数返回

    def xpath_val(self):
        '''获取元素坐标'''
        val=self.page.bounding_box()
        print(self.path_name,'\n\n获取元素坐标\n\n',val)
        self.obj({self.path_name:val})#通过回调函数返回
        
        
    def Upload_file(self,selector,file_url):
        '''上传文件'''
        #self.page.setInputFiles('input#upload', 'myfile.pdf')
        self.page.setInputFiles(selector,file_url)

    def deal_with(self,res):
        """参数处理"""
        #{'csrfmiddlewaretoken': 'sjAuyfpHGhnjdLqi9ZNBhFx48bUfq89FTqH6BwZWOesQm6XJxO1JIqxFKW4daEPL', 'path_name': '进入到dpa登录', 'sleep_time': '1', 'Positioning': '12', 'url': 'http://192.168.3.185/dpa/login'}
        #{'path_name': '输入密码', 'sleep_time': '1', 'Positioning': '0', 'title': '[placeholder=\\"请输入密码\\"]', 'interest': '2', 'data': '123456'} 关键中的关键
        #{'path_name': '点击登录', 'sleep_time': '1', 'Positioning': '0', 'title': 'button:has-text(\\"登录\\")', 'interest': '0'}
        interest = res.get('interest')#获取操作方式
        print(res.get('sleep_time'),'sleep_timesleep_time')
        sleep_time = int(res.get('sleep_time'))#获取睡眠时间,这里前端得效验
        print('走进了我的心房',interest,res)		 
        if interest=='0':
            #左键点击
            print('左键点击')
            self.Left_click()
            time.sleep(sleep_time)
            # return None
            return self.obj({self.path_name:True})#通过回调函数返回

        # elif interest=='1':
            # #清空输入框
            # obj.clear()
            # return None
        elif interest=='2':
            #输入内容
            data = res.get('data')#获取data
            self.enter(data)
            time.sleep(sleep_time)
            return self.obj({self.path_name:True})#通过回调函数返回
        
        elif interest=='3':
            #获取div内容
            Text=self.text_val()
            time.sleep(sleep_time)
            # return Text
            return self.obj({self.path_name:Text})#通过回调函数返回

        elif interest=='4':
            #右键点击
            self.Right_click()
            time.sleep(sleep_time)
            # return None
            return self.obj({self.path_name:True})#通过回调函数返回


        elif interest=='5':
            #双击
            print('左键双击')
            self.Double_click()
            time.sleep(sleep_time)
            return self.obj({self.path_name:True})#通过回调函数返回
        elif interest=='6':
            #长按
            self.Press(width,height,t)
            time.sleep(sleep_time)
            return self.obj({self.path_name:True})#通过回调函数返回
        # elif interest=='7':
           # #回退
            # obj.back()
            # return None
        # elif interest=='8':
           # #回车
           # obj.send_keys(Keys.ENTER)
           # return None
        elif interest=='9':
           #获取坐标
           Text=self.xpath_val()
           time.sleep(sleep_time)
           return Text
           
           