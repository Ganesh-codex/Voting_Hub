const BASE_URL = "https://voting-hub.onrender.com";

function show(id){ document.getElementById(id).classList.remove('hidden'); }
function hide(id){ document.getElementById(id).classList.add('hidden'); }

let currentUserRole = null;
let selectedRole = null;

async function fetchCandidates(){
  const list = document.getElementById('candidateList');
  list.innerHTML = '<div style="text-align:center;color:#6b7280;padding:40px">Loading candidates...</div>';
  try{
    const res = await fetch(`${BASE_URL}/candidate`);
    const data = await res.json();
    list.innerHTML = '';
    if(data.length === 0){
      list.innerHTML = '<div style="text-align:center;color:#6b7280;padding:40px">No candidates available</div>';
      return;
    }
    data.forEach((c)=>{
      const card = document.createElement('div');
      card.className = 'candidate-card';
      const initials = (c.name || 'C').split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase();
      card.innerHTML = `
        <div class="candidate-avatar">${initials}</div>
        <h3 class="candidate-name">${c.name || 'Unknown'}</h3>
        <p class="candidate-party"><i class="fas fa-flag" style="margin-right:6px"></i>${c.party || 'Independent'}</p>
        <p class="candidate-age"><i class="fas fa-birthday-cake" style="margin-right:6px"></i>Age: ${c.age || 'Not specified'}</p>
        <div class="candidate-actions"></div>
      `;
      const actions = card.querySelector('.candidate-actions');

      if(currentUserRole === 'admin'){
        const del = document.createElement('button');
        del.className = 'btn';
        del.innerHTML = '<i class="fas fa-trash"></i> Delete';
        del.style.background = 'var(--danger)';
        del.style.color = 'white';
        del.addEventListener('click', ()=>deleteCandidate(c._id));
        actions.appendChild(del);
      }else{
        const voteBtn = document.createElement('button');
        voteBtn.className = 'btn btn-primary';
        voteBtn.innerHTML = '<i class="fas fa-check-circle"></i> Vote';
        voteBtn.addEventListener('click', ()=>voteCandidate(c._id));
        actions.appendChild(voteBtn);
      }

      list.appendChild(card);
    })
  }catch(err){
    list.innerHTML = '<div style="text-align:center;color:#ef4444;padding:40px"><i class="fas fa-exclamation-circle"></i> Failed to load candidates</div>';
  }
}

async function fetchCounts(){
  const list = document.getElementById('countList');
  try{
    const res = await fetch(`${BASE_URL}/candidate/vote/count`);
    const data = await res.json();
    list.innerHTML = '';
    if(data.length === 0){
      list.innerHTML = '<div style="text-align:center;color:#6b7280;padding:20px">No votes recorded yet</div>';
      return;
    }

    const totalVotes = data.reduce((sum, item) => sum + item.count, 0);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'vote-count-header';
    headerDiv.innerHTML = `
      <div class="total-votes-display">
        <span class="total-label">Total Votes Cast:</span>
        <span class="total-count">${totalVotes}</span>
      </div>
    `;
    list.appendChild(headerDiv);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'vote-items-container';

    data.forEach(item=>{
      const percentage = totalVotes > 0 ? ((item.count / totalVotes) * 100).toFixed(1) : 0;
      const div = document.createElement('div');
      div.className = 'count-item-detailed';
      div.innerHTML = `
        <div class="count-item-header">
          <span class="count-party">
            <i class="fas fa-flag" style="margin-right:8px;color:var(--primary)"></i>
            ${item.party}
          </span>
          <span class="count-badge">${item.count}</span>
        </div>
        <div class="vote-bar-container">
          <div class="vote-bar" style="width: ${percentage}%">
            <span class="vote-percentage">${percentage}%</span>
          </div>
        </div>
        <div class="vote-stats">
          <span class="vote-text">${item.count} vote${item.count !== 1 ? 's' : ''} out of ${totalVotes}</span>
        </div>
      `;
      itemsContainer.appendChild(div);
    });

    list.appendChild(itemsContainer);

    if(typeof Chart !== 'undefined' && document.getElementById('voteChart')){
      try{ 
        document.getElementById('chartWrapper').classList.remove('hidden');
        updateChart(data); 
      }catch(e){}
    }
  }catch(err){
    list.innerHTML = '<div style="text-align:center;color:#ef4444;padding:20px"><i class="fas fa-exclamation-circle"></i> Failed to load counts</div>';
  }
}

let voteChart = null;
function updateChart(data){
  const labels = data.map(d=>d.party);
  const counts = data.map(d=>d.count);
  const ctx = document.getElementById('voteChart').getContext('2d');
  if(!voteChart){
    voteChart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Total Votes', data: counts }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }else{
    voteChart.data.labels = labels;
    voteChart.data.datasets[0].data = counts;
    voteChart.update();
  }
}

