class BaccaratGame {
    constructor() {
        this.shoe = [];
        this.shoePosition = 0;
        this.shuffleMarker = 0;
        this.playerHand = [];
        this.bankerHand = [];
        this.gameState = 'ready'; // ready, dealing, player-decision, banker-decision, hand-complete
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.isNatural = false;
        
        this.initializeElements();
        this.createShoe();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.elements = {
            cardsLeft: document.getElementById('cards-left'),
            shuffleWarning: document.getElementById('shuffle-warning'),
            correctCount: document.getElementById('correct-count'),
            wrongCount: document.getElementById('wrong-count'),
            playerCards: document.getElementById('player-cards'),
            bankerCards: document.getElementById('banker-cards'),
            playerTotal: document.getElementById('player-total'),
            bankerTotal: document.getElementById('banker-total'),
            playerDecision: document.getElementById('player-decision'),
            bankerDecision: document.getElementById('banker-decision'),
            handResult: document.getElementById('hand-result'),
            feedback: document.getElementById('feedback'),
            feedbackTitle: document.getElementById('feedback-title'),
            feedbackText: document.getElementById('feedback-text'),
            winnerText: document.getElementById('winner-text'),
            playerHitBtn: document.getElementById('player-hit'),
            playerStandBtn: document.getElementById('player-stand'),
            bankerHitBtn: document.getElementById('banker-hit'),
            bankerStandBtn: document.getElementById('banker-stand'),
            nextHandBtn: document.getElementById('next-hand'),
            continueBtn: document.getElementById('continue-btn'),
            shuffleBtn: document.getElementById('shuffle-btn'),
            newGameBtn: document.getElementById('new-game-btn'),
            rulesBtn: document.getElementById('rules-btn'),
            rulesModal: document.getElementById('rules-modal'),
            shoeCards: document.getElementById('shoe-cards'),
            shoeMarker: document.getElementById('shoe-marker')
        };
    }

    createShoe() {
        this.shoe = [];
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // Create 8 decks
        for (let deck = 0; deck < 8; deck++) {
            for (let suit of suits) {
                for (let rank of ranks) {
                    this.shoe.push({
                        suit: suit,
                        rank: rank,
                        value: this.getCardValue(rank),
                        color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
                    });
                }
            }
        }
        
        this.shuffleShoe();
        this.shoePosition = 0;
        
        // Place marker at 7/8ths through the shoe
        this.shuffleMarker = Math.floor(this.shoe.length * 7/8);
    }

