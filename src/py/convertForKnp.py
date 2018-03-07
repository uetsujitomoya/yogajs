#!/usr/bin/env python
#coding:utf-8

import codecs


f = open('darshana/yoga-002_uetsujiEdited.txt','r')

#f = codecs.open('../1030noRap.txt','r','utf-8')
Allf = f.read()


textKaigyo = Allf.replace('。', '。\r\n')
#text = Allf.replace(u'。',u'。\r\n')
#print text,

textDeleted1 = textKaigyo.replace('？', '？\r\n')
textDeleted2 = textDeleted1.replace('！', '！\r\n')

txtForWrite = open('darshana/yoga-002_uetsujiEdited_lined.txt','w')

txtForWrite.write(textDeleted2)

#txtForWrite = codecs.open('../1030Rap.txt','w','shift_jis')

#for line in text:
#    txtForWrite.write(line)

#txtForWrite.write(text)
txtForWrite.close()

f.close()
