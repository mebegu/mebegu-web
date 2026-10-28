"""Local-only preview server. No production route or public asset is changed."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        if self.path.split('?')[0] == '/cv/mehmet-berk-gurcay-cv.pdf':
            target = ROOT / 'public/cv/mehmet-berk-gurcay-cv.pdf'
            if not target.exists():
                self.send_error(404, 'Local contact-redacted source review PDF has not been rendered')
                return
            self.send_response(200)
            self.send_header('Content-Type', 'application/pdf')
            self.send_header('Content-Disposition', 'attachment; filename="mehmet-berk-gurcay-cv.pdf"')
            self.end_headers()
            self.wfile.write(target.read_bytes())
            return
        if self.path == '/':
            self.path = '/docs/cv-concepts/index.html'
        clean = self.path.split('?')[0].lstrip('/')
        if not (ROOT / clean).exists() and (ROOT / 'dist' / clean).exists():
            self.path = '/dist/' + clean
        return super().do_GET()


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port', type=int, default=4322)
args = parser.parse_args()
server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(ROOT)))
print(f'CV concepts: http://127.0.0.1:{args.port}/docs/cv-concepts/', flush=True)
server.serve_forever()
