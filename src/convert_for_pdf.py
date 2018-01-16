#!/usr/bin/env python
#coding:utf-8

import codecs

f = open('../txt/C_C_experiment/sagyou1_no_rap.txt','r')
#f = codecs.open('../1030noRap.txt','r','utf-8')
Allf = f.read()


text1 = Allf.replace('〈','\r\n〈')
text2 = text1.replace('〉','〉\r\n')
#text = Allf.replace(u'。',u'。\r\n')
#print text,

txtForWrite = open('../txt/C_C_experiment/sagyou1.txt','w')
txtForWrite.write(text2)

#txtForWrite = codecs.open('../1030Rap.txt','w','shift_jis')

#for line in text:
#    txtForWrite.write(line)

#txtForWrite.write(text)
txtForWrite.close()

f.close()
