#!/usr/bin/env python
#coding:utf-8

f = open('../160402.txt','r')
Allf = f.read()

text = Allf.replace('¡£','¡£\r\n')
#print text,

txtForWrite = open('../160402ForPutIntoKNP.txt','w')
txtForWrite.write('hoge\n')
txtForWrite.close()

f.close()
