# -*- coding: utf-8 -*-
from httplib2 import Http
import httplib2 
from logging import info,debug
import logging
import time 
import socket
import crydt
import random
import MySQLdb
import sys


logging.basicConfig(level=logging.INFO
    ,format='%(asctime)s %(filename)s [line:%(lineno)d] %(levelname)s : %(message)s'
    # ,datefmt = '%a, %d, %b, %Y %H:%M:%S'
    # ,filename = 'app.log'
    # ,filemode = 'w'
    )

# httplib2.debuglevel = 5
def downFromIP(ip,maxLen,num=2):

    onePiece = 188*43
    needPiece = maxLen/onePiece
    headers={
    "accept":"*/*", 
    "user-agent":"1",
    "host": "live.yunfancdn.com",
    "referer": "http://www.zhanqi.tv/luoxue",
    "connection": "keep-Alive"
    }
    # uri = "/live/hash/rtmp%3A%2F%2Fdlrtmp.cdn.zhanqi.tv%2Fzqlive%2F27837_NAd8g"
    uri = "/live/hash/rtmp%3A%2F%2Fb.biaozhun.rtmp.yunfancdn.com%2Flive%2Fblive1%3Fct%3Dfalse&nyt=1438940106564"
    #uri = "/live/hash/rtmp%3A%2F%2Fbiaozhun.rtmp.yunfancdn.com%2Flive%2Flive1%3Fct%3Dfalse&nyt=1438940299943"
    gethead = "?gethead=true"
    url = "http://" + ip.strip() + ":1928" + uri
    http=Http(timeout = 5)
    #first request
    try:
        res_h, res_b = http.request(url+gethead, headers = headers)
    except socket.error,e:
        return "first request socket.error:"+str(e)
    except socket.timeout,e:
        return "first request socket.timeout"+str(e)
    
    if res_h.status == 200  and res_h.get("content-length",None)=="0":

        idx_h = int(res_h.get("idx",0))
        max_h= int(res_h.get("max",0))
        #
        offset = 200
        if max_h - idx_h < offset+needPiece:
            debug(ip + "#1call downFromIP")
            time.sleep(5)
            if num<0:
                return "#1call num=0: " + str(res_h)
            return downFromIP(ip,maxLen,num-1)
            
            
        #首次请求
        debug(ip + "request again")
        start_bytes = (idx_h+offset)*onePiece
        end_bytes = start_bytes + needPiece * onePiece
        headers["range"] = "bytes=%d-%d" % (start_bytes,end_bytes)
        res2_b =""
        
        http2=Http(timeout = 5)
        try:
            res2_h, res2_b = http2.request(url, headers = headers)
        except socket.timeout, e:
            return "second request socket.timeout"+str(e)
        except socket.error,e:
            return "second request socket.error:"+str(e)
        if res2_h.status ==200 and "content-range" in res2_h and len(res2_b)>=needPiece * onePiece:
            return "OK"# + str(res2_h)
        else:
            return "ERROR" + str(res2_h)
    elif res_h.status == 400:
        debug(ip + "#2call downFromIP")
        if num<0:
            return "#2call num=0: " + str(res_h)
        time.sleep(2)
        return downFromIP(ip,maxLen,num-1)
    else:
        return "unkown error !!!!" + str(res_h)
def check843(ip):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client.connect((ip,843))
    except Exception, e:
        return "843 invalid : " + str(e)
    client.send("<policy-file-request/>")
    data = client.recv(1024)
    if "<allow-access-from domain" in data:
        return "843 : OK"
    else:
        return "843 invalid : " + data


def postUrlTracker(data,counts = 1):

    http  = httplib2.Http()
    headers = {
        
        "pragma":"no-cache"
        # "origin":"http://demo.yunfancdn.com",
        # "referer":"http://demo.yunfancdn.com/flash/YunfanVideoPlayer.swf/[[DYNAMIC]]/1"

    }
    for i in range(counts):
               
        res_h, res_b = http.request("http://urltracker.yunfan.com:8081/?opt=2",
            method="POST", body=data,headers = headers)
        print res_b
