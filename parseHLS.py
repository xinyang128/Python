#-*- coding: UTF-8 -*- 。
import httplib2
import time
import re
import socket
def downfile(url):

    start = time.time()
    http=httplib2.Http(timeout = 5)
    try:
        res_h, res_b = http.request(url, "GET")
    except socket.error,e:
        print " socket.error:"+str(e)
    except httplib2.ServerNotFoundError,e:
        print " ServerNotFoundError:"+str(e)
    if res_h.status !=200 and res_h.status !=206  and res_h.status !=302:
        print url
        print "ERROR: ",res_h
        return []

    end = time.time()
    down_time = end - start 
    res_b_len = res_h.get("content-length",'0')
    ex = url[url.rfind('/')+1:]
    content_location = res_h.get('content-location',"nokey")
    ip = content_location[7:content_location.find('/',7)]
    print ex,"| IP:",ip,"| time:",down_time,"| file_len:",res_b_len,"| speed(KB/s):",int(int(res_b_len)/down_time/1000)
    #保存ts
    filename = ex[:ex.find('?')]
    fp = open(filename,'wb')
    fp.write(res_b)
    fp.close()
    if '.m3u8' in ex:
        return parseM3U8(url,res_b)
    else:

        return #len(res_b)
    #     check(len(res_b),url)

def check(filelen,url):
    pattern = re.compile("start=(\d+)&end=(\d+)")
    res = pattern.search(url).groups()
    calc_len = int(res[1])-int(res[0])+1
    if filelen != calc_len:
        print "!!!!!!!!!!!!!!!!!!!!!!!!!!!!ERROR,calc_len:",calc_len,"| file_len:",filelen

def parseM3U8(url,res_b):
    tss = []
    data = res_b
    url_prv = url[:url.rfind('/')+1]
    
    while 1:
        
        ts,data = s_find(data)
        if ts==0:
            break
        tss.append(url_prv+ts)
    return tss

def s_find(res_b):
    ext_start = res_b.find("#EXTINF:")
    if ext_start == -1:
        ts = 0 
        data = ""
        return ts,data
    ext_end = res_b.find("\n",ext_start)
    ts_start = ext_end+1
    ts_end = res_b.find("\n",ts_start)
    ts =  res_b[ts_start:ts_end]
    data = res_b[ts_end+1:]
    return ts,data
if __name__ == "__main__":
    start = 0
    prv_ts = ""
    for i in xrange(1):
        #先下载m3u8文件
        tss = downfile('http://dianbo.hls.yunfancdn.com/video/hls/mp4/jiucenyaota/playlist.m3u8')
        if tss ==[]:
            break
        if prv_ts == "":
            start  = 0
        else:
            
            if prv_ts ==tss[-1]:
                # print "sleep10s"               
                time.sleep(10)

                continue
            else:
                if prv_ts in tss:
                    start = tss.index(prv_ts) +1
                else:
                    start=0
        filelen = 0         
        for ts in tss[start:]:
            downfile(ts)
        #     filelen = filelen + int(downfile(ts))
        # print 'filelen::::',filelen
        prv_ts = tss[-1]
    pass