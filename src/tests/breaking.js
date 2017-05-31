function breakStatement(){
  breakStatement: {
    console.log('before break');
    break breakStatement;
    console.log('after break');
  }
}

function returnStatement(){
  console.log('before return');
  return;
  console.log('after break');
}

breakStatement();
returnStatement();
