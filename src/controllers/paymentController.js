// controllers/paymentController.js
const paymentService = require('../services/paymentService');

class PaymentController {
    async createTransaction(req, res) {
        try {
            const { orderId, amount, type, bank, customer } = req.body;
            const tenantId = req.headers['x-tenant-id'];

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID wajib' });

            let result;
            if (type === 'QRIS') {
                result = await paymentService.createQrisTransaction(orderId, amount, customer);
            } else if (type === 'VA') {
                result = await paymentService.createVirtualAccountTransaction(orderId, amount, bank);
            } else {
                return res.status(400).json({ error: 'Tipe pembayaran tidak valid' });
            }

            res.status(201).json({ success: true, data: { ...result, tenantId } });
        } catch (err) {
            res.status(500).json({ error: 'Gagal proses transaksi', details: err.message });
        }
    }

    async handleWebhook(req, res) {
        try {
            const signature = req.headers['x-payment-signature'];
            const isValid = paymentService.verifyWebhookSignature(req.body, signature);

            if (!isValid) return res.status(403).json({ error: 'Signature tidak valid' });

            // Update status database tenant di sini
            res.status(200).json({ status: 'OK' });
        } catch (err) {
            res.status(500).json({ error: 'Webhook gagal' });
        }
    }
}

module.exports = new PaymentController();