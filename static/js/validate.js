const path = 'static/smival.wasm';

const read_smiles = instance => {
  return smiles => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(`${smiles}\0`);
    const length = encoded.length;
    const pString = instance.exports.alloc(length);
    const view = new Uint8Array(
      instance.exports.memory.buffer, pString, length
    );

    view.set(encoded);

    return instance.exports.read_smiles(pString);
  };
};

const watch = instance => {
  const read = read_smiles(instance);

  document.getElementById('codeEditor').addEventListener('input', e => {
    const { target } = e;

    var lines_array = target.value.split('\n').filter(Boolean);
    var p = document.getElementById("indicator");
    var submit_button = document.getElementById("subtn");
    var allow = false;
    
    var prob_arr = [];    

    for (let i = 0; i < lines_array.length; i++) {
      if (read(lines_array[i]) === 0){} 
      else {
        prob_arr.push(i+1);
      }
    }
    p.style.display = "block";
    if (lines_array.length === 0 && prob_arr.length === 0){
      p.innerHTML = "Enter at least 1 SMILES structure of a substance."
    } else if (prob_arr.length === 0 ){
      p.innerHTML = "All SMILESs entered are valid. Please click on Submit.";
      allow = true;
    } else{
      p.innerHTML = "Kindly make sure that each line contains just one SMILES. <br/>Invalid SMILES at indexes: " + prob_arr;
    }

    if (allow){
      submit_button.disabled = false;
    } else {
      submit_button.disabled = true;
    }
  });
}

(async () => {
  const response = await fetch(path);
  const bytes = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(bytes, { });

  watch(wasm.instance);
})();