import pymysql
import re

class sql_lave:
    def __init__(self,host,port,user,passwd,db):
        self.conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            passwd=passwd,
            db=db,
            charset='utf8'
        )
		
    def run_sql(self,str_sql):
        #get请求
        #bool(re.search('multi', 'A mUltiCased string', re.IGNORECASE))
        cursor = self.conn.cursor()
        list_sql=str_sql.split(";")
        cols=None
        for i in str_sql:
            if bool(re.search('select', str_sql, re.IGNORECASE)):
                try:
                    cursor.execute(str_sql)
                    results = cursor.fetchall()
                    cols =cursor.description
                except Exception as e:
                    cols=None
                    results = e
            elif bool(re.search('insert', str_sql, re.IGNORECASE)) or bool(re.search('updata', str_sql, re.IGNORECASE)) or bool(re.search('delete', str_sql, re.IGNORECASE)):
                try:
                    cursor.execute(str_sql)
                    self.conn.commit()
                    results = '执行成功'

                except Exception as e:
                    self.conn.rollback()
                    results = e
            else:
                results='sql语法错误'
                print('sql语法错误')
        self.conn.close()
        return cols,results
	