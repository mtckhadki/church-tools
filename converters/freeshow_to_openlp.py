import json
import xml.etree.ElementTree as ET
import os

def convert_show_to_xml(show_path, output_folder):
    with open(show_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    show_data = data[1]
    title = show_data["meta"]["title"]

    root = ET.Element("song")
    lyrics = ET.SubElement(root, "lyrics")

    for i, slide in enumerate(show_data.get("slides", [])):
        verse = ET.SubElement(lyrics, "verse", name=f"v{i+1}")
        lines = ET.SubElement(verse, "lines")
        lines.text = slide.get("text", "")

    tree = ET.ElementTree(root)

    output_file = os.path.join(output_folder, title + ".xml")
    tree.write(output_file, encoding="utf-8", xml_declaration=True)

    return output_file