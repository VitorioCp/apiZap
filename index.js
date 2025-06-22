const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

const WEBHOOK_URL = 'https://vitoriocorrea313.app.n8n.cloud/webhook-test/minhaApiZap'
// 'https://vitoriocorrea313.app.n8n.cloud/webhook/minhaApiZap';

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
        const isGroup = message.from.endsWith('@g.us');
        let name = '';

        if (isGroup) {
            // Recupera o nome do grupo
            const chat = await message.getChat();
            name = chat.name || '';
        } else {
            // Recupera o nome do contato
            const contact = await message.getContact();
            name = contact.pushname || contact.name || contact.number || '';
        }

        const data = {
            from: message.from,
            name: name,
            body: message.body,
            timestamp: new Date().toISOString(),
             type: isGroup
        };

        await axios.post(WEBHOOK_URL, data);
        console.log(`📨 Mensagem recebida e enviada para o Webhook: ${JSON.stringify(data)}`);

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
