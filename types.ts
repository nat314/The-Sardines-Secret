import React from 'react';

export type GameState = 'SPLASH' | 'CHOOSING' | 'OPENING' | 'REVEALED';

export interface Fortune {
  id: number;
  text: string;
}

export interface TinProps {
  id: number;
  isSelected: boolean;
  isOtherSelected: boolean;
  gameState: GameState;
  consultedFish: number[];
  onSelect: (id: number) => void;
  onReset: () => void;
}

export interface SardineProps {
  id: number;
  onClick: (e: React.MouseEvent) => void;
  delay: number;
  isConsulted?: boolean;
}