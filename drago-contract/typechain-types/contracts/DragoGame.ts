/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface DragoGameInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "ENTRY_FEE"
      | "EVENT_DURATION"
      | "MAX_PLAYERS"
      | "PRIZE"
      | "adminCloseEvent"
      | "currentEvent"
      | "endEventAndClaimPrize"
      | "eventActive"
      | "getCurrentEventDetails"
      | "joinGame"
      | "owner"
      | "renounceOwnership"
      | "startGame"
      | "submitScore"
      | "transferOwnership"
      | "withdrawFees"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "EventClosedByAdmin"
      | "EventEnded"
      | "FeesWithdrawn"
      | "GameStarted"
      | "NewHighScore"
      | "OwnershipTransferred"
      | "PlayerJoined"
      | "ScoreSubmitted"
  ): EventFragment;

  encodeFunctionData(functionFragment: "ENTRY_FEE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "EVENT_DURATION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MAX_PLAYERS",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "PRIZE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "adminCloseEvent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "currentEvent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "endEventAndClaimPrize",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "eventActive",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentEventDetails",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "joinGame", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "startGame", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "submitScore",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFees",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "ENTRY_FEE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "EVENT_DURATION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MAX_PLAYERS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "PRIZE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "adminCloseEvent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentEvent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "endEventAndClaimPrize",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "eventActive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentEventDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "joinGame", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "startGame", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "submitScore",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFees",
    data: BytesLike
  ): Result;
}

