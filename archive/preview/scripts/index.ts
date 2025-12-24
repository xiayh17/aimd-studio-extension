/**
 * Scripts Module Index
 * 
 * Bundles all interaction scripts for the webview.
 * This maintains backward compatibility with getVariableInteractionScript().
 */

/**
 * Generate the complete interaction script for the webview
 * This combines all individual script modules into a single IIFE
 */
export function getVariableInteractionScript(nonce: string): string {
    const escapedNonce = nonce.replace(/'/g, "\\'");

    return `
(function() {
    const nonce = '${escapedNonce}';
    
    console.log('AIMD interaction script loaded');
    
    // ============================================
    // Floating Window Class
    // ============================================
    class VariableFloatingWindow {
        constructor(variableElement) {
            this.element = variableElement;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.originalPosition = null;
            this.currentFixedPosition = null;
            this.returnTimeout = null;
            this.hasMoved = false;
            this.animationFrame = null;
            this.pendingUpdate = false;
            this.init();
        }
        
        init() {
            this.saveOriginalPosition();
            this.element.classList.add('aimd-variable-interactive');
            this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.element.addEventListener('contextmenu', this.handleContextMenu.bind(this));
            this.element.addEventListener('click', this.handleClick.bind(this));
        }
        
        saveOriginalPosition() {
            const originalPosition = this.element.style.position;
            const originalLeft = this.element.style.left;
            const originalTop = this.element.style.top;
            
            this.element.style.position = '';
            this.element.style.left = '';
            this.element.style.top = '';
            
            const rect = this.element.getBoundingClientRect();
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            this.originalPosition = {
                x: rect.left + scrollX,
                y: rect.top + scrollY,
                width: rect.width,
                height: rect.height
            };
            
            this.element.style.position = originalPosition;
            this.element.style.left = originalLeft;
            this.element.style.top = originalTop;
        }
        
        isFarFromOriginal() {
            if (!this.originalPosition || !this.currentFixedPosition) return false;
            
            const originalCenterX = this.originalPosition.x + this.originalPosition.width / 2;
            const originalCenterY = this.originalPosition.y + this.originalPosition.height / 2;
            const currentCenterX = this.currentFixedPosition.x + this.originalPosition.width / 2;
            const currentCenterY = this.currentFixedPosition.y + this.originalPosition.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(currentCenterX - originalCenterX, 2) + 
                Math.pow(currentCenterY - originalCenterY, 2)
            );
            
            const threshold = this.originalPosition.width * 1.5;
            return distance > threshold;
        }
        
        returnToOriginal() {
            if (!this.originalPosition) return;
            
            if (this.returnTimeout) {
                clearTimeout(this.returnTimeout);
                this.returnTimeout = null;
            }
            
            this.element.classList.add('aimd-variable-returning');
            
            if (this.element.style.position !== 'fixed') {
                const rect = this.element.getBoundingClientRect();
                this.element.style.position = 'fixed';
                this.element.style.left = rect.left + 'px';
                this.element.style.top = rect.top + 'px';
            }
            
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            const targetX = this.originalPosition.x - scrollX;
            const targetY = this.originalPosition.y - scrollY;
            
            this.element.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.element.style.left = targetX + 'px';
            this.element.style.top = targetY + 'px';
            
            const onTransitionEnd = () => {
                this.element.style.position = '';
                this.element.style.left = '';
                this.element.style.top = '';
                this.element.style.transition = '';
                this.element.style.zIndex = '';
                this.element.classList.remove('aimd-variable-returning');
                this.currentFixedPosition = null;
                this.hasMoved = false;
                this.saveOriginalPosition();
                this.element.removeEventListener('transitionend', onTransitionEnd);
            };
            
            this.element.addEventListener('transitionend', onTransitionEnd, { once: true });
        }
        
        handleMouseDown(e) {
            if (e.button === 2) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            if (this.returnTimeout) {
                clearTimeout(this.returnTimeout);
                this.returnTimeout = null;
            }
            
            if (this.element.classList.contains('aimd-variable-returning')) {
                this.element.classList.remove('aimd-variable-returning');
                this.element.style.transition = '';
            }
            
            this.isDragging = true;
            const rect = this.element.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            
            if (this.element.style.position === 'fixed') {
                this.currentFixedPosition = { x: rect.left, y: rect.top };
            } else {
                this.saveOriginalPosition();
                this.currentFixedPosition = null;
            }
            
            this.element.classList.add('aimd-variable-dragging');
            
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
        }
        
        handleMouseMove = (e) => {
            if (!this.isDragging) return;
            
            e.preventDefault();
            
            if (!this.pendingUpdate) {
                this.pendingUpdate = true;
                this.animationFrame = requestAnimationFrame(() => {
                    this.updatePosition(e);
                    this.pendingUpdate = false;
                });
            }
        };
        
        updatePosition(e) {
            if (!this.isDragging) return;
            
            const newX = e.clientX - this.dragOffset.x;
            const newY = e.clientY - this.dragOffset.y;
            
            const maxX = window.innerWidth - this.element.offsetWidth;
            const maxY = window.innerHeight - this.element.offsetHeight;
            
            const constrainedX = Math.max(0, Math.min(newX, maxX));
            const constrainedY = Math.max(0, Math.min(newY, maxY));
            
            if (this.element.style.position !== 'fixed') {
                this.element.style.position = 'fixed';
                const rect = this.element.getBoundingClientRect();
                this.element.style.left = rect.left + 'px';
                this.element.style.top = rect.top + 'px';
            }
            
            this.element.style.left = constrainedX + 'px';
            this.element.style.top = constrainedY + 'px';
            this.element.style.zIndex = '10000';
            this.element.style.transition = '';
            this.element.style.willChange = 'transform, left, top';
            
            this.currentFixedPosition = { x: constrainedX, y: constrainedY };
            this.hasMoved = true;
        };
        
        handleMouseUp = (e) => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.element.classList.remove('aimd-variable-dragging');
            
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
            this.pendingUpdate = false;
            
            this.element.style.willChange = '';
            
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);
            
            if (this.hasMoved && this.isFarFromOriginal()) {
                this.returnTimeout = setTimeout(() => {
                    this.returnToOriginal();
                }, 1500);
            } else if (this.hasMoved && !this.isFarFromOriginal()) {
                this.returnToOriginal();
            }
        };
        
        handleClick(e) {
            if (this.isDragging) return;
            
            e.stopPropagation();
            
            const varName = this.element.getAttribute('data-variable-name') || '';
            console.log('Variable clicked:', varName);
            
            this.element.classList.add('aimd-variable-clicked');
            setTimeout(() => {
                this.element.classList.remove('aimd-variable-clicked');
            }, 200);
        }
        
        handleContextMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const varName = this.element.getAttribute('data-variable-name') || '';
            this.showContextMenu(e.clientX, e.clientY, varName);
        }
        
        showContextMenu(x, y, varName) {
            const existingMenu = document.querySelector('.aimd-variable-context-menu');
            if (existingMenu) existingMenu.remove();
            
            const menu = document.createElement('div');
            menu.className = 'aimd-variable-context-menu';
            menu.style.position = 'fixed';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.zIndex = '10001';
            
            const escapedVarName = varName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            menu.innerHTML = 
                '<div class="aimd-variable-menu-item" data-action="info">' +
                    '<span>变量信息</span>' +
                    '<span class="aimd-variable-menu-hint">' + escapedVarName + '</span>' +
                '</div>' +
                '<div class="aimd-variable-menu-item" data-action="reset">' +
                    '<span>重置位置</span>' +
                '</div>' +
                '<div class="aimd-variable-menu-item" data-action="copy">' +
                    '<span>复制变量名</span>' +
                '</div>';
            
            menu.querySelectorAll('.aimd-variable-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.getAttribute('data-action');
                    this.handleMenuAction(action, varName);
                    menu.remove();
                });
            });
            
            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            
            setTimeout(() => {
                document.addEventListener('click', closeMenu);
            }, 0);
            
            document.body.appendChild(menu);
        }
        
        handleMenuAction(action, varName) {
            switch (action) {
                case 'info':
                    console.log('Variable info:', varName);
                    break;
                case 'reset':
                    this.resetPosition();
                    break;
                case 'copy':
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(varName).then(() => {
                            console.log('Variable name copied:', varName);
                        }).catch(err => {
                            console.error('Failed to copy:', err);
                        });
                    }
                    break;
            }
        }
        
        resetPosition() {
            if (this.returnTimeout) {
                clearTimeout(this.returnTimeout);
                this.returnTimeout = null;
            }
            this.returnToOriginal();
        }
    }
    
    // ============================================
    // Initialization Functions
    // ============================================
    
    function initVariables() {
        const variables = document.querySelectorAll('.aimd-variable');
        variables.forEach((element) => {
            new VariableFloatingWindow(element);
        });
    }
    
    function initCheckableNodes() {
        const checkableNodes = document.querySelectorAll('.aimd-step-badge[data-checkable="true"]');
        
        checkableNodes.forEach((node) => {
            node.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isChecked = node.getAttribute('data-checked') === 'true';
                const newState = !isChecked;
                node.setAttribute('data-checked', newState.toString());
                
                if (newState) {
                    node.innerHTML = '✓';
                } else {
                    const container = node.closest('.aimd-step-container');
                    const stepId = container?.getAttribute('data-step-id') || '';
                    node.textContent = stepId;
                }
                
                const container = node.closest('.aimd-step-container');
                if (container) {
                    container.setAttribute('data-checked', newState.toString());
                }
            });
        });
    }
    
    function initCollapsibleSteps() {
        const triggers = document.querySelectorAll('[data-collapsible-trigger]');
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const container = trigger.closest('.aimd-step-container');
                const isCollapsed = container.getAttribute('data-collapsed') === 'true';
                
                if (isCollapsed) {
                    container.removeAttribute('data-collapsed');
                } else {
                    container.setAttribute('data-collapsed', 'true');
                }
            });
        });
    }
    
    function initReferenceJump() {
        const refStepJumps = document.querySelectorAll('[data-target-step]');
        refStepJumps.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetStepName = el.getAttribute('data-target-step');
                
                const displayName = targetStepName
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                let targetStep = null;
                
                const allContainers = document.querySelectorAll('.aimd-step-container');
                for (const container of allContainers) {
                    const titleEl = container.querySelector('.aimd-step-title');
                    if (titleEl && titleEl.textContent.trim() === displayName) {
                        targetStep = container;
                        break;
                    }
                }
                
                if (targetStep) {
                    targetStep.removeAttribute('data-collapsed');
                    targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetStep.classList.add('aimd-highlight-flash');
                    setTimeout(() => {
                        targetStep.classList.remove('aimd-highlight-flash');
                    }, 1500);
                } else {
                    console.log('Step not found:', targetStepName, displayName);
                }
            });
        });

        const refVars = document.querySelectorAll('[data-target-var]');
        refVars.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetVarName = el.getAttribute('data-target-var');
                
                const targetVar = document.querySelector(
                    '.aimd-var-input[data-variable-name="' + targetVarName + '"]'
                );
                
                if (targetVar) {
                    targetVar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetVar.classList.add('aimd-highlight-flash');
                    setTimeout(() => {
                        targetVar.classList.remove('aimd-highlight-flash');
                    }, 1500);
                    targetVar.focus();
                } else {
                    console.log('Variable not found:', targetVarName);
                }
            });
        });
    }
    
    // ============================================
    // Toolbar & Display Mode
    // ============================================
    
    let currentDisplayMode = 0;
    const MODES = [
        { letter: 'ID', label: 'Variable ID' },
        { letter: 'V',  label: 'Value' },
        { letter: 'T',  label: 'Title' },
        { letter: '⌘',  label: 'Type' }
    ];

    function updateAllVariablesDisplay(modeIndex, root = document) {
        const inputs = root.querySelectorAll('.aimd-var-input');
        inputs.forEach(input => {
            let displayValue = '';
            switch(modeIndex) {
                case 0:
                    displayValue = input.getAttribute('data-var-id') || input.getAttribute('data-variable-name') || '';
                    break;
                case 1:
                    displayValue = input.getAttribute('data-default-value') || '';
                    break;
                case 2:
                    displayValue = ''; 
                    const title = input.getAttribute('data-var-title') || input.getAttribute('placeholder') || '';
                    input.placeholder = title;
                    break;
                case 3:
                    displayValue = input.getAttribute('data-var-type') || 'str';
                    break;
            }
            input.value = displayValue;
        });

        const headers = root.querySelectorAll('.aimd-mode-aware-th');
        headers.forEach(th => {
            const content = th.querySelector('.aimd-th-content');
            if (!content) return;

            const textEl = content.querySelector('.aimd-th-text');
            const typeEl = content.querySelector('.aimd-th-type');
            
            if (textEl) {
                switch(modeIndex) {
                    case 0:
                        textEl.textContent = content.getAttribute('data-col-id') || '';
                        break;
                    case 1: 
                    case 2:
                        textEl.textContent = content.getAttribute('data-col-title') || '';
                        break;
                    case 3:
                        textEl.textContent = content.getAttribute('data-col-type') || 'str';
                        break;
                }
            }
            if (typeEl) {
                typeEl.style.display = (modeIndex === 3) ? 'none' : 'inline';
            }
        });
    }

    function initToolbar() {
        if (window.__aimd_toolbar_init) return;
        window.__aimd_toolbar_init = true;

        document.body.addEventListener('click', (e) => {
            let el = e.target;
            let dial = null;
            
            while (el && el !== document.body) {
                if (el.id === 'btn-toggle-var-view') {
                    dial = el;
                    break;
                }
                el = el.parentElement;
            }
            
            if (dial) {
                e.preventDefault();
                e.stopPropagation();
                
                currentDisplayMode = (currentDisplayMode + 1) % 4;
                const mode = MODES[currentDisplayMode];
                
                dial.setAttribute('data-mode', currentDisplayMode);
                const segment = dial.querySelector('.dial-segment');
                if (segment) segment.setAttribute('data-mode', currentDisplayMode);
                
                const letterEl = dial.querySelector('.dial-letter');
                const labelEl = dial.querySelector('.dial-label');
                if (letterEl) {
                    letterEl.textContent = mode.letter;
                    letterEl.style.fontSize = mode.letter.length > 1 ? '14px' : '18px';
                }
                if (labelEl) labelEl.textContent = mode.label;
                
                dial.querySelectorAll('.dial-seg-label').forEach((lbl, i) => {
                    lbl.classList.toggle('active', i === currentDisplayMode);
                });
                
                updateAllVariablesDisplay(currentDisplayMode);
                console.log('Mode changed to:', mode.label);
            }
        });
        
        const checkInterval = setInterval(() => {
            const dial = document.getElementById('btn-toggle-var-view');
            if (dial) {
                dial.setAttribute('data-mode', '0');
                clearInterval(checkInterval);
            }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 5000);
    }
    
    // ============================================
    // Table Interactions
    // ============================================
    
    function initTableInteractions() {
        const containers = document.querySelectorAll('.aimd-var-table-container');
        containers.forEach(container => {
            const updateShadow = () => {
                if (container.scrollLeft > 5) {
                    container.classList.add('is-scrolled-x');
                } else {
                    container.classList.remove('is-scrolled-x');
                }
            };
            container.addEventListener('scroll', updateShadow);
            updateShadow();
        });

        document.body.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target.classList.contains('aimd-cell-input')) {
                e.stopPropagation();
                target.removeAttribute('readonly');
                target.focus();
            }
        });

        document.body.addEventListener('focusout', (e) => {
            const target = e.target;
            if (target && target.classList.contains('aimd-cell-input')) {
                target.setAttribute('readonly', 'true');
            }
        }, true);

        const addRowBtns = document.querySelectorAll('.aimd-btn-icon[title="Add Row"]');
        addRowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const wrapper = btn.closest('.aimd-var-table-wrapper');
                const tbody = wrapper.querySelector('tbody');
                const rows = tbody.querySelectorAll('.aimd-var-table-row');
                if (rows.length === 0) return;

                const lastRow = rows[rows.length - 1];
                const newRow = lastRow.cloneNode(true);
                
                const inputs = newRow.querySelectorAll('.aimd-var-input');
                inputs.forEach(input => {
                    input.setAttribute('data-is-new', 'true');
                    input.setAttribute('data-default-value', '');
                    input.value = '';
                });

                updateAllVariablesDisplay(currentDisplayMode, newRow);

                tbody.appendChild(newRow);
                
                const meta = wrapper.querySelector('.aimd-table-meta');
                if (meta) {
                    meta.textContent = (rows.length + 1) + ' Rows';
                }
            });
        });

        document.body.addEventListener('click', (e) => {
            let el = e.target;
            while (el && el !== document.body) {
                if (el.classList.contains('aimd-row-delete-btn')) {
                    const row = el.closest('.aimd-var-table-row');
                    const wrapper = el.closest('.aimd-var-table-wrapper');
                    const tbody = row.parentElement;
                    
                    if (tbody.querySelectorAll('.aimd-var-table-row').length > 1) {
                        row.remove();
                        
                        const meta = wrapper.querySelector('.aimd-table-meta');
                        const rowCount = tbody.querySelectorAll('.aimd-var-table-row').length;
                        if (meta) {
                            meta.textContent = rowCount + (rowCount === 1 ? ' Row' : ' Rows');
                        }
                    } else {
                        console.log('Cannot delete the last row');
                    }
                    return;
                }
                el = el.parentElement;
            }
        });
    }

    // ============================================
    // Portal Tooltip Management (Robust Fix)
    // ============================================
    
    function initPortalTooltips() {
        let activeTooltip = null;
        let activeWrapper = null;
        
        const showTooltip = (wrapper) => {
            if (activeWrapper === wrapper) return;
            hideTooltip();

            const template = wrapper.querySelector('.aimd-var-tooltip');
            if (!template) return;

            // Clone to body to escape all stacking contexts
            activeTooltip = template.cloneNode(true);
            activeTooltip.style.display = 'block';
            activeTooltip.style.visibility = 'hidden'; // Hide first to calculate pos
            activeTooltip.style.position = 'fixed';
            activeTooltip.style.zIndex = '2147483647'; // Max z-index
            activeTooltip.style.opacity = '0';
            activeTooltip.style.pointerEvents = 'none'; // Pass through clicks
            activeTooltip.classList.add('aimd-portal-tooltip'); // Marker class

            document.body.appendChild(activeTooltip);

            // Calculate Position
            const rect = wrapper.getBoundingClientRect();
            const tooltipRect = activeTooltip.getBoundingClientRect();
            
            // Center horizontally
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            // Default: show below
            let top = rect.bottom + 8; // 8px margin

            // Viewport boundary checks
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Prevent going off-screen left/right
            if (left < 10) left = 10;
            if (left + tooltipRect.width > viewportWidth - 10) {
                left = viewportWidth - tooltipRect.width - 10;
                // Re-position arrow? (Advanced: could adjust arrow pseudo-element transform)
            }

            // Flip to top if not enough space below
            if (top + tooltipRect.height > viewportHeight - 10) {
                top = rect.top - tooltipRect.height - 8;
                activeTooltip.classList.add('aimd-tooltip-flipped'); // For arrow styling
            }

            activeTooltip.style.left = left + 'px';
            activeTooltip.style.top = top + 'px';
            activeTooltip.style.visibility = 'visible';
            
            // Animation
            requestAnimationFrame(() => {
                if (activeTooltip) {
                    activeTooltip.style.opacity = '1';
                    activeTooltip.style.transform = 'translateY(0)'; // Reset any transform
                }
            });

            activeWrapper = wrapper;
        };

        const hideTooltip = () => {
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
            activeWrapper = null;
        };

        // Use event delegation
        document.body.addEventListener('mouseenter', (e) => {
            const wrapper = e.target.closest('.aimd-var-wrapper');
            if (wrapper) {
                showTooltip(wrapper);
            }
        }, true); // Capture phase

        document.body.addEventListener('mouseleave', (e) => {
            const wrapper = e.target.closest('.aimd-var-wrapper');
            if (wrapper && wrapper === activeWrapper) {
                hideTooltip();
            }
        }, true);

        // Also hide on scroll to prevent detached floaters
        window.addEventListener('scroll', () => {
             // Optional: could update position instead of hiding
             if (activeTooltip) hideTooltip();
        }, true);
    }

    // ============================================
    // DOM Ready
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initPortalTooltips();
            initVariables();
            initCheckableNodes();
            initCollapsibleSteps();
            initReferenceJump();
            initToolbar();
            initTableInteractions();
        });
    } else {
        initPortalTooltips();
        initVariables();
        initCheckableNodes();
        initCollapsibleSteps();
        initReferenceJump();
        initToolbar();
        initTableInteractions();
    }
})();
`;
}
