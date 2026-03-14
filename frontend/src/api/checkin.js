const API_URL = import.meta.env.VITE_API_URL

export async function submitCheckin(data, token) {
    const res = await fetch(`${API_URL}/api/checkin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Check-in failed')
    return res.json()
}

export async function getDashboard(token) {
    const res = await fetch(`${API_URL}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to load dashboard')
    return res.json()
}

export async function getHistory(token) {
    const res = await fetch(`${API_URL}/api/checkin/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to load history')
    return res.json()
}