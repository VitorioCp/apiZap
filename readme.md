# 📱 API WhatsApp Web com Webhook

Este projeto é uma aplicação Node.js que se conecta ao WhatsApp Web usando a biblioteca [`whatsapp-web.js`](https://wwebjs.dev/) e envia mensagens recebidas para um endpoint webhook via `axios`. Além disso, permite o envio de mensagens via requisição HTTP `POST`.

---

## 🚀 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [whatsapp-web.js](https://wwebjs.dev/)
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)
- [axios](https://axios-http.com/)

---

## 🛠️ Instalação

### 1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Configure o webhook:

No arquivo principal (`index.js` ou `app.js`), substitua a variável `WEBHOOK_URL` com a URL do seu servidor:

```js
const WEBHOOK_URL = 'https://seu-webhook.com/endpoint';
```

---

## 🌐 Como tornar sua API acessível pela internet

Para que o webhook funcione corretamente, você precisa expor sua API local para a internet. A maneira mais simples é utilizando o [Ngrok](https://ngrok.com/):

### Instale e inicie o Ngrok:

```bash
npm install -g ngrok
ngrok http 3000
```

O Ngrok vai gerar uma URL como:

```
https://abcd-12-34-56-78.ngrok.io
```

Use essa URL no seu `WEBHOOK_URL` para testes:

```js
const WEBHOOK_URL = 'https://abcd-12-34-56-78.ngrok.io/endpoint';
```

---

## ▶️ Uso

### 1. Inicie o servidor:

```bash
node index.js
```

Aparecerá um QR Code no terminal. Escaneie com o WhatsApp no seu celular para iniciar a sessão.

---

## 📤 Envio de Mensagens

Você pode enviar mensagens através da rota HTTP `POST`:

### Endpoint:

```
POST /send
```

### Body (JSON):

```json
{
  "phone": "5522999999999",
  "message": "Olá, esta é uma mensagem de teste!"
}
```

> ⚠️ O número deve estar no formato internacional, sem espaços, parênteses ou traços. Ex: `5521999999999`

### Exemplo com cURL:

```bash
curl -X POST http://localhost:3000/send \
     -H "Content-Type: application/json" \
     -d '{"phone":"5522999999999","message":"Olá do WhatsApp bot!"}'
```

---

## 📩 Recebimento de Mensagens

Todas as mensagens recebidas serão enviadas para o Webhook definido, no seguinte formato:

```json
{
  "from": "5522999999999",
  "name": "Nome do contato ou grupo",
  "body": "Conteúdo da mensagem",
  "timestamp": "2025-07-02T13:45:00.000Z",
  "type": false
}
```

- `type: false` → conversa individual  
- `type: true` → grupo

---

## 📡 Rotas disponíveis

| Método | Rota     | Descrição                          |
|--------|----------|------------------------------------|
| GET    | `/`      | Verifica se a API está rodando     |
| POST   | `/send`  | Envia uma mensagem via WhatsApp    |

---

## 📦 Estrutura da Aplicação

```
├── index.js
├── package.json
```

---

## 🔒 Sessão Local

A sessão do WhatsApp é salva localmente usando `LocalAuth`, o que evita escanear o QR Code novamente após reiniciar o servidor.

---

## 🧪 Testes

Você pode usar ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar as rotas da API.

---

## 🧾 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
