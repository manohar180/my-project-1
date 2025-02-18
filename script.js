document.addEventListener('DOMContentLoaded', () => {
    const plotContainer = document.getElementById('plotContainer');
    const totalPlots = 585;
    const plotStatus = new Array(totalPlots).fill(false);
    for (let i = 1; i <= totalPlots; i++) {
      const plot = document.createElement('div');
      plot.className = 'plot';
      plot.textContent = i;
      plot.addEventListener('click', () => {
        plotStatus[i-1] = !plotStatus[i-1];
        plot.classList.toggle('sold');
      });
      plotContainer.appendChild(plot);
    }
  });
  
