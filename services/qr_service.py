import os
from werkzeug.utils import secure_filename
from services.qr_code import generate_qr as styled_qr

def generate_qr(data, logo_file, output_folder):

    template = data.get("template")
    link = data.get("link")

    if not template or not link:
        raise Exception("Template and link are required")

    filename = secure_filename(link[:30].replace(" ", "_")) + ".png"
    output_path = os.path.join(output_folder, filename)

    logo_path = None

    if logo_file:
        logo_path = os.path.join(output_folder, secure_filename(logo_file.filename))
        logo_file.save(logo_path)

    styled_qr(
        template_name=template,
        link=link,
        output_file=output_path,
        logo_path=logo_path
    )

    return output_path