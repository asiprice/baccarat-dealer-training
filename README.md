# Baccarat Dealer Training Game

A professional web-based training simulator designed to teach casino dealers the rules and procedures of Baccarat. This interactive game provides hands-on practice with real-time feedback to ensure dealers master the complex third-card drawing rules.

![Baccarat Training Game](https://img.shields.io/badge/Game-Baccarat%20Training-gold) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎯 Features

### 🃏 Authentic Casino Experience
- **8-Deck Shoe System** with automatic shuffling and cut card placement
- **Professional Card Graphics** using high-quality PNG images
- **Realistic Game Flow** matching actual casino procedures
- **Shuffle Warning** when cut card is reached

### 🎓 Educational Training
- **Interactive Decision Prompts** for Player and Banker actions
- **Real-time Rule Validation** with immediate feedback
- **Detailed Explanations** when incorrect decisions are made
- **Natural Handling** training (8s and 9s)
- **Score Tracking** for correct vs incorrect decisions

### 🎮 Game Mechanics
- **Complete Rule Engine** implementing all Baccarat third-card rules
- **Smooth Animations** for card dealing and reveals
- **Responsive Design** works on desktop, tablet, and mobile
- **Keyboard Shortcuts** for faster gameplay (H/S for Hit/Stand)

## 🚀 Quick Start

### Option 1: Direct Play
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start training immediately!

### Option 2: With High-Quality Card Images
1. Clone the repository
2. Visit `setup-cards.html` for detailed instructions
3. Download card images from the provided sources
4. Place in `/cards` directory with correct naming
5. Refresh the game for enhanced visuals

## 🎲 How to Play

1. **New Hand**: Game automatically deals 2 cards each to Player and Banker
2. **Player Decision**: Choose whether Player should Hit or Stand
3. **Banker Decision**: Choose whether Banker should Hit or Stand  
4. **Feedback**: Get immediate feedback if your decision was incorrect
5. **Results**: See the hand winner and start the next hand

## 📋 Baccarat Rules Summary

### Card Values
- **Ace** = 1 point
- **2-9** = Face value
- **10, J, Q, K** = 0 points
- **Hand Value** = Sum of cards (drop tens digit, 0-9 range)

### Third Card Rules (in order)
1. **Naturals**: If either side has 8 or 9, both stand
2. **Player**: Draws on 0-5, stands on 6-7
3. **Banker Basic**: Draws on 0-2, stands on 7
4. **Banker vs Standing Player**: If Player stood on 6-7, Banker draws on 3-5, stands on 6
5. **Banker vs Player's Third Card**: Complex rules based on Banker total and Player's third card

## 🛠️ Technical Details

### Built With
- **HTML5** - Structure and semantic markup
- **CSS3** - Professional styling with animations
- **Vanilla JavaScript** - Game logic and interactions
- **PNG Images** - High-quality playing card graphics

### Browser Support
- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design adapts to all screen sizes

## 📁 Project Structure

```
baccarat-dealer-training/
├── index.html              # Main game interface
├── script.js              # Game logic and rules engine
├── styles.css             # Professional styling
├── Rules.MD               # Complete Baccarat rules reference
├── setup-cards.html       # Card setup instructions
├── cards/                 # Playing card PNG images
│   ├── ace_of_spades.png
│   ├── 2_of_hearts.png
│   └── ... (52 total)
└── README.md              # This file
```

## 🎯 Training Objectives

This game helps dealers master:

- **Rule Recognition**: Identify when to draw third cards
- **Speed**: Make quick, accurate decisions under pressure  
- **Naturals**: Proper handling of 8s and 9s
- **Complex Scenarios**: Banker decisions based on Player's third card
- **Procedure**: Correct dealing and revelation sequence

## 🔧 Customization

### Card Images
- Replace PNG files in `/cards` directory
- Follow naming convention: `[rank]_of_[suit].png`
- Supports any aspect ratio, recommends 2:3 ratio

### Game Settings
Modify variables in `script.js`:
- `shuffleMarker`: Cut card position (default: 7/8 through shoe)
- Card dealing timing
- Animation speeds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🎰 About Baccarat

Baccarat is one of the most popular casino games worldwide, known for its simple objective but complex third-card drawing rules. This trainer ensures dealers can confidently handle any situation that arises during live play.

---

**Ready to train?** Open `index.html` and start mastering Baccarat! 🎴

For questions or support, please open an issue in this repository.