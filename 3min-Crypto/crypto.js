document.addEventListener('DOMContentLoaded', function() {
 
    const DEFAULT_DATA = {
        walletBalance: 5250.75,
        freeBalance: 3150.45,
        investedBalance: 2100.30,
        totalProfit: 450.25,
        cryptoBalances: {
            'BTC': 0.015,
            'ETH': 1.5,
            'ADA': 1000,
            'BNB': 5,
            'SOL': 25
        },
        transactions: [
            { 
                id: 1, 
                type: 'buy', 
                crypto: 'BTC', 
                amount: 0.005, 
                price: 42000, 
                total: 210, 
                date: '2023-12-05 14:30', 
                status: 'completed' 
            },
            { 
                id: 2, 
                type: 'sell', 
                crypto: 'ETH', 
                amount: 0.5, 
                price: 2300, 
                total: 1150, 
                date: '2023-12-04 11:15', 
                status: 'completed' 
            },
            { 
                id: 3, 
                type: 'deposit', 
                amount: 1000, 
                method: 'card', 
                date: '2023-12-03 09:45', 
                status: 'completed' 
            },
            { 
                id: 4, 
                type: 'withdraw', 
                amount: 500, 
                method: 'bank', 
                date: '2023-12-02 16:20', 
                status: 'completed' 
            },
            { 
                id: 5, 
                type: 'buy', 
                crypto: 'ADA', 
                amount: 500, 
                price: 0.45, 
                total: 225, 
                date: '2023-12-01 13:10', 
                status: 'completed' 
            }
        ],
        portfolioValue: 18542.36,
        lastUpdated: new Date().toISOString()
    };

   
    function initStorage() {
        if (!localStorage.getItem('pogaFinanceData')) {
            console.log('Inicializimi i localStorage me të dhënat fillestare...');
            localStorage.setItem('pogaFinanceData', JSON.stringify(DEFAULT_DATA));
            localStorage.setItem('pogaTheme', 'dark');
            localStorage.setItem('pogaFirstVisit', new Date().toISOString());
            localStorage.setItem('pogaVersion', '1.0.0');
            showNotification('Sistemi u inicializua me të dhënat fillestare!', 'success');
        }
        
        
        updateStorageInfo();
    }

    function loadFromStorage() {
        const data = JSON.parse(localStorage.getItem('pogaFinanceData'));
        if (!data) {
            initStorage();
            return DEFAULT_DATA;
        }
        return data;
    }

    function saveToStorage(data) {
        try {
            localStorage.setItem('pogaFinanceData', JSON.stringify(data));
            localStorage.setItem('pogaLastUpdate', new Date().toISOString());
            updateStorageInfo();
            return true;
        } catch (error) {
            console.error('Gabim gjatë ruajtjes në localStorage:', error);
            showNotification('Gabim gjatë ruajtjes së të dhënave!', 'error');
            return false;
        }
    }

    function updateStorageInfo() {
        const storageInfo = document.getElementById('storage-info');
        const storageStatus = document.getElementById('storage-status');
        
        if (storageInfo) {
            const data = loadFromStorage();
            const transactionCount = data.transactions.length;
            const cryptoCount = Object.keys(data.cryptoBalances).length;
            storageInfo.textContent = `${transactionCount} transaksione, ${cryptoCount} kriptomonedha`;
        }
        
        if (storageStatus) {
            storageStatus.textContent = localStorage.getItem('pogaFinanceData') ? '100%' : '0%';
        }
    }

    function getStoredTheme() {
        return localStorage.getItem('pogaTheme') || 'dark';
    }

    function saveTheme(theme) {
        localStorage.setItem('pogaTheme', theme);
    }

    function addTransaction(transaction) {
        const data = loadFromStorage();
        
        
        const maxId = data.transactions.length > 0 
            ? Math.max(...data.transactions.map(t => t.id)) 
            : 0;
        
        transaction.id = maxId + 1;
        transaction.date = new Date().toLocaleString('sq-AL');
        transaction.status = 'completed';
        
        data.transactions.unshift(transaction);
        
        
        if (data.transactions.length > 100) {
            data.transactions = data.transactions.slice(0, 100);
        }
        
        data.lastUpdated = new Date().toISOString();
        
        saveToStorage(data);
        return transaction;
    }

    function updateCryptoBalance(symbol, amount, operation = 'add') {
        const data = loadFromStorage();
        
        if (!data.cryptoBalances[symbol]) {
            data.cryptoBalances[symbol] = 0;
        }
        
        if (operation === 'add') {
            data.cryptoBalances[symbol] += amount;
        } else if (operation === 'subtract') {
            data.cryptoBalances[symbol] = Math.max(0, data.cryptoBalances[symbol] - amount);
        }
        
        saveToStorage(data);
        return data.cryptoBalances[symbol];
    }

    function updateWalletBalances(type, amount, cryptoAmount = 0, cryptoPrice = 0) {
        const data = loadFromStorage();
        
        switch(type) {
            case 'deposit':
                data.walletBalance += amount;
                data.freeBalance += amount;
                break;
                
            case 'withdraw':
                data.walletBalance -= amount;
                data.freeBalance -= amount;
                break;
                
            case 'buy':
                data.walletBalance -= amount;
                data.freeBalance -= amount;
                data.investedBalance += amount;
                
                const buyProfit = (cryptoPrice * cryptoAmount * 0.01); // 1% fitim
                data.totalProfit += buyProfit;
                break;
                
            case 'sell':
                const sellAmount = amount;
                data.walletBalance += sellAmount;
                data.freeBalance += sellAmount;
                data.investedBalance -= (cryptoPrice * cryptoAmount);
               
                const sellProfit = sellAmount * 0.02; // 2% fitim
                data.totalProfit += sellProfit;
                break;
        }
        
       
        data.walletBalance = Math.max(0, data.walletBalance);
        data.freeBalance = Math.max(0, data.freeBalance);
        data.investedBalance = Math.max(0, data.investedBalance);
        
        data.lastUpdated = new Date().toISOString();
        saveToStorage(data);
        
        return data;
    }

    function resetToDefaults() {
        if (confirm('A jeni i sigurt që dëshironi të rivendosni të gjitha të dhënat? Kjo veprim nuk mund të zhbëhet!')) {
            localStorage.removeItem('pogaFinanceData');
            localStorage.removeItem('pogaTheme');
            localStorage.removeItem('pogaFirstVisit');
            localStorage.removeItem('pogaLastUpdate');
            
            initStorage();
            location.reload();
        }
    }

    function exportData(format = 'json') {
        const data = loadFromStorage();
        let exportContent;
        
        switch(format) {
            case 'json':
                exportContent = JSON.stringify(data, null, 2);
                break;
            case 'csv':
                
                const headers = ['ID', 'Type', 'Crypto', 'Amount', 'Price', 'Total', 'Date'];
                const rows = data.transactions.map(t => [
                    t.id,
                    t.type,
                    t.crypto || '',
                    t.amount,
                    t.price || '',
                    t.total || t.amount,
                    t.date
                ]);
                
                exportContent = [
                    headers.join(','),
                    ...rows.map(row => row.join(','))
                ].join('\n');
                break;
            case 'txt':
                exportContent = `Poga Finance Data Export\n`;
                exportContent += `Generated: ${new Date().toLocaleString()}\n\n`;
                exportContent += `Wallet Balance: $${data.walletBalance.toFixed(2)}\n`;
                exportContent += `Free Balance: $${data.freeBalance.toFixed(2)}\n`;
                exportContent += `Invested Balance: $${data.investedBalance.toFixed(2)}\n`;
                exportContent += `Total Profit: $${data.totalProfit.toFixed(2)}\n\n`;
                exportContent += `Cryptocurrency Balances:\n`;
                Object.entries(data.cryptoBalances).forEach(([crypto, balance]) => {
                    exportContent += `  ${crypto}: ${balance}\n`;
                });
                exportContent += `\nTransactions: ${data.transactions.length}\n`;
                break;
        }
        
        return exportContent;
    }

    function downloadData(filename, content, type = 'application/json') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    
    
    initStorage();
    
    
    const storedData = loadFromStorage();
    
   
    let walletBalance = storedData.walletBalance;
    let freeBalance = storedData.freeBalance;
    let investedBalance = storedData.investedBalance;
    let totalProfit = storedData.totalProfit;
    let cryptoBalances = storedData.cryptoBalances;
    let transactions = storedData.transactions;
    let portfolioValue = storedData.portfolioValue || 18542.36;

    
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

    
    
    function refreshData() {
        const data = loadFromStorage();
        walletBalance = data.walletBalance;
        freeBalance = data.freeBalance;
        investedBalance = data.investedBalance;
        totalProfit = data.totalProfit;
        cryptoBalances = data.cryptoBalances;
        transactions = data.transactions;
        
        updateWalletDisplay();
        loadTransactions();
        updateStorageInfo();
    }

    
    
    
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    
    const currentTheme = getStoredTheme();
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            themeIcon.className = 'fas fa-sun';
            saveTheme('light');
        } else {
            themeIcon.className = 'fas fa-moon';
            saveTheme('dark');
        }
    });
    
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });
    
    
    const resetDataBtn = document.getElementById('reset-data-btn');
    const exportDataBtn = document.getElementById('export-data-btn');
    
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', resetToDefaults);
    }
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            const exportModal = document.getElementById('export-modal');
            const exportDataTextarea = document.getElementById('export-data');
            const exportFormat = document.getElementById('export-format');
            
            const data = exportData(exportFormat.value);
            exportDataTextarea.value = data;
            exportModal.classList.add('active');
        });
    }
    
    
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
    
    
    const startNowBtn = document.getElementById('start-now-btn');
    const watchVideoBtn = document.getElementById('watch-video-btn');
    
    if (startNowBtn) {
        startNowBtn.addEventListener('click', function() {
            showNotification('Mirë se vini në Poga Finance! Të dhënat tuaja ruhen në localStorage.', 'success');
        });
    }
    
    if (watchVideoBtn) {
        watchVideoBtn.addEventListener('click', function() {
            showNotification('Video tutorial do të hapet së shpejti!', 'info');
        });
    }
    
    
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
        
        
        const transaction = {
            type: 'buy',
            crypto: selectedCrypto,
            cryptoName: cryptoData.find(c => c.symbol === selectedCrypto)?.name || selectedCrypto,
            amount: amount,
            price: price,
            total: parseFloat(totalValue),
            status: 'completed'
        };
        
        
        addTransaction(transaction);
        updateCryptoBalance(selectedCrypto, amount, 'add');
        updateWalletBalances('buy', parseFloat(totalValue), amount, price);
        
        
        refreshData();
        
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
    
    // Wallet dhe transaksione
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
    
    
    const exportModal = document.getElementById('export-modal');
    const exportClose = document.querySelector('.export-close');
    const copyDataBtn = document.getElementById('copy-data-btn');
    const downloadDataBtn = document.getElementById('download-data-btn');
    
    
    depositBtn.addEventListener('click', function() {
        depositModal.classList.add('active');
    });
    
    withdrawBtn.addEventListener('click', function() {
        withdrawModal.classList.add('active');
        withdrawAmount.max = freeBalance;
        document.querySelector('.balance-display').textContent = `$${freeBalance.toFixed(2)}`;
    });
    
    viewAllBtn.addEventListener('click', function() {
        loadTransactions(transactions); 
        showNotification(`Duke shfaqur të gjitha ${transactions.length} transaksionet...`, 'info');
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
        
        
        const transaction = {
            type: 'deposit',
            amount: amount,
            method: method,
            status: 'completed'
        };
        
        
        addTransaction(transaction);
        updateWalletBalances('deposit', amount);
        
        
        refreshData();
        
        depositModal.classList.remove('active');
        depositAmount.value = '';
        showNotification(`Depozituat me sukses $${amount.toFixed(2)} në wallet!`, 'success');
    });
    
    withdrawConfirm.addEventListener('click', function() {
        const amount = parseFloat(withdrawAmount.value);
        const fee = 1.50;
        const total = amount - fee;
        
        if (!amount || amount < 20 || amount > freeBalance) {
            showNotification('Ju lutem shkruani një shumë valid (minimumi $20)!', 'error');
            return;
        }
        
        if (amount > freeBalance) {
            showNotification('Nuk keni balancë të mjaftueshme!', 'error');
            return;
        }
        
        
        const transaction = {
            type: 'withdraw',
            amount: amount,
            method: bankAccount.value,
            fee: fee,
            total: total,
            status: 'completed'
        };
        
        
        addTransaction(transaction);
        updateWalletBalances('withdraw', amount);
        
        
        refreshData();
        
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
        
        if (!isBuy && amount > (cryptoBalances[crypto] || 0)) {
            showNotification(`Nuk keni ${crypto} të mjaftueshme për shitje!`, 'error');
            return;
        }
        
        if (isBuy) {
            
            const transaction = {
                type: 'buy',
                crypto: crypto,
                cryptoName: cryptoName,
                amount: amount,
                price: price,
                total: total,
                fee: fee,
                status: 'completed'
            };
            
            
            addTransaction(transaction);
            updateCryptoBalance(crypto, amount, 'add');
            updateWalletBalances('buy', totalCostValue, amount, price);
            
            showNotification(`Blerje e suksesshme! Blenët ${amount} ${crypto} për $${total.toFixed(2)}`, 'success');
        } else {
            const sellValue = total - fee;
            
            
            const transaction = {
                type: 'sell',
                crypto: crypto,
                cryptoName: cryptoName,
                amount: amount,
                price: price,
                total: total,
                fee: fee,
                net: sellValue,
                status: 'completed'
            };
            
            
            addTransaction(transaction);
            updateCryptoBalance(crypto, amount, 'subtract');
            updateWalletBalances('sell', sellValue, amount, price);
            
            showNotification(`Shitje e suksesshme! Shitët ${amount} ${crypto} për $${sellValue.toFixed(2)}`, 'success');
        }
        
        
        refreshData();
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
    
    
    if (exportClose) {
        exportClose.addEventListener('click', function() {
            exportModal.classList.remove('active');
        });
    }
    
    if (copyDataBtn) {
        copyDataBtn.addEventListener('click', function() {
            const exportDataTextarea = document.getElementById('export-data');
            exportDataTextarea.select();
            document.execCommand('copy');
            showNotification('Të dhënat u kopjuan në clipboard!', 'success');
        });
    }
    
    if (downloadDataBtn) {
        downloadDataBtn.addEventListener('click', function() {
            const exportDataTextarea = document.getElementById('export-data');
            const exportFormat = document.getElementById('export-format');
            const format = exportFormat.value;
            const filename = `poga_finance_data_${new Date().toISOString().split('T')[0]}.${format}`;
            const type = format === 'json' ? 'application/json' : 
                        format === 'csv' ? 'text/csv' : 'text/plain';
            
            downloadData(filename, exportDataTextarea.value, type);
            showNotification(`Të dhënat u shkarkuan si ${filename}`, 'success');
        });
    }
    
    exportModal.addEventListener('click', function(e) {
        if (e.target === exportModal) {
            exportModal.classList.remove('active');
        }
    });
    
    
    setInterval(() => {
        updateCryptoPrices();
        showNotification('Çmimet e kriptomonedhave u përditësuan automatikisht!', 'info');
    }, 30000); 
    
   
    
    function initializeWallet() {
        updateWalletDisplay();
        loadTransactions();
        updateStorageInfo();
        
        
        document.getElementById('crypto-count').textContent = Object.keys(cryptoBalances).length;
    }
    
    function updateWalletDisplay() {
        document.querySelector('.balance-amount').textContent = `$${walletBalance.toFixed(2)}`;
        
        
        const changePercent = ((totalProfit / (walletBalance - totalProfit)) * 100).toFixed(1);
        const changeSign = totalProfit >= 0 ? '+' : '';
        document.querySelector('.balance-change').textContent = `${changeSign}$${totalProfit.toFixed(2)} (${changeSign}${changePercent}%)`;
        document.querySelector('.balance-change').className = `balance-change ${totalProfit >= 0 ? 'positive' : 'negative'}`;
        
        
        document.getElementById('free-balance').textContent = `$${freeBalance.toFixed(2)}`;
        document.getElementById('invested-balance').textContent = `$${investedBalance.toFixed(2)}`;
        document.getElementById('total-profit').textContent = `$${totalProfit.toFixed(2)}`;
        
        
        updatePortfolioValue();
    }
    
    function updatePortfolioValue() {
        
        let totalPortfolioValue = 0;
        
        Object.keys(cryptoBalances).forEach(symbol => {
            const crypto = cryptoData.find(c => c.symbol === symbol);
            if (crypto) {
                totalPortfolioValue += cryptoBalances[symbol] * crypto.price;
            }
        });
        
        
        totalPortfolioValue += freeBalance;
        portfolioValue = totalPortfolioValue;
        
        
        const portfolioValueEl = document.querySelector('.portfolio-value');
        if (portfolioValueEl) {
            portfolioValueEl.textContent = `$${portfolioValue.toFixed(2)}`;
        }
    }
    
    function loadTransactions(transactionList = null) {
        const transactionsList = document.getElementById('transactions-list');
        if (!transactionsList) return;
        
        transactionsList.innerHTML = '';
        
        const transactionsToShow = transactionList || transactions.slice(0, 5);
        
        if (transactionsToShow.length === 0) {
            transactionsList.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-history"></i>
                    <p>Nuk ka transaksione të regjistruara</p>
                </div>
            `;
            return;
        }
        
        transactionsToShow.forEach(transaction => {
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
                    title = `Blerje ${transaction.crypto || ''}`;
                    amountClass = 'negative';
                    amountText = `-$${(transaction.total || transaction.amount).toFixed(2)}`;
                    break;
                case 'sell':
                    iconClass = 'sell';
                    icon = 'fas fa-cash-register';
                    title = `Shitje ${transaction.crypto || ''}`;
                    amountClass = 'positive';
                    amountText = `+$${(transaction.net || transaction.total || 0).toFixed(2)}`;
                    break;
                default:
                    iconClass = 'deposit';
                    icon = 'fas fa-exchange-alt';
                    title = `Transaksion`;
                    amountClass = 'positive';
                    amountText = `+$${transaction.amount?.toFixed(2) || '0.00'}`;
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
        const isBuy = document.querySelector('.trade-tab.active')?.getAttribute('data-type') === 'buy';
        
        if (currentPriceEl) currentPriceEl.textContent = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (totalValueEl) totalValueEl.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (tradeFeeEl) tradeFeeEl.textContent = `$${fee.toFixed(2)} (0.1%)`;
        
        if (isBuy) {
            if (totalCostEl) totalCostEl.textContent = `$${(total + fee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            if (totalReceiveEl) totalReceiveEl.textContent = `${amount.toFixed(8)} ${crypto}`;
            if (executeTradeBtn) {
                executeTradeBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Ekzekuto Blerjen';
                executeTradeBtn.style.background = 'linear-gradient(90deg, #10b981, #0ea5e9)';
            }
        } else {
            if (totalCostEl) totalCostEl.textContent = `${amount.toFixed(8)} ${crypto}`;
            if (totalReceiveEl) totalReceiveEl.textContent = `$${(total - fee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            if (executeTradeBtn) {
                executeTradeBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Ekzekuto Shitjen';
                executeTradeBtn.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
            }
        }
    }
    
    function getCurrentCryptoPrice(symbol) {
        const crypto = cryptoData.find(c => c.symbol === symbol);
        return crypto ? crypto.price : 0;
    }
    
    function getMaxTradeAmount() {
        const isBuy = document.querySelector('.trade-tab.active')?.getAttribute('data-type') === 'buy';
        const crypto = tradeCrypto.value;
        const price = getCurrentCryptoPrice(crypto);
        
        if (isBuy) {
            return freeBalance / (price * 1.001);
        } else {
            return cryptoBalances[crypto] || 0;
        }
    }
    
    
    
    let notificationTimeout;
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('i');
        const text = document.getElementById('notification-text');
        
        if (!notification || !text) return;
        
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
    
    
    
    function initializeCharts() {
        createMiniChart('btc-chart', [42000, 42500, 42300, 42400, 42200, 42567], '#f7931a');
        createMiniChart('eth-chart', [2300, 2320, 2310, 2330, 2340, 2345], '#627eea');
        initializePortfolioChart();
    }
    
    function createMiniChart(canvasId, data, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const width = canvas.width;
        const height = canvas.height;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        
        
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
        const canvas = document.getElementById('portfolio-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        
        const labels = [];
        const data = [];
        let value = portfolioValue * 0.8; 
        
        for (let i = 0; i < 30; i++) {
            labels.push(`Dita ${i + 1}`);
            value += (Math.random() - 0.45) * portfolioValue * 0.05;
            data.push(value);
        }
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(41, 196, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(41, 196, 255, 0.05)');
        
        
        if (window.portfolioChart) {
            window.portfolioChart.destroy();
        }
        
        window.portfolioChart = new Chart(ctx, {
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
    
    function updatePortfolioChart(period) {
        showNotification(`Grafiku i portofolit u përditësua për periudhën: ${period}`, 'info');
        
        
        if (window.portfolioChart) {
            window.portfolioChart.update();
        }
    }
    
    
    
    function loadCryptoData() {
        const tableBody = document.getElementById('crypto-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        cryptoData.forEach(crypto => {
            const changeClass = crypto.change >= 0 ? 'positive' : 'negative';
            const changeIcon = crypto.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
            const userBalance = cryptoBalances[crypto.symbol] || 0;
            const balanceValue = userBalance * crypto.price;
            
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
                            ${userBalance > 0 ? `<div class="user-balance-small">Ju keni: ${userBalance.toFixed(4)}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td class="price-cell">$${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><span class="price-change-small ${changeClass}"><i class="${changeIcon}"></i> ${Math.abs(crypto.change).toFixed(2)}%</span></td>
                <td>$${(crypto.marketCap / 1000000000).toFixed(2)}B</td>
                <td>$${(crypto.volume / 1000000).toFixed(2)}M</td>
                <td><div class="mini-chart"><canvas id="chart-${crypto.symbol}"></canvas></div></td>
                <td>
                    <button class="btn btn-outline add-to-portfolio" data-symbol="${crypto.symbol}" data-name="${crypto.name}">
                        <i class="fas fa-plus"></i> ${userBalance > 0 ? 'Shto' : 'Blej'}
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
                const crypto = cryptoData.find(c => c.symbol === symbol);
                
                if (crypto) {
                    
                    const amountToAdd = 0.001;
                    
                    
                    const transaction = {
                        type: 'buy',
                        crypto: symbol,
                        cryptoName: name,
                        amount: amountToAdd,
                        price: crypto.price,
                        total: amountToAdd * crypto.price,
                        status: 'completed'
                    };
                    
                    
                    addTransaction(transaction);
                    updateCryptoBalance(symbol, amountToAdd, 'add');
                    updateWalletBalances('buy', amountToAdd * crypto.price, amountToAdd, crypto.price);
                    
                    
                    refreshData();
                    
                    showNotification(`Bleni ${amountToAdd} ${symbol} (${name}) për $${(amountToAdd * crypto.price).toFixed(2)}`, 'success');
                }
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
        const range = max - min || 1;
        
        
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
            const symbol = row.cells[1].querySelector('.crypto-symbol')?.textContent;
            
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
        
        cryptoData.forEach(crypto => {
            const change = (Math.random() - 0.5) * 0.1; 
            crypto.price *= (1 + change);
            crypto.change = change * 100;
        });
        
        
        loadCryptoData();
        
       
        createMiniChart('btc-chart', 
            [cryptoData[0].price * 0.95, cryptoData[0].price * 0.97, cryptoData[0].price * 0.98, 
             cryptoData[0].price * 0.99, cryptoData[0].price, cryptoData[0].price * 1.01], 
            '#f7931a');
        createMiniChart('eth-chart', 
            [cryptoData[1].price * 0.96, cryptoData[1].price * 0.97, cryptoData[1].price * 0.98,
             cryptoData[1].price * 0.99, cryptoData[1].price, cryptoData[1].price * 1.02], 
            '#627eea');
        
        
        updatePortfolioValue();
        updateWalletDisplay();
    }
    
    
    
    function loadNewsData() {
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;
        
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
    
    
    
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        
        container.innerHTML = '';
        
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 4 + 1 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = 'rgba(41, 196, 255, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.position = 'absolute';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.zIndex = '-1';
            
            
            particle.animate(
                [
                    { transform: 'translateY(0px) translateX(0px)' },
                    { transform: `translateY(${Math.random() * 100 - 50}px) translateX(${Math.random() * 100 - 50}px)` }
                ],
                {
                    duration: Math.random() * 5000 + 3000,
                    iterations: Infinity,
                    direction: 'alternate',
                    easing: 'ease-in-out'
                }
            );
            
            container.appendChild(particle);
        }
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
        
        .user-balance-small {
            font-size: 11px;
            color: #29c4ff;
            margin-top: 2px;
        }
        
        .no-transactions {
            text-align: center;
            padding: 40px 20px;
            color: #94a3b8;
        }
        
        .no-transactions i {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        .no-transactions p {
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
    
   
    
    
    createParticles();
    initializeCharts();
    loadCryptoData();
    loadNewsData();
    initializeWallet();
    initializeTrade();
    
    
    setTimeout(() => {
        showNotification('Mirë se vini në Poga Finance! Të dhënat tuaja ruhen lokalmente në shfletues.', 'success');
    }, 1000);
    
    
    setInterval(updateStorageInfo, 5000);
});
