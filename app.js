let player = {
    name: '',
    cash: 0
}

const priceGrade = 1.7 // price = base * (priceGrade^quantity)

let clickUpgrades = [
    {
        picture: '🥤',
        name: 'Mountain Dew',
        description: 'Enjoy the sweet sweet taste of Mountain Dew.',
        base: 10,
        quantity: 0,
        multiplier: 1
    },
    {
        picture: '🍕',
        name: 'UberEats',
        description: "The developer won't have to leave the house for food, increasing efficiency!",
        base: 200,
        quantity: 0,
        multiplier: 8
    }
]

let automaticUpgrades = [
    {
        picture: '🧑‍💻',
        name: 'Fiverr Developer',
        description: "It's not much but it's dishonest work.",
        base: 500,
        quantity: 0,
        multiplier: 10
    },
    {
        picture: '🤖',
        name: 'ChatGPT',
        description: "Wait?! I don't even need to code?",
        base: 2000,
        quantity: 0,
        multiplier: 100
    }
]

let upgrades = [...automaticUpgrades, ...clickUpgrades]

let achievements = [
    {
        name: '🍕 Desolate Developer',
        description: 'Buy UberEats. Rough times.',
        unlocked: false
    },
    {
        name: '🍭 Sugar Rush',
        description: 'Buy 10 Cans of Mountain Dew.',
        unlocked: false
    },
    {
        name: '⌨️ Keyboard Warrior',
        description: 'Have over $10k in the bank.',
        unlocked: false
    },
    {
        name: '🚶‍♂️ Go Outside',
        description: 'Maybe the real exercise was the nerds we met along the way.',
        unlocked: false
    }
]


let nerdLines = ["erm.. what the flip dude", "erm.. i'm a little hungry", 'i crave the dew', 'where\'s my hug at?', '*aggressive typing*', 'i bet you don\'t even know sql!', 'apache cassandra 🔛🔝', 'live laugh code', 'i type 323 wpm noob', '*opens steam*', '*opens vscode*', 'wh- what are you doin', 'ur bad!11! no skills??!', 'im champion 🤓', 'jarrett was here', `mY nAmE iS mIcK (best teacher tho fr fr)`, 'where did hee goooo', 'erm actually thats not right ☝️', 'chair upgrade incoming', '💯 W coding', '*rizzard music*', 'hoo-ray!', 'where art thou skills', 'that column is improperly nested!', 'im telling jake!']

function drawStats() {
    const statsElm = document.querySelector('#stats')
    statsElm.innerHTML = `💸 $${prettifyNumber(player.cash)} | 👆 ${calculateClickPower().toFixed(0)} | 🤖 $${calculateAutomaticProfit().toFixed(0)}/s`;

    saveData()
}

function performClick() {
    let clickPower = calculateClickPower()
    player.cash += clickPower
    spawnNerd()
    drawStats()
    drawShop()
}

function collectionTask() {
    player.cash += calculateAutomaticProfit()
    drawStats()
    drawShop()
}

function calculateClickPower() {
    let clickPow = 1
    clickUpgrades.filter(x => x.quantity > 0).forEach(x => {
        clickPow += x.quantity * x.multiplier
    })
    return clickPow
}

function calculateAutomaticProfit() {
    let autoProfit = 0
    automaticUpgrades.filter(x => x.quantity > 0).forEach(x => {
        autoProfit += x.multiplier * x.quantity
    })
    return autoProfit
}

function calculatePrice(itemName) {
    let upgrade = upgrades.find(x => x.name == itemName)
    let price = upgrade.base * Math.pow(priceGrade, upgrade.quantity)
    return Math.floor(price)
}

function drawShop() {
    let inventoryInject = '';

    upgrades.forEach(x => {
        let upgradeIDName = x.name.toLowerCase().replace(' ', '-')
        const upgradeElm = document.getElementById(upgradeIDName)
        const descriptionElm = upgradeElm.querySelector("p")
        descriptionElm.innerHTML = x.description

        const buttonElm = upgradeElm.querySelector('button')
        let price = calculatePrice(x.name)
        if (price > player.cash) {
            buttonElm.classList.remove('btn-primary')
            buttonElm.classList.add('btn-danger')
        } else {
            buttonElm.setAttribute('onclick', `buyItem('${x.name}')`)
            buttonElm.classList.remove('btn-danger')
            buttonElm.classList.add('btn-primary')
        }

        buttonElm.innerHTML = `${x.picture} ${x.name} [💵 ${prettifyNumber(price)}]`
    })

    upgrades.filter(x => x.quantity > 0).forEach(x => {
        inventoryInject += `${x.quantity}x ${x.name}<br>`
    })

    const inventoryElm = document.querySelector('#inventory')
    inventoryElm.innerHTML = inventoryInject == '' ? "You don't have any items yet!" : inventoryInject

    saveData()
}

