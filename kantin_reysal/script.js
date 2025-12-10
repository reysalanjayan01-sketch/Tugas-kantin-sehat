// Data produk kantin sehat
const products = [
    {
        id: 1,
        nama: "Aqua",
        jenis: "minuman",
        harga: 4000,
        ukuran: "600 ml",
        stok: 50
    },
    {
        id: 2,
        nama: "Milo UHT",
        jenis: "minuman",
        harga: 6000,
        ukuran: "180 ml",
        stok: 30
    },
    {
        id: 3,
        nama: "Sari Roti Tawar Kupas",
        jenis: "makanan",
        harga: 12000,
        ukuran: "200 g",
        stok: 20
    },
    {
        id: 4,
        nama: "Beng-Beng Wafer",
        jenis: "snack",
        harga: 3500,
        ukuran: "20 g",
        stok: 100
    },
    {
        id: 5,
        nama: "Pop Mie Mini",
        jenis: "makanan",
        harga: 7000,
        ukuran: "75 g",
        stok: 40
    }
    
];

// Fungsi untuk login
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Validasi sederhana
            if (username === 'admin' && password === 'admin') {
                // Simpan status login di localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // Redirect ke halaman menu
                window.location.href = 'menu.html';
            } else {
                alert('Login gagal! Username atau password salah.\n\nGunakan:\nUsername: admin\nPassword: admin');
            }
        });
    }
}

// Fungsi untuk logout
function setupLogout() {
    const logoutBtns = document.querySelectorAll('#logoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hapus status login
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            
            // Redirect ke halaman login
            window.location.href = 'index.html';
        });
    });
}

// Fungsi untuk memuat produk di halaman menu
function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Tentukan warna berdasarkan jenis produk
        let typeClass = '';
        let typeText = '';
        switch(product.jenis) {
            case 'minuman':
                typeClass = 'minuman';
                typeText = 'Minuman';
                break;
            case 'makanan':
                typeClass = 'makanan';
                typeText = 'Makanan';
                break;
            case 'snack':
                typeClass = 'snack';
                typeText = 'Snack';
                break;
        }
        
        productCard.innerHTML = `
            <div class="product-header">
                <div class="product-name">${product.nama}</div>
                <div class="product-type ${typeClass}">${typeText}</div>
            </div>
            <div class="product-price">Rp ${product.harga.toLocaleString('id-ID')}</div>
            <div class="product-details">
                <p><i class="fas fa-weight"></i> Ukuran: ${product.ukuran}</p>
                <p><i class="fas fa-box"></i> Stok: ${product.stok}</p>
            </div>
            <button class="btn-select" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Pilih Produk
            </button>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Tambahkan event listener untuk tombol pilih
    document.querySelectorAll('.btn-select').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToSelected(productId);
            this.innerHTML = '<i class="fas fa-check"></i> Dipilih';
            this.classList.add('selected');
            
            // Reset tombol setelah 1.5 detik
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus"></i> Pilih Produk';
                this.classList.remove('selected');
            }, 1500);
        });
    });
}

// Fungsi untuk menambahkan produk ke daftar terpilih
function addToSelected(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Ambil daftar produk terpilih dari localStorage atau buat array baru
    let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    
    // Cek apakah produk sudah ada di daftar
    const existingIndex = selectedProducts.findIndex(p => p.id === productId);
    
    if (existingIndex !== -1) {
        // Jika sudah ada, tambahkan jumlahnya
        selectedProducts[existingIndex].qty += 1;
    } else {
        // Jika belum ada, tambahkan produk baru
        selectedProducts.push({
            ...product,
            qty: 1
        });
    }
    
    // Simpan ke localStorage
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    
    // Perbarui tampilan daftar terpilih
    updateSelectedProductsDisplay();
}

// Fungsi untuk memperbarui tampilan daftar produk terpilih
function updateSelectedProductsDisplay() {
    const selectedContainer = document.getElementById('selectedProducts');
    if (!selectedContainer) return;
    
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    
    if (selectedProducts.length === 0) {
        selectedContainer.innerHTML = '<p class="empty-message">Belum ada produk terpilih</p>';
        return;
    }
    
    let html = '';
    selectedProducts.forEach(product => {
        const subtotal = product.harga * product.qty;
        
        html += `
            <div class="selected-item" data-id="${product.id}">
                <div class="selected-item-info">
                    <h4>${product.nama}</h4>
                    <p>Rp ${product.harga.toLocaleString('id-ID')} | ${product.ukuran}</p>
                </div>
                <div class="selected-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" data-id="${product.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${product.qty}</span>
                        <button class="quantity-btn increase" data-id="${product.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn-remove" data-id="${product.id}">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
    });
    
    selectedContainer.innerHTML = html;
    
    // Tambahkan event listener untuk tombol kuantitas dan hapus
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            updateQuantity(parseInt(this.getAttribute('data-id')), -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            updateQuantity(parseInt(this.getAttribute('data-id')), 1);
        });
    });
    
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            removeProduct(parseInt(this.getAttribute('data-id')));
        });
    });
}

