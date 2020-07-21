import i from"fs";import{sep as t,resolve as a,join as e}from"path";import{Readable as p}from"stream";function s(){this._types=Object.create(null),this._extensions=Object.create(null);for(var i=0;i<arguments.length;i++)this.define(arguments[i]);this.define=this.define.bind(this),this.getType=this.getType.bind(this),this.getExtension=this.getExtension.bind(this)}s.prototype.define=function(i,t){for(var a in i){var e=i[a].map((function(i){return i.toLowerCase()}));a=a.toLowerCase();for(var p=0;p<e.length;p++){if("*"!=(s=e[p])[0]){if(!t&&s in this._types)throw new Error('Attempt to change mapping for "'+s+'" extension from "'+this._types[s]+'" to "'+a+'". Pass `force=true` to allow this, otherwise remove "'+s+'" from the list of extensions for "'+a+'".');this._types[s]=a}}if(t||!this._extensions[a]){var s=e[0];this._extensions[a]="*"!=s[0]?s:s.substr(1)}}},s.prototype.getType=function(i){var t=(i=String(i)).replace(/^.*[/\\]/,"").toLowerCase(),a=t.replace(/^.*\./,"").toLowerCase(),e=t.length<i.length;return(a.length<t.length-1||!e)&&this._types[a]||null},s.prototype.getExtension=function(i){return(i=/^\s*([^;\s]*)/.test(i)&&RegExp.$1)&&this._extensions[i.toLowerCase()]||null};var o=new s({"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomdeleted+xml":["atomdeleted"],"application/atomsvc+xml":["atomsvc"],"application/atsc-dwd+xml":["dwd"],"application/atsc-held+xml":["held"],"application/atsc-rsat+xml":["rsat"],"application/bdoc":["bdoc"],"application/calendar+xml":["xcs"],"application/ccxml+xml":["ccxml"],"application/cdfx+xml":["cdfx"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/emotionml+xml":["emotionml"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/fdt+xml":["fdt"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/its+xml":["its"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lgr+xml":["lgr"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mmt-aei+xml":["maei"],"application/mmt-usd+xml":["musd"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/mrb-consumer+xml":["*xdf"],"application/mrb-publish+xml":["*xdf"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/node":["cjs"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/p2p-overlay+xml":["relo"],"application/patch-ops-error+xml":["*xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/provenance+xml":["provx"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/route-apd+xml":["rapd"],"application/route-s-tsid+xml":["sls"],"application/route-usd+xml":["rusd"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/senml+xml":["senmlx"],"application/sensml+xml":["sensmlx"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/swid+xml":["swidtag"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/toml":["toml"],"application/ttml+xml":["ttml"],"application/urc-ressheet+xml":["rsheet"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-att+xml":["xav"],"application/xcap-caps+xml":["xca"],"application/xcap-diff+xml":["xdf"],"application/xcap-el+xml":["xel"],"application/xcap-error+xml":["xer"],"application/xcap-ns+xml":["xns"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xliff+xml":["xlf"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mobile-xmf":["mxmf"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/hej2k":["hej2"],"image/hsj2":["hsj2"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jph":["jph"],"image/jphc":["jhc"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/jxra":["jxra"],"image/jxrs":["jxrs"],"image/jxs":["jxs"],"image/jxsc":["jxsc"],"image/jxsi":["jxsi"],"image/jxss":["jxss"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/mtl":["mtl"],"model/obj":["obj"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]});const l=i.createReadStream,n=i.readFileSync,m={},c={};let r=0;const x={},d=i=>{c[i]||(c[i]={reverses:{},ranges:{}})},f=(i,t,a)=>{c[i].reverses[t.id]||(c[i].reverses[t.id]={}),c[i].reverses[t.id][a]=!0},g=function(i,t,a=!1){if(!c[i])return;const e=c[i];for(let i in e.reverses){const p=e.reverses[i],s=x[i];for(let i in p)a?delete s.responses[i]:s.responses[i]=t}},u=function(t){if(d(t),c[t].stats)return!0;try{return c[t].stats=i.statSync(t),!0}catch(i){return!1}},h=function(i,t,a,e){return t&&e.stats.size>t.maxFileSize?e.stream=(t,a)=>l(i,a).pipe(t):(e.data=a||n(i),e.stream=(i,t)=>{const a=new p;a.push(t.end?e.data.slice(t.start,t.end+1):e.data),a.push(null),a.pipe(i)})},v=function(i,t,a){const e=t?c[i+t]:a;return a.headers={"Content-Length":e.stats.size,"Content-Type":o.getType(i)+(a.charset?"; charset="+a.charset:""),"Last-Modified":e.stats.mtime.toUTCString()},a.response=e.response=function(i,t){if(i.headers.range){const p=i.headers.range;(a.ranges[p]||(a.ranges[p]=function(i,t,a){const e={},p=a.stats.size;let[s,o]=i.replace("bytes=","").split("-"),l=e.end=parseInt(o,10)||p-1,n=e.start=parseInt(s,10)||0;if(n>=p||l>=p){const i="bytes */"+p;return function(t){return t.setHeader("Content-Range",i),t.statusCode=416,t.end()}}const m={"Content-Range":`bytes ${n}-${l}/${p}`,"Content-Length":l-n+1,"Accept-Ranges":"bytes","Content-Type":t["Content-Type"],"Last-Modified":t["Last-Modified"]};return function(i){i.writeHead(206,m),a.stream(i,e)}}(p,a.headers,e)))(t)}else t.writeHead(200,a.headers),e.stream(t,{})}},j=function(i,t){if(!t.alias||"object"!=typeof t.alias)return i;for(let a in t.alias)if(i.startsWith(a))return i.replace(a,t.alias[a]);return i},b=function(i,t,a){return a?a():(t.statusCode=404,t.end())},y=function(i,a=!0){if(i)return i.length>1&&i.endsWith(t)&&(i=i.slice(0,-1)),a&&(i.endsWith(t+"index.html")?y(i.slice(0,-11),!1):c[i]&&c[i].stats&&c[i].stats.isDirectory()&&y(i+t+"index.html",!1)),g(i,null,!0),delete c[i],delete m[i],!0},w=async function(i,a){let p=e(a.dir,j(i,a));if(p.endsWith(t)&&(p=p.slice(0,-1)),m[p])return m[p];d(p),f(p,a,i);const s=c[p],{stop:o,sufix:l}=function(i){let a="";return!u(i)||c[i].stats.isDirectory()&&(!u(i+(a=t+"index.html"))||c[i+a].stats.isDirectory())?{stop:!0}:{stop:!1,sufix:a}}(p);if(o){let t=e(a.dir,a.base.endsWith("/")?a.base.slice(0,-1):a.base);return a.spa?(f(t,a,i),s.response=m[t]):s.response=b}f(p+l,a,i);const n=c[p+l];return s.stream=n.stream=s.stream||n.stream||h(p+l,a,null,s),s.response=n.response=s.response||n.response||v(p,l,s),m[p]=m[p+l]=s.response};var k={serve:function(i){"string"==typeof i&&(i={dir:i});const t=Object.assign({base:"/",dir:".",maxFileSize:1048576,spa:!1},i);return t.id=++r,x[t.id]=t,t.dir=a(t.dir),t.responses={},t.base=j(t.base,t),w(t.base,t),async function(i,a,e){const p=decodeURIComponent(i.path||i.pathname||function(i){let t=i.url;if(void 0===t)return t;let a=i._parsedUrl;if(a&&a._raw===t)return a;a={},a.query=a.search=null,a.href=a.path=a.pathname=t;let e=t.indexOf("?",1);return-1!==e&&(a.search=t.substring(e),a.query=a.search.substring(1),a.pathname=t.substring(0,e)),a._raw=t,i._parsedUrl=a}(i).pathname);return(t.responses[p]||(t.responses[p]=await w(p,t)))(i,a,e)}},memory:function(i,e){i=a(i),d(i),e instanceof Buffer||(e=Buffer.from(e));const p=c[i];return p.charset="utf-8",p.stats={size:e.length,mtime:new Date,isDirectory:()=>!1},p.stream=h(i,null,e,p),p.response=m[i]=v(i,"",p),g(i,p.response),i.endsWith(t+"index.html")&&y(i.slice(0,-11),!1),!0},clear:y};export default k;
