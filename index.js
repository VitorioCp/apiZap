const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

const WEBHOOK_URL = 'https://webhook.site/258cd327-1a5e-450b-bd8d-4a98235c0278';

// Inicializa o cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(), // Salva a sessão localmente
    puppeteer: {
        headless: true, // Mude para false se quiser ver o navegador
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

// Geração do QR Code para logar
client.on('qr', (qr) => {
    console.log('Escaneie o QR Code abaixo com seu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Confirmação de conexão
client.on('ready', () => {
    console.log('✅ WhatsApp conectado com sucesso!');
});

// Recebe mensagens
client.on('message', async (message) => {
    try {
        const data = {
            from: message.from,
            body: message.body,
            timestamp: new Date().toISOString(),
        };

        // Envia a mensagem para seu Webhook
        await axios.post(WEBHOOK_URL, data);

        console.log(`📨 Mensagem recebida e enviada para o Webhook: ${message.body}`);
    } catch (err) {
        console.error('❌ Erro ao enviar webhook:', err.message);
    }
});

// Inicializa o cliente
client.initialize();

// Rota de teste
app.get('/', (req, res) => {
    res.send('API de WhatsApp está rodando!');
});

// Rota para enviar mensagem
app.post('/send', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).send('Faltando número ou mensagem');
    }

    try {
        await client.sendMessage(`${phone}@c.us`, message);
        res.send('Mensagem enviada com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao enviar mensagem: ' + err);
    }
});

app.listen(port, () => {
    console.log(`🌐 Servidor rodando em http://localhost:${port}`);
});
