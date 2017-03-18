#!/usr/bin/env python
#coding:utf-8

counselingDate = '151128'

f = open('../../json/170309_'+counselingDate+'.json','r')
Allf = f.read()

text0 = Allf.replace('〈','：')
text = text0.replace('〉','：')
#print text,

txtForWrite = open('../../json/170316_'+counselingDate+'.json','w')
txtForWrite.write(text)
txtForWrite.close()

f.close()
