import re
import os

def minify_css(file_path):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        content = re.sub(r'\s*([{:;,])\s*', r'\1', content)
        content = re.sub(r';}', '}', content)
        content = re.sub(r'\s+', ' ', content).strip()
        
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Minified {file_path}")
    except Exception as e:
        print(f"Error minifying {file_path}: {e}")

css_files = [
    '/Users/sph/Portfolio-V2/static/css/index.css',
    '/Users/sph/Portfolio-V2/static/css/main.css',
    '/Users/sph/Portfolio-V2/static/css/animation.css'
]

for css_file in css_files:
    if os.path.exists(css_file):
        minify_css(css_file)
    else:
        print(f"File not found: {css_file}")
