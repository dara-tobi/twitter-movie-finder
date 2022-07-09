let socket = io();

let colors = ['Gray', 'Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green', 'Emerald', 'Teal', 'Cyan', 'Sky', 'Blue', 'Indigo', 'Violet', 'Rose', 'Pink', 'Fuchsia', 'Purple'].map(color => color.toLowerCase());

let getRandomColor = (colors) => {
  let randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

let getUserColorFromLocalStorage = (username) => {
  let userHandles = JSON.parse(localStorage.getItem('userHandles')) || [];
  if (!userHandles.length) {
    color = getRandomColor(colors);
    let onlineUser = {user: username, color: color};
    userHandles.push(onlineUser);
    localStorage.setItem('userHandles', JSON.stringify(userHandles));
  } else {
    let user = userHandles.find(user => user.user === username);
    if (user) {
      color = user.color;
    } else {
      color = getRandomColor(colors);
      let onlineUser = {user: username, color: color};
      userHandles.push(onlineUser);
      localStorage.setItem('userHandles', JSON.stringify(userHandles));
    }
  }
  return color;
}


let initSocket = () => {
  socket.on('', function(data) {

    let messageTimestamp = data.timestamp;  
    let msg = data.msg;
    let color = getUserColorFromLocalStorage(data.user);

    let date = new Date(Date.now());
    let minutes = date.getMinutes();
    let hours = date.getHours();
  
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    let time = `${hours}:${minutes}`;
    let item = document.createElement('li')
  
    item.innerHTML = `
      <div class="text-${color}-600">
        <div>
          <div class="message">
            <a href="https://twitter.com/${data.user}" target="_blank" class="font-bold tracking-tighter underline">${data.user}</a><span>:</span>
            <span>${msg}</span>
            <span class="text-${color}-400 italic" style="font-size:.525rem;">(<a href="https://twitter.com/${data.user}/status/${data.status_id}" target="_blank" class="font-bold tracking-tighter underline">${time}</a>)</span>
          </div>
          <div class="replies">
            <ul class="replies ml-8">
            </ul>
          </div>
        </div>
      </div>
    `;
  
    item.classList.add('px-2', `bg-${color}-50`, 'top-level-message');
    item.setAttribute('data-id', `${data.user}-${messageTimestamp}`);
    item.style.marginTop = '2px';
    messages.appendChild(item);

    item.scrollIntoView(({ behavior: 'smooth' }));
  });
}

initSocket();