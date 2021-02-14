from api import logs_ref
import random, sys

activityMultipliers = [0.1,0,0,0,0.1,0.1,1,4,7,2,3,4,0,4,3,6,6,2,5,9,2,1,1,0.5]


minutely = []
stood = [0]*24
cul = 0

i = 0
remaining = 0

for i in range(1440):
    minutely.append(cul)
    if remaining:
        cul += 1
        if random.randint(0, 7) == 0:
            stood[i // 60] += 1
        remaining -= 1

    else:
        prob = random.randint(0, 200 - activityMultipliers[i//60]*20//1)
        if prob == 0:
            remaining = random.randint(0, 1+7*activityMultipliers[i//60]//1)
            stood[i//60]+=1

# convert data

print(minutely[-1])

minutely = [60*i-x*60 for i, x in enumerate(minutely)]

print(minutely[:100])


tupScore = []
for i in range(7):
    tupScore.append(random.randint(15,30))
logs_ref.document('xOz6Cjsm6Zom8njn2MsX').update({
    u'minutely': minutely,
    # u'tupGo': tupScore,
    u'standFreq': stood,

})