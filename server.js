require('http').createServer((req,res)=>{
  if (req.url==='/good-evening') { res.setHeader('Content-Type','text/plain'); res.end('Good evening'); return; }
  res.end('Hello, World!\n');
}).listen(3000,()=>console.log('Server running at http://127.0.0.1:3000/'));
