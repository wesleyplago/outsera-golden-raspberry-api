export interface Movie {
  year: number;
  title: string;
  studios: string;
  producers: string;
  winner: boolean;
}

export interface Producer {
  name: string;
  wins: number[];
}

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface IntervalResponse {
  min: ProducerInterval[];
  max: ProducerInterval[];
}