async function voteCandidate(id){
  if(!id){ alert('Candidate id missing'); return }
  const token = localStorage.getItem('token');
  if(!token){ alert('Please login first'); return }
  try{
    const res = await fetch(`${BASE_URL}/candidate/vote/${id}`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const json = await res.json();
    if(res.ok){
      alert('Vote recorded');
      fetchCounts();
    }else{
      alert(json.message || json.error || 'Vote failed');
    }
  }catch(err){
    alert('Vote request failed');
  }
}

async function fetchProfile(token){
  try{
    const res = await fetch(`${BASE_URL}/user/profile`, { headers: { 'Authorization': 'Bearer ' + token }});
    if(!res.ok) return null;
    const json = await res.json();
    return json.user || null;
  }catch(e){ return null; }
}

async function setLoggedIn(token){
  const profile = await fetchProfile(token);
  if(profile){
    document.getElementById('userName').textContent = profile.name || 'User';
    const roleElement = document.getElementById('userRole');
    if(roleElement) roleElement.textContent = profile.role === 'admin' ? 'Administrator' : 'Voter';
    currentUserRole = profile.role || null;

    hide('auth'); hide('roleSelect'); show('userPanel'); show('mainContent'); show('candidates');

    if(currentUserRole === 'admin'){ show('counts'); show('adminPanel'); }
    else{ hide('counts'); hide('adminPanel'); }

    fetchCandidates();
    fetchCounts();
    setInterval(fetchCounts, 10000);
  }else{
    localStorage.removeItem('token');
    setLoggedOut();
  }
}

function setLoggedOut(){
  localStorage.removeItem('token');
  hide('auth'); hide('userPanel'); hide('mainContent'); hide('candidates'); hide('counts'); hide('adminPanel');
  show('roleSelect');
}

document.getElementById('loginForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const aadhar = document.getElementById('aadhar').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('loginMsg');
  msg.textContent = '';
  msg.className = 'message-box';
  try{
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({aadharCardNumber: aadhar, password})
    });
    const json = await res.json();
    if(res.ok && json.token){
      const profile = await fetchProfile(json.token);
      if(selectedRole === 'admin' && profile && profile.role !== 'admin'){
        msg.className = 'message-box error';
        msg.textContent = '❌ This account is not an admin.';
        return;
      }
      localStorage.setItem('token', json.token);
      msg.className = 'message-box success';
      msg.textContent = '✓ Login successful!';
      setTimeout(()=>setLoggedIn(json.token), 500);
    }else{
      msg.className = 'message-box error';
      msg.textContent = '❌ ' + (json.error || 'Login failed');
    }
  }catch(err){
    msg.className = 'message-box error';
    msg.textContent = '❌ Login request failed.';
  }
});

document.getElementById('logoutBtn').addEventListener('click', ()=> setLoggedOut());

async function addCandidate(e){
  e.preventDefault();
  const name = document.getElementById('candName').value.trim();
  const party = document.getElementById('candParty').value.trim();
  const age = parseInt(document.getElementById('candAge').value,10) || undefined;
  const token = localStorage.getItem('token');
  const msg = document.getElementById('adminMsg');
  msg.textContent = '';
  msg.className = 'message-box';
  if(!name||!party){ msg.className = 'message-box error'; msg.textContent = '❌ Name and Party required'; return }
  try{
    const res = await fetch(`${BASE_URL}/candidate`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ name, party, age })
    });
    const json = await res.json();
    if(res.ok){
      msg.className = 'message-box success';
      msg.textContent = '✓ Candidate added!';
      document.getElementById('addCandidateForm').reset();
      fetchCandidates();
    }else{
      msg.className = 'message-box error';
      msg.textContent = '❌ ' + (json.error || 'Failed');
    }
  }catch(err){ msg.className = 'message-box error'; msg.textContent = '❌ Request failed'; }
}

async function deleteCandidate(id){
  if(!confirm('Delete this candidate?')) return;
  const token = localStorage.getItem('token');
  try{
    const res = await fetch(`${BASE_URL}/candidate/` + id, { method: 'DELETE', headers: { 'Authorization':'Bearer ' + token }});
    if(res.ok){ fetchCandidates(); fetchCounts(); alert('✓ Deleted'); }
    else alert('❌ Delete failed');
  }catch(err){ alert('❌ Request failed'); }
}

document.getElementById('addCandidateForm').addEventListener('submit', addCandidate);

const token = localStorage.getItem('token');
if(token){ setLoggedIn(token); } else { setLoggedOut(); }

document.getElementById('roleVoter').addEventListener('click', ()=>{
  selectedRole = 'voter';
  document.getElementById('roleLabel').textContent = 'Login (Voter)';
  hide('roleSelect'); show('auth');
});

document.getElementById('roleAdmin').addEventListener('click', ()=>{
  selectedRole = 'admin';
  document.getElementById('roleLabel').textContent = 'Login (Admin)';
  hide('roleSelect'); show('auth');
});
