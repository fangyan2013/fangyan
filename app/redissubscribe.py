
import redis
from utils.redis_pool import POOL
#但是以nginx+uwsgi方式在linux中时,通过命令uwsgi --ini /etc/uwsgi8080.ini启动后,即时脚本中调用该url对应的方法,但是仍然不会启动redis监听
#解决:uwsgi启动文件中增加 enable-threads=true的属性设置
def redis_sub(__list, i):
    redis_conn = redis.StrictRedis(connection_pool=POOL)
    p = redis_conn.pubsub()
    p.subscribe("cctv")

    for item in p.listen():
        print(item,'===='*10,type(item['channel']),item['channel'])
        if item['channel'] == 'None':continue
        print("正在监听频道：{}".format(item['channel']) )
        # if item['type'] == 'message':
        data = item['data']
        print("频道 {} 发来新消息:{}" .format(item['channel'], data))
        __list[i]=data
        # yield 'data:%s\n\n' % data
        if data == 'exit':
            print("取消订阅")
            p.unsubscribe('cctv')
            # yield 'data:%s\n\n' % "END"
            __list[i]="END"
            break


def redis_sub2(__list, i):
    redis_conn = redis.StrictRedis(connection_pool=POOL)
    p = redis_conn.pubsub()
    p.subscribe("cctv2")

    for item in p.listen():
        print(item,'===='*10,type(item['channel']),item['channel'])
        if item['channel'] == 'None':continue
        print("正在监听频道：{}".format(item['channel']) )
        # if item['type'] == 'message':
        data = item['data']
        print("频道 {} 发来新消息:{}" .format(item['channel'], data))
        __list[i]=data
        # yield 'data:%s\n\n' % data
        if data == 'exit':
            print("取消订阅")
            p.unsubscribe('cctv')
            # yield 'data:%s\n\n' % "END"
            __list[i]="END"
            break