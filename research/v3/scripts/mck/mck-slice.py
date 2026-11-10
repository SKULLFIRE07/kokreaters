import sys
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
src, prefix, sliceh, outw = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
im = Image.open(src); W,H = im.size
i=0
for y in range(0,H,sliceh):
    c = im.crop((0,y,W,min(H,y+sliceh)))
    if outw and W>outw: c = c.resize((outw, int(c.height*outw/W)))
    c.convert('RGB').save(f"{prefix}-{i:02d}.jpg", quality=70); i+=1
print(W,H,i)