def sendTcpData(ip,port,hexData,counts=1):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client.connect((ip,port))
    except Exception, e:
        print "IP or port invalid : " + str(e)
    for i in range(counts):
        client.send(hex2str(hexData))
        data = client.recv(1024)

def postkafka(data):
    headers={
    "accept":"*/*", 
    "user-agent":"1",
    "host": "s1.log.yunfancdn.com",
    "referer": "http://www.zhanqi.tv/luoxue",
    "connection": "keep-Alive"
    }
    
    url = "http://s1.log.yunfancdn.com/s.gif"
    http=Http(timeout = 5)
    data = crydt.enc(data
        ,0x42CC8769)
    try:
        res_h, res_b = http.request(url, "POST" , data , headers = headers)

    except socket.error,e:
        return " socket.error:"+str(e)

    if res_h.status==200:
        return "OK"
def postkafka2(data):
    url = "http://s1.log.yunfancdn.com:800/kafka"
    http=Http(timeout = 5)
    try:
        res_h, res_b = http.request(url, "POST" , data)
    except socket.error,e:
        return " socket.error:"+str(e)

    if res_h.status==200:
        return "OK"
def testdis(url,sqlStr):
    headers={
    "accept":"*/*", 
    "user-agent":"IOS8.0",
    "host": "pcvideodn.titan.imgo.tv",
    "referer": "test_content-length",
    "connection": "keep-Alive"
    }
    
    http=Http(timeout = 5)
    try:
        res_h, res_b = http.request(url, "GET")
    except socket.error,e:
        print " socket.error:"+str(e)
    except httplib2.ServerNotFoundError,e:
        print " ServerNotFoundError:"+str(e)

    if res_h.status ==404:
        #404,触发创建任务,查数据库是否收到请求
        try:
            conn=MySQLdb.connect(host='rds024s2n64i012251qqpublic.mysql.rds.aliyuncs.com',user='liushuiwen',passwd='ef00c0645643a76b053b4adfbb94261b',db='rtmpdispatch',port=3306)
            cur=conn.cursor()
            count = cur.execute(sqlStr)
            # print "次数:",count
            cur.close()
            conn.close()
            if count!=1:
                print "-----------------------------------------------------"
                print "mysql return count : ",count
                print "sqlStr: ",sqlStr
                print "http_info: ",time.asctime(time.localtime()),res_h
        except MySQLdb.Error,e:
            print "-----------------------------------------------------"
            print time.asctime(time.localtime())
            print "Mysql Error %d: %s" % (e.args[0], e.args[1])

        return
    else:
        print "-----------------------------------------------------"
        print time.asctime(time.localtime()),res_h
        return

if __name__ == "__main__":
    # s = ('113.6.228.154',)
    # for i in s:

        
    #     print i + " : " + downFromIP(i,2*1024*1024) +" , " + check843(i)
   
    # print check843("175.6.0.48")
    # print hex2str("3c706f6c6963792d66696c652d726571756573742f3e")
    sys.stdout.write('[')
    for x in xrange(1000):
        randomStr = str(random.randint(10**7,10**8-1));
        url = 'http://cat302.hlslive.zhanqi.yfcdn.net/zqlive/test_'+ randomStr +'/online.m3u8'
        # url = 'http://cat302.hlslive.zhanqi.yfcdn.net/zqlive/test/online.m3u8'
        request_arg = "url: "+url
        sqlStr = "SELECT * from rtmp_log where request_arg= '" + request_arg + "'"
        testdis(url,sqlStr)
        time.sleep(1)
        # print "次数: ",x
        sys.stdout.write('=')
        sys.stdout.flush()
    sys.stdout.write(']')   
    print
    pass

    


    
# 