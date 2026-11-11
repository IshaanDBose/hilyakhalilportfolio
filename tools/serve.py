"""Local preview server that behaves like GitHub Pages:
/about serves about.html, unknown paths serve 404.html.
Usage: python3 tools/serve.py [port]   (default 8080), then open http://localhost:8080
"""
import http.server, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def send_head(self):
        path = self.path.split('?', 1)[0].split('#', 1)[0]
        full = os.path.join(ROOT, path.lstrip('/'))
        if not os.path.splitext(path)[1] and not os.path.isdir(full) and os.path.isfile(full.rstrip('/') + '.html'):
            self.path = path.rstrip('/') + '.html'
        elif not os.path.exists(self.translate_path(self.path)) and os.path.isfile(os.path.join(ROOT, '404.html')):
            self.path = '/404.html'
            f = open(os.path.join(ROOT, '404.html'), 'rb')
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            return f
        return super().send_head()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f'Serving {ROOT} at http://localhost:{port}')
    http.server.ThreadingHTTPServer(('', port), Handler).serve_forever()
