/* ---------------- text helpers ---------------- */

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function hl(code, lang){
  code = esc(code);
  const store = [];
  function wrap(re, cls){
    code = code.replace(re, m => {
      store.push('<span class="tk-'+cls+'">'+m+'</span>');
      return '\u0000'+(store.length-1)+'\u0000';
    });
  }
  if(lang==='cpp'){
    wrap(/\/\/.*$/gm,'com');
    wrap(/"(?:[^"\\]|\\.)*"/g,'str');
    wrap(/#\s*include\s*&lt;[^&]*&gt;|#\s*\w+/g,'pre');
    wrap(/\b\d+\b/g,'num');
    wrap(/\b(class|public|private|protected|return|new|delete|const|void|int|char|float|double|bool|true|false|if|else|for|while|namespace|std|nullptr|struct|virtual|static)\b/g,'kw');
    wrap(/\b([A-Za-z_]\w*)(?=\s*\()/g,'fn');
  } else if(lang==='bash' || lang==='conf'){
    wrap(/#.*$/gm,'com');
    wrap(/"(?:[^"\\]|\\.)*"/g,'str');
    wrap(/\b(bind|exec|input|kb_layout|kb_options|monitor|windowrule|killactive)\b/g,'kw');
  }
  code = code.replace(/\u0000(\d+)\u0000/g, (_,i) => store[Number(i)]);
  return code;
}
