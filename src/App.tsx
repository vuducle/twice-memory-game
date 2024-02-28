import React, { useState, useEffect } from "react";
import "./App.css";
//@ts-ignore
import TWICE_Video from "./assets/twice.mp4";
import TWICE_LOGO from "./assets/twice.png";

interface Card {
  idol: string;
  color: string;
  url?: string;
}
const idols: string[] = [
  "mina-myoi",
  "mina-myoi",
  "sana",
  "sana",
  "momo",
  "momo",
  "chaeyoung-from-twice",
  "chaeyoung-from-twice",
  "jihyo",
  "jihyo",
  "dahyun",
  "dahyun",
  "jeongyeon",
  "jeongyeon",
  "tzuyu",
  "tzuyu",
  "nayeon",
  "nayeon",
  "twice",
  "twice",
];

class Board {
  private width: number;
  private height: number;
  private fields: Card[][];

  constructor() {
    this.width = 5;
    this.height = 4;
    const fields = Array(this.height);
    for (let y = 0; y < this.height; y++) {
      const arr = Array(this.width);
      fields[y] = arr;
    }
    this.fields = fields;
  }
  get getFields() {
    return this.fields;
  }

  setField(card: Card, position: { x: number; y: number }) {
    const y = this.fields[position.y];
    y[position.x] = card;
  }

  setGifUrl(position: { x: number; y: number }, url: string) {
    const card = this.fields[position.y][position.x];
    card.url = url;
  }

  clearUrl(position: { x: number; y: number }) {
    const card = this.fields[position.y][position.x];
    card.url = undefined;
  }
}

const MemoryGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(new Board());
  const [selectedCards, setSelectedCards] = useState<
    (Card & { position: { x: number; y: number } })[]
  >([]);
  const [isBoardVisible, setBoardVisibility] = useState<boolean>(false);

  const generateRandomColor = (): string => {
    const hue: number = Math.floor(Math.random() * 360);
    const saturation: number = 50;
    const lightness: number = 40;
    const alpha: number = 1.0;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  };

  const handleCardClick = async (
    card: Card,
    position: { x: number; y: number }
  ): Promise<void> => {
    if (selectedCards.length > 2) return;
    const url = await fetchGiphyGif(card.idol);
    const newCard = {
      ...card,
      url: url,
      position,
    };
    board.setGifUrl({ x: position.x, y: position.y }, url);
    setSelectedCards([...selectedCards, newCard]);
  };

  const fetchGiphyGif = async (searchTerm: string): Promise<string> => {
    const apiKey: string = "P3aNPyvle2NM0ryl8XfNVybor0jTlNDP";
    const url: string = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.data[0]?.images.original.url || "";
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const playTWICEMusic = (url: string): void => {
    var audio = new Audio(url);
    audio.volume = 0.1;
    audio.play();
    audio.loop = true;
  };

  const handleStartGame = (): void => {
    setBoardVisibility(true);
    playTWICEMusic("https://felix-nguyen.de/public/moonlight.mp3");
  };

  const checkPairs = () => {
    const first = selectedCards[0];
    const second = selectedCards[1];

    if (first.idol === second.idol) {
      // is win win
      setSelectedCards([]);
    } else {
      selectedCards.forEach((card) => {
        board.clearUrl(card.position);
      });
      setSelectedCards([]);
    }
  };

  useEffect(() => {
    const unsetBoard = new Board();
    const emptyFields: { x: number; y: number }[] = [];
    const fields = unsetBoard.getFields;
    fields.forEach((y, j) => {
      for (let i = 0; i < y.length; i++) {
        emptyFields.push({ x: i, y: j });
      }
    });

    idols.forEach((idol, i) => {
      const pos = Math.floor(Math.random() * emptyFields.length);
      const field = emptyFields[pos];
      emptyFields.splice(pos, 1);
      const card = {
        idol: idol,
        color: generateRandomColor(),
      };
      unsetBoard.setField(card, field);
    });
    setBoard(unsetBoard);
  }, []);

  useEffect(() => {
    if (selectedCards.length === 2) {
      setTimeout(() => {
        checkPairs();
      }, 1000);
    }
  }, [selectedCards]);

  return (
    <div style={{ backgroundColor: "smokewhite" }} className="yeet">
      <video className="videoTag" autoPlay loop muted>
        <source src={TWICE_Video} type="video/mp4" />
      </video>
      <section className="container">
        <img src={TWICE_LOGO} className="TWICE_LOGO" />
        <h2>TWICE Memory</h2>
        <p>
          A little memory game, where your favorite TWICE bias is listed UwU:
        </p>
        <p>For example: Momo, Mina, Sana, and Chaeyoung.</p>
        <button onClick={handleStartGame} className="btn">
          Start game
        </button>
        <h1 id="result"></h1>
        {isBoardVisible && (
          <div>
            {board.getFields.map((field, j) => {
              return (
                <div key={`memory-row-${j}`} style={{ display: "flex" }}>
                  {field.map((card, i) => {
                    return (
                      <div
                        key={`memory-column-${i}`}
                        style={{
                          backgroundColor: card.color,
                          textAlign: "center",
                          width: "20vw",
                          height: "300px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() => handleCardClick(card, { x: i, y: j })}
                      >
                        {card.url ? (
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                            src={card.url}
                            alt={`Memory card for ${i}-${j}`}
                          />
                        ) : (
                          `?`
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MemoryGame;
