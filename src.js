(async () => {
    const baseUrl = 'https://api.coinbase.com/v2/prices/'

    const coins = ['BTC', 'ETH']

    const y = new Date()
    y.setDate(y.getDate() - 1)
    const mm = y.getMonth() + 1
    const dd = y.getDate()

    const yDay = [y.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
        ].join('-')


    const urls = [
        ...coins.map(coin => baseUrl + coin + '-USD/spot'), 
        ...coins.map(coin => baseUrl + coin + '-USD/spot?date=' + yDay)
    ]

    try {
        const datas = await Promise.all(
            urls.map(url => fetch(url).then(response => response.json()))
        )

        let bitcoin, ethereum, bitcoinYday, ethereumYday

        datas.map(({ data }, i) => {
            let id = data.base === 'BTC' ? 'bitcoin' : 'ethereum'
            if (i > 1) id += 'Yday'
            
            document.getElementById(id).innerHTML = parseFloat(data.amount).toFixed(2).toString() + '$'

            if (i < 2) {
                data.base === 'BTC' ? bitcoin = data.amount : ethereum = data.amount
            } else {
                data.base === 'BTC' ? bitcoinYday = parseFloat(data.amount).toFixed(2) : ethereumYday = parseFloat(data.amount).toFixed(2)

                const sub = data.base === 'BTC' ? bitcoin - bitcoinYday : ethereum - ethereumYday

                let html = '<span class="'
                html += sub > 0 ? 'plus">+' : 'minus">'
                html += sub.toFixed(2).toString() + '</span>'
                document.getElementById(id).innerHTML += html                
            }
        })

        const r = bitcoin / ethereum
        const rYday = bitcoinYday / ethereumYday
    
        document.getElementById('btceth').innerText = r.toFixed(2).toString() + '/1'
        document.getElementById('btcethYday').innerHTML = rYday.toFixed(2).toString() + '/1'

        const rh = r - rYday
        let html = '<span class="'
        html += rh > 0 ? 'plus">+' : 'minus">'
        html += rh.toFixed(2).toString() + '/1</span>'
        document.getElementById('btcethYday').innerHTML += html

    } catch (error) {
        console.log(error)
    }
})()