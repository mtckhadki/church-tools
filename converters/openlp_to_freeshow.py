import xml.etree.ElementTree as ET
import json
import os

# ===== THEME MAPPING =====
def apply_theme(text):
    return {
        "text": text,
        "style": {
            "fontSize": 48,
            "color": "#FFFFFF",
            "align": "center",
            "lineHeight": 1.2
        },
        "background": {
            "type": "solid",
            "color": "#000000"
        }
    }

def convert_xml_to_show(xml_path, output_folder):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    ns = {"ns": "http://openlyrics.info/namespace/2009/song"}

    title = root.find(".//ns:title", ns).text

    verses = []
    for verse in root.findall(".//ns:verse", ns):
        lines = verse.find("ns:lines", ns)
        if lines is not None:
            verses.append(lines.text.strip())

    show_data = {
        "meta": {
            "title": title,
            "artist": ""
        },
        "slides": [apply_theme(v) for v in verses]
    }

    output_file = os.path.join(output_folder, title + ".show")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump([1, show_data], f, indent=2, ensure_ascii=False)

    return output_file