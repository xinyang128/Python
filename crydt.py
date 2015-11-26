# -*- coding: utf-8 -*-
from strTools import hex2str,hex2mem

import base64
def enc(data,key):
    c1 = longToInt(key + 84836237)
    c2 = longToInt(key + 278417278)
    c3 = longToInt(key + 1995388704)
    c4 = longToInt(2654435769)
    
    crrPos = 0
    
    dataBytes = bytearray(data,"utf-8")
    splitPos = 8
    dataLen = len(dataBytes)
    # print "dataLen's len:",dataLen

    while dataLen >= splitPos:
        left = pick(dataBytes,crrPos)
        right = pick(dataBytes,crrPos+4)
        
        
        c5=0
        for i in range(16):

            # print i,type(left),left
            
            c5 = longToInt(c5 + c4)
            left = longToInt(left + ((right << 4) + key ^ right + c5 ^ (right >> 5) + c1));
            right = longToInt(right + ((left << 4) + c2 ^ left + c5 ^ (left >> 5) + c3));
        

        memcpy(dataBytes,left,crrPos)
        memcpy(dataBytes,right,crrPos+4)
        crrPos += 8
        dataLen -= 8     

    for i in range(dataLen):
        # print 
        dataBytes[crrPos] = dataBytes[crrPos] ^ 0xFF
        crrPos +=1 
        # hexStr+= hex(ord(i)^0xFF)[2:]
    # s=hex2str(hexStr)
    # print repr(dataBytes)
    ret = base64.b64encode(dataBytes)
    ret = ret.replace('=','[').replace("/","-").replace("+","*")
    
    return ret
def pick(dataBytes,crrPos):
    num=4
    ret=0
    for i in range(num):
        tmp = crrPos+num-1-i
        ret += dataBytes[tmp]<<8*(3-i)
    # print repr(dataBytes),"--",crrPos
    # for i in range(num):
    #     ret += dataBytes[crrPos+i] << (8*(3-i))
    # print ret
    return ret
def longToInt(value):

    if value > 4294967295 :
        return (value & (2 ** 32 - 1))
    else :
        return value
def memcpy(dataBytes,src,start):

    tmpBytes = hex2mem(hex(src)[2:])
    # print repr(tmpBytes)
    # dataBytes[start+0] = tmpBytes[0]
    # dataBytes[start+1] = tmpBytes[1]
    # dataBytes[start+2] = tmpBytes[2]
    # dataBytes[start+3] = tmpBytes[3]

    dataBytes[start+3] = tmpBytes[0]
    try:
        dataBytes[start+2] = tmpBytes[1]
    except IndexError:
        dataBytes[start+2] = 0
    try:
        dataBytes[start+1] = tmpBytes[2]
    except IndexError:
        dataBytes[start+1] =0
    try:
        dataBytes[start+0] = tmpBytes[3]
    except IndexError:
        dataBytes[start+0] =0
if __name__ == "__main__":

    print enc('{"act":"superminer","count":1,"data":["41097527|www.baidu1.com|115.231.216.40|386|211|1"],"dm":"yunfancdn.com","key":""}'
        ,0x42CC8769)
