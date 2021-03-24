const parser = peg.generate(`
Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
    return tail.reduce(function(head, element) {
        const node = {
            name: element[1],
            children: [head, element[3]],
        };
        if (element[1] === '+') {
            node.value = head.value + element[3].value;
        }
        if (element[1] === '-') {
            node.value = head.value - element[3].value;
        }
        return node;
    }, head);
  }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
    return tail.reduce(function(head, element) {
        const node = {
            name: element[1],
            children: [head, element[3]],
        };
        if (element[1] === '*') {
            node.value = head.value * element[3].value;
        }
        if (element[1] === '/') {
            node.value = head.value / element[3].value;
        }
        return node;
    }, head);
  }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / sign:[-+] head:Factor {
    const node = {name: sign, children: [head]};
    if (sign === '+') {
        node.value = +head.value;
    }
    if (sign === '-') {
        node.value = -head.value;
    }
    return node;
  }
  / Float

Float "number"
  = _ [0-9]+ ("." [0-9]+)? {
    return {
        name: text(),
        value: parseFloat(text())
    };
  }

_ "whitespace"
  = [ \\t]*
`);

const input = document.getElementById('input');
const buttons = document.querySelectorAll('.button');
const treeOutput = document.getElementById('tree-output');

let autoClear = false;
function autoClearInput() {
    if (!autoClear) {
        return;
    }
    input.value = '';
    autoClear = false;
}

buttons.forEach(btn => {
    const value = btn.dataset.val || btn.innerText;
    switch (value) {
        case 'BACK':
            btn.addEventListener('click', () => {
                input.value = input.value.substring(0, input.value.length - 1)
            });
            break;

        case 'CLR':
            btn.addEventListener('click', () => {
                treeOutput.innerHTML = '';
                input.value = '';
            });
            break;

        case '=':
            btn.addEventListener('click', () => {
                if (!input.value.length) {
                    return;
                }

                autoClear = true;
                treeOutput.innerHTML = '';
                try {
                    const tree = parser.parse(input.value);
                    input.value = tree.value;

                    drawTree({
                        divID: 'tree-output', 
                        width: 400,
                        height: 350,
                        padding: 30,
                        treeData: tree
                    });
                } catch (err) {
                    input.value = 'ERROR';
                }
            });
            break;

        case '+':
        case '-':
        case '*':
        case '/':
            btn.addEventListener('click', () => {
                autoClear = false;
                input.value += value;
            });
            break;

        default:
            btn.addEventListener('click', () => {
                autoClearInput();
                input.value += value;
            });
    }
});
