
def findAnagrams(s, p):
    """
    :type s: str
    :type p: str
    :rtype: List[int]
    """
    i = 0
    j = 0
    result = []
    hmap = {}
    count = len(hmap.keys())
    while(j<len(s)):
        if(j-i+1 < window_size):
            hmap[s[j]]
            j = j + 1
        if(j-i+1 == window_size):
            i = i + 1
            j = j + 1
    return result

if __name__ == "__main__":
    findAnagrams("cbaebabacd", "abc")