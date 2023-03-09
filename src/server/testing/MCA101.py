import sumoflist as n
from ast import literal_eval
import sys
from difflib import Differ
import os
def test_case_sumL_1():
	try:
		assert n.sumL([1,2,3])==5
	except AssertionError:
		print('Input:', [1,2,3])
		print('Output:', 5)
		print('Your output: ', n.sumL([1,2,3]))
		return False
	else:
		return True
def test_case_sumL_2():
	try:
		assert n.sumL([2,2,3])==7
	except AssertionError:
		print('Input:', [2,2,3])
		print('Output:', 7)
		print('Your output: ', n.sumL([2,2,3]))
		return False
	else:
		return True
def test_case_prod_1():
	try:
		assert n.prod([1,2,3])==6
	except AssertionError:
		print('Input:', [1,2,3])
		print('Output:', 6)
		print('Your output: ', n.prod([1,2,3]))
		return False
	else:
		return True
def test_case_prod_2():
	try:
		assert n.prod([2,5])==10
	except AssertionError:
		print('Input:', [2,5])
		print('Output:', 10)
		print('Your output: ', n.prod([2,5]))
		return False
	else:
		return True
def test_case_subs_1():
	try:
		assert n.subs(2,2)==0
	except AssertionError:
		print('Input:', 2,2)
		print('Output:', 0)
		print('Your output: ', n.subs(2,2))
		return False
	else:
		return True
def test_case_Hello_1():
	try:
		assert n.Hello()=='Hello'
	except AssertionError:
		print('Input:', )
		print('Output:', 'Hello')
		print('Your output: ', n.Hello())
		return False
	else:
		return True
def test_case_printHello_1():
	with open('output.txt','w') as sys.stdout:
		n.printHello()
	i=0
	isSame=True
	sys.stdout = sys.__stdout__
	codeout=''
	compare="""hello
"""
	with open('output.txt','r') as f:
		while True:
			c=f.read(1)
			codeout+=c
			if not c:
				break
			if(i>=len(compare) or c!=compare[i]):
				print('Wrong Output')
				isSame=False
			i+=1
	os.remove('output.txt')
	if not isSame:
		print('Your Output:',compare)
		print('Expected output:',codeout)
	return isSame
print('for test_case_sumL_1()')
if(test_case_sumL_1()):
	print('----test case passed')
else:
	print('failed!! ')
print('for test_case_sumL_2()')
if(test_case_sumL_2()):
	print('----test case passed')
else:
	print('failed!! ')
print('for test_case_prod_1()')
if(test_case_prod_1()):
	print('----test case passed')
else:
	print('failed!! ')
print('for test_case_prod_2()')
if(test_case_prod_2()):
	print('----test case passed')
else:
	print('failed!! ')
print('for test_case_subs_1()')
if(test_case_subs_1()):
	print('----test case passed')
else:
	print('failed!! ')
print('for test_case_Hello_1()')
if(test_case_Hello_1()):
	print('----test case passed')
else:
	print('failed!! ')
print('for test_case_printHello_1()')
if(test_case_printHello_1()):
	print('----test case passed')
else:
	print('failed!! ')
