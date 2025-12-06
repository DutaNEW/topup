import React, { useState } from 'react'
import axios from 'axios'

export default function CreateTransaction() {
  const [amount, setAmount] = useState(10000)
  const [gateway, setGateway] = useState('qris')
  const [reference, setReference] = useState(`ref-${Date.now()}`)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await axios.post('/api/transaction/create', {
        amount,
        gateway,
        reference,
        metadata: { source: 'frontend-demo' }
      })
      setResult(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
      <h2>Create Transaction</h2>
      <form onSubmit={handleCreate}>
        <div style={{ marginBottom: 10 }}>
          <label>
            Amount (IDR):
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ marginLeft: 10, padding: 5 }} />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Gateway:
            <select value={gateway} onChange={(e) => setGateway(e.target.value)} style={{ marginLeft: 10, padding: 5 }}>
              <option>qris</option>
              <option>midtrans</option>
              <option>xendit</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Reference:
            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} style={{ marginLeft: 10, padding: 5, width: 250 }} />
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ padding: '8px 16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Creating...' : 'Create Transaction'}
        </button>
      </form>

      {error && <div style={{ marginTop: 15, color: 'red', padding: 10, backgroundColor: '#ffe6e6', borderRadius: 4 }}>Error: {error}</div>}

      {result && (
        <div style={{ marginTop: 15, padding: 10, backgroundColor: '#e6f2ff', borderRadius: 4 }}>
          <h3>Result</h3>
          <p><strong>Transaction ID:</strong> {result.tx.id}</p>
          <p><strong>Reference:</strong> {result.tx.reference}</p>
          <p><strong>Status:</strong> {result.tx.status}</p>
          <p><strong>Gateway Response Type:</strong> {result.result.type}</p>
          {result.result.url && (
            <p>
              <strong>Payment URL:</strong> <a href={result.result.url} target="_blank" rel="noopener noreferrer">{result.result.url}</a>
            </p>
          )}
          {result.result.imageUrl && (
            <div>
              <strong>QR Code:</strong>
              <br />
              <img src={result.result.imageUrl} alt="QR Code" style={{ maxWidth: 200, marginTop: 10 }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
