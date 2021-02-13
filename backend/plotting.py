from api import logs_ref
import random

# minutely = []
# cul = 0
# for i in range(1440):
#     if i < 360:
#         cul += 60
#     elif i <1000:
#         if random.randint(0,3) <= 2:
#             cul += random.randint(20,60)
#         else:
#             cul += 0
#     else:
#         cul += 60
#     minutely.append(cul)

stood = [0] * 24

for i in range(8,22):
    stood[i] = random.randint(1, 8)

logs_ref.document('h2vVRIIuNyr65vgZCe2Y').update({
    # u'minutely': minutely,
    u'standFreq': stood,

})