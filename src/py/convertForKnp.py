#!/usr/bin/env python
#coding:utf-8

import codecs

<<<<<<< HEAD:src/py/ConvertForKNP.py
f = open('../../txt/xPlus1_0318.txt','r')
=======
f = open('../../txt/ningen_shikkaku_seiri.txt','r')
>>>>>>> counselorEducationForEvaluation:src/py/convertForKnp.py
#f = codecs.open('../1030noRap.txt','r','utf-8')
Allf = f.read()

        
textKaigyo = Allf.replace('。', '。\r\n')
#text = Allf.replace(u'。',u'。\r\n')
#print text,

textDeleted1 = textKaigyo.replace('。', '。\r\n')

<<<<<<< HEAD:src/py/ConvertForKNP.py
txtForWrite = open('../../txt/xPlus1_0318c.txt','w')
=======
txtForWrite = open('../../txt/ningen_shikkakuC.txt','w')
>>>>>>> counselorEducationForEvaluation:src/py/convertForKnp.py
txtForWrite.write(textKaigyo)

#txtForWrite = codecs.open('../1030Rap.txt','w','shift_jis')

#for line in text:
#    txtForWrite.write(line)

#txtForWrite.write(text)
txtForWrite.close()

f.close()
