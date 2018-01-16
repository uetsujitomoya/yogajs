#!/usr/bin/env python
#coding:utf-8

import codecs

f = open('../1030noRap.txt','r')
#f = codecs.open('../1030noRap.txt','r','utf-8')
Allf = f.read()


text = Allf.replace('。','。\r\n')
#text = Allf.replace(u'。',u'。\r\n')
#print text,

txtForWrite = open('../1030Rap3.txt','w')
txtForWrite.write(text)

#txtForWrite = codecs.open('../1030Rap.txt','w','shift_jis')

#for line in text:
#    txtForWrite.write(line)

#txtForWrite.write(text)
txtForWrite.close()

f.close()
