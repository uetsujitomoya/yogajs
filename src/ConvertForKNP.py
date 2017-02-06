#!/usr/bin/env python
#coding:utf-8

import codecs

f = codecs.open('../160402.txt','r','utf-8')
Allf = f.read()

text = Allf.replace(u'。',u'。\r\n')
#print text,

txtForWrite = codecs.open('../160402sjisForKNP.txt','w','shift_jis')

for line in text:
    txtForWrite.write(line)

#txtForWrite.write(text)
txtForWrite.close()

f.close()