    shuffleShoe() {
        for (let i = this.shoe.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shoe[i], this.shoe[j]] = [this.shoe[j], this.shoe[i]];
        }
    }

    getCardValue(rank) {
        if (rank === 'A') return 1;
        if (['10', 'J', 'Q', 'K'].includes(rank)) return 0;
        return parseInt(rank);
    }

    calculateHandValue(hand) {
        const total = hand.reduce((sum, card) => sum + card.value, 0);
        return total % 10;
    }

    dealCard() {
        if (this.shoePosition >= this.shoe.length) {
            this.createShoe();
        }
        
        const card = this.shoe[this.shoePosition];
        this.shoePosition++;
        return card;
    }

    createCardElement(card, faceUp = false) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        
        if (faceUp) {
            cardDiv.classList.add('face-up', card.color);
            const imagePath = this.getCardImagePath(card);
            cardDiv.innerHTML = `<img src="${imagePath}" alt="${card.rank} of ${this.getSuitName(card.suit)}" class="card-image" onerror="this.parentElement.innerHTML = this.parentElement.dataset.fallback;">`;
            cardDiv.dataset.fallback = this.getCardHTML(card);
        } else {
            cardDiv.classList.add('face-down');
        }
        
        cardDiv.classList.add('card-animate-deal');
        return cardDiv;
    }

    getCardImagePath(card) {
        const suitNames = {
            '♠': 'spades',
            '♥': 'hearts', 
            '♦': 'diamonds',
            '♣': 'clubs'
        };
        
        const rankNames = {
            'A': 'ace',
            '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
            'J': 'jack',
            'Q': 'queen', 
            'K': 'king'
        };
        
        const suit = suitNames[card.suit];
        const rank = rankNames[card.rank];
        
        return `cards/${rank}_of_${suit}.png`;
    }

    getSuitName(suit) {
        const suitNames = {
            '♠': 'Spades',
            '♥': 'Hearts', 
            '♦': 'Diamonds',
            '♣': 'Clubs'
        };
        return suitNames[suit];
    }

    getCardHTML(card) {
        // Corner rank and suit for all cards
        const cornerHTML = `
            <div class="card-corner top-left">
                <div>${card.rank}</div>
                <div>${card.suit}</div>
            </div>
            <div class="card-corner bottom-right">
                <div>${card.rank}</div>
                <div>${card.suit}</div>
            </div>
        `;

        // Handle face cards
        if (['J', 'Q', 'K'].includes(card.rank)) {
            const faceClass = card.rank === 'J' ? 'jack' : card.rank === 'Q' ? 'queen' : 'king';
            return cornerHTML + `
                <div class="card-center">
                    <div class="face-card ${faceClass}">
                        ${card.rank}
                    </div>
                </div>
            `;
        }

        // Handle Ace
        if (card.rank === 'A') {
            return cornerHTML + `
                <div class="card-center">
                    <div class="ace-large">${card.suit}</div>
                </div>
            `;
        }

        // Handle number cards (2-10)
        return cornerHTML + this.getNumberCardPips(card);
    }

    getNumberCardPips(card) {
        const num = parseInt(card.rank);
        const suit = card.suit;
        
        const pipLayouts = {
            2: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; gap: 20px;"><div class="pip">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>',
            
            3: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 8px;"><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>',
            
            4: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px;"><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>',
            
            5: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 6px;"><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="grid-column: 1/3; justify-self: center;">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>',
            
            6: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 6px;"><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>',
            
            7: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr 1fr; gap: 4px;"><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="grid-column: 1/3; justify-self: center;">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>',
            
            8: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr 1fr; gap: 4px;"><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>',
            
            9: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 3px;"><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>',
            
            10: '<div class="card-center"><div class="card-pips" style="grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr 1fr; gap: 2px;"><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="grid-column: 1/3; justify-self: center;">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip">' + suit + '</div><div class="pip" style="grid-column: 1/3; justify-self: center; transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div><div class="pip" style="transform: rotate(180deg);">' + suit + '</div></div></div>'
        };
        
        return pipLayouts[num] || '';
    }

    startNewHand() {
        this.playerHand = [];
        this.bankerHand = [];
        this.gameState = 'dealing';
        this.isNatural = false;
        
        this.clearCards();
        this.hideAllPrompts();
        
        // Deal 4 cards alternating Player, Banker, Player, Banker
        setTimeout(() => this.dealCardToPlayer(), 200);
        setTimeout(() => this.dealCardToBanker(), 600);
        setTimeout(() => this.dealCardToPlayer(), 1000);
        setTimeout(() => this.dealCardToBanker(), 1400);
        setTimeout(() => this.revealCards(), 2000);
    }

    dealCardToPlayer() {
        const card = this.dealCard();
        this.playerHand.push(card);
        const cardElement = this.createCardElement(card, false);
        const slots = this.elements.playerCards.querySelectorAll('.card-slot');
        const targetSlot = slots[this.playerHand.length - 1];
        if (targetSlot) {
            targetSlot.appendChild(cardElement);
        }
    }

    dealCardToBanker() {
        const card = this.dealCard();
        this.bankerHand.push(card);
        const cardElement = this.createCardElement(card, false);
        const slots = this.elements.bankerCards.querySelectorAll('.card-slot');
        const targetSlot = slots[this.bankerHand.length - 1];
        if (targetSlot) {
            targetSlot.appendChild(cardElement);
        }
    }

    revealCards() {
        const playerCardElements = this.elements.playerCards.querySelectorAll('.card');
        const bankerCardElements = this.elements.bankerCards.querySelectorAll('.card');
        
        playerCardElements.forEach((cardEl, index) => {
            setTimeout(() => this.flipCard(cardEl, this.playerHand[index]), index * 200);
        });
        
        bankerCardElements.forEach((cardEl, index) => {
            setTimeout(() => this.flipCard(cardEl, this.bankerHand[index]), index * 200);
        });
        
        setTimeout(() => {
            this.updateHandTotals();
            this.checkForNaturals();
        }, 1000);
    }

    flipCard(cardElement, card) {
        cardElement.classList.add('card-animate-flip');
        
        setTimeout(() => {
            cardElement.className = `card face-up ${card.color}`;
            const imagePath = this.getCardImagePath(card);
            cardElement.innerHTML = `<img src="${imagePath}" alt="${card.rank} of ${this.getSuitName(card.suit)}" class="card-image" onerror="this.parentElement.innerHTML = this.parentElement.dataset.fallback;">`;
            cardElement.dataset.fallback = this.getCardHTML(card);
        }, 300);
    }

    updateHandTotals() {
        const playerTotal = this.calculateHandValue(this.playerHand);
        const bankerTotal = this.calculateHandValue(this.bankerHand);
        
        this.elements.playerTotal.textContent = playerTotal;
        this.elements.bankerTotal.textContent = bankerTotal;
    }

    checkForNaturals() {
        const playerTotal = this.calculateHandValue(this.playerHand);
        const bankerTotal = this.calculateHandValue(this.bankerHand);
        
        this.isNatural = playerTotal >= 8 || bankerTotal >= 8;
        this.gameState = 'player-decision';
        this.showPlayerDecision();
    }

    showPlayerDecision() {
        this.elements.playerDecision.classList.remove('hidden');
    }

    showBankerDecision() {
        this.elements.bankerDecision.classList.remove('hidden');
    }

    hideAllPrompts() {
        this.elements.playerDecision.classList.add('hidden');
        this.elements.bankerDecision.classList.add('hidden');
        this.elements.handResult.classList.add('hidden');
        this.elements.feedback.classList.add('hidden');
    }

    handlePlayerDecision(shouldHit) {
        const playerTotal = this.calculateHandValue(this.playerHand);
        const correctAction = this.getCorrectPlayerAction(playerTotal);
        
        if (shouldHit === correctAction) {
            this.correctAnswers++;
            this.executePlayerAction(correctAction);
        } else {
            this.wrongAnswers++;
            this.showFeedback(false, this.getPlayerFeedback(playerTotal, correctAction));
            this.pendingAction = () => this.executePlayerAction(correctAction);
        }
        
        this.updateScoreDisplay();
    }

    handleBankerDecision(shouldHit) {
        const bankerTotal = this.calculateHandValue(this.bankerHand);
        const playerTotal = this.calculateHandValue(this.playerHand);
        const playerThirdCard = this.playerHand.length > 2 ? this.playerHand[2].value : null;
        
        const correctAction = this.getCorrectBankerAction(bankerTotal, playerTotal, playerThirdCard, this.playerHand.length === 2);
        
        if (shouldHit === correctAction) {
            this.correctAnswers++;
            this.executeBankerAction(correctAction);
        } else {
            this.wrongAnswers++;
            this.showFeedback(false, this.getBankerFeedback(bankerTotal, playerTotal, playerThirdCard, this.playerHand.length === 2, correctAction));
            this.pendingAction = () => this.executeBankerAction(correctAction);
        }
        
        this.updateScoreDisplay();
    }

    getCorrectPlayerAction(playerTotal) {
        if (this.isNatural) {
            return false; // Player always stands on naturals
        }
        return playerTotal <= 5; // Player draws on 0-5, stands on 6-7
    }

    getCorrectBankerAction(bankerTotal, playerTotal, playerThirdCard, playerStood) {
        if (this.isNatural) {
            return false; // Banker always stands on naturals
        }
        
        // Rule 3: Banker 0-2 draws, 7 stands
        if (bankerTotal <= 2) return true;
        if (bankerTotal === 7) return false;
        
        // Rule 4: If Player stood on 6 or 7, Banker draws on 3,4,5 and stands on 6
        if (playerStood && playerTotal >= 6) {
            return bankerTotal <= 5;
        }
        
        // Rule 5: Banker decision based on total and Player's 3rd card
        if (bankerTotal === 3) {
            return playerThirdCard !== 8;
        }
        if (bankerTotal === 4) {
            return [2, 3, 4, 5, 6, 7].includes(playerThirdCard);
        }
        if (bankerTotal === 5) {
            return [4, 5, 6, 7].includes(playerThirdCard);
        }
        if (bankerTotal === 6) {
            return [6, 7].includes(playerThirdCard);
        }
        
        return false;
    }

    executePlayerAction(shouldHit) {
        this.elements.playerDecision.classList.add('hidden');
        
        if (shouldHit) {
            setTimeout(() => {
                this.dealCardToPlayer();
                setTimeout(() => {
                    const slots = this.elements.playerCards.querySelectorAll('.card-slot');
                    const newCard = slots[this.playerHand.length - 1].querySelector('.card');
                    this.flipCard(newCard, this.playerHand[this.playerHand.length - 1]);
                    setTimeout(() => {
                        this.updateHandTotals();
                        this.gameState = 'banker-decision';
                        this.showBankerDecision();
                    }, 600);
                }, 300);
            }, 500);
        } else {
            setTimeout(() => {
                this.gameState = 'banker-decision';
                this.showBankerDecision();
            }, 500);
        }
    }

    executeBankerAction(shouldHit) {
        this.elements.bankerDecision.classList.add('hidden');
        
        if (shouldHit) {
            setTimeout(() => {
                this.dealCardToBanker();
                setTimeout(() => {
                    const slots = this.elements.bankerCards.querySelectorAll('.card-slot');
                    const newCard = slots[this.bankerHand.length - 1].querySelector('.card');
                    this.flipCard(newCard, this.bankerHand[this.bankerHand.length - 1]);
                    setTimeout(() => {
                        this.updateHandTotals();
                        this.gameState = 'hand-complete';
                        this.showHandResult();
                    }, 600);
                }, 300);
            }, 500);
        } else {
            setTimeout(() => {
                this.gameState = 'hand-complete';
                this.showHandResult();
            }, 500);
        }
    }

    showHandResult() {
        const playerTotal = this.calculateHandValue(this.playerHand);
        const bankerTotal = this.calculateHandValue(this.bankerHand);
        
        let winner;
        if (playerTotal > bankerTotal) {
            winner = `Player wins ${playerTotal} to ${bankerTotal}`;
        } else if (bankerTotal > playerTotal) {
            winner = `Banker wins ${bankerTotal} to ${playerTotal}`;
        } else {
            winner = `Tie ${playerTotal} to ${bankerTotal}`;
        }
        
        this.elements.winnerText.textContent = winner;
        this.elements.handResult.classList.remove('hidden');
        
        // Check if we need to shuffle after this hand
        if (this.shoePosition >= this.shuffleMarker) {
            this.elements.shuffleBtn.disabled = false;
            this.elements.shuffleWarning.classList.remove('hidden');
        }
    }

    showFeedback(correct, message) {
        this.elements.feedbackTitle.textContent = correct ? 'Correct!' : 'Incorrect!';
        this.elements.feedbackText.textContent = message;
        this.elements.feedback.className = correct ? 'feedback correct' : 'feedback';
        this.elements.feedback.classList.remove('hidden');
    }

    getPlayerFeedback(playerTotal, correctAction) {
        if (this.isNatural) {
            const bankerTotal = this.calculateHandValue(this.bankerHand);
            if (playerTotal >= 8) {
                return `Player has a natural ${playerTotal}, so they must stand.`;
            } else {
                return `Banker has a natural ${bankerTotal}, so Player must stand.`;
            }
        }
        
        if (correctAction) {
            return `Player has ${playerTotal}, which is 0-5, so they must draw a third card.`;
        } else {
            return `Player has ${playerTotal}, which is 6-7, so they must stand.`;
        }
    }

    getBankerFeedback(bankerTotal, playerTotal, playerThirdCard, playerStood, correctAction) {
        if (this.isNatural) {
            if (bankerTotal >= 8) {
                return `Banker has a natural ${bankerTotal}, so they must stand.`;
            } else {
                return `Player has a natural ${playerTotal}, so Banker must stand.`;
            }
        }
        
        if (bankerTotal <= 2) {
            return `Banker has ${bankerTotal}, which is 0-2, so they must draw.`;
        }
        if (bankerTotal === 7) {
            return `Banker has 7, so they must stand.`;
        }
        
        if (playerStood && playerTotal >= 6) {
            if (correctAction) {
                return `Player stood with ${playerTotal}, so Banker draws on 3, 4, or 5. Banker has ${bankerTotal}.`;
            } else {
                return `Player stood with ${playerTotal}, so Banker stands on 6. Banker has ${bankerTotal}.`;
            }
        }
        
        const cardText = playerThirdCard !== null ? `Player's third card was ${playerThirdCard}.` : '';
        
        if (bankerTotal === 3) {
            return correctAction ? 
                `Banker 3 draws unless Player's 3rd card is 8. ${cardText}` :
                `Banker 3 stands only when Player's 3rd card is 8. ${cardText}`;
        }
        
        if (bankerTotal === 4) {
            return correctAction ?
                `Banker 4 draws if Player's 3rd card is 2,3,4,5,6,7. ${cardText}` :
                `Banker 4 stands if Player's 3rd card is A,8,9,0. ${cardText}`;
        }
        
        if (bankerTotal === 5) {
            return correctAction ?
                `Banker 5 draws if Player's 3rd card is 4,5,6,7. ${cardText}` :
                `Banker 5 stands if Player's 3rd card is A,2,3,8,9,0. ${cardText}`;
        }
        
        if (bankerTotal === 6) {
            return correctAction ?
                `Banker 6 draws if Player's 3rd card is 6,7. ${cardText}` :
                `Banker 6 stands if Player's 3rd card is A,2,3,4,5,8,9,0. ${cardText}`;
        }
        
        return 'Check the rules for this situation.';
    }

    clearCards() {
        this.elements.playerCards.innerHTML = `
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            <div class="card-slot"></div>
        `;
        this.elements.bankerCards.innerHTML = `
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            <div class="card-slot"></div>
        `;
        this.elements.playerTotal.textContent = '0';
        this.elements.bankerTotal.textContent = '0';
    }

    updateDisplay() {
        this.elements.cardsLeft.textContent = this.shoe.length - this.shoePosition;
        this.updateScoreDisplay();
        this.updateShoeVisual();
    }

    updateScoreDisplay() {
        this.elements.correctCount.textContent = this.correctAnswers;
        this.elements.wrongCount.textContent = this.wrongAnswers;
    }

    updateShoeVisual() {
        const remainingPercentage = ((this.shoe.length - this.shoePosition) / this.shoe.length) * 100;
        this.elements.shoeCards.style.width = `${remainingPercentage}%`;
        
        if (this.shoePosition >= this.shuffleMarker) {
            this.elements.shuffleWarning.classList.remove('hidden');
        } else {
            this.elements.shuffleWarning.classList.add('hidden');
        }
    }

    bindEvents() {
        this.elements.playerHitBtn.addEventListener('click', () => this.handlePlayerDecision(true));
        this.elements.playerStandBtn.addEventListener('click', () => this.handlePlayerDecision(false));
        this.elements.bankerHitBtn.addEventListener('click', () => this.handleBankerDecision(true));
        this.elements.bankerStandBtn.addEventListener('click', () => this.handleBankerDecision(false));
        
        this.elements.nextHandBtn.addEventListener('click', () => {
            this.updateDisplay();
            this.startNewHand();
        });
        
        this.elements.continueBtn.addEventListener('click', () => {
            this.elements.feedback.classList.add('hidden');
            if (this.pendingAction) {
                this.pendingAction();
                this.pendingAction = null;
            }
        });
        
        this.elements.shuffleBtn.addEventListener('click', () => {
            this.createShoe();
            this.elements.shuffleBtn.disabled = true;
            this.elements.shuffleWarning.classList.add('hidden');
            this.updateDisplay();
        });
        
        this.elements.newGameBtn.addEventListener('click', () => {
            this.createShoe();
            this.correctAnswers = 0;
            this.wrongAnswers = 0;
            this.elements.shuffleBtn.disabled = true;
            this.clearCards();
            this.hideAllPrompts();
            this.updateDisplay();
            this.gameState = 'ready';
        });
        
        this.elements.rulesBtn.addEventListener('click', () => {
            this.elements.rulesModal.classList.remove('hidden');
        });
        
        this.elements.rulesModal.querySelector('.close').addEventListener('click', () => {
            this.elements.rulesModal.classList.add('hidden');
        });
        
        this.elements.rulesModal.addEventListener('click', (e) => {
            if (e.target === this.elements.rulesModal) {
                this.elements.rulesModal.classList.add('hidden');
            }
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'player-decision') {
                if (e.key === 'h' || e.key === 'H') this.handlePlayerDecision(true);
                if (e.key === 's' || e.key === 'S') this.handlePlayerDecision(false);
            } else if (this.gameState === 'banker-decision') {
                if (e.key === 'h' || e.key === 'H') this.handleBankerDecision(true);
                if (e.key === 's' || e.key === 'S') this.handleBankerDecision(false);
            } else if (this.gameState === 'hand-complete') {
                if (e.key === 'n' || e.key === 'N') {
                    this.updateDisplay();
                    this.startNewHand();
                }
            }
            
            if (e.key === 'r' || e.key === 'R') {
                this.elements.rulesModal.classList.toggle('hidden');
            }
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new BaccaratGame();
    
    // Start the first hand automatically
    setTimeout(() => {
        game.startNewHand();
    }, 1000);
});