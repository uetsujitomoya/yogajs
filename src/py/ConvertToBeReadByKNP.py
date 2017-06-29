#!/usr/bin/env python
#coding:utf-8

f = open('../../txt/1002.txt','r')
Allf = f.read()

text = Allf.replace('��','��\r\n')
#print text,

txtForWrite = open('../../txt/170628convertedToBeReadByKNP_1002.txt','w')
txtForWrite.write(text)
txtForWrite.close()

f.close()
