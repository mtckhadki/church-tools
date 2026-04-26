import os, json, uuid

TEMPLATE_DIR = 'templates_data'
os.makedirs(TEMPLATE_DIR, exist_ok=True)

def save_template(data):
    tid = data.get("id") or uuid.uuid4().hex
    data["id"] = tid

    path = os.path.join(TEMPLATE_DIR, f"{tid}.json")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    return data

def list_templates():
    out=[]
    for f in os.listdir(TEMPLATE_DIR):
        with open(os.path.join(TEMPLATE_DIR,f),encoding='utf-8') as fh:
            out.append(json.load(fh))
    return out

def delete_template(tid):
    os.remove(os.path.join(TEMPLATE_DIR,f'{tid}.json'))