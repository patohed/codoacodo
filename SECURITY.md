# Nodo Codo a Codo - Security Configuration Guide
# Configuraciones de seguridad para diferentes tipos de servidores

## APACHE (.htaccess ya configurado)
El archivo .htaccess ya está configurado con medidas de seguridad.

## NGINX (nginx.conf o archivo de configuración específico)
```nginx
# Security Headers
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()" always;

# Hide server information
server_tokens off;

# Rate limiting
limit_req_zone $binary_remote_addr zone=contact:10m rate=1r/s;
location /contact {
    limit_req zone=contact burst=5 nodelay;
}

# Block suspicious user agents
if ($http_user_agent ~* (libwww-perl|wget|python|nikto|curl|scan|masscan)) {
    return 403;
}

# Block access to sensitive files
location ~ /\. {
    deny all;
}

location ~* \.(htaccess|htpasswd|ini|log|sh|inc|bak|sql)$ {
    deny all;
}
```

## CLOUDFLARE (Configuración recomendada)
1. Activar "Always Use HTTPS"
2. Activar "HSTS"
3. Configurar Security Level: "Medium" o "High"
4. Activar "Bot Fight Mode"
5. Configurar Page Rules para rate limiting
6. Activar "Email Address Obfuscation"

## Medidas de seguridad implementadas:

### 1. Frontend (HTML/CSS/JS)
- ✅ Content Security Policy (CSP)
- ✅ Sanitización de inputs con XSS protection
- ✅ Validación de formularios mejorada
- ✅ Rate limiting en JavaScript
- ✅ Honeypot anti-spam
- ✅ CSRF token placeholder
- ✅ Input validation patterns
- ✅ Autocomplete attributes para mejor UX y seguridad

### 2. Headers de Seguridad
- ✅ X-XSS-Protection
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ Referrer-Policy
- ✅ Permissions-Policy
- ✅ Content-Security-Policy

### 3. Protección contra ataques
- ✅ XSS (Cross-Site Scripting)
- ✅ CSRF (Cross-Site Request Forgery) - placeholder
- ✅ Clickjacking
- ✅ MIME type sniffing
- ✅ SQL Injection patterns
- ✅ Directory traversal
- ✅ File inclusion attacks
- ✅ Bot protection

### 4. Validación y Sanitización
- ✅ Input sanitization
- ✅ Pattern matching
- ✅ Length limits
- ✅ Character set restrictions
- ✅ Email validation
- ✅ Suspicious pattern detection

### 5. Performance y Caching
- ✅ Compression (gzip/deflate)
- ✅ Cache headers
- ✅ Resource preloading
- ✅ CDN integrity checks

## Checklist de Seguridad Post-Deployment:
- [ ] Configurar HTTPS/SSL
- [ ] Implementar CSRF tokens reales (backend)
- [ ] Configurar rate limiting a nivel servidor
- [ ] Configurar backup automático
- [ ] Monitoreo de logs de seguridad
- [ ] Actualizaciones regulares de dependencias
- [ ] Configurar firewall de aplicación web (WAF)
- [ ] Implementar 2FA para acceso administrativo
