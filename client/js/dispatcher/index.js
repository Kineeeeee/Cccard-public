import { dispatcher } from "./Dispatcher.js";

// Import Room Handlers
import {
    handleRoomCreated,
    handlePlayersUpdate,
    handleUserJoined,
    handleYourHand,
    handleDealCards,
    handleRoomStateUpdate,
    handleSettingsUpdated,
    handleHostChanged,
    handleUserLeft,
} from "./handlers/roomHandlers.js";

// Import Game Handlers
import {
    handleCardPlayed,
    handlePlayerDeclared,
    handleRoundReset,
    handlePlayerPassed,
    handleGameOver,
    handleTurnTimerUpdate,
    handleTurnTimerStarted,
    handlePrepStarted,
    handlePrepTimerUpdate,
    handleValidateSelectedCardsResult,
} from "./handlers/gameHandlers.js";

export function initDispatcher() {
    // Room Events
    dispatcher.register("room_created", handleRoomCreated);
    dispatcher.register("players_update", handlePlayersUpdate);
    dispatcher.register("user_joined", handleUserJoined);
    dispatcher.register("your_hand", handleYourHand);
    dispatcher.register("deal_cards", handleDealCards);
    dispatcher.register("room_state_update", handleRoomStateUpdate);
    dispatcher.register("settings_updated", handleSettingsUpdated);
    dispatcher.register("host_changed", handleHostChanged);
    dispatcher.register("user_left", handleUserLeft);

    // Game Events
    dispatcher.register("card_played", handleCardPlayed);
    dispatcher.register("player_declared", handlePlayerDeclared);
    dispatcher.register("round_reset", handleRoundReset);
    dispatcher.register("player_passed", handlePlayerPassed);
    dispatcher.register("game_over", handleGameOver);
    dispatcher.register("turn_timer_update", handleTurnTimerUpdate);
    dispatcher.register("turn_timer_started", handleTurnTimerStarted);
    dispatcher.register("prep_started", handlePrepStarted);
    dispatcher.register("prep_timer_update", handlePrepTimerUpdate);
    dispatcher.register(
        "validate_selected_cards_result",
        handleValidateSelectedCardsResult,
    );
}
