import React, { Component } from 'react';
import shuffle from 'lodash.shuffle';

import './App.css';

import Card from './Card';
import GuessCount from './GuessCount';
import HallOfFame, { FAKE_HOF } from './HallOfFame';

const SIDE = 6;
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿';
const VISUAL_PAUSE_MSECS = 750;

class App extends Component {
    state = {
        cards: this.generateCards(),
        currentPair: [],
        guesses: 0,
        matchedCardsIndices: []
    };

    generateCards() {
        const result = [];
        const size = SIDE * SIDE;
        const candidates = shuffle(SYMBOLS);
        while (result.length < size) {
            const card = candidates.pop();
            result.push(card, card);
        }
        return shuffle(result);
    }

    getFeedbackForCard(index) {
        const { currentPair, matchedCardsIndices } = this.state;
        const indexMatched = matchedCardsIndices.includes(index);

        if (currentPair.length < 2) {
            return indexMatched || index === currentPair[0] ? 'visible' : 'hidden';
        }

        if (currentPair.includes(index)) {
            return indexMatched ? 'justMatched' : 'justMismatched';
        }

        return indexMatched ? 'visible' : 'hidden';
    }

    handleNewPairClosedBy(index) {
        const { cards, currentPair, guesses, matchedCardsIndices } = this.state;

        const newPair = [currentPair[0], index];
        const newGuesses = guesses + 1;
        const matched = cards[newPair[0]] === cards[newPair[1]];
        this.setState({ currentPair: newPair, guesses: newGuesses });
        if (matched) {
            this.setState({ matchedCardsIndices: [...matchedCardsIndices, ...newPair] });
        }
        setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS);
    }

    // Arrow fx for binding
    handleCardClick = index => {
        const { currentPair } = this.state;

        if (currentPair.length === 2) {
            return;
        }

        if (currentPair.length === 0) {
            this.setState({ currentPair: [index] });
            return;
        }

        this.handleNewPairClosedBy(index);
    };

    render() {
        const { cards, guesses, matchedCardsIndices } = this.state;
        const won = matchedCardsIndices.length === cards.length;
        return (
            <div className="memory">
                <GuessCount guesses={guesses} />
                {cards.map((card, index) => (
                    <Card
                        card={card}
                        feedback={this.getFeedbackForCard(index)}
                        index={index}
                        onClick={this.handleCardClick}
                        key={index}
                    />
                ))}
                {won && <HallOfFame entries={FAKE_HOF} />}
            </div>
        );
    }
}

export default App;
