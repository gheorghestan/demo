document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    
    hamburgerMenu.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !hamburgerMenu.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // Table row selection
    const tableRows = document.querySelectorAll('tbody tr');
    const detailsPanel = document.querySelector('.details-panel');
    
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't trigger on checkbox clicks
            if (e.target.type === 'checkbox') return;
            
            // Remove selected class from all rows
            tableRows.forEach(r => r.classList.remove('selected'));
            
            // Add selected class to clicked row
            this.classList.add('selected');
            
            // Update details panel content based on selected row
            updateDetailsPanel(this);
        });
    });

    // Checkbox handling
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const headerCheckbox = document.querySelector('thead input[type="checkbox"]');
    
    // Header checkbox - select all
    headerCheckbox.addEventListener('change', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Individual checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Update header checkbox state
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            headerCheckbox.checked = checkedCount === checkboxes.length;
            headerCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        });
    });

    // Table sorting
    const sortableHeaders = document.querySelectorAll('th i.fa-sort');
    
    sortableHeaders.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const column = this.parentElement;
            const table = column.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const columnIndex = Array.from(column.parentElement.children).indexOf(column);
            
            // Toggle sort direction
            const isAscending = !column.classList.contains('sorted-desc');
            
            // Remove sort classes from all headers
            document.querySelectorAll('th').forEach(th => {
                th.classList.remove('sorted-asc', 'sorted-desc');
            });
            
            // Add appropriate sort class
            column.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');
            
            // Sort rows
            rows.sort((a, b) => {
                const aText = a.children[columnIndex].textContent.trim();
                const bText = b.children[columnIndex].textContent.trim();
                
                if (isAscending) {
                    return aText.localeCompare(bText);
                } else {
                    return bText.localeCompare(aText);
                }
            });
            
            // Reappend sorted rows
            rows.forEach(row => tbody.appendChild(row));
        });
    });

    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="text"]');
    
    searchInputs.forEach(input => {
        if (input.placeholder === 'Search') {
            input.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                if (this.closest('.sidebar')) {
                    // Sidebar search
                    filterSidebarItems(searchTerm);
                } else {
                    // Table search
                    filterTableRows(searchTerm);
                }
            });
        }
    });

    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from siblings
            const tabContainer = this.parentElement;
            tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Switch content based on tab
            switchTabContent(this.textContent.trim());
        });
    });

    // Chat suggestions
    const suggestions = document.querySelectorAll('.suggestion');
    const chatInput = document.querySelector('.chat-input input');
    
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            chatInput.value = this.textContent.trim();
            chatInput.focus();
        });
    });

    // Chat input handling
    const chatSendButton = document.querySelector('.input-actions .fa-arrow-up');
    
    chatSendButton.addEventListener('click', function() {
        sendChatMessage();
    });
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });

    // Panel controls
    const panelCloseButtons = document.querySelectorAll('.panel-controls .fa-times, .chat-controls .fa-minus');
    
    panelCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.details-panel, .chat-panel');
            panel.style.display = 'none';
        });
    });

    // Responsive window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });

    // Initialize some default states
    initializeDefaultStates();
});

function updateDetailsPanel(selectedRow) {
    const processName = selectedRow.children[1].textContent.trim();
    const state = selectedRow.children[3].textContent.trim();
    const startTime = selectedRow.children[4].textContent.trim();
    const endTime = selectedRow.children[5].textContent.trim();
    const duration = selectedRow.children[6].textContent.trim();
    
    // Update panel header
    const panelTitle = document.querySelector('.details-panel h3');
    panelTitle.textContent = processName;
    
    // Update package info
    const packageName = document.querySelector('.package-name');
    packageName.textContent = `Package: ${processName}@1.0.31`;
    
    // Update runtime details (simulate different values)
    const detailRows = document.querySelectorAll('.detail-row');
    if (detailRows.length > 2) {
        detailRows[2].querySelector('.value').textContent = `Current: ${startTime}`;
        detailRows[3].querySelector('.value').textContent = `Current: ${endTime}`;
        detailRows[4].querySelector('.value').textContent = duration;
    }
}

function filterSidebarItems(searchTerm) {
    const navItems = document.querySelectorAll('.nav-item, .nav-subitem');
    
    navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterTableRows(searchTerm) {
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update pagination info
    const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
    updatePaginationInfo(visibleRows.length);
}

function switchTabContent(tabName) {
    // Simulate tab switching by updating table content
    console.log(`Switching to ${tabName} tab`);
    
    // In a real application, this would load different data
    // For demo purposes, we'll just log the action
}

function sendChatMessage() {
    const chatInput = document.querySelector('.chat-input input');
    const message = chatInput.value.trim();
    
    if (message) {
        // Add message to chat (in a real app, this would send to server)
        console.log('Sending message:', message);
        
        // Clear input
        chatInput.value = '';
        
        // Simulate response
        setTimeout(() => {
            showChatResponse(message);
        }, 1000);
    }
}

function showChatResponse(originalMessage) {
    // Simulate AI response
    const responses = [
        "I can help you with that automation task.",
        "Let me analyze your process data.",
        "Here are some suggestions for optimizing your workflow.",
        "I've found several automation opportunities in your data."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    console.log('Chat response:', randomResponse);
    
    // In a real app, this would add the response to the chat interface
}

function updatePaginationInfo(visibleCount) {
    const paginationText = document.querySelector('.pagination span');
    if (paginationText) {
        paginationText.textContent = `1 - ${visibleCount} / ${visibleCount}`;
    }
}

function initializeDefaultStates() {
    // Set initial selected row
    const firstRow = document.querySelector('tbody tr.selected');
    if (firstRow) {
        updateDetailsPanel(firstRow);
    }
    
    // Add some enhanced interactions
    addHoverEffects();
    addTooltips();
}

function addHoverEffects() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, .nav-item, .nav-subitem, .suggestion');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s ease';
        });
    });
}

function addTooltips() {
    // Add tooltips to icon buttons
    const iconButtons = document.querySelectorAll('.header-icons i, .panel-controls i, .chat-controls i');
    
    iconButtons.forEach(icon => {
        const tooltipTexts = {
            'fa-search': 'Search',
            'fa-bell': 'Notifications',
            'fa-question-circle': 'Help',
            'fa-external-link-alt': 'Open in new window',
            'fa-times': 'Close',
            'fa-cog': 'Settings',
            'fa-minus': 'Minimize'
        };
        
        const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
        if (tooltipTexts[iconClass]) {
            icon.title = tooltipTexts[iconClass];
        }
    });
}

// Export functions for potential external use
window.UiPathOrchestrator = {
    updateDetailsPanel,
    filterTableRows,
    sendChatMessage
};