
document.addEventListener('DOMContentLoaded', () => {
  const plotContainer = document.getElementById('plotContainer');
  const totalPlots = 585;
  const plots = [];
  let ws = null;
  
  function connectWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsPort = ':3000';
    ws = new WebSocket(`${wsProtocol}//${window.location.hostname}${wsPort}`);

    ws.onopen = () => {
      console.log('Connected to server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'init') {
        message.plotStatus.forEach((status, index) => {
          if (status) {
            plots[index].classList.add('sold');
          } else {
            plots[index].classList.remove('sold');
          }
        });
      } else if (message.type === 'update') {
        if (plots[message.plotId]) {
          if (message.status) {
            plots[message.plotId].classList.add('sold');
          } else {
            plots[message.plotId].classList.remove('sold');
          }
        }
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from server, reconnecting...');
      setTimeout(connectWebSocket, 1000);
    };
  }

  // Create plots
  for (let i = 1; i <= totalPlots; i++) {
    const plot = document.createElement('div');
    plot.className = 'plot';
    plot.textContent = i;
    
    plot.addEventListener('click', () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const newStatus = !plot.classList.contains('sold');
        ws.send(JSON.stringify({
          type: 'toggle',
          plotId: i - 1,
          status: newStatus
        }));
      }
    });

    plotContainer.appendChild(plot);
    plots.push(plot);
  }

  // Initial WebSocket connection
  connectWebSocket();
});
