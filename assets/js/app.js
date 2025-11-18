// DCG证书生成器 v2.0 - 主要JavaScript逻辑

class CertificateGenerator {
  constructor() {
    this.canvas = document.getElementById('certificateCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.nameInput = document.getElementById('nameInput');
    this.uidInput = document.getElementById('uidInput');
    this.avatarUpload = document.getElementById('avatarUpload');
    this.coordsDisplay = document.getElementById('coordsDisplay');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.errorOverlay = document.getElementById('errorOverlay');
    this.retryBtn = document.getElementById('retryBtn');
    
    // 模板配置
    this.templates = {
      english: {
        1: "templates/english/English_VIP1.png",
        2: "templates/english/English_VIP2.png", 
        3: "templates/english/English_VIP3.png",
        4: "templates/english/English_VIP4.png",
        5: "templates/english/English_VIP5.png"
      },
      armenian: {
        1: "templates/armenian/Armenian_VIP1.png",
        2: "templates/armenian/Armenian_VIP2.png",
        3: "templates/armenian/Armenian_VIP3.png", 
        4: "templates/armenian/Armenian_VIP4.png",
        5: "templates/armenian/Armenian_VIP5.png"
      },
      hungarian: {
        1: "templates/hungarian/Hungarian_VIP1.png",
        2: "templates/hungarian/Hungarian_VIP2.png",
        3: "templates/hungarian/Hungarian_VIP3.png",
        4: "templates/hungarian/Hungarian_VIP4.png", 
        5: "templates/hungarian/Hungarian_VIP5.png"
      },
      spanish: {
        1: "templates/spanish/Spanish_VIP1.png",
        2: "templates/spanish/Spanish_VIP2.png",
        3: "templates/spanish/Spanish_VIP3.png",
        4: "templates/spanish/Spanish_VIP4.png",
        5: "templates/spanish/Spanish_VIP5.png"
      },
      ukrainian: {
        1: "templates/ukrainian/Ukrainian_VIP1.png", 
        2: "templates/ukrainian/Ukrainian_VIP2.png",
        3: "templates/ukrainian/Ukrainian_VIP3.png",
        4: "templates/ukrainian/Ukrainian_VIP4.png",
        5: "templates/ukrainian/Ukrainian_VIP5.png"
      },
      french: {
        1: "templates/french/French_VIP1.png",
        2: "templates/french/French_VIP2.png", 
        3: "templates/french/French_VIP3.png",
        4: "templates/french/French_VIP4.png",
        5: "templates/french/French_VIP5.png"
      },
      russian: {
        1: "templates/russian/Russian_VIP1.png",
        2: "templates/russian/Russian_VIP2.png",
        3: "templates/russian/Russian_VIP3.png",
        4: "templates/russian/Russian_VIP4.png",
        5: "templates/russian/Russian_VIP5.png"
      },
      bulgarian: {
        1: "templates/bulgarian/Bulgarian_VIP1.png",
        2: "templates/bulgarian/Bulgarian_VIP2.png",
        3: "templates/bulgarian/Bulgarian_VIP3.png", 
        4: "templates/bulgarian/Bulgarian_VIP4.png",
        5: "templates/bulgarian/Bulgarian_VIP5.png"
      },
      romanian: {
        1: "templates/romanian/Romanian_VIP1.png",
        2: "templates/romanian/Romanian_VIP2.png",
        3: "templates/romanian/Romanian_VIP3.png",
        4: "templates/romanian/Romanian_VIP4.png",
        5: "templates/romanian/Romanian_VIP5.png"
      },
      portuguese: {
        1: "templates/portuguese/Portuguese_VIP1.png",
        2: "templates/portuguese/Portuguese_VIP2.png",
        3: "templates/portuguese/Portuguese_VIP3.png",
        4: "templates/portuguese/Portuguese_VIP4.png",
        5: "templates/portuguese/Portuguese_VIP5.png"
      },
      croatian: {
        1: "templates/croatian/Croatian_VIP1.png",
        2: "templates/croatian/Croatian_VIP2.png",
        3: "templates/croatian/Croatian_VIP3.png",
        4: "templates/croatian/Croatian_VIP4.png",
        5: "templates/croatian/Croatian_VIP5.png"
      },
      slovak: {
        1: "templates/slovak/Slovak_VIP1.png",
        2: "templates/slovak/Slovak_VIP2.png",
        3: "templates/slovak/Slovak_VIP3.png",
        4: "templates/slovak/Slovak_VIP4.png",
        5: "templates/slovak/Slovak_VIP5.png"
      }
    };
    
    // 当前状态
    this.template = new Image();
    this.currentCountry = 'armenian';
    this.currentVip = 1;
    this.avatar = null;
    
    // 位置和大小参数
    this.avatarX = 77;
    this.avatarY = 188;
    this.avatarSize = 240;
    this.nameX = 358;
    this.nameY = 198;
    this.nameSize = 72;
    this.uidX = 140;
    this.uidY = 480;  // 还原到原始位置
    this.uidSize = 40;  // 修改为36px
    
    // 拖拽状态
    this.dragging = null;
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    // 初始显示加载动画
    this.showLoading();
    this.loadTemplate();
  }
  
  setupEventListeners() {
    // 国家标题点击事件（手风琴效果）
    document.querySelectorAll('.country-title').forEach(title => {
      title.addEventListener('click', () => {
        this.toggleCountry(title);
      });
    });
    
    // 模板选择事件
    document.querySelectorAll('.vip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectTemplate(btn);
      });
    });
    
    // 头像上传
    this.avatarUpload.addEventListener('change', (e) => {
      this.handleAvatarUpload(e);
    });
    
    // 粘贴上传头像
    document.addEventListener('paste', (e) => {
      this.handlePasteUpload(e);
    });
    
    // 拖拽事件
    this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
    this.canvas.addEventListener('mousemove', (e) => this.duringDrag(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrag());
    
    // 大小调整按钮
    document.getElementById('nameBigger').onclick = () => { this.nameSize += 2; this.drawAll(); };
    document.getElementById('nameSmaller').onclick = () => { this.nameSize -= 2; this.drawAll(); };
    document.getElementById('uidBigger').onclick = () => { this.uidSize += 2; this.drawAll(); };
    document.getElementById('uidSmaller').onclick = () => { this.uidSize -= 2; this.drawAll(); };
    
    // 下载功能
    document.getElementById('downloadBtn').onclick = () => this.downloadCertificate();
    
    // 重试按钮
    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => {
        this.loadTemplate();
      });
    }
    
    // 输入监听
    this.nameInput.addEventListener('input', () => this.drawAll());
    this.uidInput.addEventListener('input', () => this.drawAll());
    
    // 默认选择第一个模板并展开第一个国家
    document.addEventListener('DOMContentLoaded', () => {
      // 默认展开第一个国家
      const firstCountry = document.querySelector('.country-title');
      if (firstCountry) {
        const country = firstCountry.dataset.country;
        const vipGrid = document.querySelector(`.vip-grid[data-country="${country}"]`);
        if (vipGrid) {
          vipGrid.classList.add('expanded');
          firstCountry.classList.remove('collapsed');
        }
      }
      
      // 默认选择第一个VIP按钮
      const firstBtn = document.querySelector('.vip-btn');
      if (firstBtn) {
        firstBtn.classList.add('active');
      }
    });
  }
  
  toggleCountry(clickedTitle) {
    const country = clickedTitle.dataset.country;
    const vipGrid = document.querySelector(`.vip-grid[data-country="${country}"]`);
    const isExpanded = vipGrid.classList.contains('expanded');
    
    // 关闭所有其他国家
    document.querySelectorAll('.vip-grid').forEach(grid => {
      grid.classList.remove('expanded');
    });
    document.querySelectorAll('.country-title').forEach(title => {
      title.classList.add('collapsed');
    });
    
    // 如果点击的是当前展开的国家，则关闭；否则展开
    if (!isExpanded) {
      vipGrid.classList.add('expanded');
      clickedTitle.classList.remove('collapsed');
    }
  }
  
  selectTemplate(btn) {
    // 移除所有活动状态
    document.querySelectorAll('.vip-btn').forEach(b => b.classList.remove('active'));
    
    // 添加当前活动状态
    btn.classList.add('active');
    
    // 更新当前选择
    this.currentCountry = btn.dataset.country;
    this.currentVip = parseInt(btn.dataset.vip);
    
    // 加载新模板
    this.loadTemplate();
  }
  
  loadTemplate() {
    // 隐藏错误提示，显示加载动画
    this.hideError();
    this.showLoading();
    
    const templatePath = this.templates[this.currentCountry][this.currentVip];
    this.template.src = templatePath;
    
    this.template.onload = () => {
      this.hideLoading();
      this.drawAll();
    };
    
    this.template.onerror = () => {
      console.warn(`模板文件 ${templatePath} 未找到`);
      this.hideLoading();
      this.showError();
    };
  }
  
  showLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove('hidden');
    }
  }
  
  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden');
    }
  }
  
  showError() {
    if (this.errorOverlay) {
      this.errorOverlay.classList.remove('hidden');
    }
  }
  
  hideError() {
    if (this.errorOverlay) {
      this.errorOverlay.classList.add('hidden');
    }
  }
  
  handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
      this.loadAvatarFromFile(file);
    }
  }
  
  handlePasteUpload(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        this.loadAvatarFromFile(file);
        e.preventDefault();
        break;
      }
    }
  }
  
  loadAvatarFromFile(file) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.avatar = new Image();
        this.avatar.onload = () => this.drawAll();
        this.avatar.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  drawAll() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.template, 0, 0, 1280, 800);

    // 绘制头像（圆形裁切 + object-fit: cover 居中填充）
    if (this.avatar) {
      const imgW = this.avatar.width;
      const imgH = this.avatar.height;
      const cropSide = Math.min(imgW, imgH);
      const sx = (imgW - cropSide) / 2;
      const sy = (imgH - cropSide) / 2;

      this.ctx.save();
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.ctx.beginPath();
      this.ctx.arc(
        this.avatarX + this.avatarSize / 2,
        this.avatarY + this.avatarSize / 2,
        this.avatarSize / 2,
        0,
        Math.PI * 2
      );
      this.ctx.closePath();
      this.ctx.clip();
      this.ctx.drawImage(
        this.avatar,
        sx,
        sy,
        cropSide,
        cropSide,
        this.avatarX,
        this.avatarY,
        this.avatarSize,
        this.avatarSize
      );
      this.ctx.restore();
    }

    // 绘制姓名：白色字体 + 黑色阴影 + 白色光晕
    this.ctx.save();
    this.ctx.font = `${this.nameSize}px sans-serif`;
    this.ctx.fillStyle = "white";
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.fillText(this.nameInput.value, this.nameX, this.nameY);

    // 增加白色发光层（叠加）
    this.ctx.shadowColor = "white";
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 25;
    this.ctx.fillText(this.nameInput.value, this.nameX, this.nameY);
    this.ctx.restore();

    // 绘制 UID：白色字体 + 黑色阴影
    this.ctx.save();
    this.ctx.font = `${this.uidSize}px sans-serif`;
    this.ctx.fillStyle = "white";
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.fillText(this.uidInput.value, this.uidX, this.uidY);
    this.ctx.restore();

    // 更新坐标显示
    this.updateCoordsDisplay();
  }
  
  updateCoordsDisplay() {
    const countryNames = {
      'english': '英语',
      'armenian': '亚美尼亚语',
      'hungarian': '匈牙利语',
      'spanish': '西班牙语',
      'ukrainian': '乌克兰语',
      'french': '法语',
      'russian': '俄语',
      'bulgarian': '保加利亚语',
      'romanian': '罗马尼亚语',
      'portuguese': '葡萄牙语',
      'croatian': '克罗地亚语',
      'slovak': '斯洛伐克语'
    };
    
    const countryName = countryNames[this.currentCountry] || this.currentCountry;
    
    this.coordsDisplay.textContent = 
      `当前模板: ${countryName} VIP${this.currentVip} | 姓名: (${Math.round(this.nameX)}, ${Math.round(this.nameY)}, ${Math.round(this.nameSize)}) | UID: (${Math.round(this.uidX)}, ${Math.round(this.uidY)}, ${Math.round(this.uidSize)}) | 头像: (${Math.round(this.avatarX)}, ${Math.round(this.avatarY)}, ${Math.round(this.avatarSize)})`;
  }
  
  startDrag(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    
    // 计算文本宽度
    this.ctx.font = `${this.nameSize}px sans-serif`;
    const nameWidth = this.ctx.measureText(this.nameInput.value).width;
    this.ctx.font = `${this.uidSize}px sans-serif`;
    const uidWidth = this.ctx.measureText(this.uidInput.value).width || 50; // 如果为空，给一个默认宽度
    
    // 检查姓名区域
    const nameHit = mouseX > this.nameX && mouseX < this.nameX + nameWidth && mouseY < this.nameY && mouseY > this.nameY - this.nameSize;
    
    // 检查UID区域 - 使用简化的固定区域检测
    const uidHit = mouseX > this.uidX - 30 && mouseX < this.uidX + 200 && mouseY > this.uidY - 50 && mouseY < this.uidY + 20;
    
    // 检查是否点击在文本区域内（不包含头像）
    if (nameHit) {
      this.dragging = 'name';
    } else if (uidHit) {
      this.dragging = 'uid';
    }
    
    this.offsetX = mouseX;
    this.offsetY = mouseY;
  }
  
  duringDrag(e) {
    if (!this.dragging) return;
    
    const dx = e.offsetX - this.offsetX;
    const dy = e.offsetY - this.offsetY;
    
    if (this.dragging === 'name') { 
      this.nameX += dx; 
      this.nameY += dy; 
    }
    if (this.dragging === 'uid') { 
      this.uidX += dx; 
      this.uidY += dy; 
    }
    
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;
    this.drawAll();
  }
  
  stopDrag() {
    this.dragging = null;
  }
  
  downloadCertificate() {
    const link = document.createElement('a');
    link.download = `DCG证书_${this.currentCountry.toUpperCase()}_VIP${this.currentVip}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new CertificateGenerator();
});
