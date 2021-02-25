function bunnyStop() {
    if(window.bunnyAddPositionSizeTimeoutId) {
        clearTimeout(window.bunnyAddPositionSizeTimeoutId)
    }
    window.bunnyAddPositionSizeTimeoutId = 0
}

function bunnyCleanup() {
    bunnyStop()
    const a = document.getElementById('longPositionContainer')
    if(a)
        a.remove()
    const b = document.getElementById('shortPositionContainer')
    if(b)
        b.remove()
}

function bunnyStart() {
    if(!window || !document)
        return
    if(!/^https:\/\/www.binance.com\/[-_a-zA-Z]+\/futures/.test(window.location.toString())) {
        alert("This script only works in Binance Futures")
        return
    } else {
        bunnyCleanup()
    }
    const maxs = document.querySelectorAll('div[data-bn-type="text"][title="Max"]')
    if (maxs.length != 2) {
        alert("Please make sure you are in the Binance Futures page. If you are and you see this message, contact BlackBunny.")
        return
    }

    function getCurrency() {
        return maxs.item(0).parentElement.parentElement.previousElementSibling.children.item(0).children.item(1).textContent.match(/([a-zA-Z]+)/)[1] || ''
    }
    function getLeverage() {
        const a = Number.parseInt(document.querySelector('.ticker-wrap a+a').text,10)
        return Number.isNaN(a) || !Number.isSafeInteger(a) || a<=0 ? 0 : a
    }
    function getLongCost() {
        const a = Number.parseFloat(maxs.item(0).parentElement.parentElement.previousElementSibling.children.item(0).children.item(1).textContent)
        return Number.isNaN(a) || !Number.isFinite(a) ? 0 : a
    }
    function getShortCost() {
        const a = Number.parseFloat(maxs.item(0).parentElement.parentElement.previousElementSibling.children.item(1).children.item(1).textContent)
        return Number.isNaN(a) || !Number.isFinite(a) ? 0 : a
    }

    const longMax = maxs.item(0).parentElement;
    longMax.style.position = 'relative'
    const longLabelClass = maxs.item(0).className
    const longValueClass = maxs.item(0).nextElementSibling.className
    const longPositionContainer = document.createElement('DIV');
    longPositionContainer.id = "longPositionContainer";
    longPositionContainer.className = longMax.className
    longPositionContainer.style.width = longMax.getBoundingClientRect().width+'px'
    longPositionContainer.style.height = longMax.getBoundingClientRect().height+'px'
    longPositionContainer.style.position = 'absolute'
    longPositionContainer.style.top = '100%'
    longPositionContainer.style.left = 0
    const longPositionLabel = document.createElement('DIV')
    longPositionLabel.className = longLabelClass
    longPositionLabel.innerHTML = 'Position:'
    longPositionContainer.appendChild(longPositionLabel)
    const longPositionValueDiv = document.createElement('DIV')
    longPositionValueDiv.className = longValueClass
    longPositionContainer.appendChild(longPositionValueDiv)
    longMax.appendChild(longPositionContainer)


    const shortMax = maxs.item(1).parentElement
    shortMax.style.position = 'relative'
    const shortLabelClass = maxs.item(1).className
    const shortValueClass = maxs.item(1).nextElementSibling.className
    const shortPositionContainer = document.createElement('DIV');
    shortPositionContainer.id = "shortPositionContainer";
    shortPositionContainer.className = shortMax.className
    shortPositionContainer.style.width = shortMax.getBoundingClientRect().width+'px'
    shortPositionContainer.style.height = shortMax.getBoundingClientRect().height+'px'
    shortPositionContainer.style.position = 'absolute'
    shortPositionContainer.style.top = '100%'
    shortPositionContainer.style.left = 0
    const shortPositionLabel = document.createElement('DIV')
    shortPositionLabel.className = shortLabelClass
    shortPositionLabel.innerHTML = 'Position:'
    shortPositionContainer.appendChild(shortPositionLabel)
    const shortPositionValueDiv = document.createElement('DIV')
    shortPositionValueDiv.className = shortValueClass
    shortPositionContainer.appendChild(shortPositionValueDiv)
    shortMax.appendChild(shortPositionContainer)

    function updatePositionValues() {
        bunnyStop()
        if(document.querySelectorAll('div[data-bn-type="text"][title="Max"]').length!=2) {
            return
        }

        const lev = getLeverage()
        shortPositionValueDiv.innerHTML = (getShortCost()*lev).toFixed(2)+' '+getCurrency()
        longPositionValueDiv.innerHTML = (getLongCost()*lev).toFixed(2)+' '+getCurrency()

        window.bunnyAddPositionSizeTimeoutId = setTimeout(updatePositionValues,200)
    }

    updatePositionValues()
}
bunnyStart();