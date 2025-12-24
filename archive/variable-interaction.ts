/**
 * 模板变量交互脚本
 * 支持点击、拖动、右键菜单等操作
 */

/**
 * 生成模板变量交互脚本
 */
export function getVariableInteractionScript(nonce: string): string {
    // 转义 nonce 以防止注入
    const escapedNonce = nonce.replace(/'/g, "\\'");

    return `
(function() {
    const nonce = '${escapedNonce}';
    
    // DEBUG: 测试脚本是否运行
    // alert('AIMD Script Loaded!');
    console.log('AIMD interaction script loaded');
    
    // 浮动窗口类
    class VariableFloatingWindow {
        constructor(variableElement) {
            this.element = variableElement;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.originalPosition = null; // 原始位置（相对于文档流）
            this.currentFixedPosition = null; // 当前 fixed 位置
            this.returnTimeout = null; // 归位定时器
            this.hasMoved = false; // 是否已移动
            this.animationFrame = null; // requestAnimationFrame ID
            this.pendingUpdate = false; // 是否有待处理的更新
            this.init();
        }
        
        init() {
            // 记录原始位置（相对于文档流的位置）
            this.saveOriginalPosition();
            
            // 添加交互类
            this.element.classList.add('aimd-variable-interactive');
            
            // 绑定事件
            this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.element.addEventListener('contextmenu', this.handleContextMenu.bind(this));
            this.element.addEventListener('click', this.handleClick.bind(this));
        }
        
        saveOriginalPosition() {
            // 确保元素在原始位置（不是 fixed）
            const originalPosition = this.element.style.position;
            const originalLeft = this.element.style.left;
            const originalTop = this.element.style.top;
            
            // 临时重置以获取原始位置
            this.element.style.position = '';
            this.element.style.left = '';
            this.element.style.top = '';
            
            // 获取原始位置
            const rect = this.element.getBoundingClientRect();
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            this.originalPosition = {
                x: rect.left + scrollX,
                y: rect.top + scrollY,
                width: rect.width,
                height: rect.height
            };
            
            // 恢复之前的位置（如果有）
            this.element.style.position = originalPosition;
            this.element.style.left = originalLeft;
            this.element.style.top = originalTop;
        }
        
        isFarFromOriginal() {
            if (!this.originalPosition || !this.currentFixedPosition) {
                return false;
            }
            
            // 计算距离（使用中心点）
            const originalCenterX = this.originalPosition.x + this.originalPosition.width / 2;
            const originalCenterY = this.originalPosition.y + this.originalPosition.height / 2;
            const currentCenterX = this.currentFixedPosition.x + this.originalPosition.width / 2;
            const currentCenterY = this.currentFixedPosition.y + this.originalPosition.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(currentCenterX - originalCenterX, 2) + 
                Math.pow(currentCenterY - originalCenterY, 2)
            );
            
            // 如果距离超过元素宽度的 1.5 倍，认为远离了
            const threshold = this.originalPosition.width * 1.5;
            return distance > threshold;
        }
        
        returnToOriginal() {
            if (!this.originalPosition) return;
            
            // 清除之前的定时器
            if (this.returnTimeout) {
                clearTimeout(this.returnTimeout);
                this.returnTimeout = null;
            }
            
            // 添加归位动画类
            this.element.classList.add('aimd-variable-returning');
            
            // 确保元素是 fixed 定位
            if (this.element.style.position !== 'fixed') {
                const rect = this.element.getBoundingClientRect();
                this.element.style.position = 'fixed';
                this.element.style.left = rect.left + 'px';
                this.element.style.top = rect.top + 'px';
            }
            
            // 使用 CSS 动画归位
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            const targetX = this.originalPosition.x - scrollX;
            const targetY = this.originalPosition.y - scrollY;
            
            // 设置目标位置
            this.element.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.element.style.left = targetX + 'px';
            this.element.style.top = targetY + 'px';
            
            // 动画完成后恢复原始状态
            const onTransitionEnd = () => {
                this.element.style.position = '';
                this.element.style.left = '';
                this.element.style.top = '';
                this.element.style.transition = '';
                this.element.style.zIndex = '';
                this.element.classList.remove('aimd-variable-returning');
                this.currentFixedPosition = null;
                this.hasMoved = false;
                // 重新保存位置（可能因为滚动改变了）
                this.saveOriginalPosition();
                this.element.removeEventListener('transitionend', onTransitionEnd);
            };
            
            this.element.addEventListener('transitionend', onTransitionEnd, { once: true });
        }
        
        handleMouseDown(e) {
            // 右键不触发拖动
            if (e.button === 2) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // 清除归位定时器
            if (this.returnTimeout) {
                clearTimeout(this.returnTimeout);
                this.returnTimeout = null;
            }
            
            // 如果正在归位，停止归位
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
            
            // 如果元素已经在 fixed 位置，记录当前位置
            if (this.element.style.position === 'fixed') {
                this.currentFixedPosition = {
                    x: rect.left,
                    y: rect.top
                };
            } else {
                // 否则记录原始位置
                this.saveOriginalPosition();
                this.currentFixedPosition = null;
            }
            
            // 添加拖动状态类
            this.element.classList.add('aimd-variable-dragging');
            
            // 绑定全局事件
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
        }
        
        handleMouseMove = (e) => {
            if (!this.isDragging) return;
            
            e.preventDefault();
            
            // 使用 requestAnimationFrame 优化性能，节流更新频率
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
            
            // 计算新位置
            const newX = e.clientX - this.dragOffset.x;
            const newY = e.clientY - this.dragOffset.y;
            
            // 限制在视口内
            const maxX = window.innerWidth - this.element.offsetWidth;
            const maxY = window.innerHeight - this.element.offsetHeight;
            
            const constrainedX = Math.max(0, Math.min(newX, maxX));
            const constrainedY = Math.max(0, Math.min(newY, maxY));
            
            // 确保是 fixed 定位
            if (this.element.style.position !== 'fixed') {
                this.element.style.position = 'fixed';
                const rect = this.element.getBoundingClientRect();
                this.element.style.left = rect.left + 'px';
                this.element.style.top = rect.top + 'px';
            }
            
            // 直接更新位置（使用 requestAnimationFrame 已经优化了性能）
            this.element.style.left = constrainedX + 'px';
            this.element.style.top = constrainedY + 'px';
            this.element.style.zIndex = '10000';
            this.element.style.transition = ''; // 移除过渡，确保拖动流畅
            this.element.style.willChange = 'transform, left, top'; // 提示浏览器优化
            
            // 更新当前位置
            this.currentFixedPosition = {
                x: constrainedX,
                y: constrainedY
            };
            
            // 标记已移动
            this.hasMoved = true;
        };
        
        handleMouseUp = (e) => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.element.classList.remove('aimd-variable-dragging');
            
            // 取消待处理的动画帧
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
            this.pendingUpdate = false;
            
            // 移除 willChange 优化提示
            this.element.style.willChange = '';
            
            // 移除全局事件
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);
            
            // 检查是否需要归位
            if (this.hasMoved && this.isFarFromOriginal()) {
                // 延迟 1.5 秒后自动归位
                this.returnTimeout = setTimeout(() => {
                    this.returnToOriginal();
                }, 1500);
            } else if (this.hasMoved && !this.isFarFromOriginal()) {
                // 如果移动了但距离不远，立即归位
                this.returnToOriginal();
            }
        };
        
        handleClick(e) {
            // 如果正在拖动，不触发点击事件
            if (this.isDragging) {
                return;
            }
            
            e.stopPropagation();
            
            // 显示变量信息（后续可以扩展）
            const varName = this.element.getAttribute('data-variable-name') || '';
            console.log('Variable clicked:', varName);
            
            // 添加点击反馈
            this.element.classList.add('aimd-variable-clicked');
            setTimeout(() => {
                this.element.classList.remove('aimd-variable-clicked');
            }, 200);
        }
        
        handleContextMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const varName = this.element.getAttribute('data-variable-name') || '';
            
            // 创建右键菜单（后续可以扩展）
            this.showContextMenu(e.clientX, e.clientY, varName);
        }
        
        showContextMenu(x, y, varName) {
            // 移除已存在的菜单
            const existingMenu = document.querySelector('.aimd-variable-context-menu');
            if (existingMenu) {
                existingMenu.remove();
            }
            
            // 创建菜单
            const menu = document.createElement('div');
            menu.className = 'aimd-variable-context-menu';
            menu.style.position = 'fixed';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.zIndex = '10001';
            
            // 转义变量名以防止 XSS
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
            
            // 绑定菜单项点击事件
            menu.querySelectorAll('.aimd-variable-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.getAttribute('data-action');
                    this.handleMenuAction(action, varName);
                    menu.remove();
                });
            });
            
            // 点击其他地方关闭菜单
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
                    // 后续可以显示详细信息
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
            // 清除归位定时器
            if (this.returnTimeout) {
                clearTimeout(this.returnTimeout);
                this.returnTimeout = null;
            }
            
            // 立即归位
            this.returnToOriginal();
        }
    }
    
    // 初始化所有模板变量
    function initVariables() {
        const variables = document.querySelectorAll('.aimd-variable');
        variables.forEach((element) => {
            new VariableFloatingWindow(element);
        });
    }
    
    // 初始化可交互的 checkable 步骤节点（支持新的 step-badge 结构）
    function initCheckableNodes() {
        const checkableNodes = document.querySelectorAll('.aimd-step-badge[data-checkable="true"]');
        
        checkableNodes.forEach((node) => {
            node.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isChecked = node.getAttribute('data-checked') === 'true';
                const newState = !isChecked;
                node.setAttribute('data-checked', newState.toString());
                
                // 切换时显示勾选图标
                if (newState) {
                    node.innerHTML = '✓';
                } else {
                    // 恢复原始步骤编号
                    const container = node.closest('.aimd-step-container');
                    const stepId = container?.getAttribute('data-step-id') || '';
                    node.textContent = stepId;
                }
                
                // Also update the container so we can style the content card
                const container = node.closest('.aimd-step-container');
                if (container) {
                    container.setAttribute('data-checked', newState.toString());
                }
            });
        });
    }
    
    // 初始化可折叠步骤
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
    
    // 初始化引用标签的跳转功能
    function initReferenceJump() {
        // ref_step 跳转 - 查找带有 aimd-ref-jump 类的箭头
        const refStepJumps = document.querySelectorAll('[data-target-step]');
        refStepJumps.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetStepName = el.getAttribute('data-target-step');
                
                // 将 snake_case 转换为 Title Case 来匹配显示名
                const displayName = targetStepName
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                // 尝试多种方式查找目标步骤
                let targetStep = null;
                
                // 方式 1: 查找标题匹配的步骤
                const allContainers = document.querySelectorAll('.aimd-step-container');
                for (const container of allContainers) {
                    const titleEl = container.querySelector('.aimd-step-title');
                    if (titleEl && titleEl.textContent.trim() === displayName) {
                        targetStep = container;
                        break;
                    }
                }
                
                if (targetStep) {
                    // 展开目标步骤（如果折叠的话）
                    targetStep.removeAttribute('data-collapsed');
                    // 平滑滚动到目标
                    targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 添加高亮动画
                    targetStep.classList.add('aimd-highlight-flash');
                    setTimeout(() => {
                        targetStep.classList.remove('aimd-highlight-flash');
                    }, 1500);
                } else {
                    console.log('Step not found:', targetStepName, displayName);
                }
            });
        });

        // ref_var 跳转
        const refVars = document.querySelectorAll('[data-target-var]');
        refVars.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetVarName = el.getAttribute('data-target-var');
                
                // 查找第一个匹配的变量输入框
                const targetVar = document.querySelector(
                    '.aimd-var-input[data-variable-name="' + targetVarName + '"]'
                );
                
                if (targetVar) {
                    // 平滑滚动到目标
                    targetVar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 添加高亮动画
                    targetVar.classList.add('aimd-highlight-flash');
                    setTimeout(() => {
                        targetVar.classList.remove('aimd-highlight-flash');
                    }, 1500);
                    // 聚焦输入框
                    targetVar.focus();
                } else {
                    console.log('Variable not found:', targetVarName);
                }
            });
        });
    }
    
    // 全局状态：当前变量显示模式
    let currentDisplayMode = 0;
    const MODES = [
        { letter: 'ID', label: 'Variable ID' },
        { letter: 'V',  label: 'Value' },
        { letter: 'T',  label: 'Title' },
        { letter: '⌘',  label: 'Type' }
    ];

    // 更新所有变量（输入框和表格表头）的显示
    function updateAllVariablesDisplay(modeIndex, root = document) {
        // 1. 更新变量输入框
        const inputs = root.querySelectorAll('.aimd-var-input');
        inputs.forEach(input => {
            let displayValue = '';
            switch(modeIndex) {
                case 0: // ID
                    displayValue = input.getAttribute('data-var-id') || input.getAttribute('data-variable-name') || '';
                    break;
                case 1: // Value
                    displayValue = input.getAttribute('data-default-value') || '';
                    break;
                case 2: // Title
                    displayValue = ''; 
                    const title = input.getAttribute('data-var-title') || input.getAttribute('placeholder') || '';
                    input.placeholder = title;
                    break;
                case 3: // Type
                    displayValue = input.getAttribute('data-var-type') || 'str';
                    break;
            }
            input.value = displayValue;
        });

        // 2. 更新表格表头
        const headers = root.querySelectorAll('.aimd-mode-aware-th');
        headers.forEach(th => {
            const content = th.querySelector('.aimd-th-content');
            if (!content) return;

            const textEl = content.querySelector('.aimd-th-text');
            const typeEl = content.querySelector('.aimd-th-type');
            
            if (textEl) {
                switch(modeIndex) {
                    case 0: // ID
                        textEl.textContent = content.getAttribute('data-col-id') || '';
                        break;
                    case 1: 
                    case 2: // Title
                        textEl.textContent = content.getAttribute('data-col-title') || '';
                        break;
                    case 3: // Type
                        textEl.textContent = content.getAttribute('data-col-type') || 'str';
                        break;
                }
            }
            if (typeEl) {
                typeEl.style.display = (modeIndex === 3) ? 'none' : 'inline';
            }
        });
    }

    // 初始化工具栏交互 - 4模式轮换 Ring Dial
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
                
                // Advance to next mode
                currentDisplayMode = (currentDisplayMode + 1) % 4;
                const mode = MODES[currentDisplayMode];
                
                // Update dial UI
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
                
                // Update segment labels
                dial.querySelectorAll('.dial-seg-label').forEach((lbl, i) => {
                    lbl.classList.toggle('active', i === currentDisplayMode);
                });
                
                // Update all items
                updateAllVariablesDisplay(currentDisplayMode);
                console.log('Mode changed to:', mode.label);
            }
        });
        
        // Initialize dial state
        const checkInterval = setInterval(() => {
            const dial = document.getElementById('btn-toggle-var-view');
            if (dial) {
                dial.setAttribute('data-mode', '0');
                clearInterval(checkInterval);
            }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 5000);
    }
    
    // 初始化表格特有交互
    function initTableInteractions() {
        // 1. 水平滚动阴影检测
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

        // 2. 表格输入框编辑逻辑 (Ghost Inputs)
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

        // 3. 添加行逻辑
        const addRowBtns = document.querySelectorAll('.aimd-btn-icon[title="Add Row"]');
        addRowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const wrapper = btn.closest('.aimd-var-table-wrapper');
                const tbody = wrapper.querySelector('tbody');
                const rows = tbody.querySelectorAll('.aimd-var-table-row');
                if (rows.length === 0) return;

                const lastRow = rows[rows.length - 1];
                const newRow = lastRow.cloneNode(true);
                
                // 给新行打上标记，且移除所有预填的值
                const inputs = newRow.querySelectorAll('.aimd-var-input');
                inputs.forEach(input => {
                    input.setAttribute('data-is-new', 'true');
                    input.setAttribute('data-default-value', ''); // 清除预填充值
                    input.value = '';
                });

                // 重置并应用当前模式 (ID/Title/Type 仍需要显示，只有 Value 应该为空)
                updateAllVariablesDisplay(currentDisplayMode, newRow);

                tbody.appendChild(newRow);
                
                // 更新行数
                const meta = wrapper.querySelector('.aimd-table-meta');
                if (meta) {
                    meta.textContent = (rows.length + 1) + ' Rows';
                }
            });
        });

        // 4. 行删除逻辑
        document.body.addEventListener('click', (e) => {
            let el = e.target;
            while (el && el !== document.body) {
                if (el.classList.contains('aimd-row-delete-btn')) {
                    const row = el.closest('.aimd-var-table-row');
                    const wrapper = el.closest('.aimd-var-table-wrapper');
                    const tbody = row.parentElement;
                    
                    // 至少保留一行
                    if (tbody.querySelectorAll('.aimd-var-table-row').length > 1) {
                        row.remove();
                        
                        // 更新行数
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

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initVariables();
            initCheckableNodes();
            initCollapsibleSteps();
            initReferenceJump();
            initToolbar();
            initTableInteractions();
        });
    } else {
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
