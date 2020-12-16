let isWaitingForRequest = false;

const getAnalysis = async () => {
  isWaitingForRequest = true;
  const input_repo = document.getElementById('input_repo').value;
  const input_user = document.getElementById('input_user').value;
  const output_box_elm = document.getElementById('output_box');
    
  const repo = input_user + '/' + input_repo;
  output_box_elm.innerText = 'Loading...'
  console.log('fetching repo ' + repo);

  const res = await fetch('/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user: input_user, repo:input_repo})
  });
  const analysis = await res.json();
  
  output_box_elm.innerText = analysis.result;
  isWaitingForRequest = false;
}

document.querySelector('button').addEventListener('click', getAnalysis)
document.querySelector('input').addEventListener('keypress', (e) => {
  if (e.key == "Enter") getAnalysis()
})
