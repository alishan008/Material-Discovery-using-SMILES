var codeEditor = document.getElementById('codeEditor');
var lineCounter = document.getElementById('lineCounter');

var lineCountCache = 0;
function line_counter() {
    var lines = codeEditor.value.split('\n')
    var lineCount = lines.length;
    var outarr = new Array();
    var m = 0;
    if (lineCountCache != lineCount) {
        for (var x = 0; x < lineCount; x++) {
            if (lines[x] === ""){
                outarr[x] = " ";
            } else {
            outarr[x] = (m + 1) + '.';
            m += 1;
            }
        }
        lineCounter.value = outarr.join('\n');
    }
    lineCountCache = lineCount;
}

codeEditor.addEventListener('scroll', () => {
				lineCounter.scrollTop = codeEditor.scrollTop;
			    lineCounter.scrollLeft = codeEditor.scrollLeft;
			});

codeEditor.addEventListener('input', () => {
    line_counter();
});

codeEditor.addEventListener('keydown', (e) => {
    let { keyCode } = e;
    let { value, selectionStart, selectionEnd } = codeEditor;

    if (keyCode === 9) {  // TAB = 9
        e.preventDefault();
        codeEditor.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
        codeEditor.setSelectionRange(selectionStart+2, selectionStart+2)
    }
});
line_counter();