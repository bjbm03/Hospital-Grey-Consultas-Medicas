      // Interceptor mejorado
      (function() {
        const originalFetch = window.fetch;
        
        window.fetch = async function(...args) {
            const [url, config = {}] = args;
            const newConfig = {
                ...config,
                headers: {
                    ...(config.headers || {}),
                    'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
                }
            };
            
            console.log('Fetch interceptor:', url, newConfig);
            return originalFetch(url, newConfig);
        };
        
        // Interceptar también las redirecciones
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (localStorage.getItem('token') && (url.startsWith('/api') || url.startsWith('/dashbord'))) {
                this.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
            }
            originalOpen.apply(this, arguments);
        };
    })();