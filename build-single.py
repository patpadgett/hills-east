from pathlib import Path
import re,base64,mimetypes,json
p=Path(__file__).parent
h=(p/'index.html').read_text()
# Sampler must precede HiddenRack; both are inlined by the script pass below.
assert '<script src="pad-sampler.js" defer></script>' in h, 'Sampler missing from entry point'
assert h.index('pad-sampler.js') < h.index('hidden-rack.js'), 'Sampler load order invalid'
h=re.sub(r'<link\b[^>]*rel="preload"[^>]*>','',h)
h=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>\n'+(p/m.group(1)).read_text()+'\n</style>',h)
# One asset dictionary avoids duplicating the large animation in script strings.
assets={}
for folder in ['assets','fonts']:
 for f in (p/folder).iterdir():
  if f.is_file() and f.suffix in ['.webp','.gif','.jpg','.svg','.woff2']:
   mime=mimetypes.guess_type(str(f))[0] or 'application/octet-stream'
   assets[f.relative_to(p).as_posix()]='data:'+mime+';base64,'+base64.b64encode(f.read_bytes()).decode()
# Use the same WebP as fallback on current iPhones; retain original GIF in JS dictionary only if needed.
used=set(re.findall(r'(?:assets|fonts)/[\w.-]+',h))
for a in used:h=h.replace(a,assets[a])
def script(m):
 s=(p/m.group(1)).read_text()
 s=re.sub(r'''(['"])((?:assets|fonts)/[\w.-]+)\1''',lambda m:'window.HILLS_ASSETS['+json.dumps(m.group(2))+']' if m.group(2) in assets else m.group(0),s)
 s=re.sub(r'//# sourceMappingURL=.*','',s)
 return '<script>\n'+s.replace('</script','<\\/script')+'\n</script>'
h=re.sub(r'<script src="([^"]+)" defer></script>',script,h)
# Images needed by pause/resume are encoded once here, independently of initial markup.
runtime={a:assets[a] for a in ['assets/hills-east-ident.webp','assets/hills-east-ident.gif','assets/hills-east-poster.jpg']}
h=h.replace('<script>','<script>window.HILLS_ASSETS='+json.dumps(runtime)+';</script>\n<script>',1)
out=p/'Hills-East-Recording.html';out.write_text(h)
print(json.dumps({'path':str(out),'bytes':out.stat().st_size}))
