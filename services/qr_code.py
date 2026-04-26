import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image, ImageDraw

# ---------------------------------
# QR DESIGN TEMPLATES (RGBA SAFE)
# ---------------------------------
TEMPLATES = {
    "google_maps": {
        "module_drawer": RoundedModuleDrawer(),
        "color": (66, 133, 244, 255),  # RGBA
        "size": 1024
    },
    "google_form": {
        "module_drawer": RoundedModuleDrawer(),
        "color": (103, 58, 183, 255),
        "size": 1024
    },
    "website": {
        "module_drawer": RoundedModuleDrawer(),
        "color": (0, 0, 0, 255),
        "size": 1024
    }
}

# ---------------------------------
# ADD CENTER LOGO WITH SAFE PADDING
# ---------------------------------
def add_center_logo(
    qr_img: Image.Image,
    logo_path: str,
    logo_ratio: float = 0.22,
    padding_ratio: float = 0.06,
    padding_color=(255, 255, 255, 200)
) -> Image.Image:
    """
    logo_ratio   -> size of logo relative to QR (0.20–0.25 recommended)
    padding_ratio-> white/transparent safety margin
    """

    qr_size = qr_img.size[0]

    logo_size = int(qr_size * logo_ratio)
    padding_size = int(qr_size * padding_ratio)

    # Load logo
    logo = Image.open(logo_path).convert("RGBA")
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

    # Create padded background (alpha-safe)
    padded_size = logo_size + (padding_size * 2)
    padding_layer = Image.new("RGBA", (padded_size, padded_size), (0, 0, 0, 0))

    draw = ImageDraw.Draw(padding_layer)
    draw.rounded_rectangle(
        (0, 0, padded_size, padded_size),
        radius=int(padded_size * 0.15),
        fill=padding_color
    )

    padding_layer.paste(logo, (padding_size, padding_size), logo)

    # Center position
    pos = (
        (qr_size - padded_size) // 2,
        (qr_size - padded_size) // 2
    )

    qr_img.paste(padding_layer, pos, padding_layer)
    return qr_img

# ---------------------------------
# MAIN QR GENERATOR
# ---------------------------------
def generate_qr(
    template_name: str,
    link: str,
    output_file: str,
    logo_path: str | None = None
):
    if template_name not in TEMPLATES:
        raise ValueError(f"Unknown template: {template_name}")

    template = TEMPLATES[template_name]

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # REQUIRED for logo
        box_size=10,
        border=2
    )

    qr.add_data(link)
    qr.make(fit=True)

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=template["module_drawer"],
        color_mask=SolidFillColorMask(
            front_color=template["color"],
            back_color=(0, 0, 0, 0)  # transparent
        )
    ).convert("RGBA")

    # Resize
    img = img.resize(
        (template["size"], template["size"]),
        Image.Resampling.LANCZOS
    )

    # Add logo if provided
    if logo_path:
        img = add_center_logo(img, logo_path)

    img.save(output_file, format="PNG")
    print(f"✅ QR Code generated: {output_file}")