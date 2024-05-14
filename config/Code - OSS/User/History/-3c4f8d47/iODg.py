
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
    while(j<len(s) and i < len(s) - window_size):
        compare_set.add(s[j])
        if(j-i+1 < window_size):
            j = j + 1
        if(j-i+1 == window_size):
            compare_set.add(s[j])
            if(compare_set == original_set):
                result.append(i)
            print(result)
            print("removing : compare_set", s[i], compare_set)
            compare_set.add(s[j])
            compare_set.remove(s[i])
            print(compare_set)
            i = i + 1
            j = j + 1
    return result

if __name__ == "__main__":
    findAnagrams("cbaebabacd", "abc")