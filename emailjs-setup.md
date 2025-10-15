# 📧 Configuración de EmailJS para Galenus Panamá

## 🚀 Pasos para Configurar EmailJS

### 1. Crear Cuenta
- Ve a: https://www.emailjs.com/
- Regístrate con email: info@galenuspanama.com
- Verifica tu email

### 2. Configurar Servicio de Email
- Ve a "Email Services"
- Clic en "Add New Service"
- Selecciona Gmail o Outlook
- Conecta tu cuenta de email
- **Copia el Service ID** (ej: service_abc123)

### 3. Crear Templates

#### Template 1: Contacto
```
Template ID: template_contact
Subject: Nueva consulta desde galenuspanama.com

Content:
De: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}
Asunto: {{subject}}

Mensaje:
{{message}}

---
Enviado desde galenuspanama.com
```

#### Template 2: Newsletter
```
Template ID: template_newsletter
Subject: Nueva suscripción al newsletter

Content:
Nueva suscripción al newsletter:

Email: {{email}}
Fecha: {{date}}

---
Sistema automático - galenuspanama.com
```

### 4. Obtener Credenciales
- Ve a "Account" → "General"
- **Copia tu Public Key** (ej: user_abc123)
- **Anota tu Service ID**
- **Anota los Template IDs**

### 5. Actualizar Código
En `script.js`, reemplaza:

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'TU_SERVICE_ID_AQUI',
  templateId: 'template_contact',
  newsletterTemplateId: 'template_newsletter',
  publicKey: 'TU_PUBLIC_KEY_AQUI'
};
```

### 6. Probar
- Sube los archivos actualizados
- Prueba el formulario de contacto
- Prueba la suscripción al newsletter

## ✅ Checklist
- [ ] Cuenta EmailJS creada
- [ ] Servicio de email configurado
- [ ] Templates creados
- [ ] Credenciales copiadas
- [ ] Código actualizado
- [ ] Funcionalidad probada

## 🆘 Soporte
Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que las credenciales sean correctas
3. Asegúrate de que los templates existan
4. Contacta soporte de EmailJS si es necesario
