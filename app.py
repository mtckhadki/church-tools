from flask import Flask, render_template, request, jsonify
import os
from converters.openlp_to_freeshow import convert_xml_to_show
from converters.freeshow_to_openlp import convert_show_to_xml
from services.announcement_service import generate_xml
from flask import send_file
from services.slide_service import generate_slides
from services.qr_service import generate_qr
from services.template_service import save_template, list_templates, delete_template
from services.slide_export_service import generate_slides_zip

app = Flask(__name__)

@app.errorhandler(Exception)
def handle_exception(e):
    return {
        "error": str(e)
    }, 500

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/xml-show")
def xml_show_ui():
    return render_template("openlp_to_show.html")

@app.route("/show-xml")
def show_xml_ui():
    return render_template("show_to_openlp.html")

@app.route("/announcement-ui")
def announcement_ui():
    return render_template("announcement.html")

@app.route("/download")
def download():
    path = request.args.get("path")
    return send_file(path, as_attachment=True)

@app.route("/qr-tool")
def qr_tool():
    return render_template("qr_tool.html")

@app.route("/slide-creator")
def slide_creator():
    return render_template("slide_creator.html")

@app.route("/slide-templates")
def slide_templates():
    return render_template("slide_templates.html")

@app.route("/slide-template-editor")
def slide_template_editor():
    return render_template("slide_template_editor.html")

@app.route("/slide-batch")
def slide_batch():
    return render_template("slide_batch.html")

# ---------------------------
# MODULE 1: XML → SHOW
# ---------------------------
@app.route("/convert/xml-to-show", methods=["POST"])
def xml_to_show():
    files = request.files.getlist("files")
    results = []

    if not files:
        return {"error": "No files uploaded"}, 400

    for file in files:
        try:
            if not file.filename.endswith(".xml"):
                results.append({
                    "file": file.filename,
                    "error": "Invalid file type"
                })
                continue

            path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(path)

            output = convert_xml_to_show(path, OUTPUT_FOLDER)

            results.append({
                "file": file.filename,
                "status": "success"
            })

        except Exception as e:
            results.append({
                "file": file.filename,
                "error": str(e)
            })

    return {"results": results}


# ---------------------------
# MODULE 2: SHOW → XML
# ---------------------------
@app.route("/convert/show-to-xml", methods=["POST"])
def show_to_xml():
    files = request.files.getlist("files")
    results = []

    if not files:
        return {"error": "No files uploaded"}, 400

    for file in files:
        try:
            if not file.filename.endswith(".show"):
                results.append({
                    "file": file.filename,
                    "error": "Invalid file type"
                })
                continue

            path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(path)

            output = convert_show_to_xml(path, OUTPUT_FOLDER)

            results.append({
                "file": file.filename,
                "status": "success"
            })

        except Exception as e:
            results.append({
                "file": file.filename,
                "error": str(e)
            })

    return {"results": results}


# ---------------------------
# MODULE 3: ANNOUNCEMENT
# ---------------------------
@app.route("/announcement", methods=["POST"])
def create_announcement():
    try:
        data = request.json

        if not data or "sections" not in data:
            return {"error": "Invalid data"}, 400

        file_path = generate_xml(data, OUTPUT_FOLDER)

        return {
            "status": "success",
            "file": file_path
        }

    except Exception as e:
        return {
            "error": str(e)
        }, 500

@app.route("/generate-qr", methods=["POST"])
def create_qr():
    try:
        data = request.form
        file = request.files.get("logo")

        path = generate_qr(data, file, OUTPUT_FOLDER)

        return {"status": "success", "file": path}

    except Exception as e:
        return {"error": str(e)}, 500


@app.route("/generate-slides", methods=["POST"])
def create_slides():
    try:
        data = request.json
        path = generate_slides(data, OUTPUT_FOLDER)

        return {"status": "success", "folder": path}

    except Exception as e:
        return {"error": str(e)}, 500
    
@app.route('/api/slide-templates', methods=['GET'])
def get_templates():
    return list_templates()

@app.route('/api/slide-templates', methods=['POST'])
def create_template():
    try:
        data = request.json
        saved = save_template(data)
        return saved
    except Exception as e:
        return {"error": str(e)}, 500

@app.route('/api/slide-templates/<tid>', methods=['DELETE'])
def remove_template(tid):
    delete_template(tid)
    return {'status':'ok'}

@app.route('/generate-slides-from-template', methods=['POST'])
def generate_slides_from_template():
    data=request.json
    zip_path=generate_slides_zip(data['template'], data['slides'], OUTPUT_FOLDER)
    return {'file': zip_path}
    

if __name__ == "__main__":
    import webbrowser
    port = 5000
    webbrowser.open(f"http://127.0.0.1:{port}")
    app.run(port=port, debug=False)