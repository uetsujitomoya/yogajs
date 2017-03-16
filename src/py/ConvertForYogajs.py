#!/usr/bin/env python
#coding:utf-8

f = open('../../json/170309_160402.json','r')
Allf = f.read()

text = Allf.replace('〈','：')
#print text,

txtForWrite = open('../../json/170316_160402.json','w')
txtForWrite.write(text)
txtForWrite.close()

f.close()
