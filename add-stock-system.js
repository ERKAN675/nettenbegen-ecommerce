// Stok Durumu Sistemi - Tüm Kategori Sayfaları İçin
// Bu script tüm kategori sayfalarına uygulanacak

// CSS stillerini ekle
const stockCSS = `
/* Stok Durumu Badge'leri */
.stock-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.stock-badge.in-stock {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.stock-badge.low-stock {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
}

.stock-badge.out-of-stock {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
}

.stock-badge i {
    font-size: 10px;
}

/* Disabled button styles */
.btn-primary:disabled { 
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%); 
    cursor: not-allowed; 
    opacity: 0.6;
}

.btn-primary:disabled:hover { 
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    transform: none;
}

/* Responsive */
@media (max-width: 768px) {
    .stock-badge {
        font-size: 10px;
        padding: 4px 8px;
    }
    
    .stock-badge i {
        font-size: 8px;
    }
}
`;

// CSS'i sayfaya ekle
function addStockCSS() {
    if (!document.getElementById('stock-system-css')) {
        const style = document.createElement('style');
        style.id = 'stock-system-css';
        style.textContent = stockCSS;
        document.head.appendChild(style);
    }
}

// Stok durumu badge'i oluştur
function createStockBadge(stock) {
    if (stock > 10) {
        return `<div class="stock-badge in-stock">
            <i class="fas fa-check-circle"></i>
            Stokta
        </div>`;
    } else if (stock > 0) {
        return `<div class="stock-badge low-stock">
            <i class="fas fa-exclamation-triangle"></i>
            Son ${stock} Adet
        </div>`;
    } else {
        return `<div class="stock-badge out-of-stock">
            <i class="fas fa-times-circle"></i>
            Stokta Yok
        </div>`;
    }
}

// Ürün kartlarını güncelle
function updateProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productImage = card.querySelector('.product-image');
        const addToCartBtn = card.querySelector('.add-to-cart');
        
        if (productImage && addToCartBtn) {
            // Stok bilgisini al
            const stockText = card.querySelector('.feature-tag:contains("Stok:")')?.textContent || '';
            const stockNumber = parseInt(stockText.replace('Stok:', '').trim()) || 0;
            
            // Stok badge'i ekle (eğer yoksa)
            if (!productImage.querySelector('.stock-badge')) {
                const stockBadge = createStockBadge(stockNumber);
                productImage.insertAdjacentHTML('beforeend', stockBadge);
            }
            
            // Buton durumunu güncelle
            if (stockNumber <= 0) {
                addToCartBtn.disabled = true;
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Stokta Yok';
            } else {
                addToCartBtn.disabled = false;
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Sepete Ekle';
            }
        }
    });
}

// Sepete ekleme fonksiyonu
function addToCartByData(button) {
    const name = button.getAttribute('data-product');
    const price = parseFloat(button.getAttribute('data-price')) || 0;
    
    // Stok kontrolü
    if (button.disabled) {
        showNotification('Bu ürün stokta bulunmamaktadır!', 'error');
        return;
    }
    
    // Mevcut sepete ekleme fonksiyonunu çağır
    if (typeof addToCart === 'function') {
        addToCart(name, price);
    } else {
        // Basit sepet sistemi
        let cart = JSON.parse(localStorage.getItem('nettenbegenCart') || '[]');
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name, price, qty: 1 });
        }
        
        localStorage.setItem('nettenbegenCart', JSON.stringify(cart));
        showNotification(`${name} sepete eklendi!`);
    }
}

// Bildirim fonksiyonu
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    addStockCSS();
    updateProductCards();
    
    // Event listener'ları ekle
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            addToCartByData(this);
        });
    });
});

// MutationObserver ile dinamik içerik değişikliklerini izle
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            updateProductCards();
        }
    });
});

// Observer'ı başlat
observer.observe(document.body, {
    childList: true,
    subtree: true
});
