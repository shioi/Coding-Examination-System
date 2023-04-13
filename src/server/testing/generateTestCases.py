from unittest import TestCase
import json
from ast import literal_eval
import sys
import os

if(len(sys.argv) < 2):
    print("give arguments")
    sys.exit(1)
testFileName = sys.argv[1]+".py"
testJsonName = sys.argv[2]


try:
    jsonFile = open(testJsonName)
except:
    print("cannot open file!! error")

testFile = open(testFileName,"x")    
testFile.close();

def return_tab(times):
    tabs = ""    
    for i in range(times):
        tabs+="\t"
    return tabs
    

#all the boilereplate code goes here
def write_boilerplate_head():
    code = f"""import file as n\nfrom ast import literal_eval\nimport sys\nfrom difflib import Differ\nimport os\nimport sys\nsolved=0\n"""
    with open(testFileName, "a") as f:
        f.write(code)    

def write_totaltestcase(total):
    code = f"total={total}\n"
    with open(testFileName,"a") as f:
        f.write(code)


#creating the assert test function
def create_test(fname, inputString,output,number):
    code1 = f"def test_case_{fname}_{number}():\n{return_tab(1)}try:\n{return_tab(2)}assert n.{fname}({inputString[:-1]})=={output}\n"
    code2 = f"{return_tab(1)}except AssertionError:\n{return_tab(2)}print('Input:', { inputString[:-1]})\n{return_tab(2)}print('Output:', {output})\n{return_tab(2)}print('Your output: ', n.{fname}({inputString[:-1]}))\n{return_tab(2)}return False\n"
    code3 = f"{return_tab(1)}else:\n{return_tab(2)}return True\n"
    with open(testFileName, "a") as f:
        f.write(code1)
        f.write(code2)
        f.write(code3)
    test_functions.append(f"test_case_{fname}_{number}")

def create_test_output(fname,inputString,output,number):
    code1 = f"def test_case_{fname}_{number}():\n{return_tab(1)}with open('output.txt','w') as sys.stdout:\n{return_tab(2)}n.{fname}({inputString[:-1]})\n"
    code3 = f"{return_tab(1)}i=0\n{return_tab(1)}isSame=True\n{return_tab(1)}sys.stdout = sys.__stdout__\n{return_tab(1)}codeout=''\n"
    code4 = f'{return_tab(1)}compare="""\n{output}"""\n'
    code2 = f"{return_tab(1)}with open('output.txt','r') as f:\n{return_tab(2)}while True:\n{return_tab(3)}c=f.read(1)\n{return_tab(3)}codeout+=c\n{return_tab(3)}if not c:\n{return_tab(4)}if(i<len(compare)-1):\n{return_tab(5)}isSame=False\n{return_tab(4)}break\n{return_tab(3)}if(i>=len(compare) or c!=compare[i]):\n"
    code5=f"{return_tab(4)}if(isSame):\n{return_tab(5)}print('Wrong Output')\n{return_tab(4)}isSame=False\n{return_tab(3)}i+=1\n"
    code6 = f"{return_tab(1)}os.remove('output.txt')\n{return_tab(1)}if not isSame:\n{return_tab(2)}print('Expected Output:',compare)\n{return_tab(2)}print('Your output:',codeout)\n"
    code7 = f"{return_tab(1)}return isSame\n"
    with open(testFileName, "a") as f:
        f.write(code1)
        f.write(code3)
        f.write(code4)
        f.write(code2)
        f.write(code5)
        f.write(code6)
        f.write(code7)
    test_functions.append(f"test_case_{fname}_{number}")

def write_function_calls():
    
    with open(testFileName, "a") as f:
        for tst in test_functions:
            code = tst+"()"
            prevalidation = f"print('for {code}')\n"
            code_validation = f"if({code}):\n{return_tab(1)}print('-------test case passed-------')\n{return_tab(1)}solved+=1\nelse:\n{return_tab(1)}print('failed!! ')\n"
            f.write(prevalidation)
            f.write(code_validation)
    

    

#calling all the functions\
test_functions = []

#parsing json and creating code
def parse_and_create():
    l=0
    functions = json.load(jsonFile)
    for func in functions:
        print(func)
        i=0    
        fname = func["functionName"]
        for test in func["tests"]:
            l+=1
            i+=1
            inp = ""
            for input in test["Inputs"]:
                inp+=input["input"]+","
            out = test["Output"]
            if(func["type"]=="value" or func["type"]==''):
                create_test(fname,inp,out,i)
            elif(func["type"] == "output"):
                create_test_output(fname,inp,out+"\n",i)
    
    write_totaltestcase(l)
    

def writeLastLine():
    code = f"with open(sys.path[0]+'/solved.txt','w') as f:\n"
    code1 = f"{return_tab(1)}f.write('Total:'+str(total))\n"
    code2 = f"{return_tab(1)}f.write('\\nSolved:'+str(solved))\n"
    with open(testFileName, "a") as f:
        f.write(code)
        f.write(code1)
        f.write(code2)


write_boilerplate_head()
parse_and_create()
write_function_calls()
writeLastLine()

