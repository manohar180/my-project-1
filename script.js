
// Mock admin credentials (in real app, this would be on a server)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };
  
  class PlotManagement {
    constructor() {
      this.plots = this.loadPlots() || this.initializePlots();
      this.selectedPlot = null;
      this.setupEventListeners();
      this.checkAuth();
    }
  
    initializePlots() {
      const plots = {};
      for (let i = 1; i <= 500; i++) {
        plots[i] = { id: i, status: 'available' };
      }
      localStorage.setItem('plots', JSON.stringify(plots));
      return plots;
    }
  
    loadPlots() {
      return JSON.parse(localStorage.getItem('plots'));
    }
  
    savePlots() {
      localStorage.setItem('plots', JSON.stringify(this.plots));
    }
  
    setupEventListeners() {
      // Login form
      document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
  
      // Logout button
      document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
  
      // Plot container clicks
      document.getElementById('plotContainer').addEventListener('click', (e) => {
        const plot = e.target.closest('.plot');
        if (plot) this.openModal(plot.dataset.id);
      });
  
      // Modal actions
      document.querySelector('.plot-actions').addEventListener('click', (e) => {
        if (e.target.dataset.status) {
          this.updatePlotStatus(this.selectedPlot, e.target.dataset.status);
          this.closeModal();
        }
      });
  
      // Close modal
      document.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
  
      // Filter buttons
      document.querySelector('.plot-filters').addEventListener('click', (e) => {
        if (e.target.dataset.status) {
          this.filterPlots(e.target.dataset.status);
        }
      });
    }
  
    checkAuth() {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        this.showDashboard();
      }
    }
  
    handleLogin() {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('isLoggedIn', 'true');
        this.showDashboard();
      } else {
        alert('Invalid credentials!');
      }
    }
  
    handleLogout() {
      localStorage.removeItem('isLoggedIn');
      document.getElementById('dashboard').classList.add('hidden');
      document.getElementById('loginContainer').classList.remove('hidden');
    }
  
    showDashboard() {
      document.getElementById('loginContainer').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
      this.renderPlots();
    }
  
    renderPlots() {
      const container = document.getElementById('plotContainer');
      container.innerHTML = '';
      
      Object.values(this.plots).forEach(plot => {
        const plotElement = document.createElement('div');
        plotElement.className = 'plot';
        plotElement.dataset.id = plot.id;
        plotElement.dataset.status = plot.status;
        plotElement.textContent = plot.id;
        container.appendChild(plotElement);
      });
    }
  
    openModal(plotId) {
      this.selectedPlot = plotId;
      document.getElementById('plotModal').classList.remove('hidden');
    }
  
    closeModal() {
      this.selectedPlot = null;
      document.getElementById('plotModal').classList.add('hidden');
    }
  
    updatePlotStatus(plotId, status) {
      this.plots[plotId].status = status;
      this.savePlots();
      this.renderPlots();
    }
  
    filterPlots(status) {
      const plots = document.querySelectorAll('.plot');
      plots.forEach(plot => {
        if (status === 'all' || plot.dataset.status === status) {
          plot.style.display = 'flex';
        } else {
          plot.style.display = 'none';
        }
      });
    }
  }
  
  // Initialize the application
  new PlotManagement();
  
