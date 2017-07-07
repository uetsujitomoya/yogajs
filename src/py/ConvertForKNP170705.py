#!/usr/bin/env python
#coding:utf-8

import codecs

f = open('../../txt/170628_1002.txt','r')
#f = codecs.open('../1030noRap.txt','r','utf-8')
Allf = f.read()


textKaigyo = Allf.replace('。', '。\r\n')
#text = Allf.replace(u'。',u'。\r\n')
#print text,

textDeleted1 = textKaigyo.replace('〈', '')
textDeleted2 = textDeleted1.replace('〉', '')

txtForWrite = open('../../txt/170628convertedForKNP170705_170705.txt','w')
txtForWrite.write(textKaigyo)

#txtForWrite = codecs.open('../1030Rap.txt','w','shift_jis')

#for line in text:
#    txtForWrite.write(line)

#txtForWrite.write(text)
txtForWrite.close()

f.close()
