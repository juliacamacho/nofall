
from collections import deque

a = deque(['STANDING']*20)

a.append(5)
a.append(5)
a.append(5)
a.append(5)

for i in a:
    print(i)