export namespace EventClosedByAdminEvent {
  export type InputTuple = [
    highestScorer: AddressLike,
    highestScore: BigNumberish
  ];
  export type OutputTuple = [highestScorer: string, highestScore: bigint];
  export interface OutputObject {
    highestScorer: string;
    highestScore: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace EventEndedEvent {
  export type InputTuple = [winner: AddressLike, winningScore: BigNumberish];
  export type OutputTuple = [winner: string, winningScore: bigint];
  export interface OutputObject {
    winner: string;
    winningScore: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FeesWithdrawnEvent {
  export type InputTuple = [owner: AddressLike, amount: BigNumberish];
  export type OutputTuple = [owner: string, amount: bigint];
  export interface OutputObject {
    owner: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GameStartedEvent {
  export type InputTuple = [startTime: BigNumberish];
  export type OutputTuple = [startTime: bigint];
  export interface OutputObject {
    startTime: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NewHighScoreEvent {
  export type InputTuple = [player: AddressLike, score: BigNumberish];
  export type OutputTuple = [player: string, score: bigint];
  export interface OutputObject {
    player: string;
    score: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PlayerJoinedEvent {
  export type InputTuple = [player: AddressLike];
  export type OutputTuple = [player: string];
  export interface OutputObject {
    player: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ScoreSubmittedEvent {
  export type InputTuple = [player: AddressLike, score: BigNumberish];
  export type OutputTuple = [player: string, score: bigint];
  export interface OutputObject {
    player: string;
    score: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DragoGame extends BaseContract {
  connect(runner?: ContractRunner | null): DragoGame;
  waitForDeployment(): Promise<this>;

  interface: DragoGameInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  ENTRY_FEE: TypedContractMethod<[], [bigint], "view">;

  EVENT_DURATION: TypedContractMethod<[], [bigint], "view">;

  MAX_PLAYERS: TypedContractMethod<[], [bigint], "view">;

  PRIZE: TypedContractMethod<[], [bigint], "view">;

  adminCloseEvent: TypedContractMethod<[], [void], "nonpayable">;

  currentEvent: TypedContractMethod<
    [],
    [
      [bigint, bigint, string, bigint, bigint] & {
        startTime: bigint;
        highestScore: bigint;
        highestScorer: string;
        playerCount: bigint;
        submittedScores: bigint;
      }
    ],
    "view"
  >;

  endEventAndClaimPrize: TypedContractMethod<[], [void], "nonpayable">;

  eventActive: TypedContractMethod<[], [boolean], "view">;

  getCurrentEventDetails: TypedContractMethod<
    [],
    [
      [bigint, bigint, string, bigint, bigint] & {
        startTime: bigint;
        highestScore: bigint;
        highestScorer: string;
        playerCount: bigint;
        submittedScores: bigint;
      }
    ],
    "view"
  >;

  joinGame: TypedContractMethod<[], [void], "payable">;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  startGame: TypedContractMethod<[], [void], "payable">;

  submitScore: TypedContractMethod<[score: BigNumberish], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawFees: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "ENTRY_FEE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "EVENT_DURATION"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "MAX_PLAYERS"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "PRIZE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "adminCloseEvent"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "currentEvent"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, string, bigint, bigint] & {
        startTime: bigint;
        highestScore: bigint;
        highestScorer: string;
        playerCount: bigint;
        submittedScores: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "endEventAndClaimPrize"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "eventActive"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "getCurrentEventDetails"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, string, bigint, bigint] & {
        startTime: bigint;
        highestScore: bigint;
        highestScorer: string;
        playerCount: bigint;
        submittedScores: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "joinGame"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "startGame"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "submitScore"
  ): TypedContractMethod<[score: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawFees"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "EventClosedByAdmin"
  ): TypedContractEvent<
    EventClosedByAdminEvent.InputTuple,
    EventClosedByAdminEvent.OutputTuple,
    EventClosedByAdminEvent.OutputObject
  >;
  getEvent(
    key: "EventEnded"
  ): TypedContractEvent<
    EventEndedEvent.InputTuple,
    EventEndedEvent.OutputTuple,
    EventEndedEvent.OutputObject
  >;
  getEvent(
    key: "FeesWithdrawn"
  ): TypedContractEvent<
    FeesWithdrawnEvent.InputTuple,
    FeesWithdrawnEvent.OutputTuple,
    FeesWithdrawnEvent.OutputObject
  >;
  getEvent(
    key: "GameStarted"
  ): TypedContractEvent<
    GameStartedEvent.InputTuple,
    GameStartedEvent.OutputTuple,
    GameStartedEvent.OutputObject
  >;
  getEvent(
    key: "NewHighScore"
  ): TypedContractEvent<
    NewHighScoreEvent.InputTuple,
    NewHighScoreEvent.OutputTuple,
    NewHighScoreEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "PlayerJoined"
  ): TypedContractEvent<
    PlayerJoinedEvent.InputTuple,
    PlayerJoinedEvent.OutputTuple,
    PlayerJoinedEvent.OutputObject
  >;
  getEvent(
    key: "ScoreSubmitted"
  ): TypedContractEvent<
    ScoreSubmittedEvent.InputTuple,
    ScoreSubmittedEvent.OutputTuple,
    ScoreSubmittedEvent.OutputObject
  >;

  filters: {
    "EventClosedByAdmin(address,uint256)": TypedContractEvent<
      EventClosedByAdminEvent.InputTuple,
      EventClosedByAdminEvent.OutputTuple,
      EventClosedByAdminEvent.OutputObject
    >;
    EventClosedByAdmin: TypedContractEvent<
      EventClosedByAdminEvent.InputTuple,
      EventClosedByAdminEvent.OutputTuple,
      EventClosedByAdminEvent.OutputObject
    >;

    "EventEnded(address,uint256)": TypedContractEvent<
      EventEndedEvent.InputTuple,
      EventEndedEvent.OutputTuple,
      EventEndedEvent.OutputObject
    >;
    EventEnded: TypedContractEvent<
      EventEndedEvent.InputTuple,
      EventEndedEvent.OutputTuple,
      EventEndedEvent.OutputObject
    >;

    "FeesWithdrawn(address,uint256)": TypedContractEvent<
      FeesWithdrawnEvent.InputTuple,
      FeesWithdrawnEvent.OutputTuple,
      FeesWithdrawnEvent.OutputObject
    >;
    FeesWithdrawn: TypedContractEvent<
      FeesWithdrawnEvent.InputTuple,
      FeesWithdrawnEvent.OutputTuple,
      FeesWithdrawnEvent.OutputObject
    >;

    "GameStarted(uint256)": TypedContractEvent<
      GameStartedEvent.InputTuple,
      GameStartedEvent.OutputTuple,
      GameStartedEvent.OutputObject
    >;
    GameStarted: TypedContractEvent<
      GameStartedEvent.InputTuple,
      GameStartedEvent.OutputTuple,
      GameStartedEvent.OutputObject
    >;

    "NewHighScore(address,uint256)": TypedContractEvent<
      NewHighScoreEvent.InputTuple,
      NewHighScoreEvent.OutputTuple,
      NewHighScoreEvent.OutputObject
    >;
    NewHighScore: TypedContractEvent<
      NewHighScoreEvent.InputTuple,
      NewHighScoreEvent.OutputTuple,
      NewHighScoreEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "PlayerJoined(address)": TypedContractEvent<
      PlayerJoinedEvent.InputTuple,
      PlayerJoinedEvent.OutputTuple,
      PlayerJoinedEvent.OutputObject
    >;
    PlayerJoined: TypedContractEvent<
      PlayerJoinedEvent.InputTuple,
      PlayerJoinedEvent.OutputTuple,
      PlayerJoinedEvent.OutputObject
    >;

    "ScoreSubmitted(address,uint256)": TypedContractEvent<
      ScoreSubmittedEvent.InputTuple,
      ScoreSubmittedEvent.OutputTuple,
      ScoreSubmittedEvent.OutputObject
    >;
    ScoreSubmitted: TypedContractEvent<
      ScoreSubmittedEvent.InputTuple,
      ScoreSubmittedEvent.OutputTuple,
      ScoreSubmittedEvent.OutputObject
    >;
  };
}