// Fungsi untuk mengupdate kuantitas produk
function updateQuantity(productId, change) {
    let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    const productIndex = selectedProducts.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        selectedProducts[productIndex].qty += change;
        
        // Jika kuantitas <= 0, hapus produk
        if (selectedProducts[productIndex].qty <= 0) {
            selectedProducts.splice(productIndex, 1);
        }
        
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
        updateSelectedProductsDisplay();
    }
}

// Fungsi untuk menghapus produk
function removeProduct(productId) {
    let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    selectedProducts = selectedProducts.filter(p => p.id !== productId);
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    updateSelectedProductsDisplay();
}

// Fungsi untuk menghapus semua produk terpilih
function setupClearSelection() {
    const clearBtn = document.getElementById('clearSelection');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin menghapus semua produk terpilih?')) {
                localStorage.removeItem('selectedProducts');
                updateSelectedProductsDisplay();
            }
        });
    }
}

// Fungsi untuk navigasi ke halaman transaksi
function setupGoToTransaction() {
    const goToTransactionBtn = document.getElementById('goToTransaction');
    if (goToTransactionBtn) {
        goToTransactionBtn.addEventListener('click', function() {
            const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
            
            if (selectedProducts.length === 0) {
                alert('Pilih minimal 1 produk sebelum melanjutkan ke transaksi!');
                return;
            }
            
            window.location.href = 'transaksi.html';
        });
    }
}

