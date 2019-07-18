"use strict";function _interopDefault(i){return i&&"object"==typeof i&&"default"in i?i.default:i}var fs=_interopDefault(require("fs")),path=require("path"),stream=require("stream");function Mime(){this._types=Object.create(null),this._extensions=Object.create(null);for(var i=0;i<arguments.length;i++)this.define(arguments[i]);this.define=this.define.bind(this),this.getType=this.getType.bind(this),this.getExtension=this.getExtension.bind(this)}Mime.prototype.define=function(i,e){for(var t in i){var a=i[t].map(function(i){return i.toLowerCase()});t=t.toLowerCase();for(var s=0;s<a.length;s++){if("*"!=(p=a[s])[0]){if(!e&&p in this._types)throw new Error('Attempt to change mapping for "'+p+'" extension from "'+this._types[p]+'" to "'+t+'". Pass `force=true` to allow this, otherwise remove "'+p+'" from the list of extensions for "'+t+'".');this._types[p]=t}}if(e||!this._extensions[t]){var p=a[0];this._extensions[t]="*"!=p[0]?p:p.substr(1)}}},Mime.prototype.getType=function(i){var e=(i=String(i)).replace(/^.*[\/\\]/,"").toLowerCase(),t=e.replace(/^.*\./,"").toLowerCase(),a=e.length<i.length;return(t.length<e.length-1||!a)&&this._types[t]||null},Mime.prototype.getExtension=function(i){return(i=/^\s*([^;\s]*)/.test(i)&&RegExp.$1)&&this._extensions[i.toLowerCase()]||null};var Mime_1=Mime,standard={"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/bdoc":["bdoc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]},lite=new Mime_1(standard),url=function(i){let e=i.url;if(void 0===e)return e;let t=i._parsedUrl;if(t&&t._raw===e)return t;(t={}).query=t.search=null,t.href=t.path=t.pathname=e;let a=e.indexOf("?",1);return-1!==a&&(t.search=e.substring(a),t.query=t.search.substring(1),t.pathname=e.substring(0,a)),t._raw=e,i._parsedUrl=t};const caching={},map={};let instances=0;const instance={},serve=function(i){"string"==typeof i&&(i={dir:i});const e=Object.assign({base:"/",dir:".",maxFileSize:1048576,spa:!1},i);return e.id=++instances,instance[e.id]=e,e.dir=path.resolve(e.dir),e.responses={},e.base=alias(e.base,e),cache(e.dir+e.base,e,e.base),async function(i,t,a){const s=decodeURIComponent(i.path||i.pathname||url(i).pathname);return(e.responses[s]||(e.responses[s]=await cache(e.dir+alias(s,e),e,s)))(i,t,a)}},cache=async function(i,e,t){if(i.endsWith("/")&&(i=i.slice(0,-1)),caching[i])return caching[i];ensure(i),reverse(i,e,t);const a=map[i],{stop:s,sufix:p}=check_index(i);if(s){let i=e.dir+(e.base.endsWith("/")?e.base.slice(0,-1):e.base);return e.spa?(reverse(i,e,t),a.response=caching[i]):a.response=notFound}reverse(i+p,e,t);const n=map[i+p];return a.stream=n.stream=a.stream||n.stream||cache_stream(i+p,e,null,a),a.response=n.response=a.response||n.response||response(i,p,a),caching[i]=caching[i+p]=a.response},ensure=i=>{map[i]||(map[i]={reverses:{}})},reverse=(i,e,t)=>{map[i].reverses[e.id]||(map[i].reverses[e.id]={}),map[i].reverses[e.id][t]=!0},memory=function(i,e){i=path.resolve(i),ensure(i),e instanceof Buffer||(e=Buffer.from(e));const t=map[i];return t.charset="utf-8",t.stats={size:e.length,mtime:new Date,isDirectory:()=>!1},t.stream=cache_stream(i,null,e,t),t.response=caching[i]=response(i,"",t),update_instances(i,t.response),i.endsWith("/index.html")&&clear(i.slice(0,-11),!1),!0},update_instances=function(i,e,t=!1){if(!map[i])return;const a=map[i];for(let i in a.reverses)for(let s in a.reverses[i])t?delete instance[i].responses[s]:instance[i].responses[s]=e},check_index=function(i){let e="";return!check(i)||map[i].stats.isDirectory()&&(!check(i+(e="/index.html"))||map[i+e].stats.isDirectory())?{stop:!0}:{stop:!1,sufix:e}},check=function(i){if(ensure(i),map[i].stats)return!0;try{return map[i].stats=fs.statSync(i),!0}catch(i){return!1}},cache_stream=function(i,e,t,a){return e&&a.stats.size>e.maxFileSize?a.stream=(e,t)=>fs.createReadStream(i,t).pipe(e):(a.data=t||fs.readFileSync(i),a.stream=(i,e)=>{const t=new stream.Readable;t.push(e.start||0===e.start&&e.end?a.data.slice(e.start,e.end+1):a.data),t.push(null),t.pipe(i)})},response=function(i,e,t){const a=(i+e).split("/").pop(),s=e?map[i+e]:t;return t.headers={"Content-Length":s.stats.size,"Content-Type":lite.getType(a)+(t.charset?"; charset="+t.charset:""),"Last-Modified":s.stats.mtime.toUTCString()},t.response=s.response=function(a,p){const n={};if(a.headers.range){let[o,l]=a.headers.range.replace("bytes=","").split("-"),m=n.end=parseInt(l,10)||s.stats.size-1,c=n.start=parseInt(o,10)||0;if(c>=s.stats.size||m>=s.stats.size)return p.setHeader("Content-Range",`bytes */${s.stats.size}`),p.statusCode=416,p.end();const r=Object.assign({},t.headers);r["Content-Range"]=`bytes ${c}-${m}/${map[i+e].stats.size}`,r["Content-Length"]=m-c+1,r["Accept-Ranges"]="bytes",p.writeHead(206,r)}else p.writeHead(200,t.headers);s.stream(p,n)}},alias=function(i,e){if(!e.alias||"object"!=typeof e.alias)return i;for(let t in e.alias)if(i.startsWith(t))return i.replace(t,e.alias[t]);return i},notFound=function(i,e,t){return t?t():(e.statusCode=404,e.end())},clear=function(i,e=!0){if(i)return i.length>1&&i.endsWith("/")&&(i=i.slice(0,-1)),e&&(i.endsWith("/index.html")?clear(i.slice(0,-11),!1):map[i]&&map[i].stats&&map[i].stats.isDirectory()&&clear(i+"/index.html",!1)),update_instances(i,null,!0),delete map[i],delete caching[i],!0};var index={serve:serve,memory:memory,clear:clear};module.exports=index;