function buyItem(itemName) {
    const upgrade = upgrades.find(x => x.name == itemName)
    let price = calculatePrice(itemName)
    if (player.cash >= price) {
        player.cash -= price
        upgrade.quantity++
        drawShop()
        drawStats()
    }
}

function prettifyNumber(number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(2) + "B"
    } else if (number >= 10000000) {
        return (number / 1000000).toFixed(1) + "M"
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + "M"
    } else if (number >= 10000) {
        return (number / 1000).toFixed(1) + "K"
    } else if (number >= 1000) {
        return (number / 1000).toFixed(2) + "K"
    } else {
        return number.toFixed(0)
    }
}

function spawnNerd() {
    let nerdContainer = document.querySelector('.nerds')
    const nerd = document.createElement('div')

    nerd.innerHTML += `<div class="position-absolute" style="overflow: hidden; top: -30dvh; left: ${Math.random() * 87}%; height: 130dvh;">
    <img class="falling-nerd" src="average-developer.png" alt="">
</div>`


    nerdContainer.appendChild(nerd)
    //document.body.insertBefore(nerd, document.querySelector("main"))
    setTimeout(() => destroyNerd(nerd), 4500)
}

function destroyNerd(object) {
    object.remove()
}

function yap() {
    const chatElm = document.querySelector(".comment-bubble")
    chatElm.classList.remove('d-none')
    chatElm.innerHTML = nerdLines[Math.floor(Math.random() * nerdLines.length)]

    const pointElm = document.querySelector("#point")
    pointElm.classList.add('point')
    pointElm.classList.remove('d-none')

    setTimeout(unYap, 5000)
}

function unYap() {
    const chatElm = document.querySelector(".comment-bubble")
    chatElm.classList.add('d-none')

    const pointElm = document.querySelector("#point")
    pointElm.classList.remove('point')
    pointElm.classList.add('d-none')
}

function saveData() {
    localStorage.setItem('player', JSON.stringify(player))
    localStorage.setItem('autoUpgrades', JSON.stringify(automaticUpgrades))
    localStorage.setItem('clickUpgrades', JSON.stringify(clickUpgrades))
    localStorage.setItem('achievements', JSON.stringify(achievements))
}

function loadData() {
    if (localStorage.getItem('player') == null) return
    player = JSON.parse(localStorage.getItem('player'))
    automaticUpgrades = JSON.parse(localStorage.getItem('autoUpgrades'))
    clickUpgrades = JSON.parse(localStorage.getItem('clickUpgrades'))
    upgrades = [...automaticUpgrades, ...clickUpgrades]
    achievements = JSON.parse(localStorage.getItem('achievements'))
}

function checkAchievementConditions() {
    achievements.filter(x => x.unlocked == false).forEach(n => {
        switch (n.name) {
            case '🍕 Desolate Developer':
                const uberEatsUpgrade = upgrades.find(x => x.name == 'UberEats')
                if (uberEatsUpgrade.quantity > 0) {
                    triggerAchievement(n.name)
                }
                break
            case '🍭 Sugar Rush':
                const mtnDew = upgrades.find(x => x.name == 'Mountain Dew')
                if (mtnDew.quantity > 9) {
                    triggerAchievement(n.name)
                }
                break
            case '⌨️ Keyboard Warrior':
                if (player.cash >= 10000) {
                    triggerAchievement(n.name)
                }
                break
            case '🚶‍♂️ Go Outside':
                if (player.cash >= 100000) {
                    triggerAchievement(n.name)
                }
                break
        }
    })
}

function triggerAchievement(achievementName) {
    const achievement = achievements.find(x => x.name == achievementName)
    achievement.unlocked = true
    const achievementElm = document.querySelector('#achievement')
    achievementElm.querySelector('span').innerHTML = achievement.name
    achievementElm.querySelector('p').innerHTML = achievement.description
    achievementElm.classList.add('achievement-active')

    setTimeout(() => {
        achievementElm.classList.remove('achievement-active')
    }, 5000)
}

loadData()
//if (player.name == '') player.name = window.prompt("What is your name? This info will be used later in the game.")
drawStats()
drawShop()
setInterval(collectionTask, 1000)
setInterval(yap, 20000)
setInterval(checkAchievementConditions, 100)