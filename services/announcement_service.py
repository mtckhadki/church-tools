import xml.etree.ElementTree as ET
import os
from converters.openlp_to_freeshow import convert_xml_to_show

def generate_xml(data, output_folder):
    root = ET.Element("song")
    lyrics = ET.SubElement(root, "lyrics")

    for i, section in enumerate(data["sections"]):
        verse = ET.SubElement(lyrics, "verse", name=f"a{i}")
        lines = ET.SubElement(verse, "lines")

        # Preserve HTML formatting
        content = f"<b>{section['heading']}</b><br>{section['content']}"
        lines.text = content

    xml_path = os.path.join(output_folder, "announcement.xml")
    ET.ElementTree(root).write(xml_path, encoding="utf-8", xml_declaration=True)

    # 🔥 Auto convert to SHOW
    show_path = convert_xml_to_show(xml_path, output_folder)

    return show_path