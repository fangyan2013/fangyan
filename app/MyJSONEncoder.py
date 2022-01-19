import json
import datetime
import dateutil.parser
import decimal
 
 
def MyJSONEncoder(page_obj):
    list_val=[]
    for dict_val in list(page_obj):
        list_value = list(dict_val.values())
        list_keys = list(dict_val.keys())
        i=0
        while i< len(list_value):
            if isinstance(list_value[i],datetime.datetime):
                list_value[i]=str(list_value[i])
            i+=1
        dictionary = dict(zip(list_keys, list_value))
        list_val.append(dictionary)
    return list_val
	
	
def MYSQL_JSON(des,fet):
    keys=[]
    for column in des:
        keys.append(column[0])
    key_number = len(keys)
	
    json_data = []
    for row in fet:
        item = dict()
        for q in range(key_number):
            if isinstance(row[q],datetime.datetime):
                item[keys[q]] = str(row[q])
            else:
                item[keys[q]] = row[q]
        json_data.append(item)
    return json_data
	
	
def Parsing(j):
    dict_j=None
    def json_obj(j):#解析成json对象,第一次返回的应该是对象
        print('等待工作的电话号码',j,type(j),isinstance(j,dict))
        if isinstance(j,dict):
            dict_j=j
            return 
        else:
            return json_obj(json.loads(j))
    json_obj(j)
    print(dict_j,'dict_j-------')
    return dict_j