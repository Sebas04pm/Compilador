function tokenize(code) {
    const keywords = ['let', 'if', 'else', 'while', 'do'];
    const operators = ['+', '-', '*', '/'];
    const separators = ['(', ')', '{', '}', ';'];
  
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b|[0-9]+|\\w+|[${operators.map(op => `\\${op}`).join('')}]|[${separators.map(sep => `\\${sep}`).join('')}]`, 'g');
    return code.match(regex);
  }
  
  function parse(tokens) {
    let index = 0;
  
    function match(expectedToken) {
      if (tokens[index] === expectedToken) {
        index++;
      } else {
        throw new Error(`Expected '${expectedToken}' but found '${tokens[index]}'`);
      }
    }
  
    function factor() {
      const currentToken = tokens[index];
      if (!isNaN(Number(currentToken))) {
        match(currentToken);
        return { type: 'number', value: currentToken };
      } else if (currentToken.match(/^[a-zA-Z_]\w*$/)) {
        match(currentToken);
        return { type: 'variable', name: currentToken };
      } else {
        throw new Error(`Unexpected token '${currentToken}'`);
      }
    }
  
    function term() {
      let left = factor();
      while (tokens[index] === '*' || tokens[index] === '/') {
        const operator = tokens[index];
        match(operator);
        const right = factor();
        left = { type: 'binary', operator, left, right };
      }
      return left;
    }
  
    function expression() {
      let left = term();
      while (tokens[index] === '+' || tokens[index] === '-') {
        const operator = tokens[index];
        match(operator);
        const right = term();
        left = { type: 'binary', operator, left, right };
      }
      return left;
    }
    return expression();
  }
  
  function compile() {
    const inputCode = document.getElementById('inputCode').value;
    const tokens = tokenize(inputCode);
    try {
      const ast = parse(tokens);
      const outputDiv = document.getElementById('output');
      outputDiv.innerText = JSON.stringify(ast, null, 2);
    } catch (error) {
      const outputDiv = document.getElementById('output');
      outputDiv.innerText = `Error: ${error.message}`;
    }
  }
  