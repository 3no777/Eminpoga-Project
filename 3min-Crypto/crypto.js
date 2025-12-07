document.addEventListener('DOMContentLoaded', function() {
    let walletBalance = 5250.75;
    let freeBalance = 3150.45;
    let investedBalance = 2100.30;
    let totalProfit = 450.25;
    let cryptoBalances = {
        'BTC': 0.015,
        'ETH': 1.5,
        'ADA': 1000,
        'BNB': 5,
        'SOL': 25
    };
    
    let transactions = [
        { id: 1, type: 'buy', crypto: 'BTC', amount: 0.005, price: 42000, total: 210, date: '2023-12-05 14:30', status: 'completed' },
        { id: 2, type: 'sell', crypto: 'ETH', amount: 0.5, price: 2300, total: 1150, date: '2023-12-04 11:15', status: 'completed' },
        { id: 3, type: 'deposit', amount: 1000, method: 'card', date: '2023-12-03 09:45', status: 'completed' },
        { id: 4, type: 'withdraw', amount: 500, method: 'bank', date: '2023-12-02 16:20', status: 'completed' },
        { id: 5, type: 'buy', crypto: 'ADA', amount: 500, price: 0.45, total: 225, date: '2023-12-01 13:10', status: 'completed' }
    ];

    const cryptoData = [
        { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 42567.89, change: 3.45, marketCap: 832456789123, volume: 32456789123, color: '#f7931a', icon: 'fab fa-bitcoin' },
        { id: 2, name: 'Ethereum', symbol: 'ETH', price: 2345.67, change: 1.89, marketCap: 281234567890, volume: 15432109876, color: '#627eea', icon: 'fab fa-ethereum' },
        { id: 3, name: 'Cardano', symbol: 'ADA', price: 0.4567, change: -0.23, marketCap: 16123456789, volume: 987654321, color: '#00d395', icon: 'fas fa-chart-bar' },
        { id: 4, name: 'Binance Coin', symbol: 'BNB', price: 312.45, change: 2.34, marketCap: 48123456789, volume: 2345678901, color: '#f0b90b', icon: 'fas fa-coins' },
        { id: 5, name: 'Solana', symbol: 'SOL', price: 98.76, change: 5.67, marketCap: 40123456789, volume: 3456789012, color: '#00ffa3', icon: 'fas fa-bolt' },
        { id: 6, name: 'Ripple', symbol: 'XRP', price: 0.6789, change: -1.23, marketCap: 36123456789, volume: 1234567890, color: '#23292f', icon: 'fas fa-water' },
        { id: 7, name: 'Polkadot', symbol: 'DOT', price: 7.89, change: 0.56, marketCap: 10123456789, volume: 456789012, color: '#e6007a', icon: 'fas fa-circle' },
        { id: 8, name: 'Dogecoin', symbol: 'DOGE', price: 0.1234, change: 4.56, marketCap: 17123456789, volume: 567890123, color: '#c2a633', icon: 'fas fa-dog' }
    ];
    
    const newsData = [
        { id: 1, title: 'Bitcoin arrin nivelin më të lartë për 3 muaj', excerpt: 'Bitcoin shënon rritje prej 15% në javën e fundit, duke kaluar nivelin e $42,000.', category: 'Trend', date: '2 orë më parë' },
        { id: 2, title: 'Ethereum 2.0: Përditësimi që ndryshon gjithçka', excerpt: 'Përditësimi i ri i Ethereum-it premton të zvogëlojë konsumin e energjisë me 99%.', category: 'Teknologji', date: '5 orë më parë' },
        { id: 3, title: 'Regjistrimi i parë i ETF për Bitcoin në Europë', excerpt: 'Kompania gjermane miraton ETF-në e parë për Bitcoin në tregun europian.', category: 'Ligjore', date: '1 ditë më parë' },
        { id: 4, title: 'Rritje e mprehtë në tregun e NFT-ve', excerpt: 'Vëllimi i tregtisë së NFT-ve rritet me 40% në muajin e fundit.', category: 'NFT', date: '2 ditë më parë' },
        { id: 5, title: 'Kriptomonedhat në vendet e Ballkanit', excerpt: 'Studim i ri tregon rritje prej 200% në përdorimin e kriptomonedhave në vendet e Ballkanit.', category: 'Rajoni', date: '3 ditë më parë' },
        { id: 6, title: 'Siguria në tregun e kriptomonedhave', excerpt: 'Ekspertët flasin për masat e reja të sigurisë për mbrojtjen e investitorëve.', category: 'Siguri', date: '1 javë më parë' }
    ];
    
    createParticles();
    initializeCharts();
    loadCryptoData();
    loadNewsData();
    initializeWallet();
    initializeTrade();
    
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            themeIcon.className = 'fas fa-sun';
            body.style.backgroundColor = '#f8fafc';
            body.style.color = '#1e293b';
        } else {
            themeIcon.className = 'fas fa-moon';
            body.style.backgroundColor = '';
            body.style.color = '';
        }
    });
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterCryptoData(this.textContent.trim());
        });
    });
    
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            periodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updatePortfolioChart(this.textContent.trim());
        });
    });
    
    const addAssetBtn = document.getElementById('add-asset-btn');
    const swapBtn = document.getElementById('swap-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const assetModal = document.getElementById('asset-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');
    
    addAssetBtn.addEventListener('click', function() {
        assetModal.classList.add('active');
    });
    
    swapBtn.addEventListener('click', function() {
        showNotification('Funksioni i këmbimit do të aktivizohet së shpejti!', 'info');
    });
    
    analyzeBtn.addEventListener('click', function() {
        showNotification('Analiza e portofolit po gjenerohet...', 'info');
    });
    
    modalClose.addEventListener('click', function() {
        assetModal.classList.remove('active');
    });
    
    modalCancel.addEventListener('click', function() {
        assetModal.classList.remove('active');
    });
    
    modalConfirm.addEventListener('click', function() {
        const selectedCrypto = document.getElementById('crypto-select').value;
        const amount = parseFloat(document.getElementById('asset-amount').value);
        const price = parseFloat(document.getElementById('asset-price').value);
        const date = document.getElementById('asset-date').value;
        
        if (!amount || !price || !date) {
            showNotification('Ju lutem plotësoni të gjitha fushat!', 'error');
            return;
        }
        
        const totalValue = (amount * price).toFixed(2);
        showNotification(`U shtuan ${amount} ${selectedCrypto} me vlerë $${totalValue} në portofol!`, 'success');
        assetModal.classList.remove('active');
        document.getElementById('asset-amount').value = '';
        document.getElementById('asset-price').value = '';
        document.getElementById('asset-date').value = '';
    });
    
    assetModal.addEventListener('click', function(e) {
        if (e.target === assetModal) {
            assetModal.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Fillo Tani') || btn.textContent.includes('Hyr') || btn.textContent.includes('Regjistrohu')) {
            btn.addEventListener('click', function() {
                showNotification('Mirë se vini në Poga Finance! Platforma juaj për kriptomonedha.', 'success');
            });
        }
    });
    
    const depositBtn = document.getElementById('deposit-btn');
    const withdrawBtn = document.getElementById('withdraw-btn');
    const viewAllBtn = document.getElementById('view-all-btn');
    const depositModal = document.getElementById('deposit-modal');
    const withdrawModal = document.getElementById('withdraw-modal');
    const depositClose = document.querySelector('.deposit-close');
    const withdrawClose = document.querySelector('.withdraw-close');
    const depositCancel = document.getElementById('deposit-cancel');
    const withdrawCancel = document.getElementById('withdraw-cancel');
    const depositConfirm = document.getElementById('deposit-confirm');
    const withdrawConfirm = document.getElementById('withdraw-confirm');
    const depositAmount = document.getElementById('deposit-amount');
    const withdrawAmount = document.getElementById('withdraw-amount');
    const paymentMethod = document.getElementById('payment-method');
    const methodOptions = document.querySelectorAll('.method-option');
    const bankAccount = document.getElementById('bank-account');
    
    const tradeTabs = document.querySelectorAll('.trade-tab');
    const tradeCrypto = document.getElementById('trade-crypto');
    const tradeAmount = document.getElementById('trade-amount');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const currentPriceEl = document.getElementById('current-price');
    const totalValueEl = document.getElementById('total-value');
    const tradeFeeEl = document.getElementById('trade-fee');
    const totalCostEl = document.getElementById('total-cost');
    const totalReceiveEl = document.getElementById('total-receive');
    const executeTradeBtn = document.getElementById('execute-trade-btn');
    
    depositBtn.addEventListener('click', function() {
        depositModal.classList.add('active');
    });
    
    withdrawBtn.addEventListener('click', function() {
        withdrawModal.classList.add('active');
        withdrawAmount.max = freeBalance;
        document.querySelector('.balance-display').textContent = `$${freeBalance.toFixed(2)}`;
    });
    
    viewAllBtn.addEventListener('click', function() {
        showNotification('Duke shfaqur të gjitha transaksionet...', 'info');
    });
    
    depositClose.addEventListener('click', function() {
        depositModal.classList.remove('active');
    });
    
    withdrawClose.addEventListener('click', function() {
        withdrawModal.classList.remove('active');
    });
    
    depositCancel.addEventListener('click', function() {
        depositModal.classList.remove('active');
    });
    
    withdrawCancel.addEventListener('click', function() {
        withdrawModal.classList.remove('active');
    });
    
    depositConfirm.addEventListener('click', function() {
        const amount = parseFloat(depositAmount.value);
        const method = paymentMethod.value;
        
        if (!amount || amount < 10 || amount > 10000) {
            showNotification('Ju lutem shkruani një shumë valid (10-10000)!', 'error');
            return;
        }
        
        walletBalance += amount;
        freeBalance += amount;
        
        const newTransaction = {
            id: transactions.length + 1,
            type: 'deposit',
            amount: amount,
            method: method,
            date: new Date().toLocaleString('sq-AL'),
            status: 'completed'
        };
        
        transactions.unshift(newTransaction);
        updateWalletDisplay();
        loadTransactions();
        depositModal.classList.remove('active');
        depositAmount.value = '';
        showNotification(`Depozituat me sukses $${amount.toFixed(2)} në wallet!`, 'success');
    });
    
    withdrawConfirm.addEventListener('click', function() {
        const amount = parseFloat(withdrawAmount.value);
        const fee = 1.50;
        const total = amount - fee;
        
        if (!amount || amount < 20 || amount > freeBalance) {
            showNotification('Ju lutem shkruani një shumë valid!', 'error');
            return;
        }
        
        if (amount > freeBalance) {
            showNotification('Nuk keni balancë të mjaftueshme!', 'error');
            return;
        }
        
        walletBalance -= amount;
        freeBalance -= amount;
        
        const newTransaction = {
            id: transactions.length + 1,
            type: 'withdraw',
            amount: amount,
            method: bankAccount.value,
            fee: fee,
            total: total,
            date: new Date().toLocaleString('sq-AL'),
            status: 'completed'
        };
        
        transactions.unshift(newTransaction);
        updateWalletDisplay();
        loadTransactions();
        withdrawModal.classList.remove('active');
        withdrawAmount.value = '';
        showNotification(`Tërheqët me sukses $${amount.toFixed(2)}. Do të merrni $${total.toFixed(2)} (pas komisionit).`, 'success');
    });
    
    methodOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            paymentMethod.value = method;
            methodOptions.forEach(opt => {
                opt.style.background = 'rgba(255, 255, 255, 0.03)';
                opt.style.borderColor = 'rgba(255, 255, 255, 0.07)';
            });
            this.style.background = 'rgba(41, 196, 255, 0.1)';
            this.style.borderColor = 'rgba(41, 196, 255, 0.3)';
        });
    });
    
    tradeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tradeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateTradeForm();
        });
    });
    
    tradeCrypto.addEventListener('change', function() {
        updateTradeForm();
    });
    
    tradeAmount.addEventListener('input', function() {
        updateTradeForm();
    });
    
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const percent = parseFloat(this.getAttribute('data-percent')) / 100;
            const maxAmount = getMaxTradeAmount();
            const calculatedAmount = maxAmount * percent;
            tradeAmount.value = calculatedAmount.toFixed(4);
            updateTradeForm();
        });
    });
    
    executeTradeBtn.addEventListener('click', function() {
        const amount = parseFloat(tradeAmount.value);
        const crypto = tradeCrypto.value;
        const cryptoName = tradeCrypto.options[tradeCrypto.selectedIndex].text;
        const isBuy = document.querySelector('.trade-tab.active').getAttribute('data-type') === 'buy';
        const price = getCurrentCryptoPrice(crypto);
        const total = amount * price;
        const fee = total * 0.001;
        const totalCostValue = total + fee;
        
        if (!amount || amount <= 0) {
            showNotification('Ju lutem shkruani një sasi valid!', 'error');
            return;
        }
        
        if (isBuy && totalCostValue > freeBalance) {
            showNotification('Nuk keni balancë të mjaftueshme për këtë blerje!', 'error');
            return;
        }
        
        if (!isBuy && amount > cryptoBalances[crypto]) {
            showNotification(`Nuk keni ${crypto} të mjaftueshme për shitje!`, 'error');
            return;
        }
        
        if (isBuy) {
            freeBalance -= totalCostValue;
            walletBalance -= totalCostValue;
            cryptoBalances[crypto] = (cryptoBalances[crypto] || 0) + amount;
            
            const newTransaction = {
                id: transactions.length + 1,
                type: 'buy',
                crypto: crypto,
                cryptoName: cryptoName,
                amount: amount,
                price: price,
                total: total,
                fee: fee,
                date: new Date().toLocaleString('sq-AL'),
                status: 'completed'
            };
            
            transactions.unshift(newTransaction);
            showNotification(`Blerje e suksesshme! Blenët ${amount} ${crypto} për $${total.toFixed(2)}`, 'success');
        } else {
            const sellValue = total - fee;
            freeBalance += sellValue;
            walletBalance += sellValue;
            cryptoBalances[crypto] -= amount;
            totalProfit += (sellValue - (amount * getCryptoAveragePrice(crypto)));
            
            const newTransaction = {
                id: transactions.length + 1,
                type: 'sell',
                crypto: crypto,
                cryptoName: cryptoName,
                amount: amount,
                price: price,
                total: total,
                fee: fee,
                net: sellValue,
                date: new Date().toLocaleString('sq-AL'),
                status: 'completed'
            };
            
            transactions.unshift(newTransaction);
            showNotification(`Shitje e suksesshme! Shitët ${amount} ${crypto} për $${sellValue.toFixed(2)}`, 'success');
        }
        
        updateWalletDisplay();
        loadTransactions();
        tradeAmount.value = '';
        updateTradeForm();
    });
    
    withdrawAmount.addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        const fee = 1.50;
        const total = amount - fee;
        document.getElementById('withdraw-total').textContent = `$${total.toFixed(2)}`;
    });
    
    depositModal.addEventListener('click', function(e) {
        if (e.target === depositModal) {
            depositModal.classList.remove('active');
        }
    });
    
    withdrawModal.addEventListener('click', function(e) {
        if (e.target === withdrawModal) {
            withdrawModal.classList.remove('active');
        }
    });
    
    setInterval(() => {
        updateCryptoPrices();
        showNotification('Çmimet e kriptomonedhave u përditësuan!', 'info');
    }, 10000);
    
    function initializeWallet() {
        updateWalletDisplay();
        loadTransactions();
    }
    
    function updateWalletDisplay() {
        document.querySelector('.balance-amount').textContent = `$${walletBalance.toFixed(2)}`;
        const changePercent = ((totalProfit / (walletBalance - totalProfit)) * 100).toFixed(1);
        document.querySelector('.balance-change').textContent = `+$${totalProfit.toFixed(2)} (${changePercent}%)`;
        document.querySelector('.detail-item:nth-child(1) .detail-value').textContent = `$${freeBalance.toFixed(2)}`;
        document.querySelector('.detail-item:nth-child(2) .detail-value').textContent = `$${investedBalance.toFixed(2)}`;
        document.querySelector('.detail-item:nth-child(3) .detail-value').textContent = `$${totalProfit.toFixed(2)}`;
    }
    
    function loadTransactions() {
        const transactionsList = document.getElementById('transactions-list');
        transactionsList.innerHTML = '';
        
        transactions.slice(0, 5).forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            
            let iconClass, icon, title, amountClass, amountText;
            
            switch(transaction.type) {
                case 'deposit':
                    iconClass = 'deposit';
                    icon = 'fas fa-arrow-down';
                    title = `Depozitë - ${transaction.method}`;
                    amountClass = 'positive';
                    amountText = `+$${transaction.amount.toFixed(2)}`;
                    break;
                case 'withdraw':
                    iconClass = 'withdraw';
                    icon = 'fas fa-arrow-up';
                    title = `Tërheqje - ${transaction.method}`;
                    amountClass = 'negative';
                    amountText = `-$${transaction.amount.toFixed(2)}`;
                    break;
                case 'buy':
                    iconClass = 'buy';
                    icon = 'fas fa-shopping-cart';
                    title = `Blerje ${transaction.crypto}`;
                    amountClass = 'negative';
                    amountText = `-$${transaction.total.toFixed(2)}`;
                    break;
                case 'sell':
                    iconClass = 'sell';
                    icon = 'fas fa-cash-register';
                    title = `Shitje ${transaction.crypto}`;
                    amountClass = 'positive';
                    amountText = `+$${transaction.net.toFixed(2)}`;
                    break;
            }
            
            transactionItem.innerHTML = `
                <div class="transaction-icon ${iconClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${title}</div>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
                <div class="transaction-amount ${amountClass}">${amountText}</div>
            `;
            transactionsList.appendChild(transactionItem);
        });
    }
    
    function initializeTrade() {
        updateTradeForm();
    }
    
    function updateTradeForm() {
        const crypto = tradeCrypto.value;
        const amount = parseFloat(tradeAmount.value) || 0;
        const price = getCurrentCryptoPrice(crypto);
        const total = amount * price;
        const fee = total * 0.001;
        const isBuy = document.querySelector('.trade-tab.active').getAttribute('data-type') === 'buy';
        
        currentPriceEl.textContent = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        totalValueEl.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        tradeFeeEl.textContent = `$${fee.toFixed(2)} (0.1%)`;
        
        if (isBuy) {
            totalCostEl.textContent = `$${(total + fee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            totalReceiveEl.textContent = `${amount.toFixed(8)} ${crypto}`;
            executeTradeBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Ekzekuto Blerjen';
            executeTradeBtn.style.background = 'linear-gradient(90deg, #10b981, #0ea5e9)';
        } else {
            totalCostEl.textContent = `${amount.toFixed(8)} ${crypto}`;
            totalReceiveEl.textContent = `$${(total - fee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            executeTradeBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Ekzekuto Shitjen';
            executeTradeBtn.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
        }
    }
    
    function getCurrentCryptoPrice(symbol) {
        const crypto = cryptoData.find(c => c.symbol === symbol);
        return crypto ? crypto.price : 0;
    }
    
    function getMaxTradeAmount() {
        const isBuy = document.querySelector('.trade-tab.active').getAttribute('data-type') === 'buy';
        const crypto = tradeCrypto.value;
        const price = getCurrentCryptoPrice(crypto);
        
        if (isBuy) {
            return freeBalance / (price * 1.001);
        } else {
            return cryptoBalances[crypto] || 0;
        }
    }
    
    function getCryptoAveragePrice(symbol) {
        const averagePrices = {
            'BTC': 41000,
            'ETH': 2200,
            'ADA': 0.42,
            'BNB': 300,
            'SOL': 90
        };
        return averagePrices[symbol] || 0;
    }
    
    let notificationTimeout;
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('i');
        const text = document.getElementById('notification-text');
        
        notification.className = 'notification';
        notification.classList.add(type);
        notification.classList.add('show');
        text.textContent = message;
        
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
            notification.style.background = 'rgba(16, 185, 129, 0.9)';
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
            notification.style.background = 'rgba(239, 68, 68, 0.9)';
        } else {
            icon.className = 'fas fa-info-circle';
            notification.style.background = 'rgba(41, 196, 255, 0.9)';
        }
        
        if (notificationTimeout) clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    function updatePortfolioChart(period) {
        showNotification(`Grafiku u përditësua për periudhën: ${period}`, 'info');
    }
    
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 1 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = 'rgba(41, 196, 255, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.zIndex = '-1';
            
            particle.animate(
                [
                    { transform: 'translateY(0px)' },
                    { transform: `translateY(${Math.random() * 100 - 50}px)` }
                ],
                {
                    duration: Math.random() * 3000 + 2000,
                    iterations: Infinity,
                    direction: 'alternate'
                }
            );
            container.appendChild(particle);
        }
    }
    
    function initializeCharts() {
        createMiniChart('btc-chart', [42000, 42500, 42300, 42400, 42200, 42567], '#f7931a');
        createMiniChart('eth-chart', [2300, 2320, 2310, 2330, 2340, 2345], '#627eea');
        initializePortfolioChart();
    }
    
    function createMiniChart(canvasId, data, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const width = canvas.width;
        const height = canvas.height;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        
        ctx.clearRect(0, 0, width, height);
        
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = color + '40';
        ctx.fill();
    }
    
    function initializePortfolioChart() {
        const ctx = document.getElementById('portfolio-chart').getContext('2d');
        const labels = [];
        const data = [];
        let value = 15000;
        
        for (let i = 0; i < 30; i++) {
            labels.push(`Dita ${i + 1}`);
            value += (Math.random() - 0.45) * 1000;
            data.push(value);
        }
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(41, 196, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(41, 196, 255, 0.05)');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vlera e Portofolit',
                    data: data,
                    borderColor: '#29c4ff',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    function loadCryptoData() {
        const tableBody = document.getElementById('crypto-table-body');
        tableBody.innerHTML = '';
        
        cryptoData.forEach(crypto => {
            const changeClass = crypto.change >= 0 ? 'positive' : 'negative';
            const changeIcon = crypto.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crypto.id}</td>
                <td>
                    <div class="crypto-name">
                        <div class="crypto-icon-small" style="background: ${crypto.color}20; color: ${crypto.color}">
                            <i class="${crypto.icon}"></i>
                        </div>
                        <div>
                            <div>${crypto.name}</div>
                            <div class="crypto-symbol">${crypto.symbol}</div>
                        </div>
                    </div>
                </td>
                <td class="price-cell">$${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><span class="price-change-small ${changeClass}"><i class="${changeIcon}"></i> ${Math.abs(crypto.change).toFixed(2)}%</span></td>
                <td>$${(crypto.marketCap / 1000000000).toFixed(2)}B</td>
                <td>$${(crypto.volume / 1000000).toFixed(2)}M</td>
                <td><div class="mini-chart" id="chart-${crypto.symbol}"></div></td>
                <td>
                    <button class="btn btn-outline add-to-portfolio" data-symbol="${crypto.symbol}" data-name="${crypto.name}">
                        <i class="fas fa-plus"></i> Shto
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
            
            setTimeout(() => {
                createMiniChartForCrypto(crypto);
            }, 100);
        });
        
        document.querySelectorAll('.add-to-portfolio').forEach(btn => {
            btn.addEventListener('click', function() {
                const symbol = this.getAttribute('data-symbol');
                const name = this.getAttribute('data-name');
                showNotification(`${name} (${symbol}) u shtua në portofolin tuaj!`, 'success');
            });
        });
    }
    
    function createMiniChartForCrypto(crypto) {
        const canvasId = `chart-${crypto.symbol}`;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const data = [];
        let value = crypto.price;
        
        for (let i = 0; i < 7; i++) {
            value += (Math.random() - 0.5) * crypto.price * 0.05;
            data.push(value);
        }
        
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 40;
        
        const width = canvas.width;
        const height = canvas.height;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = crypto.change >= 0 ? '#10b981' : '#ef4444';
        
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }
    
    function filterCryptoData(filter) {
        const rows = document.querySelectorAll('#crypto-table-body tr');
        
        rows.forEach(row => {
            const name = row.cells[1].textContent;
            
            if (filter === 'Të Gjitha') {
                row.style.display = '';
            } else if (filter === 'Top 10') {
                const index = parseInt(row.cells[0].textContent);
                row.style.display = index <= 10 ? '' : 'none';
            } else {
                const isMatch = Math.random() > 0.5;
                row.style.display = isMatch ? '' : 'none';
            }
        });
    }
    
    function updateCryptoPrices() {
        const priceCells = document.querySelectorAll('.price-cell');
        const changeCells = document.querySelectorAll('#crypto-table-body td:nth-child(4) span');
        
        priceCells.forEach((cell, index) => {
            const currentPrice = parseFloat(cell.textContent.replace(/[^0-9.-]+/g, ''));
            const change = (Math.random() - 0.5) * 0.1;
            const newPrice = currentPrice * (1 + change);
            
            cell.textContent = '$' + newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            const changeCell = changeCells[index];
            const changePercent = (change * 100).toFixed(2);
            const isPositive = change >= 0;
            
            changeCell.className = `price-change-small ${isPositive ? 'positive' : 'negative'}`;
            changeCell.innerHTML = `<i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i> ${Math.abs(changePercent)}%`;
            
            const symbol = document.querySelectorAll('#crypto-table-body tr')[index].cells[1].querySelector('.crypto-symbol').textContent;
            updateMiniChart(symbol, isPositive);
        });
    }
    
    function updateMiniChart(symbol, isPositive) {
        const canvasId = `chart-${symbol}`;
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const data = [];
        const lastValue = isPositive ? 50 : 30;
        
        for (let i = 0; i < 7; i++) {
            data.push(lastValue + (Math.random() - 0.3) * 20);
        }
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const width = canvas.width;
        const height = canvas.height;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isPositive ? '#10b981' : '#ef4444';
        
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }
    
    function loadNewsData() {
        const newsGrid = document.getElementById('news-grid');
        newsGrid.innerHTML = '';
        
        newsData.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <div class="news-image">
                    <span class="news-category">${news.category}</span>
                </div>
                <div class="news-content">
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-excerpt">${news.excerpt}</p>
                    <div class="news-meta">
                        <span class="news-date"><i class="far fa-clock"></i> ${news.date}</span>
                        <a href="#" class="read-more">Lexo më shumë <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            newsGrid.appendChild(newsCard);
            
            const newsImage = newsCard.querySelector('.news-image');
            const gradients = [
                'linear-gradient(90deg, #29c4ff, #a855f7)',
                'linear-gradient(90deg, #f59e0b, #ef4444)',
                'linear-gradient(90deg, #10b981, #0ea5e9)',
                'linear-gradient(90deg, #8b5cf6, #ec4899)'
            ];
            newsImage.style.background = gradients[Math.floor(Math.random() * gradients.length)];
            
            newsCard.querySelector('.read-more').addEventListener('click', function(e) {
                e.preventDefault();
                showNotification(`Duke hapur lajmin: "${news.title}"`, 'info');
            });
        });
    }
    
    const style = document.createElement('style');
    style.textContent = `
        .light-theme {
            --bg-color: #f8fafc;
            --text-color: #1e293b;
            --card-bg: #ffffff;
            --border-color: #e2e8f0;
            --secondary-text: #64748b;
        }
        
        .light-theme body {
            background: var(--bg-color);
            color: var(--text-color);
        }
        
        .light-theme header {
            background: rgba(255, 255, 255, 0.9);
            border-bottom-color: var(--border-color);
        }
        
        .light-theme .crypto-card,
        .light-theme .portfolio-card,
        .light-theme .portfolio-chart-container,
        .light-theme .news-card,
        .light-theme .feature-card,
        .light-theme .crypto-table-container,
        .light-theme .wallet-card,
        .light-theme .transaction-card,
        .light-theme .trade-form-container,
        .light-theme .info-card {
            background: var(--card-bg);
            border-color: var(--border-color);
        }
        
        .light-theme .nav-link {
            color: var(--secondary-text);
        }
        
        .light-theme .nav-link:hover,
        .light-theme .nav-link.active {
            color: #29c4ff;
        }
        
        .light-theme .hero-subtitle,
        .light-theme .section-header p,
        .light-theme .crypto-symbol,
        .light-theme .news-excerpt,
        .light-theme .feature-card p,
        .light-theme .footer-description,
        .light-theme .detail-label,
        .light-theme .info-item p {
            color: var(--secondary-text);
        }
        
        .light-theme .crypto-table th {
            color: var(--secondary-text);
            border-bottom-color: var(--border-color);
        }
        
        .light-theme .crypto-table td {
            border-bottom-color: var(--border-color);
        }
        
        .light-theme .theme-toggle {
            background: rgba(0, 0, 0, 0.05);
        }
    `;
    document.head.appendChild(style);
});