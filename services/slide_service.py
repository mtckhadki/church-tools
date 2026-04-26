from PIL import Image, ImageDraw, ImageFont
import os

def generate_slides(data, output_folder):

    folder = os.path.join(output_folder, "slides")
    os.makedirs(folder, exist_ok=True)

    for i, slide in enumerate(data["slides"]):

        img = Image.open(slide["image"]).convert("RGB")
        draw = ImageDraw.Draw(img)

        font = ImageFont.truetype("arial.ttf", 48)

        for text in slide["texts"]:
            draw.text(
                (text["x"], text["y"]),
                text["value"],
                fill="white",
                font=font
            )

        filename = slide["title"] + ".jpg"
        path = os.path.join(folder, filename)

        img.save(path)

    return folder