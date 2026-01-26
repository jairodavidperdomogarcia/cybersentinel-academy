import re

def extract_text_from_pdf(file_path):
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            # Basic text extraction by looking for text between parentheses in PDF streams
            # This is very primitive and only works for non-compressed text streams
            text_content = re.findall(b'\((.*?)\)', content)
            decoded_text = []
            for t in text_content:
                try:
                    decoded_text.append(t.decode('utf-8'))
                except:
                    pass
            return " ".join(decoded_text)
    except Exception as e:
        return str(e)

print(extract_text_from_pdf(r"j:\CyberSentinel-AI-Academy\99_Material_Referencia\tecnología futurista moderno azul.pdf"))
