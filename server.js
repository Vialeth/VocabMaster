const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // HTML dosyasını buradan sunar

// Veri dosyası yoksa varsayılanı oluştur
if (!fs.existsSync(DATA_FILE)) {
    const initialData = [{
        id: 'default',
        sourceLang: 'English',
        targetLang: 'Turkish',
        words: []
    }];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Veriyi Oku
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Sunucu hatası');
        }
        res.json(JSON.parse(data));
    });
});

// Veriyi Kaydet
app.post('/api/data', (req, res) => {
    const newData = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Yazma hatası');
        }
        res.send({ status: 'success' });
    });
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
