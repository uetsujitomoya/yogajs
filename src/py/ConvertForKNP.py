#!/usr/bin/env python
#coding:utf-8

import codecs

f = open('../../txt/171101fotCC.txt','r')
#f = codecs.open('../1030noRap.txt','r','utf-8')
Allf = f.read()


textKaigyo = Allf.replace('。', '。\r\n')
#text = Allf.replace(u'。',u'。\r\n')
#print text,

textDeleted1 = textKaigyo.replace('。', '。\r\n')

txtForWrite = open('../../txt/1701011convertedForKNP_171101fotCC.txt','w')
txtForWrite.write(textKaigyo)

#txtForWrite = codecs.open('../1030Rap.txt','w','shift_jis')

#for line in text:
#    txtForWrite.write(line)

#txtForWrite.write(text)
txtForWrite.close()

f.close()
