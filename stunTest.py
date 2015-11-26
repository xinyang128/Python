# -*- coding: utf-8 -*-

import httplib2
import random
import socket
import sys
import time
import threading
def requestStun(rets):  

    url = "http://175.6.0.10:8868"  
    start = time.time()
    headers={
    "source": "cztv",
    "hash": "813156f9b87b1ef172a26c33a227055d",#589a6464",
    "Connection": "close"
    }
    headers["hash"]  += str(random.randint(10**7,10**8-1));
    http=httplib2.Http(timeout = 5)
    try:
        res_h, res_b = http.request(url, "GET",headers=headers)
    except socket.error,e:
        print " socket.error:"+str(e)
    except httplib2.ServerNotFoundError,e:
        print " ServerNotFoundError:"+str(e)

    if res_h.status == 200:
        # print "time: ",time.time()-start
        if res_b in rets:
            rets[res_b] += 1
        else:
            rets[res_b] = 1


if __name__ == "__main__":

    rets = {}
    for x in xrange(100):
        # thread.start_new_thread(requestStun,(rets,))
        t = threading.Thread(target=requestStun,args=(rets,))
        t.start()
        t.join()

    print rets
