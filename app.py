from flask import Flask, render_template, request, jsonify
import os
from converters.openlp_to_freeshow import convert_xml_to_show
from converters.freeshow_to_openlp import convert_show_to_xml
from services.announcement_service import generate_xml
from flask import send_file

app = Flask(__name__)

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


# ---------------------------
# MODULE 1: XML → SHOW
# ---------------------------
@app.route("/convert/xml-to-show", methods=["POST"])
def xml_to_show():
    files = request.files.getlist("files")
    results = []

    for file in files:
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        try:
            output = convert_xml_to_show(path, OUTPUT_FOLDER)
            results.append({"file": file.filename, "status": "success"})
        except Exception as e:
            results.append({"file": file.filename, "status": str(e)})

    return jsonify(results)


# ---------------------------
# MODULE 2: SHOW → XML
# ---------------------------
@app.route("/convert/show-to-xml", methods=["POST"])
def show_to_xml():
    files = request.files.getlist("files")
    results = []

    for file in files:
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        try:
            output = convert_show_to_xml(path, OUTPUT_FOLDER)
            results.append({"file": file.filename, "status": "success"})
        except Exception as e:
            results.append({"file": file.filename, "status": str(e)})

    return jsonify(results)


# ---------------------------
# MODULE 3: ANNOUNCEMENT
# ---------------------------
@app.route("/announcement", methods=["POST"])
def create_announcement():
    data = request.json

    try:
        file_path = generate_xml(data, OUTPUT_FOLDER)
        return jsonify({"status": "success", "file": file_path})
    except Exception as e:
        return jsonify({"status": str(e)})


if __name__ == "__main__":
    import webbrowser
    port = 5000
    webbrowser.open(f"http://127.0.0.1:{port}")
    app.run(port=port, debug=False)