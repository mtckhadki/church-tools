import os, zipfile, time
from PIL import Image, ImageDraw, ImageFont

def generate_slides_zip(template, slides, output_dir):
    ts = int(time.time())
    folder = os.path.join(output_dir, f'SLIDE_{ts}')
    os.makedirs(folder, exist_ok=True)
    generated=[]
    for i,slide in enumerate(slides, start=1):
        img = Image.new('RGB',(1280,720),'black')
        draw = ImageDraw.Draw(img)
        for tb in template['textboxes']:
            text = slide.get(tb['label'],'')
            font = ImageFont.truetype('arial.ttf', tb['fontSize'])
            draw.text((tb['x1'],tb['y1']), text, fill=tb['color'], font=font)
        path=os.path.join(folder,f'{i}.png')
        img.save(path)
        generated.append(path)
    zip_path=os.path.join(output_dir,f'SLIDE_{ts}.zip')
    with zipfile.ZipFile(zip_path,'w') as z:
        for f in generated:
            z.write(f, arcname=os.path.basename(f))
    return zip_path