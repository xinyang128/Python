# -*- coding: utf-8 -*-

def hex2str(data):
    ret =""
    for i in range(len(data)/2):

        ret += chr(int(data[i*2:i*2+2],16))
    return ret
def str2hex(data):
    ret=""
    for i in tuple(data):
        ret += hex(ord(i))[2:]
    return ret
def hex2mem(data):
    
    dataLen = len(data)
    num = dataLen/2
    if dataLen%2:
        num+=1
    # print num
    ret = bytearray(num)
    for i in range(num):
        start = dataLen-2
        if start<0:
            start=0
        ret[num-i-1] = int(data[start:dataLen],16)
        # print "hex2mem:",ret[num-i-1],num-i-1
        dataLen-=2
    return ret
if __name__ == "__main__":
    ret = hex2mem("23b467d8")
    for i in ret:
        print i,type(ret[1])