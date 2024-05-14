from typing import List

def solution(n: int) -> int:
	# write your solution here
	totalSum = fib(n)
	for i in range(0, n):
		leftSum = fib(i)
		print(leftSum)
		rightSum  = totalSum - leftSum
		print(rightSum)
		if(leftSum == rightSum):
			return n
	return -1
def fib(n: int) -> int:
	print("abc")
	if(n == 1 or n == 0):
		return n
	else:
		return fib(n-1) + fib(n-2)
# R E A D M E
# DO NOT CHANGE the code below, we use it to grade your submission. If changed your submission will be failed automatically.
if __name__ == '__main__':  
    n = int(input())
    print(solution(n))