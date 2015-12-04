
# -*- coding:utf-8 -*-

'''
Created on 2014-6-6

@author: long
'''

from sgmllib import SGMLParser,SGMLParseError
import os
import httplib2
import urlparse
import socket
passUrls = set()

http=httplib2.Http(timeout = 2)

class URLLister(SGMLParser):
    def reset(self):
        SGMLParser.reset(self)
        self.urls = set()
    def start_a(self, attrs):
        self.literal = 1
        # href = [ ("http://www.aipai.com"+v) for k, v in attrs if k == "href" and v.startswith("/")]
        for k,v in attrs:
            if k=="href" and "aipai.com" in v:
                self.urls.add(v)
def get_url_of_page(url, if_img=False):
    '''
    获取一个页面上的所有链接。
    '''
    urls = set()
    
    # f = urllib2.urlopen(url, timeout=3).read()
    
    try:
        res_h, res_b = http.request(url, "GET")
    except socket.error,e:
        print " socket.error:"+str(e)
        return []
    except httplib2.ServerNotFoundError,e:
        print " ServerNotFoundError:"+str(e)
        return []
    # print res_b
    try:
        url_listen = URLLister()
        url_listen.feed(res_b)
        urls = url_listen.urls
        # print urls
    except SGMLParseError,e:
        print e
    return urls

def get_page_html(begin_url, depth, main_site_domain):
    '''
    递归处理页面
    '''
    if not "aipai.com" in begin_url or ".mp4" in begin_url or ".flv" in begin_url:
        return
    passUrls.add(begin_url)
    if depth <= 0:
        return


    urls = get_url_of_page(begin_url)
    if urls:
        for murl in urls:
            if not murl in passUrls:
                get_page_html(murl, depth - 1, main_site_domain)

if __name__ == "__main__":
    url ="http://www.aipai.com"
    main_site_domain = urlparse.urlsplit(url).netloc
    get_page_html(url, 2, main_site_domain)
    for u in  passUrls:

        try:
            res_h, res_b = http.request(u, "GET")
            if ("/card.mp4" in res_b) :
                flag = 'property="og:videosrc"'
                start = res_b.find(flag)
                s = res_b[start+len(flag)+len('content="')+1 : res_b.find('"/>',start)]
                print u,s
        except socket.error,e:
            print " socket.error:"+str(e)
        except httplib2.ServerNotFoundError,e:
            print " ServerNotFoundError:"+str(e)


