import sumoflist as n
import json
from ast import literal_eval
import sys

from unittest import TestCase

def test_case(function,input, output):
    try:
        assert eval("n."+function)(input) == output
    except AssertionError:
        return False
    else:
        return True


#print(n.sumL([1,2,3]))
try:
    jsonFile = open('testcase.json')
except:
    print("cannot open file!! error")

functions = json.load(jsonFile)
for func in functions:
    fname = func["functionName"]
    cases = func["tests"]
    print("For " + fname)
    print("------------------------------------------------")
    for case in cases:
        input = literal_eval(case["Input"])
        output = literal_eval(case["Output"])
        print("Input: ", input)
        print("Expected Output: ", output)
        if(test_case(fname,input,output)):
            print("-----test case passsed----")
        else:
            print("failed")
        print("--------------------------------------")


jsonFile.close()
