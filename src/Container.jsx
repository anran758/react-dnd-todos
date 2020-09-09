import React from "react";
import update from "immutability-helper";

import Card from "./Card";

const style = {
  width: 600,
  margin: "auto"
};

export default class Container extends React.PureComponent {
  constructor(props) {
    super(props);

    this.drawFrame = () => {
      const nextState = update(this.state, this.pendingUpdateFn);
      this.setState(nextState);
      this.updateStoreData();
      this.pendingUpdateFn = undefined;
      this.requestedFrame = undefined;
    };

    this.moveCard = (id, afterId) => {
      const { cardsById, cardsByIndex } = this.state;
      const card = cardsById[id];
      const cardIndex = cardsByIndex.findIndex(item => item.id === id);
      const afterIndex = cardsByIndex.findIndex(item => item.id === afterId);
      this.scheduleUpdate({
        cardsByIndex: {
          $splice: [
            [cardIndex, 1],
            [afterIndex, 0, card]
          ]
        }
      });
    };

    this.state = {
      cardsById: {},
      cardsByIndex: []
    };
  }

  componentDidMount() {
    const cardsById = JSON.parse(localStorage.getItem("cardsById")) || {};
    const cardsByIndex = JSON.parse(localStorage.getItem("cardsByIndex")) || [];
    console.log(cardsById, cardsByIndex);

    this.setState({ cardsById, cardsByIndex });
  }

  componentWillUnmount() {
    if (this.requestedFrame !== undefined) {
      cancelAnimationFrame(this.requestedFrame);
    }
  }

  scheduleUpdate(updateFn) {
    this.pendingUpdateFn = updateFn;
    if (!this.requestedFrame) {
      this.requestedFrame = requestAnimationFrame(this.drawFrame);
    }
  }

  handleEnter = e => {
    if (e.key !== "Enter") return;

    const { value } = e.target;
    const { cardsById, cardsByIndex } = this.state;
    const key = `${Date.now()}_${Math.floor(Math.random() * 100)}`;
    const card = {
      id: key,
      text: value,
      complate: false,
      active: false
    };
    cardsById[key] = card;
    cardsByIndex.push({ ...card });

    e.target.value = "";
    this.updateStoreData();
    this.setState({ cardsByIndex, cardsById });
  };

  updateStoreData = () => {
    const { cardsById, cardsByIndex } = this.state;
    localStorage.setItem("cardsById", JSON.stringify(cardsById));
    localStorage.setItem("cardsByIndex", JSON.stringify(cardsByIndex));
  };

  handleClose = id => {
    const {  cardsByIndex } = this.state;
    // const card = cardsById[id];
    const cardIndex = cardsByIndex.findIndex(item => item.id === id);

    this.scheduleUpdate({
      cardsByIndex: {
        $splice: [[cardIndex, 1]]
      },
      cardsById: {
        $unset: [id]
      }
    });
  };

  handleCompolate = id => {
    const { cardsById, cardsByIndex } = this.state;
    const card = cardsById[id];
    const cardIndex = cardsByIndex.findIndex(item => item.id === id);
    card.complate = !card.complate;
    card.active = false;

    this.scheduleUpdate({
      cardsByIndex: {
        $splice: [[cardIndex, 1]],
        $push: [card]
      }
    });
  };

  handleActive = id => {
    const { cardsByIndex } = this.state;
    const cardIndex = cardsByIndex.findIndex(item => item.id === id);

    this.scheduleUpdate({
      cardsByIndex: {
        [cardIndex]: { $toggle: ["active"] }
      },
      cardsById: {
        [id]: { $toggle: ["active"] }
      }
    });
  };

  render() {
    const { cardsByIndex } = this.state;
    return (
      <>
        <div style={{ marginBottom: 10, textAlign: "center" }}>
          <span>Input something todo:</span>
          <input
            style={{ marginLeft: 10 }}
            type="text"
            onKeyDown={this.handleEnter}
          />
        </div>

        <div style={style}>
          {cardsByIndex.map(card => (
            <Card
              key={card.id}
              id={card.id}
              text={card.text}
              active={card.active}
              complate={card.complate}
              moveCard={this.moveCard}
              onActive={this.handleActive}
              onCompolate={this.handleCompolate}
              onClose={this.handleClose}
            />
          ))}
        </div>
      </>
    );
  }
}