// Fungsi untuk memuat item di halaman transaksi
function loadTransactionItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (!cartItemsContainer) return;
    
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    
    if (selectedProducts.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message">Tidak ada produk dalam keranjang. Silakan pilih produk terlebih dahulu.</p>';
        updateTransactionSummary();
        return;
    }
    
    let html = '';
    selectedProducts.forEach(product => {
        const total = product.harga * product.qty;
        
        html += `
            <div class="cart-item" data-id="${product.id}">
                <div class="cart-item-name">
                    <h4>${product.nama}</h4>
                    <p>${product.ukuran} • Rp ${product.harga.toLocaleString('id-ID')}/item</p>
                </div>
                <div class="cart-item-qty">
                    <input type="number" min="1" max="100" value="${product.qty}" 
                           data-id="${product.id}" class="qty-input">
                </div>
                <div class="cart-item-price">
                    Rp ${product.harga.toLocaleString('id-ID')}
                </div>
                <div class="cart-item-total">
                    Rp ${total.toLocaleString('id-ID')}
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    
    // Tambahkan event listener untuk input kuantitas
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            updateCartQuantity(parseInt(this.getAttribute('data-id')), parseInt(this.value));
        });
        
        input.addEventListener('input', function() {
            updateCartQuantity(parseInt(this.getAttribute('data-id')), parseInt(this.value) || 1);
        });
    });
    
    updateTransactionSummary();
}

// Fungsi untuk mengupdate kuantitas di keranjang
function updateCartQuantity(productId, newQty) {
    if (newQty < 1) newQty = 1;
    if (newQty > 100) newQty = 100;
    
    let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    const productIndex = selectedProducts.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        selectedProducts[productIndex].qty = newQty;
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
        updateTransactionSummary();
    }
}

// Fungsi untuk memperbarui ringkasan transaksi
function updateTransactionSummary() {
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    
    let subtotal = 0;
    let totalItems = 0;
    
    selectedProducts.forEach(product => {
        subtotal += product.harga * product.qty;
        totalItems += product.qty;
    });
    
    // Update tampilan
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('totalItems').textContent = `${totalItems} item`;
    document.getElementById('totalPayment').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    
    // Perbarui juga item keranjang jika ada
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        const productId = parseInt(item.getAttribute('data-id'));
        const product = selectedProducts.find(p => p.id === productId);
        
        if (product) {
            const total = product.harga * product.qty;
            item.querySelector('.cart-item-total').textContent = `Rp ${total.toLocaleString('id-ID')}`;
            item.querySelector('.qty-input').value = product.qty;
        }
    });
}

// Fungsi untuk setup tanggal transaksi
function setupTransactionDate() {
    const dateElement = document.getElementById('transactionDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateElement.textContent = now.toLocaleDateString('id-ID', options);
    }
}

// Fungsi untuk menyimpan transaksi
function setupSaveTransaction() {
    const saveBtn = document.getElementById('saveTransaction');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
            
            if (selectedProducts.length === 0) {
                alert('Tidak ada produk dalam transaksi!');
                return;
            }
            
            // Hitung total
            let total = 0;
            selectedProducts.forEach(product => {
                total += product.harga * product.qty;
            });
            
            // Ambil metode pembayaran
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            // Buat objek transaksi
            const transaction = {
                id: `TRX-${Date.now().toString().slice(-6)}`,
                date: new Date().toLocaleString('id-ID'),
                items: selectedProducts,
                total: total,
                payment: paymentMethod
            };
            
            // Simpan transaksi ke localStorage
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            
            // Simpan transaksi terakhir untuk struk
            localStorage.setItem('lastTransaction', JSON.stringify(transaction));
            
            alert(`Transaksi berhasil disimpan!\n\nNo. Transaksi: ${transaction.id}\nTotal: Rp ${total.toLocaleString('id-ID')}\n\nKlik "Cetak Struk" untuk mencetak struk pembayaran.`);
            
            // Kosongkan keranjang setelah transaksi disimpan
            localStorage.removeItem('selectedProducts');
        });
    }
}

// Fungsi untuk setup cetak struk
function setupPrintReceipt() {
    const printBtn = document.getElementById('printReceipt');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
            
            if (selectedProducts.length === 0) {
                alert('Tidak ada produk dalam transaksi! Silakan simpan transaksi terlebih dahulu.');
                return;
            }
            
            // Simpan transaksi terakhir jika belum disimpan
            if (!localStorage.getItem('lastTransaction')) {
                let total = 0;
                selectedProducts.forEach(product => {
                    total += product.harga * product.qty;
                });
                
                const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                
                const transaction = {
                    id: `TRX-${Date.now().toString().slice(-6)}`,
                    date: new Date().toLocaleString('id-ID'),
                    items: selectedProducts,
                    total: total,
                    payment: paymentMethod
                };
                
                localStorage.setItem('lastTransaction', JSON.stringify(transaction));
            }
            
            // Redirect ke halaman struk
            window.location.href = 'struk.html';
        });
    }
}

// Fungsi untuk setup tombol kembali
function setupBackButtons() {
    // Kembali ke menu dari transaksi
    const backToMenuBtn = document.getElementById('backToMenu');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', function() {
            window.location.href = 'menu.html';
        });
    }
}

// Fungsi untuk cek login status
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Jika tidak login dan mencoba akses halaman selain login
    if (!isLoggedIn && currentPage !== 'index.html') {
        window.location.href = 'index.html';
        return;
    }
    
    // Jika sudah login dan mencoba akses halaman login
    if (isLoggedIn && currentPage === 'index.html') {
        window.location.href = 'menu.html';
        return;
    }
}

// Fungsi utama untuk inisialisasi aplikasi
function initApp() {
    // Cek status login
    checkLogin();
    
    // Setup login
    setupLogin();
    
    // Setup logout
    setupLogout();
    
    // Setup halaman menu
    if (window.location.pathname.includes('menu.html')) {
        loadProducts();
        updateSelectedProductsDisplay();
        setupClearSelection();
        setupGoToTransaction();
    }
    
    // Setup halaman transaksi
    if (window.location.pathname.includes('transaksi.html')) {
        loadTransactionItems();
        setupTransactionDate();
        setupSaveTransaction();
        setupPrintReceipt();
        setupBackButtons();
    }
}

// Jalankan aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', initApp);